import type { Scenario, ScenarioTurn } from "@/lib/scenario-schema";
import { initialKpiState } from "@/lib/engine/state";
import { llmAssistedParse } from "@/lib/engine/llm-parser";
import { buildEvidence } from "@/lib/engine/judge";
import { aggregate } from "@/lib/engine/aggregator";
import { computeTurnAdvance } from "@/lib/engine/turn-advance";
import { agentTurn } from "@/lib/engine/conversational-agent";
import { getStore } from "@/lib/store";
import type { SessionRecord } from "@/lib/store/types";

export function startSession(scenario: Scenario, input: { candidateName?: string; candidateEmail?: string }) {
  const store = getStore();
  const seed = Math.floor(Math.random() * 900000 + 100000).toString();
  return store.createSession({
    id: crypto.randomUUID(),
    scenarioId: scenario.id,
    candidateName: input.candidateName,
    candidateEmail: input.candidateEmail,
    seed,
    currentTurn: 1,
    kpiState: initialKpiState(scenario.kpis),
    kpiHistory: [{ turn: 0, state: initialKpiState(scenario.kpis) }],
  });
}

export interface PreviewResult {
  matchedLabels: string[];
  needsHumanReview: boolean;
  reviewReason?: string;
}

/**
 * Parse-only preview for the "parse confirmation" screen (Master Spec §13).
 * Nothing is persisted or applied to state here — that only happens once
 * the candidate confirms via commitDecision. Re-running this on edited text
 * is always safe.
 */
export async function previewDecision(scenario: Scenario, session: SessionRecord, rawText: string): Promise<PreviewResult> {
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  if (!turn) throw new Error("Invalid turn index");
  const parseResult = await llmAssistedParse(rawText, turn);
  return {
    matchedLabels: parseResult.matches.map((m) => m.option.label_he),
    needsHumanReview: parseResult.needsHumanReview,
    reviewReason: parseResult.reviewReason,
  };
}

export interface SubmitDecisionResult {
  session: SessionRecord;
  matchedLabels: string[];
  needsHumanReview: boolean;
  reviewReason?: string;
  nextEventHe?: string;
  isFinalTurn: boolean;
}

/** Runs one full decision cycle: parse -> judge -> deterministic state update -> persist. */
export async function submitDecision(
  scenario: Scenario,
  session: SessionRecord,
  rawText: string
): Promise<SubmitDecisionResult> {
  const store = getStore();
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  if (!turn) throw new Error("Invalid turn index");

  const parseResult = await llmAssistedParse(rawText, turn);

  const decision = await store.addDecision({
    id: crypto.randomUUID(),
    sessionId: session.id,
    turnIndex: turn.index,
    rawText,
    matchedOptionKeys: parseResult.matches.map((m) => m.option.key),
    confidence: parseResult.confidence,
    needsHumanReview: parseResult.needsHumanReview,
    reviewReason: parseResult.reviewReason,
  });

  const evidence = buildEvidence(parseResult.matches, turn.index);
  await store.addEvidence(
    evidence.map((e) => ({
      decisionId: decision.id,
      criterion: e.criterion,
      score: e.score,
      evidenceHe: e.evidence_he,
      sourceTurn: e.sourceTurn,
    }))
  );

  const matchedOptionKeys = parseResult.matches.map((m) => m.option.key);
  const { session: updated, isFinalTurn, nextEventHe } = await applyTurnAdvance(scenario, session, turn, matchedOptionKeys);

  return {
    session: updated,
    matchedLabels: parseResult.matches.map((m) => m.option.label_he),
    needsHumanReview: parseResult.needsHumanReview,
    reviewReason: parseResult.reviewReason,
    nextEventHe,
    isFinalTurn,
  };
}

/**
 * Persists the shared tail of a turn cycle — KPI state, branch event,
 * session advance/completion, final-report generation — given a set of
 * matched canonical option keys. Built on the pure computeTurnAdvance() so
 * both the deterministic (submitDecision) and conversational-agent
 * (submitConversationalTurn) flows apply identical KPI/branching math.
 */
async function applyTurnAdvance(scenario: Scenario, session: SessionRecord, turn: ScenarioTurn, matchedOptionKeys: string[]) {
  const store = getStore();
  const advance = computeTurnAdvance({ scenario, turn, session, matchedOptionKeys });

  if (!advance.isFinalTurn && advance.nextEventHe) {
    await store.addEvent({
      id: crypto.randomUUID(),
      sessionId: session.id,
      turnIndex: advance.nextTurnIndex,
      eventHe: advance.nextEventHe,
    });
  }

  const updated = await store.updateSession(session.id, {
    kpiState: advance.nextState,
    kpiHistory: advance.kpiHistory,
    currentTurn: advance.nextTurnIndex,
    status: advance.isFinalTurn ? "completed" : "in_progress",
    completedAt: advance.isFinalTurn ? new Date().toISOString() : undefined,
  });

  if (advance.isFinalTurn && updated) {
    await finalizeReport(scenario, updated);
  }

  return { session: updated ?? session, isFinalTurn: advance.isFinalTurn, nextEventHe: advance.nextEventHe };
}

export interface SubmitConversationalTurnResult {
  session: SessionRecord;
  /** "followup" — the agent asked a clarifying question, still on the same turn.
   *  "advance" — the agent scored the decision and the session moved on (or completed). */
  kind: "followup" | "advance";
  agentMessageHe: string;
  needsHumanReview: boolean;
  isFinalTurn?: boolean;
  nextEventHe?: string;
}

/**
 * Runs one exchange of the conversational-agent turn flow: parse -> agent
 * converses and judges directly -> persist -> (on score) advance, using the
 * same applyTurnAdvance tail as the deterministic flow. See
 * lib/engine/conversational-agent.ts for why the AI judges here instead of
 * the option-driven judge.ts path.
 */
export async function submitConversationalTurn(
  scenario: Scenario,
  session: SessionRecord,
  rawText: string
): Promise<SubmitConversationalTurnResult> {
  const store = getStore();
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  if (!turn) throw new Error("Invalid turn index");

  const history = await store.listConversationMessages(session.id, turn.index);
  await store.addConversationMessage({ sessionId: session.id, turnIndex: turn.index, role: "candidate", textHe: rawText });

  const result = await agentTurn({
    scenario,
    turn,
    history: history.map((m) => ({ role: m.role, textHe: m.textHe })),
    rawText,
  });

  await store.addConversationMessage({ sessionId: session.id, turnIndex: turn.index, role: "agent", textHe: result.messageHe });

  if (result.action === "ask_followup") {
    return { session, kind: "followup", agentMessageHe: result.messageHe, needsHumanReview: result.adversarial };
  }

  const candidateTexts = [...history.filter((m) => m.role === "candidate").map((m) => m.textHe), rawText];
  const decision = await store.addDecision({
    id: crypto.randomUUID(),
    sessionId: session.id,
    turnIndex: turn.index,
    rawText: candidateTexts.join("\n---\n"),
    matchedOptionKeys: result.matchedOptionKeys,
    confidence: result.adversarial ? 0 : 0.9,
    needsHumanReview: result.adversarial,
    reviewReason: result.adversarial ? "injection_flagged" : undefined,
  });

  await store.addEvidence(
    result.criteriaScores.map((cs) => ({
      decisionId: decision.id,
      criterion: cs.criterion,
      score: cs.score,
      evidenceHe: cs.evidence_he,
      sourceTurn: turn.index,
    }))
  );

  const { session: updated, isFinalTurn, nextEventHe } = await applyTurnAdvance(scenario, session, turn, result.matchedOptionKeys);

  return {
    session: updated,
    kind: "advance",
    agentMessageHe: result.messageHe,
    needsHumanReview: result.adversarial,
    isFinalTurn,
    nextEventHe,
  };
}

export async function finalizeReport(scenario: Scenario, session: SessionRecord) {
  const store = getStore();
  const evidenceRecords = await store.listEvidence(session.id);
  const evidence = evidenceRecords.map((e) => ({
    criterion: e.criterion as never,
    score: e.score,
    evidence_he: e.evidenceHe,
    sourceTurn: e.sourceTurn,
  }));
  const result = aggregate(evidence, scenario.kpis, session.kpiState);
  await store.saveReport({
    sessionId: session.id,
    processScore: result.processScore,
    outcomeScore: result.outcomeScore,
    criteriaScores: result.criteriaScores,
  });
  return result;
}

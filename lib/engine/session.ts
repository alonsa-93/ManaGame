import type { Scenario, ScenarioTurn } from "@/lib/scenario-schema";
import { initialKpiState } from "@/lib/engine/state";
import { llmAssistedParse } from "@/lib/engine/llm-parser";
import type { ParseResult } from "@/lib/engine/parser";
import { buildEvidence } from "@/lib/engine/judge";
import { aggregate } from "@/lib/engine/aggregator";
import { computeTurnAdvance } from "@/lib/engine/turn-advance";
import { agentTurn } from "@/lib/engine/conversational-agent";
import { hashRawText, matchesFromConfirmedKeys } from "@/lib/engine/confirmed-decision";
import { notifyMake, siteUrl } from "@/lib/integrations/make-webhook";
import { getStore, hasDatabase } from "@/lib/store";
import type { SessionRecord, TurnEvidenceEntry } from "@/lib/store/types";

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
    turnEvidence: [],
  });
}

export interface PreviewResult {
  matchedLabels: string[];
  matchedOptionKeys: string[];
  confidence: number;
  needsHumanReview: boolean;
  reviewReason?: string;
  /** Binds this preview to the exact text it was computed from — see confirmed-decision.ts. */
  rawTextHash: string;
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
    matchedOptionKeys: parseResult.matches.map((m) => m.option.key),
    confidence: parseResult.confidence,
    needsHumanReview: parseResult.needsHumanReview,
    reviewReason: parseResult.reviewReason,
    rawTextHash: hashRawText(rawText),
  };
}

/** What commitDecision needs from a prior previewDecision call to trust it instead of re-parsing. */
export interface ConfirmedPreview {
  rawTextHash: string;
  matchedOptionKeys: string[];
  confidence: number;
  needsHumanReview: boolean;
  reviewReason?: string;
}

export interface SubmitDecisionResult {
  session: SessionRecord;
  matchedLabels: string[];
  needsHumanReview: boolean;
  reviewReason?: string;
  nextEventHe?: string;
  isFinalTurn: boolean;
}

/**
 * Runs one full decision cycle: parse -> judge -> deterministic state update -> persist.
 *
 * expectedTurn is the turn the client observed when it fired this submit
 * (its local session.currentTurn at click time). If the freshly-read
 * session has already moved past that — a retried request, a duplicate
 * from a double-click/back-button, or a stale replay after the original
 * request already completed — this no-ops and returns the current,
 * already-correct state instead of scoring the same text again against the
 * wrong turn or duplicating evidence. Does not cover two truly
 * simultaneous requests racing on the same turn (that needs a DB-level
 * compare-and-swap on the write itself, not just this read-time guard).
 *
 * confirmedPreview, when its rawTextHash still matches rawText, is trusted
 * directly instead of re-running llmAssistedParse — without this, the
 * model's second (non-deterministic) call could classify the same text
 * differently than the "is this what you meant?" screen the candidate just
 * confirmed, scoring them on an interpretation they never actually saw.
 */
export async function submitDecision(
  scenario: Scenario,
  session: SessionRecord,
  rawText: string,
  expectedTurn: number,
  confirmedPreview?: ConfirmedPreview
): Promise<SubmitDecisionResult> {
  const store = getStore();
  if (session.status === "completed" || session.currentTurn !== expectedTurn) {
    return { session, matchedLabels: [], needsHumanReview: false, isFinalTurn: session.status === "completed" };
  }
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  if (!turn) throw new Error("Invalid turn index");

  const parseResult: ParseResult =
    confirmedPreview && confirmedPreview.rawTextHash === hashRawText(rawText)
      ? {
          matches: matchesFromConfirmedKeys(turn, confirmedPreview.matchedOptionKeys),
          confidence: confirmedPreview.confidence,
          needsHumanReview: confirmedPreview.needsHumanReview,
          reviewReason: confirmedPreview.reviewReason,
          flaggedInjection: false, // already screened during preview; that result carries forward via needsHumanReview/reviewReason
        }
      : await llmAssistedParse(rawText, turn);

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

  if (parseResult.needsHumanReview) {
    // Awaited deliberately: Vercel serverless functions can be torn down the
    // moment the response is sent, so an un-awaited "fire-and-forget" call
    // here would risk never actually reaching Make. notifyMake() itself
    // never throws, so this can't break the candidate flow either way.
    await notifyMake({
      event: "needs_human_review",
      sessionId: session.id,
      candidateName: session.candidateName,
      scenarioTitle: scenario.title_he,
      reportUrl: `${siteUrl()}/assessor/sessions/${session.id}`,
      turnIndex: turn.index,
      reviewReason: parseResult.reviewReason,
    });
  }

  const matchedOptionKeys = parseResult.matches.map((m) => m.option.key);
  const newEvidence: TurnEvidenceEntry[] = evidence.map((e) => ({ criterion: e.criterion, score: e.score, sourceTurn: e.sourceTurn }));
  const { session: updated, isFinalTurn, nextEventHe } = await applyTurnAdvance(scenario, session, turn, matchedOptionKeys, newEvidence);

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
 *
 * newEvidence is folded onto session.turnEvidence (not just written to the
 * decisions/decision_evidence tables) so finalizeReport can score from the
 * session record itself — which, via the resiliency cookie, survives a cold
 * serverless instance even when no database is connected. See
 * lib/session-cache.ts and TurnEvidenceEntry in lib/store/types.ts.
 */
async function applyTurnAdvance(
  scenario: Scenario,
  session: SessionRecord,
  turn: ScenarioTurn,
  matchedOptionKeys: string[],
  newEvidence: TurnEvidenceEntry[] = []
) {
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
    turnEvidence: [...session.turnEvidence, ...newEvidence],
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
 * the option-driven judge.ts path. See submitDecision's doc comment for
 * what expectedTurn guards against and its limits.
 */
export async function submitConversationalTurn(
  scenario: Scenario,
  session: SessionRecord,
  rawText: string,
  expectedTurn: number
): Promise<SubmitConversationalTurnResult> {
  const store = getStore();
  if (session.status === "completed" || session.currentTurn !== expectedTurn) {
    return { session, kind: "advance", agentMessageHe: "", needsHumanReview: false, isFinalTurn: session.status === "completed" };
  }
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  if (!turn) throw new Error("Invalid turn index");

  const history = await store.listConversationMessages(session.id, turn.index);

  // Persisting the candidate's message and calling the agent are
  // independent — agentTurn takes rawText separately from history, so it
  // doesn't need this write to have landed first. Run them concurrently
  // instead of paying for two sequential round trips.
  const [, result] = await Promise.all([
    store.addConversationMessage({ sessionId: session.id, turnIndex: turn.index, role: "candidate", textHe: rawText }),
    agentTurn({
      scenario,
      turn,
      history: history.map((m) => ({ role: m.role, textHe: m.textHe })),
      rawText,
      // Without a database, conversation history read above is per-instance
      // and unreliable across a cold serverless start — never offer a
      // follow-up in that mode rather than risk resetting the "at most one
      // follow-up" limit indefinitely. See conversational-agent.ts.
      forceScore: !hasDatabase(),
    }),
  ]);

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
  const newEvidence: TurnEvidenceEntry[] = result.criteriaScores.map((cs) => ({
    criterion: cs.criterion,
    score: cs.score,
    sourceTurn: turn.index,
  }));

  if (result.adversarial) {
    await notifyMake({
      event: "needs_human_review",
      sessionId: session.id,
      candidateName: session.candidateName,
      scenarioTitle: scenario.title_he,
      reportUrl: `${siteUrl()}/assessor/sessions/${session.id}`,
      turnIndex: turn.index,
      reviewReason: "injection_flagged",
    });
  }

  const { session: updated, isFinalTurn, nextEventHe } = await applyTurnAdvance(scenario, session, turn, result.matchedOptionKeys, newEvidence);

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
  // Scored from session.turnEvidence — carried on the session record itself
  // (and therefore on the resiliency cookie in no-database mode) — rather
  // than store.listEvidence(), which is per-serverless-instance and
  // unreliable across cold starts when no database is connected. evidence_he
  // is intentionally blank here (kept out of the session/cookie to control
  // size); the assessor report page still gets verbatim quotes from
  // store.listEvidence() directly, unrelated to this score computation.
  const evidence = session.turnEvidence.map((e) => ({
    criterion: e.criterion,
    score: e.score,
    evidence_he: "",
    sourceTurn: e.sourceTurn,
  }));
  const result = aggregate(evidence, scenario.kpis, session.kpiState);
  await store.saveReport({
    sessionId: session.id,
    processScore: result.processScore,
    outcomeScore: result.outcomeScore,
    criteriaScores: result.criteriaScores,
  });

  await notifyMake({
    event: "session_completed",
    sessionId: session.id,
    candidateName: session.candidateName,
    scenarioTitle: scenario.title_he,
    reportUrl: `${siteUrl()}/assessor/sessions/${session.id}`,
    processScore: result.processScore,
    outcomeScore: result.outcomeScore,
  });

  return result;
}

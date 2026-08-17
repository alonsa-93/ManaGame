import type { Scenario } from "@/lib/scenario-schema";
import { applyDeltas, initialKpiState, type KpiState } from "@/lib/engine/state";
import { llmAssistedParse } from "@/lib/engine/llm-parser";
import { buildEvidence } from "@/lib/engine/judge";
import { aggregate } from "@/lib/engine/aggregator";
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

  let nextState: KpiState = session.kpiState;
  for (const m of parseResult.matches) {
    nextState = applyDeltas(nextState, scenario.kpis, m.option.deltas);
  }

  const isFinalTurn = turn.index >= scenario.turns.length;
  const nextTurnIndex = isFinalTurn ? turn.index : turn.index + 1;
  const nextTurn = scenario.turns.find((t) => t.index === nextTurnIndex);

  const branchEvent = parseResult.matches.find((m) => m.option.nextEvent_he)?.option.nextEvent_he;
  const nextEventHe = !isFinalTurn ? branchEvent ?? nextTurn?.event_he : undefined;

  if (!isFinalTurn && nextEventHe) {
    await store.addEvent({
      id: crypto.randomUUID(),
      sessionId: session.id,
      turnIndex: nextTurnIndex,
      eventHe: nextEventHe,
    });
  }

  const kpiHistory = [...session.kpiHistory, { turn: turn.index, state: nextState }];

  const updated = await store.updateSession(session.id, {
    kpiState: nextState,
    kpiHistory,
    currentTurn: nextTurnIndex,
    status: isFinalTurn ? "completed" : "in_progress",
    completedAt: isFinalTurn ? new Date().toISOString() : undefined,
  });

  if (isFinalTurn && updated) {
    await finalizeReport(scenario, updated);
  }

  return {
    session: updated ?? session,
    matchedLabels: parseResult.matches.map((m) => m.option.label_he),
    needsHumanReview: parseResult.needsHumanReview,
    reviewReason: parseResult.reviewReason,
    nextEventHe,
    isFinalTurn,
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

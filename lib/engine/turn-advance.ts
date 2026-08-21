import type { Scenario, ScenarioTurn } from "@/lib/scenario-schema";
import type { SessionRecord } from "@/lib/store/types";
import { applyDeltas, type KpiState } from "@/lib/engine/state";

/**
 * Pure turn-advance computation, shared by the deterministic decision flow
 * (session.submitDecision) and the conversational-agent flow
 * (session.submitConversationalTurn) — both end up with a set of matched
 * canonical option keys and need the identical KPI/branching/completion
 * math applied. No store I/O happens here; see applyTurnAdvance in
 * session.ts for the persisted side effects built on top of this.
 */

export interface TurnAdvanceInput {
  scenario: Scenario;
  turn: ScenarioTurn;
  session: SessionRecord;
  matchedOptionKeys: string[];
}

export interface TurnAdvanceResult {
  nextState: KpiState;
  kpiHistory: SessionRecord["kpiHistory"];
  isFinalTurn: boolean;
  nextTurnIndex: number;
  nextEventHe?: string;
}

export function computeTurnAdvance({ scenario, turn, session, matchedOptionKeys }: TurnAdvanceInput): TurnAdvanceResult {
  const matchedOptions = matchedOptionKeys
    .map((key) => turn.options.find((o) => o.key === key))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  let nextState: KpiState = session.kpiState;
  for (const option of matchedOptions) {
    nextState = applyDeltas(nextState, scenario.kpis, option.deltas);
  }

  const isFinalTurn = turn.index >= scenario.turns.length;
  const nextTurnIndex = isFinalTurn ? turn.index : turn.index + 1;
  const nextTurn = scenario.turns.find((t) => t.index === nextTurnIndex);

  const branchEvent = matchedOptions.find((o) => o.nextEvent_he)?.nextEvent_he;
  const nextEventHe = !isFinalTurn ? branchEvent ?? nextTurn?.event_he : undefined;

  const kpiHistory = [...session.kpiHistory, { turn: turn.index, state: nextState }];

  return { nextState, kpiHistory, isFinalTurn, nextTurnIndex, nextEventHe };
}

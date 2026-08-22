import type { IntelOption, KpiDef, Scenario } from "@/lib/scenario-schema";

export interface TurnPublicView {
  index: number;
  situation_he: string;
  constraints_he?: string[];
  availableIntel?: IntelOption[];
  decisionPrompt_he?: string;
}

export interface ScenarioPublicView {
  title_he: string;
  kpis: KpiDef[];
  totalTurns: number;
  turn: TurnPublicView;
}

/**
 * Strips everything the candidate-facing UI must never receive: the option
 * vocabulary, matching keywords, KPI deltas, criteria signals, evidence
 * text, and branch events — for the current turn AND every other turn. This
 * is the scoring "answer key". Next.js serializes props passed to a
 * 'use client' component into the page's RSC payload, so passing the raw
 * Scenario to DecisionFlow/AgentChatFlow would ship the whole rubric in
 * view-source. Server actions re-load the full Scenario by id server-side,
 * so nothing downstream needs the client to hold it.
 */
export function toScenarioPublicView(scenario: Scenario, currentTurnIndex: number): ScenarioPublicView {
  const turn = scenario.turns.find((t) => t.index === currentTurnIndex);
  if (!turn) throw new Error("Invalid turn index");
  return {
    title_he: scenario.title_he,
    kpis: scenario.kpis,
    totalTurns: scenario.turns.length,
    turn: {
      index: turn.index,
      situation_he: turn.situation_he,
      constraints_he: turn.constraints_he,
      availableIntel: turn.availableIntel,
      decisionPrompt_he: turn.decisionPrompt_he,
    },
  };
}

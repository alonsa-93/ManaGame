import { describe, expect, it } from "vitest";
import { computeTurnAdvance } from "@/lib/engine/turn-advance";
import type { Scenario, ScenarioTurn } from "@/lib/scenario-schema";
import type { SessionRecord } from "@/lib/store/types";

const kpis = [{ key: "budget", label_he: "תקציב", start: 50, min: 0, max: 100, higherIsBetter: true }];

function makeScenario(turns: ScenarioTurn[]): Scenario {
  return {
    id: "s1",
    domainKey: "finance",
    title_he: "תרחיש",
    roleLevel: "manager",
    difficulty: 1,
    summary_he: "",
    estimatedMinutes: [5, 10],
    kpis,
    turns,
  };
}

function makeSession(currentTurn: number): SessionRecord {
  return {
    id: "sess1",
    scenarioId: "s1",
    status: "in_progress",
    seed: "1",
    currentTurn,
    kpiState: { budget: 50 },
    kpiHistory: [{ turn: 0, state: { budget: 50 } }],
    turnEvidence: [],
    createdAt: new Date(0).toISOString(),
  };
}

describe("computeTurnAdvance", () => {
  it("applies the matched option's KPI deltas and advances to the next turn", () => {
    const turn1: ScenarioTurn = {
      index: 1,
      situation_he: "x",
      options: [{ key: "a", label_he: "a", keywords_he: [], deltas: { budget: 10 }, evidence_he: "e", criteriaSignals: {} }],
    };
    const turn2: ScenarioTurn = { index: 2, situation_he: "y", event_he: "עדכון תור 2", options: [] };
    const scenario = makeScenario([turn1, turn2]);
    const session = makeSession(1);

    const result = computeTurnAdvance({ scenario, turn: turn1, session, matchedOptionKeys: ["a"] });

    expect(result.nextState.budget).toBe(60);
    expect(result.isFinalTurn).toBe(false);
    expect(result.nextTurnIndex).toBe(2);
    expect(result.nextEventHe).toBe("עדכון תור 2");
    expect(result.kpiHistory).toHaveLength(2);
    expect(result.kpiHistory[1]).toEqual({ turn: 1, state: { budget: 60 } });
  });

  it("prefers the matched option's branch event over the next turn's default event", () => {
    const turn1: ScenarioTurn = {
      index: 1,
      situation_he: "x",
      options: [
        { key: "a", label_he: "a", keywords_he: [], deltas: {}, evidence_he: "e", criteriaSignals: {}, nextEvent_he: "ענף מיוחד" },
      ],
    };
    const turn2: ScenarioTurn = { index: 2, situation_he: "y", event_he: "ברירת מחדל", options: [] };
    const scenario = makeScenario([turn1, turn2]);
    const session = makeSession(1);

    const result = computeTurnAdvance({ scenario, turn: turn1, session, matchedOptionKeys: ["a"] });

    expect(result.nextEventHe).toBe("ענף מיוחד");
  });

  it("marks the final turn complete with no next event", () => {
    const turn1: ScenarioTurn = {
      index: 1,
      situation_he: "x",
      options: [{ key: "a", label_he: "a", keywords_he: [], deltas: {}, evidence_he: "e", criteriaSignals: {} }],
    };
    const scenario = makeScenario([turn1]);
    const session = makeSession(1);

    const result = computeTurnAdvance({ scenario, turn: turn1, session, matchedOptionKeys: ["a"] });

    expect(result.isFinalTurn).toBe(true);
    expect(result.nextTurnIndex).toBe(1);
    expect(result.nextEventHe).toBeUndefined();
  });

  it("ignores option keys that don't belong to the turn", () => {
    const turn1: ScenarioTurn = {
      index: 1,
      situation_he: "x",
      options: [{ key: "a", label_he: "a", keywords_he: [], deltas: { budget: 99 }, evidence_he: "e", criteriaSignals: {} }],
    };
    const scenario = makeScenario([turn1]);
    const session = makeSession(1);

    const result = computeTurnAdvance({ scenario, turn: turn1, session, matchedOptionKeys: ["not_a_real_key"] });

    expect(result.nextState.budget).toBe(50);
  });
});

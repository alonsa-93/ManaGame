import { describe, expect, it } from "vitest";
import { toScenarioPublicView } from "@/lib/engine/turn-view";
import type { Scenario } from "@/lib/scenario-schema";

const scenario: Scenario = {
  id: "s1",
  domainKey: "finance",
  title_he: "תרחיש",
  roleLevel: "manager",
  difficulty: 1,
  summary_he: "summary",
  estimatedMinutes: [5, 10],
  kpis: [{ key: "budget", label_he: "תקציב", start: 50, min: 0, max: 100, higherIsBetter: true }],
  turns: [
    {
      index: 1,
      situation_he: "מצב 1",
      constraints_he: ["אילוץ"],
      decisionPrompt_he: "מה עושים?",
      options: [
        {
          key: "secret_answer_key",
          label_he: "תשובה נכונה",
          keywords_he: ["מילת מפתח סודית"],
          deltas: { budget: 10 },
          evidence_he: "ראיה סודית",
          criteriaSignals: { realism: 5 },
          nextEvent_he: "ענף סודי",
        },
      ],
    },
    { index: 2, situation_he: "מצב 2", options: [] },
  ],
};

describe("toScenarioPublicView", () => {
  it("never leaks any option/scoring field, at any nesting depth, for any turn", () => {
    const view = toScenarioPublicView(scenario, 1);
    const serialized = JSON.stringify(view);
    for (const forbidden of [
      "options",
      "keywords_he",
      "deltas",
      "criteriaSignals",
      "evidence_he",
      "nextEvent_he",
      "secret_answer_key",
      "מילת מפתח סודית",
      "ראיה סודית",
      "ענף סודי",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("exposes only what the candidate UI actually renders for the current turn", () => {
    const view = toScenarioPublicView(scenario, 1);
    expect(view).toEqual({
      title_he: "תרחיש",
      kpis: scenario.kpis,
      totalTurns: 2,
      turn: {
        index: 1,
        situation_he: "מצב 1",
        constraints_he: ["אילוץ"],
        availableIntel: undefined,
        decisionPrompt_he: "מה עושים?",
      },
    });
  });

  it("throws on an invalid turn index rather than silently returning a wrong turn", () => {
    expect(() => toScenarioPublicView(scenario, 99)).toThrow();
  });
});

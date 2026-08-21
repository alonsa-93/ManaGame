import { describe, expect, it } from "vitest";
import { coerceAgentToolInput } from "@/lib/engine/conversational-agent";
import type { ScenarioTurn } from "@/lib/scenario-schema";

const turn: ScenarioTurn = {
  index: 1,
  situation_he: "מצב לדוגמה",
  decisionPrompt_he: "מה עושים?",
  options: [
    {
      key: "opt_a",
      label_he: "אפשרות א",
      keywords_he: [],
      deltas: {},
      evidence_he: "ראיה",
      criteriaSignals: {},
    },
  ],
};

describe("coerceAgentToolInput", () => {
  it("passes through a well-formed score action", () => {
    const result = coerceAgentToolInput(
      {
        action: "score",
        message_he: "תודה, ממשיכים.",
        adversarial: false,
        matched_option_keys: ["opt_a"],
        criteria_scores: [{ criterion: "realism", score: 4, evidence_he: "ציטוט" }],
      },
      turn,
      false
    );
    expect(result.action).toBe("score");
    if (result.action !== "score") throw new Error("expected score");
    expect(result.matchedOptionKeys).toEqual(["opt_a"]);
    expect(result.criteriaScores).toEqual([{ criterion: "realism", score: 4, evidence_he: "ציטוט" }]);
    expect(result.messageHe).toBe("תודה, ממשיכים.");
    expect(result.adversarial).toBe(false);
  });

  it("passes through a well-formed ask_followup action when not forced to score", () => {
    const result = coerceAgentToolInput(
      { action: "ask_followup", message_he: "מה שקלת מלבד זה?", adversarial: false },
      turn,
      false
    );
    expect(result.action).toBe("ask_followup");
    expect(result.messageHe).toBe("מה שקלת מלבד זה?");
  });

  it("forces action to score when mustScore is true, even if the model asked to follow up", () => {
    const result = coerceAgentToolInput(
      { action: "ask_followup", message_he: "עוד שאלה", adversarial: false },
      turn,
      true
    );
    expect(result.action).toBe("score");
    if (result.action !== "score") throw new Error("expected score");
    expect(result.criteriaScores).toEqual([]);
    expect(result.matchedOptionKeys).toEqual([]);
  });

  it("clamps out-of-range criterion scores into 0-5", () => {
    const result = coerceAgentToolInput(
      {
        action: "score",
        message_he: "ok",
        adversarial: false,
        matched_option_keys: [],
        criteria_scores: [
          { criterion: "realism", score: 9, evidence_he: "x" },
          { criterion: "communication", score: -3, evidence_he: "y" },
        ],
      },
      turn,
      false
    );
    if (result.action !== "score") throw new Error("expected score");
    expect(result.criteriaScores).toEqual([
      { criterion: "realism", score: 5, evidence_he: "x" },
      { criterion: "communication", score: 0, evidence_he: "y" },
    ]);
  });

  it("drops criterion scores with an unknown criterion key", () => {
    const result = coerceAgentToolInput(
      {
        action: "score",
        message_he: "ok",
        adversarial: false,
        matched_option_keys: [],
        criteria_scores: [{ criterion: "not_a_real_criterion", score: 3, evidence_he: "x" }],
      },
      turn,
      false
    );
    if (result.action !== "score") throw new Error("expected score");
    expect(result.criteriaScores).toEqual([]);
  });

  it("drops matched option keys that aren't part of the turn's canonical vocabulary", () => {
    const result = coerceAgentToolInput(
      {
        action: "score",
        message_he: "ok",
        adversarial: false,
        matched_option_keys: ["opt_a", "invented_option"],
        criteria_scores: [],
      },
      turn,
      false
    );
    if (result.action !== "score") throw new Error("expected score");
    expect(result.matchedOptionKeys).toEqual(["opt_a"]);
  });

  it("defaults missing/malformed fields safely instead of throwing", () => {
    const result = coerceAgentToolInput({}, turn, false);
    expect(result.action).toBe("ask_followup");
    expect(result.messageHe).toBe("");
    expect(result.adversarial).toBe(false);
  });

  it("defaults a malformed criteria_scores array on a score action to empty", () => {
    const result = coerceAgentToolInput(
      { action: "score", message_he: "ok", adversarial: false, matched_option_keys: [], criteria_scores: "not-an-array" },
      turn,
      false
    );
    if (result.action !== "score") throw new Error("expected score");
    expect(result.criteriaScores).toEqual([]);
  });
});

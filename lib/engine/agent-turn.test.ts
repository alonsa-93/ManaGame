import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = { create: mockCreate };
  },
}));

const { agentTurn } = await import("@/lib/engine/conversational-agent");
const { CRITERIA } = await import("@/lib/scenario-schema");
type ScenarioTurn = import("@/lib/scenario-schema").ScenarioTurn;

const scenario = { domainKey: "finance", roleLevel: "manager" as const, title_he: "תרחיש" };
const turn: ScenarioTurn = {
  index: 1,
  situation_he: "מצב",
  options: [
    { key: "a", label_he: "א", keywords_he: ["משהו"], deltas: {}, evidence_he: "ראיה", criteriaSignals: { realism: 3 } },
  ],
};

function toolUseResponse(input: unknown) {
  return { content: [{ type: "tool_use", input }] };
}

describe("agentTurn — forced-score safety net (mustScore=true on the second exchange)", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    mockCreate.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to heuristic scoring instead of advancing with zero evidence and a dangling follow-up as the closing message", async () => {
    mockCreate.mockResolvedValue(
      toolUseResponse({ action: "ask_followup", message_he: "שאלת המשך תלויה שלא נענתה", adversarial: false })
    );

    const result = await agentTurn({
      scenario,
      turn,
      history: [{ role: "candidate", textHe: "עשיתי X" }], // one prior candidate message => mustScore
      rawText: "עשיתי גם משהו",
    });

    expect(result.action).toBe("score");
    expect(result.messageHe).not.toBe("שאלת המשך תלויה שלא נענתה");
    if (result.action !== "score") throw new Error("expected score");
    // Recovered via the heuristic path over the combined conversation text,
    // which contains the turn's matching keyword ("משהו").
    expect(result.matchedOptionKeys).toContain("a");
  });

  it("does NOT override a genuine forced score that already carries real judgment", async () => {
    mockCreate.mockResolvedValue(
      toolUseResponse({
        action: "ask_followup", // model still says ask_followup, but mustScore forces "score"
        message_he: "תודה על ההבהרה",
        adversarial: false,
        matched_option_keys: ["a"],
        criteria_scores: [{ criterion: "realism", score: 4, evidence_he: "ציטוט אמיתי" }],
      })
    );

    const result = await agentTurn({
      scenario,
      turn,
      history: [{ role: "candidate", textHe: "עשיתי X" }],
      rawText: "הבהרה נוספת",
    });

    expect(result.action).toBe("score");
    if (result.action !== "score") throw new Error("expected score");
    expect(result.criteriaScores).toEqual([{ criterion: "realism", score: 4, evidence_he: "ציטוט אמיתי" }]);
    expect(result.messageHe).toBe("תודה על ההבהרה");
  });
});

describe("agentTurn — forceScore option (no-database resiliency mode)", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    mockCreate.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("scores immediately even with empty history when forceScore is true, rather than offering a follow-up", async () => {
    mockCreate.mockResolvedValue(
      toolUseResponse({
        action: "score",
        message_he: "תודה",
        adversarial: false,
        matched_option_keys: ["a"],
        criteria_scores: [{ criterion: CRITERIA[0].key, score: 3, evidence_he: "x" }],
      })
    );

    const result = await agentTurn({
      scenario,
      turn,
      history: [], // no prior messages — without forceScore this would allow a follow-up
      rawText: "עשיתי משהו",
      forceScore: true,
    });

    // The model already returned "score" here, so this mainly proves the
    // call succeeds with forceScore set; the mustScore-forcing branch itself
    // is covered by coerceAgentToolInput's own unit tests.
    expect(result.action).toBe("score");
  });
});

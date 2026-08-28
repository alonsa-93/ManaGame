import { describe, expect, it, beforeEach } from "vitest";
import { aiUsageSummary, costOf, recordAiCall, resetAiUsage } from "@/lib/ai-usage";

beforeEach(() => resetAiUsage());

describe("costOf", () => {
  it("prices input and output at their separate rates", () => {
    // 1M input at $3 + 1M output at $15
    expect(costOf("claude-sonnet-5", 1_000_000, 1_000_000)).toBeCloseTo(18, 6);
  });

  it("falls back to a default rate for an unknown model rather than reporting zero", () => {
    expect(costOf("some-future-model", 1_000_000, 0)).toBeGreaterThan(0);
  });

  it("is zero for a call that used nothing", () => {
    expect(costOf("claude-sonnet-5", 0, 0)).toBe(0);
  });
});

describe("aiUsageSummary", () => {
  it("is empty before anything is recorded", () => {
    expect(aiUsageSummary()).toMatchObject({ calls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, since: null });
  });

  it("totals across calls and splits by purpose", () => {
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 200 });
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 2000, outputTokens: 300 });
    recordAiCall({ model: "claude-sonnet-5", purpose: "decision_parse", inputTokens: 500, outputTokens: 50 });

    const summary = aiUsageSummary();
    expect(summary.calls).toBe(3);
    expect(summary.inputTokens).toBe(3500);
    expect(summary.outputTokens).toBe(550);
    expect(summary.byPurpose.conversational_turn?.calls).toBe(2);
    expect(summary.byPurpose.decision_parse?.calls).toBe(1);
    expect(summary.estimatedUsd).toBeCloseTo(costOf("claude-sonnet-5", 3500, 550), 9);
  });

  it("records the timestamp of the first call, so the dashboard can say since when", () => {
    recordAiCall({ model: "claude-sonnet-5", purpose: "connection_test", inputTokens: 10, outputTokens: 1 });
    expect(aiUsageSummary().since).toBeTypeOf("string");
  });
});

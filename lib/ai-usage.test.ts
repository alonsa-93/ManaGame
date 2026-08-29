import { describe, expect, it, beforeEach } from "vitest";
import { aiUsageDaily, aiUsageSummary, costOf, recordAiCall, resetAiUsage } from "@/lib/ai-usage";

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

describe("aiUsageDaily", () => {
  it("is empty before anything is recorded", () => {
    expect(aiUsageDaily()).toEqual([]);
  });

  it("buckets calls by UTC calendar date", () => {
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 100, at: "2026-08-01T09:00:00.000Z" });
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 100, at: "2026-08-01T23:00:00.000Z" });
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 100, at: "2026-08-03T09:00:00.000Z" });

    const days = aiUsageDaily();
    expect(days.map((d) => d.date)).toEqual(["2026-08-01", "2026-08-02", "2026-08-03"]);
    expect(days[0]).toMatchObject({ date: "2026-08-01", calls: 2 });
    expect(days[0]!.estimatedUsd).toBeCloseTo(costOf("claude-sonnet-5", 2000, 200), 9);
  });

  it("fills a gap day with zero rather than skipping it, so a chart never silently jumps", () => {
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 100, at: "2026-08-01T09:00:00.000Z" });
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 100, at: "2026-08-03T09:00:00.000Z" });

    const days = aiUsageDaily();
    expect(days.map((d) => d.date)).toEqual(["2026-08-01", "2026-08-02", "2026-08-03"]);
    expect(days[1]).toEqual({ date: "2026-08-02", calls: 0, estimatedUsd: 0 });
  });

  it("returns a single day when everything happened on one date", () => {
    recordAiCall({ model: "claude-sonnet-5", purpose: "conversational_turn", inputTokens: 1000, outputTokens: 100, at: "2026-08-01T09:00:00.000Z" });
    expect(aiUsageDaily()).toHaveLength(1);
  });
});

import { describe, expect, it } from "vitest";
import { scoreTrend } from "@/lib/engine/score-trend";
import type { SessionRecord, ReportRecord } from "@/lib/store/types";

function session(overrides: Partial<SessionRecord>): SessionRecord {
  return {
    id: "s1",
    scenarioId: "supply-chain-manager-1",
    status: "completed",
    seed: "seed",
    currentTurn: 4,
    kpiState: {},
    kpiHistory: [],
    turnEvidence: [],
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

function report(overrides: Partial<ReportRecord>): ReportRecord {
  return { sessionId: "s1", processScore: 70, outcomeScore: 60, criteriaScores: [], generatedAt: "2026-08-01T00:00:00.000Z", ...overrides };
}

describe("scoreTrend", () => {
  it("orders points oldest first by completion date", () => {
    const sessions = [
      session({ id: "b", completedAt: "2026-08-03T00:00:00.000Z" }),
      session({ id: "a", completedAt: "2026-08-01T00:00:00.000Z" }),
    ];
    const reports = [report({ sessionId: "b" }), report({ sessionId: "a" })];
    expect(scoreTrend(sessions, reports).map((p) => p.sessionId)).toEqual(["a", "b"]);
  });

  it("excludes sessions that have not completed", () => {
    const sessions = [session({ id: "a", status: "in_progress" }), session({ id: "b", status: "completed" })];
    const reports = [null, report({ sessionId: "b" })];
    expect(scoreTrend(sessions, reports).map((p) => p.sessionId)).toEqual(["b"]);
  });

  it("keeps a null process score as null rather than coercing it to zero", () => {
    const sessions = [session({ id: "a" })];
    const reports = [report({ sessionId: "a", processScore: null })];
    expect(scoreTrend(sessions, reports)[0]!.processScore).toBeNull();
  });

  it("handles a session with no report yet", () => {
    const sessions = [session({ id: "a" })];
    expect(scoreTrend(sessions, [null])[0]).toMatchObject({ processScore: null, outcomeScore: null });
  });

  it("falls back to createdAt when completedAt is missing", () => {
    const sessions = [session({ id: "a", completedAt: undefined, createdAt: "2026-07-15T00:00:00.000Z" })];
    expect(scoreTrend(sessions, [report({ sessionId: "a" })])[0]!.date).toBe("2026-07-15T00:00:00.000Z");
  });
});

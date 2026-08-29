import { describe, expect, it } from "vitest";
import { toSessionDetail, toSessionSummary } from "@/lib/api/serialize";
import type { DecisionRecord, ReportRecord, SessionRecord } from "@/lib/store/types";
import type { Scenario } from "@/lib/scenario-schema";

const session: SessionRecord = {
  id: "sess-1",
  scenarioId: "supply-chain-manager-1",
  candidateName: "דנה כהן",
  candidateEmail: "dana@example.com",
  status: "completed",
  seed: "seed-1",
  currentTurn: 4,
  kpiState: { schedule: 40 },
  kpiHistory: [],
  turnEvidence: [],
  createdAt: "2026-08-01T10:00:00.000Z",
  completedAt: "2026-08-01T10:35:00.000Z",
};

const scenario = {
  id: "supply-chain-manager-1",
  domainKey: "supply-chain",
  title_he: "עיכוב אספקה",
  roleLevel: "manager",
  turns: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }],
} as unknown as Scenario;

const report: ReportRecord = {
  sessionId: "sess-1",
  processScore: 72,
  outcomeScore: 55,
  criteriaScores: [
    { criterion: "realism", label_he: "ריאליזם", measured: true, score100: 80 },
    { criterion: "communication", label_he: "תקשורת", measured: false, score100: 41 },
  ],
  generatedAt: "2026-08-01T10:36:00.000Z",
};

const decisions: DecisionRecord[] = [
  {
    id: "d1",
    sessionId: "sess-1",
    turnIndex: 1,
    rawText: "בדקתי מלאי אצל ספק חלופי לפני שהתחייבתי",
    matchedOptionKeys: ["check_alt_supplier"],
    confidence: 0.9,
    needsHumanReview: false,
    createdAt: "2026-08-01T10:05:00.000Z",
  },
  {
    id: "d2",
    sessionId: "sess-1",
    turnIndex: 2,
    rawText: "טקסט חופשי רגיש",
    matchedOptionKeys: [],
    confidence: 0.2,
    needsHumanReview: true,
    reviewReason: "low_confidence",
    createdAt: "2026-08-01T10:15:00.000Z",
  },
];

describe("toSessionSummary", () => {
  it("carries the outcome an ATS needs", () => {
    expect(toSessionSummary(session, scenario, report, 1)).toEqual({
      id: "sess-1",
      scenarioId: "supply-chain-manager-1",
      scenarioTitle: "עיכוב אספקה",
      roleLevel: "manager",
      candidateName: "דנה כהן",
      externalRef: null,
      status: "completed",
      createdAt: "2026-08-01T10:00:00.000Z",
      completedAt: "2026-08-01T10:35:00.000Z",
      processScore: 72,
      outcomeScore: 55,
      needsHumanReview: true,
    });
  });

  it("survives a session whose scenario is no longer in the content library", () => {
    const summary = toSessionSummary(session, undefined, null, 0);
    expect(summary.scenarioTitle).toBe("supply-chain-manager-1");
    expect(summary.roleLevel).toBe("unknown");
    expect(summary.processScore).toBeNull();
  });

  it("never exposes the candidate's email", () => {
    expect(JSON.stringify(toSessionSummary(session, scenario, report, 0))).not.toContain("dana@example.com");
  });

  it("passes through the caller's own correlation id when one was set at creation", () => {
    const withRef = { ...session, externalRef: "ats-app-4471" };
    expect(toSessionSummary(withRef, scenario, report, 0).externalRef).toBe("ats-app-4471");
  });

  it("reports no correlation id as null, not undefined — undefined silently vanishes from JSON", () => {
    expect(toSessionSummary(session, scenario, report, 0).externalRef).toBeNull();
  });
});

describe("toSessionDetail", () => {
  const detail = toSessionDetail(session, scenario, report, decisions);

  it("never serialises the candidate's free text or the transcript", () => {
    const json = JSON.stringify(detail);
    expect(json).not.toContain("בדקתי מלאי");
    expect(json).not.toContain("טקסט חופשי רגיש");
  });

  it("never serialises the scenario's option keys — that's the answer key", () => {
    expect(JSON.stringify(detail)).not.toContain("check_alt_supplier");
  });

  it("nulls the score of an unmeasured criterion rather than reporting a stale number", () => {
    const communication = detail.criteriaScores.find((c) => c.criterion === "communication");
    expect(communication).toMatchObject({ measured: false, score100: null });
  });

  it("reports which turns were flagged and why, without the text behind them", () => {
    expect(detail.reviewFlags).toEqual([{ turnIndex: 2, reason: "low_confidence" }]);
  });

  it("counts progress against the scenario's real length", () => {
    expect(detail.turnsCompleted).toBe(2);
    expect(detail.totalTurns).toBe(4);
  });

  it("states plainly that a null process score is not a low score", () => {
    expect(detail.disclaimer).toContain("not a low score");
  });
});

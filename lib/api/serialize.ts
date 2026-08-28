import type { DecisionRecord, ReportRecord, SessionRecord } from "@/lib/store/types";
import type { Scenario } from "@/lib/scenario-schema";

/**
 * Response shapes for the integration API.
 *
 * The governing rule is minimisation: an ATS needs to know *that* an
 * assessment happened and how it came out, not what the candidate typed. So
 * the free-text answers and the agent transcript are never serialised here at
 * any verbosity — they are the most sensitive thing the system holds, and an
 * integration that pulls them into a third-party system moves that exposure
 * somewhere nobody in this codebase can see. An assessor who needs the words
 * reads them in the report, behind the operator gate.
 *
 * The scenario's option keys are also withheld: they are the scoring answer
 * key, and an ATS has no use for them.
 */

export interface ApiCriterionScore {
  criterion: string;
  label_he: string;
  measured: boolean;
  score100: number | null;
}

export interface ApiSessionSummary {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  roleLevel: string;
  candidateName: string | null;
  status: SessionRecord["status"];
  createdAt: string;
  completedAt: string | null;
  processScore: number | null;
  outcomeScore: number | null;
  needsHumanReview: boolean;
}

export interface ApiSessionDetail extends ApiSessionSummary {
  criteriaScores: ApiCriterionScore[];
  turnsCompleted: number;
  totalTurns: number;
  reviewFlags: { turnIndex: number; reason: string | null }[];
  /** Explicit, so a consumer never has to infer it from a missing field. */
  disclaimer: string;
}

const DISCLAIMER =
  "ManaGame produces structured evidence, not a hiring decision. A null processScore means fewer than three criteria were measured — it is not a low score. Free-text answers and the agent transcript are deliberately not exposed through this API.";

export function toSessionSummary(
  session: SessionRecord,
  scenario: Scenario | undefined,
  report: ReportRecord | null,
  flagCount: number
): ApiSessionSummary {
  return {
    id: session.id,
    scenarioId: session.scenarioId,
    scenarioTitle: scenario?.title_he ?? session.scenarioId,
    roleLevel: scenario?.roleLevel ?? "unknown",
    candidateName: session.candidateName ?? null,
    status: session.status,
    createdAt: session.createdAt,
    completedAt: session.completedAt ?? null,
    processScore: report?.processScore ?? null,
    outcomeScore: report?.outcomeScore ?? null,
    needsHumanReview: flagCount > 0,
  };
}

export function toSessionDetail(
  session: SessionRecord,
  scenario: Scenario | undefined,
  report: ReportRecord | null,
  decisions: DecisionRecord[]
): ApiSessionDetail {
  const flagged = decisions.filter((d) => d.needsHumanReview);

  return {
    ...toSessionSummary(session, scenario, report, flagged.length),
    criteriaScores: ((report?.criteriaScores as ApiCriterionScore[] | undefined) ?? []).map((c) => ({
      criterion: c.criterion,
      label_he: c.label_he,
      measured: c.measured,
      score100: c.measured ? c.score100 : null,
    })),
    turnsCompleted: decisions.length,
    totalTurns: scenario?.turns.length ?? 0,
    reviewFlags: flagged.map((d) => ({ turnIndex: d.turnIndex, reason: d.reviewReason ?? null })),
    disclaimer: DISCLAIMER,
  };
}

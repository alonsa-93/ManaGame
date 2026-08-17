import type { CriterionKey, KpiDef } from "@/lib/scenario-schema";
import { CRITERIA } from "@/lib/scenario-schema";
import type { EvidenceEntry } from "@/lib/engine/judge";
import { normalizeKpi } from "@/lib/engine/state";
import type { KpiState } from "@/lib/engine/state";

export interface CriterionScore {
  criterion: CriterionKey;
  label_he: string;
  measured: boolean;
  score100: number | null; // null when not measured this session
  evidence: EvidenceEntry[];
}

export interface AggregateResult {
  processScore: number | null;
  outcomeScore: number;
  criteriaScores: CriterionScore[];
}

/**
 * Deterministic aggregator. No model call happens here — this is a pure
 * function over evidence already collected by the judge and the final KPI
 * state. Given the same evidence and state, it always returns the same
 * numbers (see Master Spec §53-54, Determinism).
 */
export function aggregate(evidence: EvidenceEntry[], kpis: KpiDef[], finalState: KpiState): AggregateResult {
  const criteriaScores: CriterionScore[] = CRITERIA.map((c) => {
    const entries = evidence.filter((e) => e.criterion === c.key);
    if (entries.length === 0) {
      return { criterion: c.key, label_he: c.label_he, measured: false, score100: null, evidence: [] };
    }
    const avg = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;
    return {
      criterion: c.key,
      label_he: c.label_he,
      measured: true,
      score100: Math.round(avg * 20),
      evidence: entries,
    };
  });

  const measured = criteriaScores.filter((c) => c.score100 !== null);
  const processScore =
    measured.length >= 3
      ? Math.round(measured.reduce((sum, c) => sum + (c.score100 ?? 0), 0) / measured.length)
      : null;

  const outcomeScore = Math.round(
    kpis.reduce((sum, kpi) => sum + normalizeKpi(kpi, finalState[kpi.key] ?? kpi.start), 0) / kpis.length
  );

  return { processScore, outcomeScore, criteriaScores };
}

import type { KpiDef } from "@/lib/scenario-schema";

export type KpiState = Record<string, number>;

export function initialKpiState(kpis: KpiDef[]): KpiState {
  return Object.fromEntries(kpis.map((k) => [k.key, k.start]));
}

/** Deterministically applies KPI deltas, clamped to each KPI's declared range. */
export function applyDeltas(state: KpiState, kpis: KpiDef[], deltas: Record<string, number>): KpiState {
  const next = { ...state };
  for (const kpi of kpis) {
    const delta = deltas[kpi.key] ?? 0;
    if (delta === 0) continue;
    const raw = (next[kpi.key] ?? kpi.start) + delta;
    next[kpi.key] = Math.max(kpi.min, Math.min(kpi.max, raw));
  }
  return next;
}

export function kpiDeltaSince(before: KpiState, after: KpiState, key: string): number {
  return Math.round(((after[key] ?? 0) - (before[key] ?? 0)) * 100) / 100;
}

/** Normalizes a KPI's current value to a 0-100 "how good is this state" score. */
export function normalizeKpi(kpi: KpiDef, value: number): number {
  const span = kpi.max - kpi.min || 1;
  const pct = ((value - kpi.min) / span) * 100;
  return kpi.higherIsBetter ? pct : 100 - pct;
}

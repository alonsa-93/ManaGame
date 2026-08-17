"use client";

import type { KpiDef } from "@/lib/scenario-schema";
import type { KpiState } from "@/lib/engine/state";
import { cn } from "@/lib/utils";

/**
 * KPI represents the state of the environment, not the candidate's
 * personal score. Change is communicated; it is never labelled
 * good/bad, and never rendered as a personal grade (Master Spec §11).
 */
export function KpiStrip({ kpis, state, previous }: { kpis: KpiDef[]; state: KpiState; previous?: KpiState }) {
  const visible = kpis.slice(0, 4);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {visible.map((kpi) => {
        const value = state[kpi.key] ?? kpi.start;
        const prevValue = previous?.[kpi.key];
        const delta = prevValue !== undefined ? Math.round((value - prevValue) * 10) / 10 : 0;
        const pct = Math.max(0, Math.min(100, ((value - kpi.min) / (kpi.max - kpi.min || 1)) * 100));
        return (
          <div key={kpi.key} className="rounded-mg-md border border-mg-border bg-white p-3">
            <div className="text-xs text-mg-text-secondary">{kpi.label_he}</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-mg-text ltr-num">
                {Math.round(value * 10) / 10}
                {kpi.unit && <span className="text-xs text-mg-text-secondary"> {kpi.unit}</span>}
              </span>
              {delta !== 0 && (
                <span className={cn("text-xs ltr-num", "text-mg-text-secondary")}>
                  {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}
                </span>
              )}
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-black/[.06] overflow-hidden">
              <div className="h-full rounded-full bg-mg-teal transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

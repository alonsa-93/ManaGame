import { describe, expect, it } from "vitest";
import { listScenarios } from "@/content/scenarios";
import { CRITERIA, type CriterionKey } from "@/lib/scenario-schema";

/**
 * The rubric's contract with the content.
 *
 * `aggregator.ts` returns a null process score unless at least three distinct
 * criteria were measured, and criteria are measured only where a matched option
 * carries `criteriaSignals`. So a path of signal-less options is a completed
 * assessment that produces no score — which for a scoring product is the worst
 * possible failure, and it is invisible until someone actually walks that path.
 *
 * These tests make it visible at commit time instead. `npm run lint:content`
 * prints the same analysis in a readable form.
 */

const MIN_MEASURED = 3;
const VALID_KEYS = new Set<string>(CRITERIA.map((c) => c.key));

/** Exhaustive: turns advance linearly, so a run is one option per turn. */
function worstPathCriteriaCount(turns: { options: { criteriaSignals: Partial<Record<CriterionKey, number>> }[] }[]): number {
  const usable = turns.filter((t) => t.options.length > 0);
  let worst = Infinity;

  const walk = (index: number, measured: Set<string>) => {
    if (index === usable.length) {
      worst = Math.min(worst, measured.size);
      return;
    }
    for (const option of usable[index]!.options) {
      walk(index + 1, new Set([...measured, ...Object.keys(option.criteriaSignals ?? {})]));
    }
  };

  walk(0, new Set());
  return worst === Infinity ? 0 : worst;
}

describe("scenario criteria coverage", () => {
  const scenarios = listScenarios();

  it("has scenarios to check", () => {
    expect(scenarios.length).toBeGreaterThan(0);
  });

  it.each(scenarios.map((s) => [s.id, s] as const))(
    "%s: every path measures at least %i criteria",
    (_id, scenario) => {
      expect(worstPathCriteriaCount(scenario.turns)).toBeGreaterThanOrEqual(MIN_MEASURED);
    }
  );

  it("every option carries at least one criterion", () => {
    const bare = scenarios.flatMap((s) =>
      s.turns.flatMap((t) =>
        t.options
          .filter((o) => Object.keys(o.criteriaSignals ?? {}).length === 0)
          .map((o) => `${s.id} turn ${t.index}: ${o.key}`)
      )
    );
    expect(bare).toEqual([]);
  });

  it("uses only real criterion keys — a typo would silently never score", () => {
    const unknown = scenarios.flatMap((s) =>
      s.turns.flatMap((t) =>
        t.options.flatMap((o) =>
          Object.keys(o.criteriaSignals ?? {})
            .filter((k) => !VALID_KEYS.has(k))
            .map((k) => `${s.id}/${o.key}: ${k}`)
        )
      )
    );
    expect(unknown).toEqual([]);
  });

  it("keeps every signal inside the rubric's 0–5 scale", () => {
    const outOfRange = scenarios.flatMap((s) =>
      s.turns.flatMap((t) =>
        t.options.flatMap((o) =>
          Object.entries(o.criteriaSignals ?? {})
            .filter(([, v]) => typeof v !== "number" || v < 0 || v > 5)
            .map(([k, v]) => `${s.id}/${o.key}: ${k}=${v}`)
        )
      )
    );
    expect(outOfRange).toEqual([]);
  });
});

describe("scenario mechanics", () => {
  const scenarios = listScenarios();

  it("moves every KPI it puts on the candidate's dashboard", () => {
    // A declared-but-frozen KPI is worse than a missing one: it implies the
    // candidate's decisions affect it, and it feeds aggregate()'s outcome score
    // as a constant, damping the gap between a good run and a bad one.
    const frozen = scenarios.flatMap((s) => {
      const moved = new Set(s.turns.flatMap((t) => t.options.flatMap((o) => Object.keys(o.deltas ?? {}))));
      return s.kpis.filter((k) => !moved.has(k.key)).map((k) => `${s.id}: ${k.key}`);
    });
    expect(frozen).toEqual([]);
  });

  it("lets at least one decision change what happens next", () => {
    // The product's whole claim is that reality reacts. A scenario where no
    // option sets nextEvent_he plays the same script no matter what the
    // candidate does.
    const scripted = scenarios
      .filter((s) => !s.turns.some((t) => t.options.some((o) => o.nextEvent_he)))
      .map((s) => s.id);
    expect(scripted).toEqual([]);
  });

  it("offers information to buy on more than the opening turn", () => {
    // information_acquisition is a rubric criterion. With intel only on turn 1,
    // a candidate could demonstrate it exactly once per assessment.
    const shallow = scenarios
      .filter((s) => s.turns.filter((t) => (t.availableIntel ?? []).length > 0).length < 2)
      .map((s) => s.id);
    expect(shallow).toEqual([]);
  });

  it("has no delta that can never do anything", () => {
    // The plan's own Phase 2 gate called this "אפס דלתאות בלתי־חוקיות".
    // A negative delta on a KPI that no earlier turn is able to raise is dead
    // on arrival: the engine clamps it and the candidate's choice has no
    // effect. Worse, it hides a sign error — semiconductors-vp-1 rewarded
    // "continue production despite a risk indication" with *reduced* financial
    // exposure, and only looked harmless because exposure starts at zero.
    const dead = scenarios.flatMap((s) => {
      const byKey = new Map(s.kpis.map((k) => [k.key, k]));
      return s.turns.flatMap((turn) =>
        turn.options.flatMap((option) =>
          Object.entries(option.deltas ?? {})
            .filter(([key, delta]) => {
              const def = byKey.get(key);
              if (!def || delta >= 0) return false;
              // Best case value on arrival: every earlier turn picks its most
              // positive delta for this KPI.
              const reachable = s.turns
                .filter((t) => t.index < turn.index)
                .reduce(
                  (value, t) => Math.min(def.max, value + Math.max(0, ...t.options.map((o) => o.deltas?.[key] ?? 0))),
                  def.start
                );
              return reachable <= def.min;
            })
            .map(([key, delta]) => `${s.id} turn ${turn.index}/${option.key}: ${key}=${delta}`)
        )
      );
    });
    expect(dead).toEqual([]);
  });

  it("only moves KPIs the scenario actually declares", () => {
    const unknown = scenarios.flatMap((s) => {
      const declared = new Set(s.kpis.map((k) => k.key));
      return s.turns.flatMap((t) =>
        t.options.flatMap((o) =>
          Object.keys(o.deltas ?? {})
            .filter((k) => !declared.has(k))
            .map((k) => `${s.id}/${o.key}: ${k}`)
        )
      );
    });
    expect(unknown).toEqual([]);
  });
});

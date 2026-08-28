#!/usr/bin/env node --experimental-strip-types
/**
 * Scenario content linter.
 *
 * The engine can only score what the content declares. `aggregator.ts` returns
 * a null process score unless at least MIN_MEASURED distinct criteria were
 * measured, and criteria are measured only where an option carries
 * `criteriaSignals`. So an option with an empty `criteriaSignals` is a
 * candidate decision the product silently cannot grade — and a *path* of such
 * options is a whole simulation that produces no process score at all.
 *
 * This script measures that gap. It reads the scenario content directly (Node
 * strips the type-only imports, so no build step is involved) and reports:
 *
 *   1. options with no criteriaSignals at all
 *   2. per scenario, the worst path — the fewest distinct criteria any single
 *      run through it can measure
 *
 * Exits 0 by default so it can be run for information at any time. Pass
 * --strict to make it exit 1 when any scenario has an unscoreable path; that
 * is the intended completion gate for the content work, once the gap is closed.
 */

import { CRITERIA } from "../lib/scenario-schema.ts";

const SCENARIO_MODULES = [
  "supply-chain",
  "finance",
  "product-rd",
  "sales",
  "healthcare",
  "semiconductors",
  "aviation-defense",
  "retail",
  "people",
  "cybersecurity",
];

/** Mirrors the `measured.length >= 3` rule in lib/engine/aggregator.ts. */
const MIN_MEASURED = 3;

const strict = process.argv.includes("--strict");

async function loadScenarios() {
  const all = [];
  for (const name of SCENARIO_MODULES) {
    const mod = await import(`../content/scenarios/${name}.ts`);
    all.push(...mod.default);
  }
  return all;
}

function criteriaOf(option) {
  return Object.keys(option.criteriaSignals ?? {});
}

/** Guard against a future scenario with enough turns to blow up the search. */
const MAX_PATHS = 200_000;

/**
 * The fewest distinct criteria any single run through this scenario can
 * measure. Turns advance linearly (an option can change the *event text* of
 * the next turn but not which turn comes next), so a run is exactly one option
 * per turn and the answer is an exhaustive walk of that product — a few
 * hundred paths per scenario, so exactness costs nothing.
 *
 * Greedy would be cheaper but wrong in a way that matters here: picking the
 * locally smallest addition at each turn can miss the globally worst run, so
 * it under-reports failures. This is the number the content work is graded on,
 * so it should not be an approximation.
 */
function worstPath(scenario) {
  const turns = scenario.turns.filter((t) => t.options.length > 0);
  const pathCount = turns.reduce((n, t) => n * t.options.length, 1);
  if (pathCount > MAX_PATHS) {
    throw new Error(`${scenario.id}: ${pathCount} paths exceeds MAX_PATHS — narrow the search before trusting this number.`);
  }

  let worst = null;

  const walk = (turnIndex, measured, picks) => {
    if (turnIndex === turns.length) {
      if (worst === null || measured.size < worst.count) {
        worst = { count: measured.size, picks: [...picks], criteria: [...measured] };
      }
      return;
    }
    for (const option of turns[turnIndex].options) {
      const next = new Set([...measured, ...criteriaOf(option)]);
      picks.push(option.key);
      walk(turnIndex + 1, next, picks);
      picks.pop();
    }
  };

  walk(0, new Set(), []);
  return worst ?? { count: 0, picks: [], criteria: [] };
}

const scenarios = await loadScenarios();

let totalOptions = 0;
const emptyOptions = [];
const failingScenarios = [];

for (const scenario of scenarios) {
  for (const turn of scenario.turns) {
    for (const option of turn.options) {
      totalOptions += 1;
      if (criteriaOf(option).length === 0) {
        emptyOptions.push(`${scenario.id} · תור ${turn.index} · ${option.key} — ${option.label_he}`);
      }
    }
  }

  const worst = worstPath(scenario);
  if (worst.count < MIN_MEASURED) failingScenarios.push({ scenario, worst });
}

const pct = ((emptyOptions.length / totalOptions) * 100).toFixed(1);

console.log("");
console.log("ManaGame — בדיקת כיסוי קריטריונים בתוכן");
console.log("=".repeat(52));
console.log(`תרחישים: ${scenarios.length}`);
console.log(`אפשרויות: ${totalOptions}`);
console.log(`קריטריונים ברובריקה: ${CRITERIA.length}`);
console.log("");
console.log(`אפשרויות ללא criteriaSignals: ${emptyOptions.length} (${pct}%)`);
console.log(`תרחישים עם מסלול שלא ניתן לציון (< ${MIN_MEASURED} קריטריונים): ${failingScenarios.length}`);
console.log("");

if (failingScenarios.length > 0) {
  console.log("המסלול הגרוע ביותר בכל תרחיש כושל:");
  for (const { scenario, worst } of failingScenarios) {
    console.log(`  ${scenario.id.padEnd(30)} ${worst.count} קריטריונים  ←  ${worst.picks.join(" → ")}`);
  }
  console.log("");
}

if (emptyOptions.length > 0 && process.argv.includes("--verbose")) {
  console.log("אפשרויות ללא אף קריטריון:");
  for (const line of emptyOptions) console.log(`  ${line}`);
  console.log("");
}

if (strict && failingScenarios.length > 0) {
  console.error(`נכשל: ${failingScenarios.length} תרחישים מכילים מסלול שלא ניתן לציון.`);
  process.exit(1);
}

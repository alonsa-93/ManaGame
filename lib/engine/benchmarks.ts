/**
 * Cohort statistics: where one run sits among the others on the same scenario.
 *
 * The product's own framing is that a score is meaningless without context —
 * "68" says nothing until you know whether it is typical or exceptional for
 * this scenario. That context only exists once enough runs have accumulated.
 *
 * Which is why the honesty guard below matters more than the arithmetic: with
 * four completed runs, a "75th percentile" is one person's position among
 * three others, and presenting it as a benchmark would be a lie told with a
 * real number. Below MIN_COHORT the functions return null and the UI says
 * there is not enough data, rather than dressing up noise.
 */

/**
 * Fewest runs before a percentile is reported at all. Ten is not a
 * statistically satisfying cohort either — it is the point below which the
 * number is actively misleading rather than merely imprecise.
 */
export const MIN_COHORT = 10;

export interface CohortStats {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  /** 25th and 75th percentile values. */
  q1: number;
  q3: number;
}

/**
 * Percentile rank of `value` within `cohort`, 0-100.
 *
 * Uses the "mean rank" definition: scores strictly below, plus half of those
 * equal. The half-credit for ties is what stops every candidate on a tied
 * score from being reported as beating each other.
 */
export function percentileRank(value: number, cohort: number[]): number | null {
  if (cohort.length < MIN_COHORT) return null;

  let below = 0;
  let equal = 0;
  for (const v of cohort) {
    if (v < value) below += 1;
    else if (v === value) equal += 1;
  }

  return Math.round(((below + equal / 2) / cohort.length) * 100);
}

/** Linear-interpolated quantile over a sorted copy. */
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 1) return sorted[0]!;
  const pos = (sorted.length - 1) * q;
  const lower = Math.floor(pos);
  const upper = Math.ceil(pos);
  if (lower === upper) return sorted[lower]!;
  return sorted[lower]! + (sorted[upper]! - sorted[lower]!) * (pos - lower);
}

export function cohortStats(values: number[]): CohortStats | null {
  if (values.length < MIN_COHORT) return null;

  const sorted = [...values].sort((a, b) => a - b);
  return {
    count: sorted.length,
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    mean: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length),
    median: Math.round(quantile(sorted, 0.5)),
    q1: Math.round(quantile(sorted, 0.25)),
    q3: Math.round(quantile(sorted, 0.75)),
  };
}

/**
 * Plain-language reading of a percentile, for the report.
 *
 * Deliberately banded rather than exact: "in the top quarter" is a claim the
 * data can support; "at the 78th percentile, ahead of 78% of candidates"
 * implies a precision that a cohort of a few dozen does not have.
 */
export function describePercentile(rank: number): string {
  if (rank >= 75) return "ברבע העליון של הריצות בתרחיש הזה";
  if (rank >= 50) return "מעל החציון של הריצות בתרחיש הזה";
  if (rank >= 25) return "מתחת לחציון של הריצות בתרחיש הזה";
  return "ברבע התחתון של הריצות בתרחיש הזה";
}

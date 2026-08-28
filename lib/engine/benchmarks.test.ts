import { describe, expect, it } from "vitest";
import { cohortStats, describePercentile, MIN_COHORT, percentileRank } from "@/lib/engine/benchmarks";

/** A cohort just large enough to be reported on. */
const ten = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

describe("percentileRank", () => {
  it("refuses to report on a cohort too small to mean anything", () => {
    expect(percentileRank(50, [10, 20, 50, 90])).toBeNull();
    expect(percentileRank(50, Array(MIN_COHORT - 1).fill(50))).toBeNull();
  });

  it("reports once the cohort is large enough", () => {
    expect(percentileRank(50, ten)).not.toBeNull();
  });

  it("places the lowest and highest values at the ends", () => {
    expect(percentileRank(10, ten)).toBe(5); // below 0, equal 1 -> 0.5/10
    expect(percentileRank(100, ten)).toBe(95);
  });

  it("gives tied scores half credit, so tied candidates don't outrank each other", () => {
    const allSame = Array(10).fill(50);
    expect(percentileRank(50, allSame)).toBe(50);
  });

  it("places a value above the whole cohort at 100", () => {
    expect(percentileRank(999, ten)).toBe(100);
  });

  it("places a value below the whole cohort at 0", () => {
    expect(percentileRank(0, ten)).toBe(0);
  });
});

describe("cohortStats", () => {
  it("is null below the minimum cohort", () => {
    expect(cohortStats([1, 2, 3])).toBeNull();
  });

  it("summarises a cohort", () => {
    expect(cohortStats(ten)).toEqual({
      count: 10,
      min: 10,
      max: 100,
      mean: 55,
      median: 55,
      q1: 33,
      q3: 78,
    });
  });

  it("does not mutate the caller's array", () => {
    const input = [...ten].reverse();
    const copy = [...input];
    cohortStats(input);
    expect(input).toEqual(copy);
  });
});

describe("describePercentile", () => {
  it("bands rather than implying false precision", () => {
    expect(describePercentile(90)).toContain("ברבע העליון");
    expect(describePercentile(75)).toContain("ברבע העליון");
    expect(describePercentile(60)).toContain("מעל החציון");
    expect(describePercentile(30)).toContain("מתחת לחציון");
    expect(describePercentile(5)).toContain("ברבע התחתון");
  });
});

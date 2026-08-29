import { describe, expect, it } from "vitest";
import { CALIBRATION_ANCHORS } from "@/content/calibration-anchors";
import { CRITERIA } from "@/lib/scenario-schema";

describe("calibration anchors", () => {
  it("has an entry for every criterion in the rubric — not more, not fewer", () => {
    const keys = Object.keys(CALIBRATION_ANCHORS).sort();
    const rubricKeys = CRITERIA.map((c) => c.key).sort();
    expect(keys).toEqual(rubricKeys);
  });

  it.each(CRITERIA.map((c) => [c.key, c.label_he] as const))("%s (%s): low < mid < high", (key) => {
    const anchors = CALIBRATION_ANCHORS[key];
    expect(anchors.low.score).toBeLessThan(anchors.mid.score);
    expect(anchors.mid.score).toBeLessThan(anchors.high.score);
    expect(anchors.low.score).toBeGreaterThanOrEqual(0);
    expect(anchors.high.score).toBeLessThanOrEqual(100);
  });

  it("gives every band a non-empty example and rationale", () => {
    for (const anchors of Object.values(CALIBRATION_ANCHORS)) {
      for (const band of [anchors.low, anchors.mid, anchors.high]) {
        expect(band.example_he.trim().length).toBeGreaterThan(0);
        expect(band.rationale_he.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("never repeats the exact same example across a criterion's three bands", () => {
    for (const anchors of Object.values(CALIBRATION_ANCHORS)) {
      const examples = [anchors.low.example_he, anchors.mid.example_he, anchors.high.example_he];
      expect(new Set(examples).size).toBe(3);
    }
  });
});

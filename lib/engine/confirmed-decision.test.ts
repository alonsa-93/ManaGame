import { describe, expect, it } from "vitest";
import { hashRawText, matchesFromConfirmedKeys } from "@/lib/engine/confirmed-decision";
import type { ScenarioTurn } from "@/lib/scenario-schema";

const turn: ScenarioTurn = {
  index: 1,
  situation_he: "x",
  options: [
    { key: "a", label_he: "א", keywords_he: [], deltas: {}, evidence_he: "e1", criteriaSignals: {} },
    { key: "b", label_he: "ב", keywords_he: [], deltas: {}, evidence_he: "e2", criteriaSignals: {} },
  ],
};

describe("hashRawText", () => {
  it("is deterministic for the same text", () => {
    expect(hashRawText("שלום עולם")).toBe(hashRawText("שלום עולם"));
  });

  it("differs for different text", () => {
    expect(hashRawText("שלום עולם")).not.toBe(hashRawText("שלום עולם!"));
  });
});

describe("matchesFromConfirmedKeys", () => {
  it("resolves confirmed keys against the turn's canonical options, preserving order", () => {
    const matches = matchesFromConfirmedKeys(turn, ["b", "a"]);
    expect(matches.map((m) => m.option.key)).toEqual(["b", "a"]);
  });

  it("drops any key that isn't part of the turn's vocabulary rather than fabricating an option", () => {
    const matches = matchesFromConfirmedKeys(turn, ["a", "not_real"]);
    expect(matches.map((m) => m.option.key)).toEqual(["a"]);
  });

  it("returns an empty array when nothing was confirmed", () => {
    expect(matchesFromConfirmedKeys(turn, [])).toEqual([]);
  });
});

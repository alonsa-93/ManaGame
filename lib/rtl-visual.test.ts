import { describe, expect, it } from "vitest";
import { toVisualRtl } from "@/lib/rtl-visual";

describe("toVisualRtl", () => {
  it("reverses a Hebrew phrase so Satori paints it right-to-left", () => {
    expect(toVisualRtl("החלטות")).toBe("תוטלחה");
  });

  it("round-trips — applying it twice returns the original", () => {
    const original = "החלטות שמנהלות מציאות";
    expect(toVisualRtl(toVisualRtl(original))).toBe(original);
  });

  it("puts a sentence-final period on the left, where RTL wants it", () => {
    expect(toVisualRtl("שלום.").startsWith(".")).toBe(true);
  });

  it("mirrors bracket glyphs so they still open and close correctly", () => {
    expect(toVisualRtl("(שלום)")).toBe("(םולש)");
  });

  it("leaves a line with no Hebrew completely alone", () => {
    expect(toVisualRtl("Decision Simulation Infrastructure")).toBe("Decision Simulation Infrastructure");
  });

  it("refuses mixed Hebrew and Latin rather than silently mangling it", () => {
    expect(() => toVisualRtl("ManaGame היא פלטפורמה")).toThrow(/mixed Hebrew\/Latin/);
  });
});

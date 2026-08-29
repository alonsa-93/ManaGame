import { describe, expect, it } from "vitest";
import { validateCreateSessionInput } from "@/lib/api/create-session-input";

describe("validateCreateSessionInput", () => {
  it("accepts a minimal valid body", () => {
    const result = validateCreateSessionInput({ scenarioId: "supply-chain-manager-1" });
    expect(result).toEqual({ ok: true, input: { scenarioId: "supply-chain-manager-1" } });
  });

  it("carries through optional fields when present", () => {
    const result = validateCreateSessionInput({
      scenarioId: "supply-chain-manager-1",
      candidateName: "דנה כהן",
      candidateEmail: "dana@example.com",
      externalRef: "ats-app-4471",
    });
    expect(result).toEqual({
      ok: true,
      input: {
        scenarioId: "supply-chain-manager-1",
        candidateName: "דנה כהן",
        candidateEmail: "dana@example.com",
        externalRef: "ats-app-4471",
      },
    });
  });

  it("rejects a non-object body", () => {
    expect(validateCreateSessionInput(null)).toEqual({ ok: false, error: expect.any(String) });
    expect(validateCreateSessionInput("scenarioId")).toEqual({ ok: false, error: expect.any(String) });
    expect(validateCreateSessionInput([1, 2])).toMatchObject({ ok: false });
  });

  it("rejects a missing or blank scenarioId", () => {
    expect(validateCreateSessionInput({})).toMatchObject({ ok: false });
    expect(validateCreateSessionInput({ scenarioId: "   " })).toMatchObject({ ok: false });
    expect(validateCreateSessionInput({ scenarioId: 42 })).toMatchObject({ ok: false });
  });

  it("rejects a malformed email but leaves it out rather than crashing on a valid one", () => {
    expect(validateCreateSessionInput({ scenarioId: "s1", candidateEmail: "not-an-email" })).toMatchObject({
      ok: false,
    });
  });

  it("trims whitespace and caps field length so one caller can't send megabytes in a string field", () => {
    const result = validateCreateSessionInput({ scenarioId: "  s1  ", candidateName: "x".repeat(10_000) });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.scenarioId).toBe("s1");
      expect(result.input.candidateName?.length).toBeLessThanOrEqual(300);
    }
  });

  it("treats an empty optional string as absent, not as an empty value", () => {
    const result = validateCreateSessionInput({ scenarioId: "s1", externalRef: "" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.input.externalRef).toBeUndefined();
  });
});

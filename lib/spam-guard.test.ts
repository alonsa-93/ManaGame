import { describe, expect, it } from "vitest";
import { classifySubmission, MIN_FILL_MS } from "@/lib/spam-guard";

const NOW = 1_700_000_000_000;
const slowEnough = String(NOW - MIN_FILL_MS - 1);

describe("classifySubmission", () => {
  it("passes an ordinary human submission", () => {
    expect(classifySubmission({ honeypot: "", startedAt: slowEnough, now: NOW })).toBe("ok");
  });

  it("catches a filled honeypot", () => {
    expect(classifySubmission({ honeypot: "https://buy-now.example", startedAt: slowEnough, now: NOW })).toBe("honeypot");
  });

  it("treats whitespace in the honeypot as empty", () => {
    expect(classifySubmission({ honeypot: "   ", startedAt: slowEnough, now: NOW })).toBe("ok");
  });

  it("catches an instant submit", () => {
    expect(classifySubmission({ honeypot: "", startedAt: String(NOW - 200), now: NOW })).toBe("too-fast");
  });

  it("checks the honeypot before the clock, so a bot that fakes the timestamp is still caught", () => {
    expect(classifySubmission({ honeypot: "x", startedAt: String(NOW - 200), now: NOW })).toBe("honeypot");
  });

  it("does not punish a missing or malformed timestamp", () => {
    expect(classifySubmission({ honeypot: "", startedAt: "", now: NOW })).toBe("ok");
    expect(classifySubmission({ honeypot: "", startedAt: "not-a-number", now: NOW })).toBe("ok");
    expect(classifySubmission({ honeypot: "", startedAt: "0", now: NOW })).toBe("ok");
  });

  it("accepts a submission exactly at the threshold", () => {
    expect(classifySubmission({ honeypot: "", startedAt: String(NOW - MIN_FILL_MS), now: NOW })).toBe("ok");
  });
});

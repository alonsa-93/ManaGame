import { afterEach, describe, expect, it, vi } from "vitest";
import { signCookiePayload, verifyCookiePayload } from "@/lib/session-cookie-sign";

describe("session cookie signing", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("verifies a signature produced by signCookiePayload for the same payload", () => {
    vi.stubEnv("SESSION_COOKIE_SECRET", "test-secret");
    const payload = JSON.stringify({ id: "abc", note: "יש כאן. גם נקודות. בעברית." });
    const sig = signCookiePayload(payload);
    expect(verifyCookiePayload(payload, sig)).toBe(true);
  });

  it("rejects a payload that was tampered with after signing", () => {
    vi.stubEnv("SESSION_COOKIE_SECRET", "test-secret");
    const payload = JSON.stringify({ id: "abc", kpiState: { budget: 50 } });
    const sig = signCookiePayload(payload);
    const tampered = JSON.stringify({ id: "abc", kpiState: { budget: 100 } });
    expect(verifyCookiePayload(tampered, sig)).toBe(false);
  });

  it("rejects a forged signature that isn't derived from the secret at all", () => {
    vi.stubEnv("SESSION_COOKIE_SECRET", "test-secret");
    const payload = JSON.stringify({ id: "abc" });
    expect(verifyCookiePayload(payload, "not-a-real-signature")).toBe(false);
  });

  it("changes the signature when the secret changes, so cookies don't verify across different secrets", () => {
    vi.stubEnv("SESSION_COOKIE_SECRET", "secret-one");
    const payload = JSON.stringify({ id: "abc" });
    const sigOne = signCookiePayload(payload);

    vi.stubEnv("SESSION_COOKIE_SECRET", "secret-two");
    expect(verifyCookiePayload(payload, sigOne)).toBe(false);
  });
});

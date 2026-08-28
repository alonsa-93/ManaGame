import { describe, expect, it, afterEach, beforeEach } from "vitest";
import {
  ADMIN_SESSION_TTL_MS,
  createSessionValue,
  isAuthEnabled,
  passwordMatches,
  verifySessionValue,
} from "@/lib/auth/admin-session";

const NOW = 1_700_000_000_000;

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct horse battery staple";
  process.env.SESSION_COOKIE_SECRET = "test-secret";
});

afterEach(() => {
  delete process.env.ADMIN_PASSWORD;
  delete process.env.SESSION_COOKIE_SECRET;
});

describe("isAuthEnabled", () => {
  it("is off when no passphrase is configured", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(isAuthEnabled()).toBe(false);
  });

  it("is on once a passphrase is set", () => {
    expect(isAuthEnabled()).toBe(true);
  });
});

describe("passwordMatches", () => {
  it("accepts the configured passphrase", () => {
    expect(passwordMatches("correct horse battery staple")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(passwordMatches("wrong")).toBe(false);
    expect(passwordMatches("")).toBe(false);
    expect(passwordMatches("correct horse battery stapl")).toBe(false);
  });

  it("rejects everything when no passphrase is configured, rather than letting empty match empty", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(passwordMatches("")).toBe(false);
  });
});

describe("session cookie", () => {
  it("round-trips a freshly issued session", async () => {
    const value = await createSessionValue(NOW);
    expect(await verifySessionValue(value, NOW + 1000)).toBe(true);
  });

  it("expires after the TTL", async () => {
    const value = await createSessionValue(NOW);
    expect(await verifySessionValue(value, NOW + ADMIN_SESSION_TTL_MS - 1)).toBe(true);
    expect(await verifySessionValue(value, NOW + ADMIN_SESSION_TTL_MS + 1)).toBe(false);
  });

  it("rejects a forged expiry — the signature is checked first", async () => {
    const value = await createSessionValue(NOW);
    const signature = value.slice(value.indexOf(".") + 1);
    const forged = `${NOW + 10 * ADMIN_SESSION_TTL_MS}.${signature}`;
    expect(await verifySessionValue(forged, NOW)).toBe(false);
  });

  it("rejects a tampered signature", async () => {
    const value = await createSessionValue(NOW);
    expect(await verifySessionValue(`${value}x`, NOW)).toBe(false);
  });

  it("rejects malformed and missing values", async () => {
    expect(await verifySessionValue(undefined, NOW)).toBe(false);
    expect(await verifySessionValue("", NOW)).toBe(false);
    expect(await verifySessionValue("no-separator", NOW)).toBe(false);
    expect(await verifySessionValue(".onlysig", NOW)).toBe(false);
  });

  it("stops accepting old cookies once the passphrase changes", async () => {
    const value = await createSessionValue(NOW);
    process.env.ADMIN_PASSWORD = "a different passphrase";
    expect(await verifySessionValue(value, NOW + 1000)).toBe(false);
  });
});

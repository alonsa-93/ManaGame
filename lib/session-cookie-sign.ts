import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * HMAC signing for the resiliency-layer session cookie (lib/session-cache.ts).
 * Without this, resolveSession() trusted the client-held cookie verbatim —
 * a candidate could edit it (devtools/curl; httpOnly only blocks page JS)
 * to forge kpiState/currentTurn/status and dictate their own assessment
 * score. Pulled into its own module so the sign/verify logic is directly
 * unit-testable without mocking next/headers.
 */

function cookieSecret(): string {
  // Explicit secret (recommended) > Vercel's per-deployment commit SHA
  // (stable across every instance of one deployment, rotates automatically
  // on the next deploy — invalidating old cookies is fine, they're only a
  // resiliency cache) > a fixed local-dev-only fallback. A per-cold-start
  // random value would defeat the whole point of this layer: every fresh
  // Lambda would fail to verify cookies written by any other instance.
  return process.env.SESSION_COOKIE_SECRET || process.env.VERCEL_GIT_COMMIT_SHA || "managame-dev-cookie-secret-not-for-production";
}

export function signCookiePayload(payload: string): string {
  return createHmac("sha256", cookieSecret()).update(payload).digest("base64url");
}

export function verifyCookiePayload(payload: string, signature: string): boolean {
  const expected = signCookiePayload(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

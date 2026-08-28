import { timingSafeEqual } from "node:crypto";

/**
 * Bearer-token auth for the read-only integration API (/api/v1).
 *
 * Separate from the operator passphrase on purpose. An ATS is a machine with a
 * long-lived credential and a narrow, read-only scope; the operator gate is a
 * human with a browser session and full access. Sharing one secret between
 * them would mean rotating an integration to lock out a person, and would give
 * a vendor's integration exactly as much reach as an administrator.
 *
 * The API is disabled entirely — not merely unauthenticated — when no token is
 * configured, so nobody can accidentally expose candidate data by deploying
 * with a blank env var.
 */

export type ApiAuthResult = { ok: true } | { ok: false; status: 401 | 503; message: string };

export function isApiEnabled(): boolean {
  return Boolean(process.env.ATS_API_TOKEN);
}

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function authenticateRequest(request: Request): ApiAuthResult {
  const expected = process.env.ATS_API_TOKEN;
  if (!expected) {
    return { ok: false, status: 503, message: "The integration API is not enabled on this deployment." };
  }

  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return { ok: false, status: 401, message: "Missing bearer token." };
  }

  if (!constantTimeEquals(token, expected)) {
    return { ok: false, status: 401, message: "Invalid token." };
  }

  return { ok: true };
}

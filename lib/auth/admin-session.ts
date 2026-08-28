/**
 * Access gate for the internal surfaces (/admin, /assessor).
 *
 * Until this existed, anyone who knew a URL could read every candidate's
 * assessment, evidence and contact details. That is the single most sensitive
 * thing this system holds.
 *
 * Deliberately a shared passphrase, not user accounts: the product has one
 * operator today, and a real identity system (per-assessor accounts, roles,
 * audit trail) is Phase 4 work that would be wrong to fake now. What this does
 * give is a genuine boundary — signed, expiring, and invalidated the moment the
 * passphrase changes.
 *
 * Web Crypto rather than node:crypto because this runs in middleware, which is
 * an Edge runtime with no Node built-ins. lib/session-cookie-sign.ts is the
 * Node-side equivalent for the candidate resiliency cookie; the two are
 * separate on purpose and sign different things.
 */

export const ADMIN_COOKIE = "mg_admin";

/** Twelve hours — a working day, so an operator signs in once per session. */
const TTL_MS = 12 * 60 * 60 * 1000;

/**
 * The gate is off when no passphrase is configured, which keeps local
 * development and the current deployment working exactly as before. It is
 * surfaced loudly on /admin/system rather than failing silently open, because
 * "unprotected" is a state the operator must actually know about.
 */
export function isAuthEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function signingSecret(): string {
  // The passphrase is folded into the key so that changing it immediately
  // invalidates every outstanding session cookie.
  const base =
    process.env.SESSION_COOKIE_SECRET ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    "managame-dev-cookie-secret-not-for-production";
  return `${base}:${process.env.ADMIN_PASSWORD ?? ""}`;
}

async function hmac(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64url(new Uint8Array(signature));
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Constant-time comparison. Edge has no timingSafeEqual, so this is explicit. */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return constantTimeEquals(input, expected);
}

/** Cookie value: `<expiry-ms>.<signature>`. */
export async function createSessionValue(now: number = Date.now()): Promise<string> {
  const expiresAt = now + TTL_MS;
  return `${expiresAt}.${await hmac(String(expiresAt))}`;
}

export async function verifySessionValue(value: string | undefined, now: number = Date.now()): Promise<boolean> {
  if (!value) return false;
  const separator = value.indexOf(".");
  if (separator <= 0) return false;

  const expiresAt = value.slice(0, separator);
  const signature = value.slice(separator + 1);

  // Check the signature before trusting the expiry: an unsigned cookie's
  // timestamp is just an attacker-supplied number.
  if (!constantTimeEquals(signature, await hmac(expiresAt))) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}

export const ADMIN_SESSION_TTL_MS = TTL_MS;

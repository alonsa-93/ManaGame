import { cookies } from "next/headers";
import { getStore, hasDatabase } from "@/lib/store";
import type { SessionRecord } from "@/lib/store/types";

/**
 * Resiliency layer for the in-process store on serverless deployments.
 *
 * A single Node `next start` process shares memory across every request,
 * so the in-process store (lib/store/memory.ts) works perfectly there. On
 * Vercel, consecutive requests from the same browser are NOT guaranteed to
 * land on the same warm Lambda instance — a cold instance would otherwise
 * see the candidate's session as missing mid-flow.
 *
 * Every mutation also writes a compact snapshot of the session into an
 * httpOnly cookie. If a read misses the in-process store and no database
 * is configured, we rehydrate from that cookie and re-seed this instance's
 * store — self-healing the request instead of failing it. With a real
 * database connected, this layer is inert: Postgres is already shared and
 * authoritative, so a miss there is a real miss.
 */

const COOKIE_PREFIX = "mg_s_";
const COOKIE_MAX_AGE = 60 * 60 * 6; // 6 hours — long enough for one sitting.

function cookieName(sessionId: string) {
  return `${COOKIE_PREFIX}${sessionId}`;
}

export async function persistSessionCookie(session: SessionRecord) {
  if (hasDatabase()) return; // Postgres already persists this durably.
  const store = await cookies();
  store.set(cookieName(session.id), JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/play",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function resolveSession(sessionId: string): Promise<SessionRecord | null> {
  const store = getStore();
  const existing = await store.getSession(sessionId);
  if (existing) return existing;
  if (hasDatabase()) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(cookieName(sessionId))?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SessionRecord;
    if (parsed.id !== sessionId) return null;
    await store.hydrateSession(parsed);
    return parsed;
  } catch {
    return null;
  }
}

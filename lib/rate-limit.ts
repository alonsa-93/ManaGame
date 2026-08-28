/**
 * A small fixed-window rate limiter.
 *
 * Deliberate scope limit, stated plainly because it matters: the counters live
 * in the process. On Vercel that means the limit is enforced *per warm
 * instance*, so a determined attacker spraying across cold starts gets more
 * than `limit` requests through. What it does reliably stop is the ordinary
 * case — one client hammering one endpoint on one connection, which is what
 * form-spam and accidental double-submits actually look like.
 *
 * The moment a database or KV is connected (Phase 1), the same interface can
 * be backed by a shared counter and the guarantee becomes real. Until then,
 * treat this as a speed bump, not a security control.
 */

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the current window resets. 0 when allowed. */
  retryAfterMs: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitResult;
  reset(): void;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const windows = new Map<string, { count: number; startedAt: number }>();

  function sweep(now: number) {
    // Bounded memory: drop windows that have already expired. Without this a
    // long-lived instance accumulates one entry per IP it has ever seen.
    for (const [key, window] of windows) {
      if (now - window.startedAt >= windowMs) windows.delete(key);
    }
  }

  return {
    check(key: string, now: number = Date.now()): RateLimitResult {
      sweep(now);
      const existing = windows.get(key);

      if (!existing || now - existing.startedAt >= windowMs) {
        windows.set(key, { count: 1, startedAt: now });
        return { allowed: true, retryAfterMs: 0 };
      }

      if (existing.count >= limit) {
        return { allowed: false, retryAfterMs: windowMs - (now - existing.startedAt) };
      }

      existing.count += 1;
      return { allowed: true, retryAfterMs: 0 };
    },

    reset() {
      windows.clear();
    },
  };
}

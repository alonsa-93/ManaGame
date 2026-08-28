import { createRateLimiter } from "@/lib/rate-limit";

/**
 * Spend controls on the paths that call Anthropic.
 *
 * Every conversational turn is a billed API call, and nothing about the
 * candidate flow is authenticated — a session id is enough to submit a turn.
 * Without a ceiling, a script holding one session id can run the bill up
 * indefinitely, and a browser retry loop can do it by accident.
 *
 * Two independent limits, because they catch different things:
 *  - per session: one candidate cannot burn more than a real assessment needs.
 *    Twenty scenario turns with a clarifying follow-up each is ~40 calls, so 60
 *    leaves room for retries and still caps a runaway loop.
 *  - per IP: stops one actor from sidestepping the session limit by minting new
 *    sessions. A genuine shared office egress IP running back-to-back
 *    assessments stays well inside 200/hour.
 *
 * See lib/rate-limit.ts for the honest caveat: these counters live in the
 * process, so on Vercel they are enforced per warm instance.
 */
const perSession = createRateLimiter({ limit: 60, windowMs: 60 * 60 * 1000 });
const perIp = createRateLimiter({ limit: 200, windowMs: 60 * 60 * 1000 });

export class AiRateLimitError extends Error {
  constructor() {
    super("AI rate limit exceeded");
    this.name = "AiRateLimitError";
  }
}

/**
 * Throws AiRateLimitError when either ceiling is hit. Callers surface it to the
 * candidate as an ordinary "try again shortly" message — never as a failure
 * that loses their answer.
 */
export function assertAiCallAllowed({ sessionId, ip }: { sessionId: string; ip: string }): void {
  if (!perSession.check(sessionId).allowed) throw new AiRateLimitError();
  if (!perIp.check(ip).allowed) throw new AiRateLimitError();
}

/** Test seam — resets both windows. */
export function resetAiRateLimits(): void {
  perSession.reset();
  perIp.reset();
}

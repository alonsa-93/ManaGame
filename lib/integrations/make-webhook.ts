/**
 * Outbound notifications to a Make.com scenario (https://www.make.com), so
 * "connecting the admin/assessor system to Make" is a plain webhook POST —
 * no Make SDK, no credentials stored here. The Make side (routing to
 * email/Slack/CRM etc.) is configured entirely in the Make scenario itself;
 * this module only knows the webhook URL and the event shape it sends.
 */

export type MakeEvent = "session_completed" | "needs_human_review";

export interface MakeEventPayload {
  event: MakeEvent;
  sessionId: string;
  candidateName?: string;
  scenarioTitle: string;
  reportUrl: string;
  processScore?: number | null;
  outcomeScore?: number;
  turnIndex?: number;
  reviewReason?: string;
}

/**
 * Resolves the base URL used to build links back into ManaGame (e.g. the
 * assessor report link in a notification email). Precedence: an explicit
 * override, then Vercel's per-deployment URL, then the known canonical
 * production domain — never throws, always returns something usable.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://mana-game-amber.vercel.app";
}

/**
 * Best-effort, fire-and-forget notification — a down or unconfigured Make
 * webhook must never block the candidate/session flow. No-op when
 * MAKE_WEBHOOK_URL isn't set.
 */
export async function notifyMake(payload: MakeEventPayload): Promise<void> {
  const url = process.env.MAKE_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Swallow — see doc comment above.
  }
}

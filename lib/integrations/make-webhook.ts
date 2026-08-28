/**
 * Outbound notifications to a Make.com scenario (https://www.make.com), so
 * "connecting the admin/assessor system to Make" is a plain webhook POST —
 * no Make SDK, no credentials stored here. The Make side (routing to
 * email/Slack/CRM etc.) is configured entirely in the Make scenario itself;
 * this module only knows the webhook URL and the event shape it sends.
 */

import { deploymentUrl } from "@/lib/site-url";

export type MakeEvent = "session_completed" | "needs_human_review" | "contact_lead";

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
  /** contact_lead only — the marketing enquiry itself. */
  lead?: {
    name: string;
    email: string;
    role?: string;
    organization?: string;
    orgSize?: string;
    whatToTest?: string;
  };
}

/**
 * Base URL for links back into ManaGame in outbound notifications. This is
 * deliberately the *deployment* URL, not the canonical one: a report link in a
 * notification should open the deployment that produced the event. See
 * lib/site-url.ts for why the two are kept apart.
 */
export const siteUrl = deploymentUrl;

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

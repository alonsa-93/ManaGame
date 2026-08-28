"use server";

import { headers } from "next/headers";
import { getStore } from "@/lib/store";
import { createRateLimiter } from "@/lib/rate-limit";
import { classifySubmission } from "@/lib/spam-guard";
import { notifyMake, siteUrl } from "@/lib/integrations/make-webhook";

export type ContactActionResult = { ok: true } | { ok: false; error: string };

/**
 * Five enquiries per IP per hour. Generous for a human — nobody legitimately
 * sends a sixth — and low enough that a script gets bored. See lib/rate-limit.ts
 * for the honest limits of enforcing this in process memory.
 */
const limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

async function clientKey(): Promise<string> {
  const h = await headers();
  // x-forwarded-for is a client-settable header in general, but on Vercel the
  // edge overwrites it, so the left-most entry is the real peer.
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatToTest = String(formData.get("whatToTest") ?? "").trim();
  const orgSize = String(formData.get("orgSize") ?? "").trim();

  // Spam checks run before validation so a bot learns nothing from the error
  // text, and before the rate limiter so junk doesn't consume a real visitor's
  // budget if they happen to share an egress IP.
  const verdict = classifySubmission({
    honeypot: String(formData.get("company_website") ?? ""),
    startedAt: String(formData.get("interaction_at") ?? ""),
  });
  if (verdict !== "ok") {
    // Report success. Telling a bot it was detected only teaches it to adapt,
    // and a false positive on a real person at least doesn't show them an error
    // they can't act on.
    return { ok: true };
  }

  if (!limiter.check(await clientKey()).allowed) {
    return { ok: false, error: "נשלחו כבר כמה פניות מהכתובת הזו. נסו שוב בעוד שעה." };
  }

  if (!name) {
    return { ok: false, error: "נא למלא שם." };
  }
  if (!email) {
    return { ok: false, error: "נא למלא כתובת אימייל." };
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { ok: false, error: "כתובת האימייל אינה תקינה." };
  }

  const id = crypto.randomUUID();
  const lead = {
    name,
    email,
    role: role || undefined,
    organization: organization || undefined,
    orgSize: orgSize || undefined,
    whatToTest: whatToTest || undefined,
  };

  // Two independent deliveries, because each covers the other's failure mode:
  // the store is the durable record (and the only one, once a database is
  // connected), while the Make webhook is what actually puts the lead in front
  // of a person today — and it survives the no-database case, where the store
  // is process memory that a cold start throws away.
  let stored = false;
  let notified = false;

  try {
    await getStore().addContactSubmission({ ...lead, id });
    stored = true;
  } catch {
    // Fall through — the notification below may still land.
  }

  try {
    await notifyMake({
      event: "contact_lead",
      // These three keep the payload shape the Make scenario's other two
      // branches already map. The scenario has a matching `contact_lead`
      // route — without it the webhook fires, the router matches nothing, and
      // the lead is dropped silently, which is exactly what happened until it
      // was added.
      sessionId: id,
      scenarioTitle: "פנייה חדשה מהאתר",
      reportUrl: `${siteUrl()}/admin/leads`,
      lead,
    });
    notified = Boolean(process.env.MAKE_WEBHOOK_URL);
  } catch {
    // notifyMake already swallows; this is belt and braces.
  }

  if (!stored && !notified) {
    return { ok: false, error: "משהו השתבש בשליחה. נסו שוב בעוד רגע." };
  }

  return { ok: true };
}

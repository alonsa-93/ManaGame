/**
 * Two cheap, no-third-party spam checks for the public contact form.
 *
 * Neither is a security control and neither is meant to be: they filter the
 * commodity bots that POST every form they can find. A targeted submitter gets
 * through both, which is fine — the cost of a bad lead is a wasted minute, and
 * the cost of a CAPTCHA is every real visitor's time plus a third party
 * watching them.
 */

export type SpamVerdict = "ok" | "honeypot" | "too-fast";

/**
 * A real person needs time to read the labels and type. Anything faster than
 * this came from a script. Kept low enough that a fast paste-and-submit human
 * is never caught.
 */
export const MIN_FILL_MS = 2_500;

export function classifySubmission({
  honeypot,
  startedAt,
  now = Date.now(),
}: {
  /** Value of the decoy field. A human never sees it, so anything here is a bot. */
  honeypot: string;
  /** Client timestamp of the visitor's first interaction with the form, as a string from the form body. */
  startedAt: string;
  now?: number;
}): SpamVerdict {
  if (honeypot.trim() !== "") return "honeypot";

  const startedAtMs = Number(startedAt);
  // A missing or malformed timestamp is not evidence of a bot — a visitor who
  // submitted without ever focusing a field, or a stripped form value, would
  // both produce it — so it passes. The honeypot still applies.
  if (!Number.isFinite(startedAtMs) || startedAtMs <= 0) return "ok";

  if (now - startedAtMs < MIN_FILL_MS) return "too-fast";

  return "ok";
}

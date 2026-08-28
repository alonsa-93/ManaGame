/**
 * Sanitises the `?next=` destination carried through the login redirect.
 *
 * Without this, `/login?next=https://evil.example` would hand an attacker a
 * redirect off the back of a trusted domain — the classic open redirect used to
 * make a phishing link look legitimate. Only a same-site absolute path ever
 * gets through.
 */

const DEFAULT_DESTINATION = "/assessor/sessions";

export function safeNextPath(raw: string | undefined | null): string {
  if (!raw) return DEFAULT_DESTINATION;

  // Must be an absolute path on this site. A second leading slash (or a
  // backslash, which some browsers normalise to one) makes it
  // protocol-relative: "//evil.example" is a full URL to a browser, not a path.
  if (!raw.startsWith("/")) return DEFAULT_DESTINATION;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return DEFAULT_DESTINATION;

  // A scheme anywhere means it was never a plain path.
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return DEFAULT_DESTINATION;

  // Control characters — CR/LF especially — can smuggle an extra line into a
  // Location header.
  if (/[\u0000-\u0020\u007f]/.test(raw)) return DEFAULT_DESTINATION;

  return raw;
}

export { DEFAULT_DESTINATION };

/**
 * Two different "site URLs", deliberately kept apart — they answer different
 * questions and must not be collapsed into one helper.
 *
 * `canonicalSiteUrl()` is the site's stable public identity: `metadataBase`,
 * `<link rel="canonical">`, the sitemap, robots.txt and JSON-LD. It must not
 * change per deployment. `VERCEL_URL` is unique to *every single deploy*, so
 * using it here would publish a different canonical origin on every push and
 * split the site's search identity across dozens of hostnames — which is
 * exactly the bug that shipped when `metadataBase` was hardcoded instead.
 *
 * `deploymentUrl()` is the opposite: a link back into *this* running
 * deployment, for outbound notifications (the assessor report link in a Make
 * webhook), where pointing at the deployment that actually produced the event
 * is the correct behaviour.
 */

/**
 * The project's production alias. Used only when nothing better is available —
 * i.e. local development, or a host that sets none of the Vercel variables.
 */
const FALLBACK_ORIGIN = "https://mana-game-amber.vercel.app";

/** Accepts both `example.com` (Vercel's bare-host style) and a full origin. */
function normalizeOrigin(raw: string): string {
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export function canonicalSiteUrl(): string {
  // VERCEL_PROJECT_PRODUCTION_URL is the project's production domain and stays
  // stable across deployments — Vercel sets it even inside preview builds,
  // which is precisely what a canonical URL needs.
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return raw ? normalizeOrigin(raw) : FALLBACK_ORIGIN;
}

export function deploymentUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  return raw ? normalizeOrigin(raw) : FALLBACK_ORIGIN;
}

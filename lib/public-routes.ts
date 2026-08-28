/**
 * The site's crawlable surface, in one place, so sitemap.ts and robots.ts can
 * never drift apart — a sitemap that lists a URL robots.txt disallows is a
 * self-contradiction search engines report as an error.
 */

export interface PublicRoute {
  path: string;
  changeFrequency: "yearly" | "monthly" | "weekly" | "daily";
  priority: number;
}

export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/technology", changeFrequency: "monthly", priority: 0.9 },
  { path: "/experience", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/accessibility", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Everything a crawler must stay out of.
 *
 * `/play` is the deliberate one: those routes are publicly reachable by design
 * (the /experience demo launches one), but they are live assessment entry
 * points. Letting a crawler walk them would create orphan sessions in the
 * assessor's data and put scenario situations into search results, where a
 * candidate could read the simulation before sitting it.
 */
export const DISALLOWED_PREFIXES = ["/admin", "/assessor", "/play", "/api"];

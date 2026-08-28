import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/site-url";
import { DISALLOWED_PREFIXES } from "@/lib/public-routes";

export default function robots(): MetadataRoute.Robots {
  const origin = canonicalSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOWED_PREFIXES.map((prefix) => `${prefix}/`),
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}

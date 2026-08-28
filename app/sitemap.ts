import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/site-url";
import { PUBLIC_ROUTES } from "@/lib/public-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = canonicalSiteUrl();
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: route.path === "/" ? origin : `${origin}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

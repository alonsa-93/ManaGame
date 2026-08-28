import type { MetadataRoute } from "next";

/**
 * Colours here are the literal brand token values from app/globals.css
 * (--mg-background, --mg-teal). They can't reference the CSS variables — the
 * browser reads this manifest before any stylesheet — so if the tokens move,
 * move these with them.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ManaGame — החלטות שמנהלות מציאות",
    short_name: "ManaGame",
    description:
      "פלטפורמת סימולציה דינמית לקבלת החלטות: מועמדים ומנהלים מתמודדים עם מצבים עסקיים משתנים, והמערכת מתעדת החלטות, ראיות ותוצאות.",
    start_url: "/",
    display: "standalone",
    lang: "he",
    dir: "rtl",
    background_color: "#f8f9f7",
    theme_color: "#18b8a6",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

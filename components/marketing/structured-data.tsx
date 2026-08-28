import { canonicalSiteUrl } from "@/lib/site-url";
import { FAQS } from "@/content/faq";

/**
 * schema.org structured data for the homepage: who publishes this, what the
 * site is, and the FAQ — generated from the same FAQS array the page renders
 * visibly, so the markup can't drift from the content.
 *
 * Server component: this is inert markup with no interactivity, so it costs
 * the client nothing but the bytes.
 */
export function StructuredData() {
  const origin = canonicalSiteUrl();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "ManaGame",
        url: origin,
        logo: `${origin}/icon.png`,
        description:
          "פלטפורמת סימולציה דינמית לקבלת החלטות עבור תהליכי מיון, הערכת מנהלים ופיתוח ארגוני.",
        slogan: "החלטות שמנהלות מציאות",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "ManaGame",
        inLanguage: "he-IL",
        publisher: { "@id": `${origin}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${origin}/#faq`,
        mainEntity: FAQS.map((entry) => ({
          "@type": "Question",
          name: entry.q,
          acceptedAnswer: { "@type": "Answer", text: entry.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // The payload is entirely first-party content from content/faq.ts and
      // lib/site-url.ts — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

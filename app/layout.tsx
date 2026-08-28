import type { Metadata } from "next";
import { Assistant, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { canonicalSiteUrl } from "@/lib/site-url";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const TITLE = "ManaGame — החלטות שמנהלות מציאות";
const DESCRIPTION =
  "ManaGame היא פלטפורמת סימולציה דינמית לקבלת החלטות. מועמדים ומנהלים מתמודדים עם מצבים עסקיים משתנים, והמערכת מתעדת החלטות, ראיות ותוצאות.";

export const metadata: Metadata = {
  // Resolved, never hardcoded — see lib/site-url.ts. A wrong metadataBase
  // silently rewrites every canonical and og:image URL to a domain the site
  // doesn't own.
  metadataBase: new URL(canonicalSiteUrl()),
  title: {
    default: TITLE,
    template: "%s — ManaGame",
  },
  description: DESCRIPTION,
  applicationName: "ManaGame",
  // No `alternates.canonical` here on purpose: metadata is inherited, so a
  // canonical set on the root layout would make every page declare itself the
  // homepage. Each public page sets its own (see app/(marketing)/*/page.tsx).
  openGraph: {
    title: TITLE,
    description: "לא שואלים מנהלים מה הם היו עושים. נותנים להם להתמודד עם מה שקורה באמת.",
    url: "/",
    siteName: "ManaGame",
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "לא שואלים מנהלים מה הם היו עושים. נותנים להם להתמודד עם מה שקורה באמת.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${inter.variable}`}>
      <body className="antialiased bg-mg-background text-mg-text">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

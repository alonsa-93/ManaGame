import type { Metadata } from "next";
import { Assistant, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://managame.vercel.app"),
  title: "ManaGame — החלטות שמנהלות מציאות",
  description:
    "ManaGame היא פלטפורמת סימולציה דינמית לקבלת החלטות. מועמדים ומנהלים מתמודדים עם מצבים עסקיים משתנים, והמערכת מתעדת החלטות, ראיות ותוצאות.",
  openGraph: {
    title: "ManaGame — החלטות שמנהלות מציאות",
    description:
      "לא שואלים מנהלים מה הם היו עושים. נותנים להם להתמודד עם מה שקורה באמת.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${inter.variable}`}>
      <body className="antialiased bg-mg-background text-mg-text">{children}</body>
    </html>
  );
}

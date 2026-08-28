import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/*
        WCAG 2.4.1 (Bypass Blocks). Without this, a keyboard or screen-reader
        user tabs through the whole navigation on every page before reaching
        the content. Visually hidden until focused, then it appears in place.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[100] focus:rounded-mg-md focus:bg-mg-surface focus:px-4 focus:py-2.5 focus:text-mg-text focus:shadow-[var(--mg-shadow-elevated)] focus:outline-none focus:ring-2 focus:ring-mg-teal"
      >
        דילוג לתוכן העיקרי
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

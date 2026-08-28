import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { AccessBar } from "@/components/admin/access-bar";

// See the note in app/admin/layout.tsx — noindex complements robots.txt.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/assessor/sessions", label: "סשנים" },
  { href: "/assessor/reports", label: "דוחות" },
  { href: "/assessor/comparison", label: "השוואה" },
  { href: "/admin/scenarios", label: "תרחישים" },
  { href: "/assessor/calibration", label: "כיול" },
  { href: "/assessor/settings", label: "הגדרות" },
];

export default function AssessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mg-background">
      <AccessBar />
      <header className="border-b border-mg-border bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <Logo height={22} href="/assessor/sessions" />
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-mg-text-secondary hover:text-mg-text hover:bg-black/[.03] rounded-mg-sm whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10">{children}</main>
    </div>
  );
}

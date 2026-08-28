import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

// robots.txt keeps crawlers out; noindex keeps a URL out of the index even if
// someone links to it from outside. Both are needed — they solve different
// halves of the problem.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin/scenarios", label: "תרחישים" },
  { href: "/admin/events", label: "אירועים" },
  { href: "/admin/rubric", label: "רובריקה" },
  { href: "/assessor/calibration", label: "כיול" },
  { href: "/assessor/sessions", label: "סשנים" },
  { href: "/admin/leads", label: "פניות" },
  { href: "/admin/system", label: "מערכת" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mg-background">
      <header className="border-b border-mg-border bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <Logo height={22} href="/admin/scenarios" />
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

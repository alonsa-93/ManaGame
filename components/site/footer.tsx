import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "המוצר",
    links: [
      { href: "/#product", label: "המוצר" },
      { href: "/#how-it-works", label: "איך זה עובד" },
      { href: "/experience", label: "התנסות" },
    ],
  },
  {
    title: "הטכנולוגיה",
    links: [
      { href: "/technology#engine", label: "המנוע" },
      { href: "/technology#security", label: "Security" },
      { href: "/technology#evidence", label: "Evidence" },
    ],
  },
  {
    title: "החברה",
    links: [
      { href: "/#philosophy", label: "אודות" },
      { href: "/contact", label: "צרו קשר" },
    ],
  },
  {
    title: "משפטי",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/accessibility", label: "Accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-mg-border bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Logo height={28} />
            <p className="mt-4 text-sm text-mg-text-secondary max-w-xs">החלטות שמנהלות מציאות</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-mg-text mb-3">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-mg-text-secondary hover:text-mg-teal transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-mg-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-mg-text-secondary">ManaGame — Decision Simulation Infrastructure.</p>
          <p className="text-xs text-mg-text-secondary/70 ltr-num" dir="ltr">
            © {new Date().getFullYear()} ManaGame
          </p>
        </div>
      </div>
    </footer>
  );
}

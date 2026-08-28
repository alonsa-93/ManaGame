"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#product", label: "המוצר" },
  { href: "/#how-it-works", label: "איך זה עובד" },
  { href: "/technology", label: "הטכנולוגיה" },
  { href: "/experience", label: "החוויה" },
  { href: "/#use-cases", label: "למי זה מתאים" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-mg-border shadow-[var(--mg-shadow-subtle)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className={cn("flex items-center justify-between transition-all duration-300", scrolled ? "h-16" : "h-20")}>
          <Logo height={scrolled ? 26 : 30} />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm text-mg-text-secondary hover:text-mg-text rounded-mg-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/*
              A "עברית | English" switch used to sit here with no onClick and no
              English site behind it. On a product whose whole pitch is evidence
              and honesty, a control that does nothing is worse than no control,
              so it's gone until there is something to switch to. Restore it
              alongside a real locale route, not before.
            */}
            <Link href="/experience">
              <Button size="sm">בואו ננסה</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 -m-2 text-mg-text"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-b border-mg-border px-5 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-2 py-3 text-mg-text border-b border-mg-border/60 last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/experience" onClick={() => setOpen(false)} className="mt-3">
            <Button className="w-full">בואו ננסה</Button>
          </Link>
        </div>
      )}
    </header>
  );
}

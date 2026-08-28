import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "התנסות בסימולציית קבלת החלטות",
  description: "יש לכם שלוש דקות? נכניס אתכם למצב שבו צריך לקבל החלטה, ואז נראה מה קורה כשהמציאות משתנה.",
  alternates: { canonical: "/experience" },
};

const STEPS = [
  { n: "01", title: "מצב", body: "מקבלים מצב עסקי אמיתי: מידע חלקי, אילוצים ומשאבים מוגבלים." },
  { n: "02", title: "החלטה", body: "כותבים במילים שלכם מה הייתם עושים — אין תשובה \"נכונה\" אחת." },
  { n: "03", title: "המציאות משתנה", body: "המערכת מגיבה להחלטה שלכם, ואתם מתבקשים להחליט שוב." },
];

export default function ExperiencePage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-20 sm:pt-28 pb-16 text-center">
        <span className="text-sm font-medium text-mg-teal">The ManaGame Experience</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-mg-text leading-tight">יש לכם שלוש דקות?</h1>
        <p className="mt-6 text-lg text-mg-text-secondary leading-relaxed max-w-2xl mx-auto">
          לא תקבלו ציון. לא ננסה להחליט אם אתם מנהלים טובים. פשוט נכניס אתכם למצב שבו צריך לקבל החלטה, ואז נראה מה
          קורה כשהמציאות משתנה.
        </p>
        <div className="mt-9">
          <Link href="/play/supply-chain-manager-1">
            <Button size="lg">התחילו</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <Card key={s.n} className="p-6">
              <div className="text-mg-teal font-bold text-xl ltr-num mb-2">{s.n}</div>
              <h3 className="font-semibold text-mg-text mb-1.5">{s.title}</h3>
              <p className="text-sm text-mg-text-secondary leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 sm:px-8 pb-24">
        <Card className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-mg-text mb-4">מה קרה מאחורי הקלעים?</h2>
          <p className="text-mg-text-secondary leading-relaxed mb-6">
            מה שתראו בהתנסות הקצרה הוא הדגמה של העיקרון. במערכת המלאה, כל אחד מהשלבים הבאים הוא חלק ממערכת רחבה יותר
            של תרחישים, מצב, אירועים, ראיות, שיפוט ובדיקה אנושית.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-mg-text ltr-num" dir="ltr">
            {["Your Decision", "Parser", "Structured Action", "State Engine", "Event", "New State", "Next Decision"].map(
              (step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-mg-sm border border-mg-border bg-mg-background px-2.5 py-1">{step}</span>
                  {i < arr.length - 1 && <ChevronLeft className="h-4 w-4 text-mg-text-secondary rotate-180" />}
                </span>
              )
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/technology">
              <Button variant="secondary">רוצים לראות את המערכת המלאה?</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">לתיאום הדגמה</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

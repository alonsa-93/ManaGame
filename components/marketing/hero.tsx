"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const KPIS_BEFORE = [
  { key: "schedule", label: "לוח זמנים", value: 78 },
  { key: "cash", label: "תקציב חירום", value: 62 },
  { key: "reputation", label: "אמון הלקוח", value: 85 },
];

const KPIS_AFTER = [
  { key: "schedule", label: "לוח זמנים", value: 71 },
  { key: "cash", label: "תקציב חירום", value: 54 },
  { key: "reputation", label: "אמון הלקוח", value: 88 },
];

export function Hero() {
  const [changed, setChanged] = useState(false);
  const kpis = changed ? KPIS_AFTER : KPIS_BEFORE;

  return (
    <section id="product" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block text-sm font-medium text-mg-teal mb-4 tracking-wide">ManaGame</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.15] text-mg-text">
              לא שואלים מנהלים
              <br />
              מה הם היו עושים.
            </h1>
            <p className="mt-3 text-2xl sm:text-3xl font-medium mg-gradient-text">נותנים להם להתמודד עם מה שקורה באמת.</p>

            <p className="mt-7 text-lg text-mg-text-secondary leading-relaxed max-w-xl">
              ManaGame היא סימולציית קבלת החלטות דינמית שמכניסה מועמדים ומנהלים לתוך מצבים עסקיים משתנים. במקום לקבל
              תשובה תיאורטית לשאלה כמו &quot;מה היית עושה אם...&quot;, המערכת מציגה מצב, אילוצים, מידע חלקי ומשאבים
              מוגבלים — ומבקשת מהמשתמש להחליט. ואז המציאות משתנה: ההחלטה משפיעה על המצב הבא, אירועים חדשים נכנסים
              לתמונה, המשאבים משתנים והמשתמש נדרש לקבל החלטה נוספת.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/experience">
                <Button size="lg">
                  התנסו בסימולציה
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/technology">
                <Button size="lg" variant="secondary">
                  ראו איך זה עובד
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Card className="p-5 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-medium text-mg-text-secondary">מצב הסימולציה</span>
                <span className="text-xs text-mg-text-secondary">
                  סבב <span className="ltr-num">02 / 06</span>
                </span>
              </div>

              <div className="space-y-4">
                {kpis.map((kpi) => {
                  const before = KPIS_BEFORE.find((k) => k.key === kpi.key)!.value;
                  const delta = kpi.value - before;
                  return (
                    <div key={kpi.key}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-mg-text">{kpi.label}</span>
                        <span className="flex items-center gap-1 ltr-num text-mg-text-secondary">
                          {changed && delta !== 0 && (
                            <span className={cn("inline-flex items-center", delta > 0 ? "text-mg-success" : "text-mg-text-secondary")}>
                              {delta > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            </span>
                          )}
                          {kpi.value}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/[.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-mg-teal transition-all duration-700 ease-out"
                          style={{ width: `${kpi.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className={cn(
                  "mt-6 rounded-mg-md border p-4 text-sm transition-all duration-500",
                  changed ? "bg-mg-sand border-[#e8d4ad] opacity-100" : "opacity-0 h-0 p-0 border-transparent overflow-hidden"
                )}
              >
                <p className="font-medium text-mg-text mb-1">עדכון חדש</p>
                <p className="text-mg-text-secondary">ספק מרכזי הודיע על עיכוב של שמונה ימים במשלוח הקרוב.</p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-mg-text">
                  {changed ? "המציאות השתנתה. מה הייתם עושים עכשיו?" : "זהו מצב לדוגמה מתוך סימולציה."}
                </p>
                {!changed ? (
                  <Button size="sm" variant="secondary" onClick={() => setChanged(true)}>
                    מה קורה עכשיו?
                  </Button>
                ) : (
                  <Link href="/experience">
                    <Button size="sm">נסו בעצמכם</Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

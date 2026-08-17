import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const layers = [
  { num: "01", label: "תרחיש" },
  { num: "02", label: "מנוע מצב" },
  { num: "03", label: "פרשן החלטות" },
  { num: "04", label: "מנוע אירועים" },
  { num: "05", label: "שיפוט" },
  { num: "06", label: "ראיות" },
  { num: "07", label: "בדיקה אנושית" },
];

const stateFlow = ["מצב לפני", "פעולה", "דלתא", "מצב אחרי"];

export default function TechnologyTeaser() {
  return (
    <section id="technology" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
        מאחורי החוויה יש מנוע.
      </h2>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mg-text-secondary">
        ManaGame אינה שכבת AI שמייצרת טקסט סביב שאלון. מאחורי החוויה קיימת מערכת המורכבת
        ממספר שכבות, שלכל אחת מהן תפקיד מוגדר. התרחיש מגדיר את העולם. מנוע המצב מנהל את
        הנתונים. הפרסר הופך את השפה החופשית למבנה שהמערכת יכולה לעבוד איתו. מנוע האירועים
        משנה את המציאות בהתאם לתנאים שהוגדרו. שכבת השיפוט מנתחת את ההחלטה לפי רובריקה
        מוגדרת. האגרגטור מחשב את הציון באופן דטרמיניסטי. ושכבת הראיות והבדיקה האנושית
        מאפשרות לחזור למה שבאמת קרה.
      </p>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {layers.map((layer) => (
          <div
            key={layer.num}
            className="rounded-mg-md border border-mg-border bg-mg-surface px-3 py-4 text-center"
          >
            <div className="ltr-num text-xs font-semibold text-mg-teal">{layer.num}</div>
            <div className="mt-1 text-sm font-medium text-mg-text">{layer.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h3 className="text-2xl sm:text-3xl font-semibold text-mg-text max-w-3xl">
          לכל החלטה יש מחיר.
        </h3>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-mg-text-secondary">
          מנוע המצב שומר את מצב המערכת לפני ואחרי כל תור. הוא אינו מנחש את התוצאה. הוא
          מחשב אותה לפי החוקים והנתונים שהוגדרו מראש.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {stateFlow.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="rounded-mg-md border border-mg-border bg-mg-surface px-4 py-3 text-sm font-medium text-mg-text">
                {step}
              </div>
              {i < stateFlow.length - 1 && (
                <ChevronLeft
                  className="h-4 w-4 shrink-0 text-mg-text-secondary"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <Link
          href="/technology"
          className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-mg-md border border-mg-border bg-white px-3.5 text-sm font-medium text-mg-text transition-all duration-150 hover:border-mg-teal hover:text-mg-teal focus-visible:outline-none"
        >
          לצלול לתוך הארכיטקטורה המלאה
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SecurityLabSection } from "@/components/marketing/technology/security-lab-section";

export const metadata = {
  title: "איך ManaGame עובדת — מנוע סימולציה וקבלת החלטות",
  description:
    "ארכיטקטורה של שבע שכבות: תרחיש, מנוע מצב, פרשן החלטות, מנוע אירועים, שיפוט, ראיות ובדיקה אנושית.",
};

const LAYERS = [
  {
    num: "01",
    title: "תרחיש",
    does: "מגדיר את העולם: תפקיד, ענף, KPI, אילוצים ואירועים אפשריים.",
    why: "כדי שהחלטות יתקבלו בתוך הקשר, ולא בחלל ריק.",
    not: "לא כתיבת סיפור יפה כמטרה בפני עצמה.",
  },
  {
    num: "02",
    title: "מנוע מצב",
    does: "שומר את מצב המערכת לפני ואחרי כל תור.",
    why: "כדי שלכל החלטה תהיה תוצאה ברורה וניתנת לחישוב.",
    not: "לא מנחש תוצאה ולא מייצר אותה באופן חופשי.",
  },
  {
    num: "03",
    title: "פרשן החלטות",
    does: "הופך שפה חופשית להחלטה מובנית שהמנוע יכול לעבד.",
    why: "כדי שהמערכת תבין מה בדיוק המשתמש בחר לעשות.",
    not: "לא שופט ולא מנקד את ההחלטה בעצמו.",
  },
  {
    num: "04",
    title: "מנוע אירועים",
    does: "מפעיל אירועים בהתאם למצב, לזמן, לחומרה ולהחלטות קודמות.",
    why: "כדי שהמציאות בסימולציה תגיב ולא תמתין למועמד.",
    not: "לא עונש אקראי שמנותק מהסביבה.",
  },
  {
    num: "05",
    title: "שיפוט",
    does: "מעריך החלטה מובנית מול רובריקה מוגדרת וראיות רלוונטיות.",
    why: "כדי שההערכה תהיה עקבית ומבוססת קריטריונים, לא רושם כללי.",
    not: "לא קובע את הציון הסופי בעצמו.",
  },
  {
    num: "06",
    title: "ראיות",
    does: "שומר ציטוטים, הקשר ומקורות לכל הערכה שנוצרת.",
    why: "כדי שאפשר יהיה לחזור ולבדוק למה הוחלט מה שהוחלט.",
    not: "לא מסתפק ב'המערכת חושבת ש...' בלי מקור.",
  },
  {
    num: "07",
    title: "בדיקה אנושית",
    does: "מעביר מקרים לא ודאיים או שנויים במחלוקת לבדיקת אדם.",
    why: "כדי שאי-ודאות לא תיפתר באמצעות ניחוש.",
    not: "לא מחליף שיקול דעת אנושי במקרים גבוליים.",
  },
];

const STATE_FLOW = ["STATE BEFORE", "ACTION", "DELTA", "STATE AFTER"];

const EVENT_FLOW = [
  'החלטה: "אני דוחה את הטיפול בספק."',
  "הזמן מתקדם.",
  'אירוע: "ספק מרכזי הודיע על השבתת פעילות."',
];

const JUDGE_PIPELINE = [
  "Candidate Input",
  "Parser",
  "Structured Action",
  "Feasibility",
  "Evidence",
  "Judge",
  "Score Aggregator",
  "Report",
];

const INTEL_ITEMS = [
  { name: "דוח ספק", cost: 1, accuracy: 85 },
  { name: "תחזית ביקוש", cost: 2, accuracy: 70 },
  { name: "בדיקת סיכון", cost: 3, accuracy: 95 },
];

const RTL_CHALLENGES = [
  "כיווניות",
  "מספרים",
  "מטבעות",
  "מילים בתוך מילים",
  "טקסט חופשי",
  "מורפולוגיה",
  "מונחים באנגלית",
  "שילוב בין עברית, אנגלית ומספרים",
];

export default function TechnologyPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <Badge variant="neutral">Inside ManaGame</Badge>
        <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text">
          <span className="block">מערכת אחת.</span>
          <span className="block mg-gradient-text">שבע שכבות.</span>
        </h1>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          החוויה שהמשתמש רואה פשוטה בכוונה. אבל מאחוריה קיימת ארכיטקטורה שמפרידה בין
          תרחיש, מצב, פרשנות, אירועים, שיפוט, ראיות ובדיקה אנושית.
        </p>
      </section>

      {/* ARCHITECTURE MAP */}
      <section id="architecture" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          מפת הארכיטקטורה.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          שבע שכבות, כל אחת עם תפקיד מוגדר וגבולות ברורים.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LAYERS.map((layer) => (
            <Card key={layer.num}>
              <CardContent>
                <span className="ltr-num block text-2xl font-bold text-mg-teal">
                  {layer.num}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-mg-text">{layer.title}</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-mg-text">מה זה עושה</dt>
                    <dd className="mt-1 text-mg-text-secondary leading-relaxed">{layer.does}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-mg-text">למה זה קיים</dt>
                    <dd className="mt-1 text-mg-text-secondary leading-relaxed">{layer.why}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-mg-text">מה זה לא עושה</dt>
                    <dd className="mt-1 text-mg-text-secondary leading-relaxed">{layer.not}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SCENARIO */}
      <section id="scenario" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          תרחיש הוא לא טקסט.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          התרחיש הוא העולם שבו ההחלטה מתרחשת. הוא מגדיר את התפקיד, הענף, ה-KPI,
          האילוצים, המידע הזמין, האירועים, החלופות וההסתעפויות האפשריות. המטרה אינה
          לכתוב סיפור יפה. המטרה היא ליצור סביבה שבה החלטות יכולות לשנות מצב.
        </p>
      </section>

      {/* STATE ENGINE */}
      <section id="state-engine" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          לכל החלטה יש מחיר.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          מנוע המצב שומר את מצב המערכת לפני ואחרי כל תור. הוא אינו מנחש את התוצאה. הוא
          מחשב אותה לפי החוקים והנתונים שהוגדרו מראש.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {STATE_FLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="rounded-mg-md border border-mg-border bg-mg-surface px-4 py-3 text-sm font-medium text-mg-text">
                <span className="ltr-num">{step}</span>
              </div>
              {i < STATE_FLOW.length - 1 && (
                <ChevronLeft className="h-4 w-4 shrink-0 text-mg-text-secondary" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DETERMINISM */}
      <section id="determinism" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          AI יכול לנסח. המנוע חייב לזכור.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          מודל שפה יכול לעזור לפרש שפה אנושית. אבל הוא אינו אמור להחליט באופן חופשי כיצד
          העולם השתנה. ב-ManaGame ההפרדה הזו מכוונת. ה-AI מפרש. המנוע מחשב. המערכת שומרת
          את המצב. והאדם נשאר בתהליך קבלת ההחלטה.
        </p>
      </section>

      {/* DETERMINISM LAB */}
      <section id="determinism-lab" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          אותו מצב. אותה החלטה. אותו Seed. אותו מנוע.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          האם אפשר להריץ את אותה החלטה שוב? כן — כאשר תנאי ההרצה זהים.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Badge variant="illustrative">Demo Data</Badge>
        </div>

        <div className="mt-4 max-w-xl">
          <Card>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-mg-text">Seed</dt>
                  <dd className="ltr-num text-mg-text-secondary">4839217</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-mg-text shrink-0">Input</dt>
                  <dd className="text-mg-text-secondary text-right">
                    אני בודק ספק חלופי ומקצה שני עובדים
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-mg-text">Engine Version</dt>
                  <dd className="ltr-num text-mg-text-secondary">v1.4.2</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-mg-text">Content Version</dt>
                  <dd className="ltr-num text-mg-text-secondary">2026.08</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <p className="mt-4 text-sm text-mg-text-secondary leading-relaxed">
            הטקסט שהמערכת מציגה יכול להשתנות ברמת הניסוח. המצב המספרי והתוצאה
            הדטרמיניסטית אינם אמורים להשתנות כאשר כל תנאי ההרצה הרלוונטיים זהים.
          </p>
        </div>
      </section>

      {/* EVENT ENGINE */}
      <section id="events" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          המציאות לא מחכה למועמד.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          אירועים יכולים להתרחש בהתאם למצב המערכת, לחלון הזמן, לחומרה, לתנאים שהוגדרו
          בתרחיש ולהחלטות שכבר התקבלו.
        </p>

        <div className="mt-8 flex max-w-xl flex-col items-start gap-2">
          {EVENT_FLOW.map((line, i) => (
            <div key={line} className="flex flex-col items-start gap-2">
              <div className="rounded-mg-md border border-mg-border bg-mg-surface px-4 py-3 text-sm font-medium text-mg-text">
                {line}
              </div>
              {i < EVENT_FLOW.length - 1 && (
                <ChevronDown className="h-4 w-4 shrink-0 text-mg-text-secondary mx-4" aria-hidden />
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-mg-text-secondary">
          האירוע אינו עונש אקראי. הוא חלק מהסביבה.
        </p>
      </section>

      {/* INFORMATION / FOG OF WAR */}
      <section id="information" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          לא כל מידע שווה לקנות.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          בעולם אמיתי, מידע עולה משאבים. לפעמים הוא עולה זמן. לפעמים כסף. לפעמים הוא
          מגיע מאוחר מדי. ולפעמים גם מידע שרכשת אינו מושלם. ManaGame יכולה לייצר מצבים
          שבהם המשתמש צריך להחליט לא רק מה לעשות — אלא איזה מידע שווה להשיג לפני שהוא
          פועל.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {INTEL_ITEMS.map((item) => (
            <Card key={item.name}>
              <CardContent>
                <h3 className="text-lg font-semibold text-mg-text">{item.name}</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-mg-text-secondary">עלות</span>
                    <span className="ltr-num font-medium text-mg-text">{item.cost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mg-text-secondary">דיוק</span>
                    <span className="ltr-num font-medium text-mg-text">{item.accuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* JUDGE */}
      <section id="judge" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          ה-AI לא נותן את הציון.
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          שכבת השיפוט מקבלת החלטה מובנית, הקשר, ראיות רלוונטיות ורובריקה מוגדרת. היא
          מחזירה הערכה בהתאם לקריטריונים שהוגדרו. הציון הסופי אינו אמור להיות מספר
          שהמודל פשוט &quot;החליט&quot;. האגרגטור הדטרמיניסטי הוא שמחשב את הציון בהתאם
          לחוקים שהוגדרו במערכת.
        </p>

        <div className="mt-10 flex max-w-xs flex-col items-center gap-2 mx-auto">
          {JUDGE_PIPELINE.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-mg-md border border-mg-border bg-mg-surface px-4 py-3 text-center text-sm font-medium text-mg-text">
                <span className="ltr-num">{step}</span>
              </div>
              {i < JUDGE_PIPELINE.length - 1 && (
                <ChevronDown className="h-4 w-4 shrink-0 text-mg-text-secondary" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* HEBREW / RTL */}
      <section id="rtl" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
          <span dir="ltr" className="inline-block">
            עברית היא לא English עם RTL.
          </span>
        </h2>
        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          ManaGame נבנתה מראש לעבודה בעברית. המערכת צריכה להתמודד עם: כיווניות, מספרים,
          מטבעות, מילים בתוך מילים, טקסט חופשי, מורפולוגיה, מונחים באנגלית, שילוב בין
          עברית, אנגלית ומספרים. הממשק אינו מסתמך על התאמת מילות מפתח פשוטה בלבד כדי
          להבין את ההחלטה של המשתמש.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {RTL_CHALLENGES.map((challenge) => (
            <Badge key={challenge} variant="neutral">
              {challenge}
            </Badge>
          ))}
        </div>
      </section>

      {/* SECURITY + SECURITY LAB (dark, client) */}
      <SecurityLabSection />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <div className="rounded-mg-xl border border-mg-border bg-mg-surface px-6 py-12 sm:px-12 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-mg-text">
            רוצים לראות את זה על תפקיד אמיתי?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/experience"
              className="inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-mg-md bg-mg-teal px-7 text-base font-medium text-white transition-all duration-150 hover:bg-[#149385] active:bg-[#0f7a6f] shadow-[0_1px_2px_rgba(24,184,166,.25)]"
            >
              נסו את הסימולציה
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-mg-md border border-mg-border bg-white px-7 text-base font-medium text-mg-text transition-all duration-150 hover:border-mg-teal hover:text-mg-teal"
            >
              קבעו הדגמה
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";

export const metadata = {
  title: "נגישות",
  description: "מחויבות הנגישות של ManaGame.",
  alternates: { canonical: "/legal/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold mb-6">נגישות</h1>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אנחנו בונים את ManaGame מתוך כוונה שהמוצר יהיה נגיש ושמיש עבור כמה שיותר משתמשים ומועמדים,
        ושואפים לעמוד בהנחיות WCAG 2.2 ברמה AA לאורך כלל חלקי המוצר — מאתר השיווק ועד לחוויית
        הסימולציה עצמה.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">ניווט במקלדת</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        כל הפעולות המרכזיות במערכת ניתנות לביצוע באמצעות מקלדת בלבד, עם סדר מיקוד (focus) הגיוני
        ואינדיקציה ברורה ונראית לעין לאלמנט הפעיל, כך שאין הסתמכות על שימוש בעכבר בלבד.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">קוראי מסך ותמיכה בעברית מימין לשמאל</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אנו עובדים על סימון סמנטי נכון, תוויות ברורות לרכיבי טפסים ואזורי תוכן דינמיים, כך שקוראי
        מסך יוכלו להעביר את המידע בצורה מדויקת. הממשק כולו בנוי בכיווניות מימין לשמאל (RTL) כשפת
        עבודה עיקרית, כולל טיפול נכון בתוכן מעורב עברית-אנגלית ובמספרים.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">תנועה מופחתת</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        המערכת מכבדת את הגדרת המשתמש להעדפת תנועה מופחתת (prefers-reduced-motion), ומקטינה או
        מבטלת אנימציות ומעברים עבור מי שבחר בהעדפה זו במערכת ההפעלה או בדפדפן.
      </p>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        נגישות היא תהליך מתמשך עבורנו, ולא יעד חד-פעמי. אם נתקלתם במכשול נגישות בשימוש במוצר, נשמח
        לשמוע ולתקן — ניתן לפנות אלינו דרך{" "}
        <Link href="/contact" className="text-mg-teal underline underline-offset-2 hover:opacity-80">
          עמוד יצירת הקשר
        </Link>
        .
      </p>
    </article>
  );
}

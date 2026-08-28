import Link from "next/link";
import { Alert } from "@/components/ui/alert";

export const metadata = {
  title: "הצהרת נגישות",
  description: "מצב הנגישות של ManaGame: מה נבדק, מה מיושם, ומה עדיין לא.",
  alternates: { canonical: "/legal/accessibility" },
};

const UPDATED = "אוגוסט 2026";

export default function AccessibilityPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold mb-2">הצהרת נגישות</h1>
      <p className="text-sm text-mg-text-secondary mb-6">עודכן: {UPDATED}</p>

      <Alert variant="warning" className="mb-8">
        טרם בוצעה בדיקת נגישות על ידי מורשה נגישות מוסמך, ולכן זו אינה הצהרת נגישות מלאה לפי תקנות
        שוויון זכויות לאנשים עם מוגבלות. המסמך מתאר את מצב הנגישות בפועל — כולל מה שעדיין חסר.
      </Alert>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame מיועדת לשמש בתהליכי מיון והערכה. מוצר שמעריך אנשים חייב להיות נגיש להם — מחסום
        נגישות בסימולציה אינו רק אי-נוחות, הוא מדידה שגויה של מי שנתקל בו. אנו מכוונים לעמידה
        בהנחיות WCAG 2.2 ברמה AA, שהן הבסיס לתקן הישראלי ת&quot;י 5568.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">מה מיושם ונבדק בקוד</h2>
      <ul className="list-disc ps-6 space-y-2 text-mg-text-secondary leading-relaxed mb-4">
        <li>
          <strong>ניווט במקלדת:</strong> הפעולות במערכת ניתנות לביצוע במקלדת, עם אינדיקציית מיקוד
          נראית לעין על רכיבים אינטראקטיביים.
        </li>
        <li>
          <strong>דילוג לתוכן:</strong> קישור דילוג בתחילת כל עמוד שיווקי, כדי לא לחייב מעבר על כל
          התפריט בכל עמוד.
        </li>
        <li>
          <strong>תנועה מופחתת:</strong> המערכת מכבדת את הגדרת{" "}
          <code className="font-mono" dir="ltr">prefers-reduced-motion</code> ומצמצמת אנימציות ומעברים.
        </li>
        <li>
          <strong>עברית ו-RTL:</strong> הממשק בנוי מלכתחילה בכיווניות מימין לשמאל, כולל טיפול בתוכן
          מעורב עברית-אנגלית ובמספרים.
        </li>
        <li>
          <strong>מבנה סמנטי:</strong> כותרות היררכיות, אזורי landmark, ותוויות מקושרות לשדות טפסים.
          רכיבי אקורדיון וטפסים נושאים מאפייני ARIA מתאימים.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">מה עדיין חסר</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אנו מעדיפים לומר זאת מפורשות ולא להשאיר לרושם כללי:
      </p>
      <ul className="list-disc ps-6 space-y-2 text-mg-text-secondary leading-relaxed mb-4">
        <li>לא בוצעה בדיקה ידנית מלאה עם קוראי מסך (NVDA, JAWS, VoiceOver).</li>
        <li>לא בוצע ביקורת נגישות על ידי מורשה נגישות מוסמך.</li>
        <li>לא מונה רכז נגישות ייעודי.</li>
        <li>
          <strong>ניגודיות צבעים:</strong> נמדדה, ולא כולה עומדת בדרישה. גוון הטורקיז של המותג
          (<code dir="ltr">#18b8a6</code>) מגיע ליחס של כ-‎2.4:1 מול רקע בהיר, במקום ‎4.5:1 הנדרש
          לטקסט רגיל. הגוון תקין כאלמנט גרפי, ואינו מספיק כצבע טקסט קטן. הפתרון דורש החלטת מותג
          ולכן טרם בוצע.
        </li>
      </ul>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        מדידה אחרונה ב-Lighthouse על עמוד הבית: נגישות ‎96, שיטות מומלצות ‎96, SEO ‎100, ביצועים ‎91.
        הציון אינו תעודת עמידה — הוא כלי אוטומטי שמכסה חלק מהקריטריונים בלבד.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">נתקלתם במכשול?</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        נגישות היא תהליך מתמשך ולא יעד חד-פעמי. אם נתקלתם במכשול — במיוחד במהלך סימולציה — נשמח
        לשמוע ולתקן. ניתן לפנות דרך{" "}
        <Link href="/contact" className="text-mg-teal underline underline-offset-2 hover:opacity-80">
          עמוד יצירת הקשר
        </Link>
        .
      </p>
    </article>
  );
}

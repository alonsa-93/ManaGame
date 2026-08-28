import { Alert } from "@/components/ui/alert";
import Link from "next/link";

export const metadata = {
  title: "תנאי שימוש",
  description: "התנאים שחלים על שימוש בפלטפורמת ManaGame, על תוצרי ההערכה ועל מגבלות האחריות.",
  alternates: { canonical: "/legal/terms" },
};

const UPDATED = "אוגוסט 2026";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold mb-2">תנאי שימוש</h1>
      <p className="text-sm text-mg-text-secondary mb-6">עודכן: {UPDATED}</p>

      <Alert variant="warning" className="mb-8">
        המסמך תואם למערכת כפי שהיא בנויה בפועל, וטרם עבר בדיקה משפטית. הוא אינו מהווה ייעוץ משפטי
        ואינו תחליף להסכם התקשרות חתום מול ארגון.
      </Alert>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        השימוש בפלטפורמת ManaGame — הסימולציות, ממשקי הניהול ודוחות ההערכה — כפוף לתנאים אלה. גישה
        ניתנת לארגונים ולמשתמשים שהוסמכו על ידם, ושימוש במערכת מהווה הסכמה לתנאים שלהלן.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">מה המערכת עושה, ומה היא לא</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame מציבה משתתף בתוך סביבה עסקית משתנה, מתעדת את רצף ההחלטות שקיבל ומפיקה מהן ראיות
        והערכה מובנית לפי רובריקה קבועה. היא <strong>אינה מקבלת החלטת העסקה</strong>, אינה מדרגת
        מועמדים זה מול זה מיוזמתה, ואינה תחליף לראיון, לבדיקת התאמה או לשיקול דעת מקצועי. כל החלטה
        שמתקבלת על בסיס תוצרי המערכת היא באחריות הארגון והמעריך.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">מגבלות הכלי, במפורש</h2>
      <ul className="list-disc ps-6 space-y-2 text-mg-text-secondary leading-relaxed mb-4">
        <li>
          ההערכה נמדדת רק במה שהתרחיש מגדיר. התנהגות שהתרחיש לא נועד למדוד לא תיבחן, גם אם היא
          חשובה לתפקיד.
        </li>
        <li>
          כשלא נאספו מספיק ראיות, המערכת אינה מפיקה ציון תהליך. היעדר ציון אינו ציון נמוך.
        </li>
        <li>
          החלטות שהמערכת לא סיווגה בביטחון מסומנות לבדיקה אנושית ואינן מוכרעות אוטומטית.
        </li>
        <li>
          השוואה בין מועמדים תקפה רק בתוך אותו תרחיש ובכפוף לכללי ההשוואה של המערכת. השוואה בין
          תרחישים שונים אינה תקפה.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">חובות הארגון המפעיל</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ארגון שמעמיד מועמדים בסימולציה אחראי ליידע אותם מראש על ההערכה ועל אופן השימוש בתוצריה,
        לקבל את הסכמתם כנדרש, ולנהל את המידע בהתאם לדין החל — לרבות חוק הגנת הפרטיות. הארגון אחראי
        גם לניהול ההרשאות אצלו: מי מצוות ההערכה רשאי לצפות בדוחות מועמדים.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">שימוש הוגן במערכת</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אין להשתמש במערכת למטרה שאינה הערכה ופיתוח לגיטימיים, אין לנסות לעקוף מנגנוני אבטחה או
        הרשאות, ואין להעתיק, לשכפל או להפיץ את תוכן התרחישים והרובריקה. תוכן התרחישים הוא לב הקניין
        הרוחני של המוצר — חשיפתו למועמדים מראש הורסת את תקפות ההערכה עבור כל מי שנבחן אחריהם.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">קניין רוחני</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        התרחישים, הרובריקה, מנוע ההחלטות והממשקים הם קניינה של ManaGame. נתוני ההערכה שנוצרו עבור
        ארגון — תשובות המועמדים, הראיות והדוחות — שייכים לארגון המזמין.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">שינויים ויצירת קשר</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        תנאים אלה עשויים להתעדכן. שינוי מהותי יובא לידיעת הארגונים המשתמשים במערכת. לשאלות ניתן
        לפנות דרך <Link href="/contact" className="text-mg-teal hover:underline">עמוד יצירת הקשר</Link>.
      </p>
    </article>
  );
}

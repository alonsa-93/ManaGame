import { Alert } from "@/components/ui/alert";
import Link from "next/link";

export const metadata = {
  title: "מדיניות פרטיות",
  description: "איזה מידע ManaGame אוספת, לאן הוא מגיע, כמה זמן הוא נשמר ואילו זכויות עומדות למועמדים.",
  alternates: { canonical: "/legal/privacy" },
};

const UPDATED = "אוגוסט 2026";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold mb-2">מדיניות פרטיות</h1>
      <p className="text-sm text-mg-text-secondary mb-6">עודכן: {UPDATED}</p>

      <Alert variant="warning" className="mb-8">
        המסמך תואם למערכת כפי שהיא בנויה בפועל, וטרם עבר בדיקה משפטית. הוא אינו מהווה ייעוץ משפטי.
        ארגון שמפעיל את ManaGame על מועמדים אמיתיים נדרש לבדיקה משפטית עצמאית לפני תחילת השימוש.
      </Alert>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame היא פלטפורמת סימולציה לקבלת החלטות המשמשת ארגונים בתהליכי הערכה ופיתוח. המסמך הזה
        מתאר איזה מידע אישי המערכת אוספת, לאן הוא מגיע, מי יכול להגיע אליו ואילו זכויות עומדות
        למי שהמידע נוגע אליו.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">תפקידי הצדדים</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ברוב המקרים <strong>הארגון המזמין הוא בעל מאגר המידע</strong> — הוא זה שהחליט להעמיד מועמד
        בסימולציה, הוא שקובע את מטרת ההערכה והוא שמחליט מה לעשות עם התוצאה. ManaGame פועלת עבורו
        כמחזיקה בתשתית ומעבדת את המידע לפי הנחיותיו. חלוקת התפקידים הזו קובעת גם למי מועמד פונה
        בבקשת עיון או מחיקה: לארגון שזימן אותו.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">אילו נתונים נאספים</h2>
      <ul className="list-disc ps-6 space-y-2 text-mg-text-secondary leading-relaxed mb-4">
        <li>
          <strong>זיהוי:</strong> שם המועמד, וכתובת אימייל אם נמסרה. אין איסוף של מספר תעודת זהות,
          פרטי תשלום, מיקום או קבצים.
        </li>
        <li>
          <strong>תוכן ההחלטות:</strong> הטקסט החופשי המלא שהמועמד כתב בכל תור.
        </li>
        <li>
          <strong>תמליל השיחה:</strong> כשהמערכת פועלת במצב סוכן שיחה — כל ההודעות משני הצדדים.
        </li>
        <li>
          <strong>הערכה:</strong> ציון לכל קריטריון ברובריקה, משפט הראיה שממנו נגזר, וסימון להחלטות
          שהופנו לבדיקה אנושית.
        </li>
        <li>
          <strong>מצב הסימולציה:</strong> ערכי מדדים, תור נוכחי וסטטוס.
        </li>
        <li>
          <strong>פניות מהאתר:</strong> שם, אימייל, תפקיד, ארגון, גודל ארגון וטקסט הפנייה.
        </li>
        <li>
          <strong>מדידת שימוש:</strong> נתוני ביצועים ותנועה מצרפיים באמצעות Vercel Analytics. אין
          קוקיז שיווקיים, אין פיקסלים של רשתות חברתיות ואין פרופיילינג פרסומי.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">למי המידע מועבר</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame אינה מוכרת מידע ואינה משתמשת בנתוני מועמדים למטרה שאינה ההערכה שלשמה נאספו. שלושה
        גורמים מקבלים מידע כחלק מהפעלת השירות:
      </p>
      <ul className="list-disc ps-6 space-y-2 text-mg-text-secondary leading-relaxed mb-4">
        <li>
          <strong>Anthropic</strong> — כשמצב הסוכן פעיל, טקסט ההחלטה ותוכן התור נשלחים למודל לצורך
          שיחה והערכה. <strong>שם המועמד וכתובת האימייל אינם נשלחים.</strong>
        </li>
        <li>
          <strong>Make.com</strong> — כשמוגדרת אינטגרציית התראות, נשלחת הודעה בסיום סשן או בסימון
          לבדיקה, הכוללת שם מועמד, שם התרחיש, ציונים וקישור לדוח.
        </li>
        <li>
          <strong>Vercel</strong> — ספק ההרצה והאחסון של השירות.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">אבטחת מידע</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אזור המעריך והניהול מוגן מאחורי שכבת הרשאות, ואינו נגיש למנועי חיפוש. תמונת מצב הסשן
        שנשמרת בדפדפן המועמד חתומה קריפטוגרפית, כך שלא ניתן לערוך אותה כדי לזייף התקדמות או ציון.
        התעבורה מוצפנת, ומוגדרות מדיניות אבטחת תוכן וכותרות הגנה בדפדפן. פירוט הנדסי מלא של זרימות
        המידע והפערים שנותרו מתוחזק בריפו של המוצר.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">משך שמירה</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        מדיניות שימור מוגדרת נקבעת מול הארגון המזמין כחלק מההתקשרות. כברירת מחדל המערכת אינה מוחקת
        נתוני הערכה באופן אוטומטי, ולכן אנו ממליצים לארגון לקבוע תקופת שמירה מפורשת לפני תחילת
        השימוש ולא אחריו.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">זכויות המועמד</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        לפי חוק הגנת הפרטיות, התשמ&quot;א-1981, לרבות תיקון 13 שנכנס לתוקף באוגוסט 2025, עומדות
        למי שהמידע נוגע אליו זכות עיון במידע שנשמר עליו, זכות לבקש את תיקונו אם הוא שגוי או לא
        מעודכן, וזכות לבקש את מחיקתו בנסיבות המנויות בחוק. במערכות הערכה קיימת גם חשיבות מיוחדת
        לשקיפות לגבי אופן הפקת ההערכה.
      </p>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        פנייה למימוש זכות מופנית <strong>לארגון שזימן את המועמד להערכה</strong>, שהוא בעל המאגר.
        ManaGame מסייעת לארגון לאתר ולהפיק את המידע הרלוונטי.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">החלטות אוטומטיות</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame אינה מקבלת החלטת העסקה. היא מפיקה ראיות והערכה מובנית, וההחלטה נשארת בידי הארגון
        והמעריך האנושי. ציון התהליך מחושב במנגנון אגרגציה דטרמיניסטי — אותם נתונים מפיקים תמיד את
        אותו ציון. החלטות שהמערכת לא הצליחה לסווג בביטחון מסומנות במפורש להכרעה אנושית ואינן
        מוכרעות אוטומטית.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">יצירת קשר</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        לשאלות בנוגע לטיפול במידע ניתן לפנות דרך <Link href="/contact" className="text-mg-teal hover:underline">עמוד יצירת הקשר</Link>.
      </p>
    </article>
  );
}

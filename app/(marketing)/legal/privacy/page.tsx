import { Alert } from "@/components/ui/alert";

export const metadata = {
  title: "מדיניות פרטיות",
  description: "כיצד ManaGame אוספת, שומרת ומשתמשת במידע.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold mb-6">מדיניות פרטיות</h1>

      <Alert variant="info" className="mb-8">
        מסמך זה הינו טיוטה ראשונית ואינו מהווה ייעוץ משפטי.
      </Alert>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame היא פלטפורמת סימולציה לקבלת החלטות, המשמשת ארגונים בתהליכי הערכה ופיתוח. במהלך
        השימוש במערכת אנו אוספים כמה סוגי מידע: מידע על החלטות שמועמדים מקבלים בתוך הסימולציה,
        מידע טכני על מהלך הסשן (כגון תזמון, התקדמות בתרחיש ואירועים במערכת), ומידע שנמסר מרצון
        דרך טופס יצירת הקשר באתר.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">אילו נתונים נאספים</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        נתוני החלטת מועמד כוללים את הטקסט או הבחירות שנמסרו במהלך הסימולציה, וכן ראיות שנגזרות
        מהן לצורך הערכה. נתוני סשן כוללים מזהה סשן, תרחיש, וציוני מצב לאורך זמן. נתוני טופס יצירת
        קשר כוללים שם, תפקיד, ארגון, כתובת אימייל ותוכן פנייה חופשי, לפי מה שנמסר בטופס.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">כיצד נשמר המידע</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        מידע שנאסף בתוך סימולציה שייך לארגון שמפעיל אותה, ומאוחסן בהתאם להרשאות שאותו ארגון קבע.
        ManaGame אינה מוכרת מידע לצדדים שלישיים ואינה משתמשת בנתוני מועמדים למטרות שאינן קשורות
        להערכה שלשמה נאספו, אלא אם צוין אחרת מול הארגון הרלוונטי.
      </p>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אנו עובדים על גיבוש מדיניות פרטיות מלאה ומחייבת, שתפרט את משך השמירה, זכויות המשתמשים
        לעיון ומחיקה, ואמצעי האבטחה הננקטים. עד לפרסום הגרסה המלאה, לשאלות בנוגע לטיפול במידע ניתן
        לפנות אלינו ישירות דרך עמוד יצירת הקשר.
      </p>
    </article>
  );
}

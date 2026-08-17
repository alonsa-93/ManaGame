import { Alert } from "@/components/ui/alert";

export const metadata = {
  title: "תנאי שימוש — ManaGame",
  description: "תנאי השימוש בפלטפורמת ManaGame.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold mb-6">תנאי שימוש</h1>

      <Alert variant="info" className="mb-8">
        מסמך זה הינו טיוטה ראשונית ואינו מהווה ייעוץ משפטי.
      </Alert>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        השימוש בפלטפורמת ManaGame, לרבות הסימולציות, ממשקי הניהול ודוחות ההערכה, כפוף לתנאים אלה.
        גישה למערכת ניתנת לארגונים ולמשתמשים המורשים על ידם, ושימוש בה מהווה הסכמה לתנאים
        המפורטים בעמוד זה.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">שימוש הוגן במערכת</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אין להשתמש במערכת למטרה שאינה הערכה ופיתוח לגיטימיים, ואין לנסות לעקוף מנגנוני אבטחה,
        להעתיק את תוכן התרחישים, או לפעול בניגוד להרשאות שניתנו על ידי הארגון המפעיל. ManaGame
        רשאית להגביל או להשעות גישה במקרה של שימוש החורג מהתנאים הללו.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">גבולות האחריות</h2>
      <p className="text-mg-text-secondary leading-relaxed mb-4">
        ManaGame מספקת כלי תיעוד וניתוח שנועד לתמוך בשיקול הדעת של מעריכים אנושיים. המערכת אינה
        מקבלת החלטת העסקה במקום המעריך, ואינה מהווה תחליף לבדיקה, לראיון אנושי או לשיקול דעת
        מקצועי. כל החלטה על בסיס תוצרי המערכת היא באחריות הארגון והמעריך המשתמשים בה.
      </p>

      <p className="text-mg-text-secondary leading-relaxed mb-4">
        אנו עובדים על גיבוש תנאי שימוש מלאים ומחייבים, שיפרטו בין היתר את תנאי ההתקשרות עם ארגונים,
        זכויות קניין רוחני ומנגנוני יישוב מחלוקות. עד לפרסום הגרסה המלאה, לשאלות בנוגע לתנאים ניתן
        לפנות אלינו ישירות דרך עמוד יצירת הקשר.
      </p>
    </article>
  );
}

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stillTesting = [
  "התוקף המנבא של הסימולציות.",
  "האיכות והערך של שאלות ההמשך.",
  "הנורמות הנכונות להשוואה בין תפקידים ותרחישים.",
  "ההשפעה של שימוש במערכת על תהליכי גיוס אמיתיים.",
  "המשמעות הארגונית של מדדים שונים לאורך זמן.",
];

const beliefs = [
  { en: "Reality over theory", he: "מציאות לפני תיאוריה" },
  { en: "Evidence over impression", he: "ראיות לפני רושם" },
  { en: "Human judgment over automation", he: "שיקול דעת אנושי לפני אוטומציה" },
];

const trustMarkers = [
  "Human Review",
  "Privacy",
  "Security",
  "Accessibility",
  "Deterministic Engine",
  "No Automatic Hire Decision",
  "No Personality Claims",
  "No Ranking by Default",
];

export default function PhilosophyTrust() {
  return (
    <>
      <section id="what-we-know" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-semibold text-mg-text max-w-3xl">
          מה אנחנו יודעים.
        </h2>

        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          אנחנו יודעים שמנוע דטרמיניסטי מאפשר לשמור על עקביות של מצב ותוצאות כאשר תנאי
          ההרצה זהים. אנחנו יודעים שניתן לשמור רצף החלטות ולקשר אותו לראיות ולהתפתחויות
          שהתרחשו במהלך הסימולציה. אנחנו יודעים שניתן להשתמש ב-Human Review במצבים שבהם
          המערכת אינה בטוחה מספיק.
        </p>

        <Card className="mt-10 max-w-3xl border-mg-border shadow-none">
          <CardContent>
            <h3 className="text-xl font-semibold text-mg-text">מה אנחנו עדיין בודקים</h3>
            <p className="mt-3 text-mg-text-secondary leading-relaxed text-lg">
              אנחנו עדיין בודקים את:
            </p>
            <ul className="mt-3 list-disc pr-5 space-y-2 text-mg-text-secondary leading-relaxed text-lg">
              {stillTesting.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="philosophy" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-semibold text-mg-text max-w-3xl">
          למה בכלל בנינו את ManaGame?
        </h2>

        <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
          כי הרבה מאוד תהליכי הערכה מבקשים מאנשים לדבר על איך הם מקבלים החלטות. אנחנו
          רצינו לבדוק מה קורה כשלא מבקשים מהם להסביר מראש איזה מנהלים הם. פשוט נותנים להם
          להחליט. המצב משתנה. המידע משתנה. המשאבים משתנים. ואז צריך להחליט שוב.
        </p>

        <div className="mt-14 grid sm:grid-cols-3 gap-6">
          {beliefs.map((belief) => (
            <div key={belief.en} className="pt-4 border-t-2 border-mg-teal">
              <p className="text-lg font-semibold text-mg-text">{belief.en}</p>
              <p className="mt-1 text-mg-text-secondary">{belief.he}</p>
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-3xl text-xl text-mg-text leading-relaxed">
          החלטות טובות לא תמיד נראות טוב בזמן אמת. לפעמים הן נראות איטיות. לפעמים הן
          דורשות עוד מידע. לפעמים הן כוללות ויתור. לפעמים הן מסתיימות בתוצאה רעה. ולפעמים
          רק בדיעבד אפשר להבין למה החלטה מסוימת הייתה סבירה בתנאים שבהם התקבלה. לכן אנחנו
          לא מחפשים תשובה אחת. אנחנו מחפשים רצף.
        </p>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-semibold text-mg-text max-w-3xl">
          טכנולוגיה רצינית דורשת גם גבולות.
        </h2>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trustMarkers.map((marker) => (
            <div
              key={marker}
              className="flex items-center gap-2 rounded-mg-md border border-mg-border px-4 py-3"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-mg-text-secondary" aria-hidden />
              <span className="text-sm text-mg-text">{marker}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

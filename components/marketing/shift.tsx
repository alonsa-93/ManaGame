import { Card, CardContent } from "@/components/ui/card";

const oldQuestions = [
  "ספר לנו על מקרה שבו...",
  "איך אתה מתמודד עם לחץ?",
  "מה היית עושה אם...",
];

const newPrompts = [
  "זה המצב.",
  "זה המידע שיש לך.",
  "זה מה שהשתנה.",
  "מה אתה עושה עכשיו?",
];

export default function Shift() {
  return (
    <section id="shift" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text">
        <span className="block">לא עוד שאלה.</span>
        <span className="mg-gradient-text block mt-1">סיטואציה.</span>
      </h2>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent>
            <h3 className="text-sm font-medium text-mg-text-secondary tracking-wide">
              מה תהליכי מיון נוטים לשאול
            </h3>
            <ul className="mt-6 space-y-5">
              {oldQuestions.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="text-2xl leading-none text-mg-border select-none">
                    &rdquo;
                  </span>
                  <span className="text-lg leading-relaxed text-mg-text-secondary">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-sm font-medium text-mg-text-secondary tracking-wide">
              מה ManaGame עושה
            </h3>
            <ul className="mt-6 space-y-5">
              {newPrompts.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-mg-teal"
                    aria-hidden
                  />
                  <span className="text-lg leading-relaxed font-medium text-mg-text">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <p className="mt-14 max-w-3xl mx-auto text-center text-lg leading-relaxed text-mg-text-secondary">
        ההבדל אינו רק בצורה שבה השאלה מנוסחת. ההבדל הוא שהמערכת ממשיכה אחרי התשובה.
        החלטה אחת משנה את נקודת הפתיחה של ההחלטה הבאה.
      </p>
    </section>
  );
}

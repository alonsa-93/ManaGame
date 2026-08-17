import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const timeline = [
  "תור 01 · החלטה",
  "תור 02 · מידע",
  "תור 03 · אירוע",
  "תור 04 · הקצאה מחדש",
  "תור 05 · עצירה",
];

export default function EvidenceReview() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div id="evidence">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
            לא &quot;המערכת חושבת ש...&quot;
          </h2>
          <p className="mt-3 text-xl text-mg-teal font-medium">&quot;הנה מה שקרה.&quot;</p>

          <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
            במקום לכתוב: &quot;הוא נראה אסטרטגי.&quot; ManaGame מחפשת להגיע לראיות שאפשר
            לחזור אליהן. לדוגמה: &quot;בתור 4 הוא רכש מידע לפני שהתחייב למשאב.&quot; או:
            &quot;בתור 3 הוא בחר להקפיא יוזמה אחת כדי לשמר משאבים.&quot; המשמעות אינה נובעת
            רק מהמשפט. היא נבנית מתוך ההקשר שבו הוא נאמר, המצב שהיה באותו רגע ומה שקרה
            אחריו.
          </p>

          <div className="mt-14 flex items-center" aria-hidden>
            {timeline.map((label, i) => (
              <div key={label} className="flex flex-1 items-center last:flex-initial">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <span className="h-3 w-3 rounded-full bg-mg-teal" />
                  <span className="text-xs text-mg-text-secondary text-center whitespace-nowrap">
                    {label}
                  </span>
                </div>
                {i < timeline.length - 1 && (
                  <div className="flex-1 h-px bg-mg-border mx-2 -mt-6" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-xl">
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-mg-text">אבחון לפני פעולה</h3>
                <p className="mt-1 text-sm text-mg-text-secondary">
                  ציון: <span className="ltr-num">4/5</span>
                </p>
                <p className="mt-4 text-mg-text-secondary leading-relaxed">
                  <span className="font-medium text-mg-text">ראיה: </span>
                  &quot;רכש מידע לפני שהקצה משאבים משמעותיים.&quot;
                </p>
                <p className="mt-4 text-xs text-mg-text-secondary">
                  מקור: <span className="ltr-num">Turn 03</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div id="human-review">
          <Badge variant="review" className="text-sm">
            נדרשת בדיקה אנושית
          </Badge>

          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
            כשלא ברור — לא ממציאים.
          </h2>

          <p className="mt-6 max-w-3xl text-mg-text-secondary leading-relaxed text-lg">
            מערכת רצינית צריכה לדעת גם להגיד: &quot;אני לא בטוח.&quot; אם מהלך אינו ניתן
            לסיווג באופן מספק, אם קיימת אי-הסכמה בין הרצות השופט, אם חסרה ראיה או אם
            התרחש אירוע טכני חריג, ManaGame אינה אמורה להשלים את החסר באמצעות ניחוש.
            במקרים כאלה הסשן יכול לעבור לבדיקה אנושית.
          </p>
        </div>
      </section>
    </>
  );
}

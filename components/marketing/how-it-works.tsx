import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "מצב",
    body: "המערכת מציגה מצב עסקי הכולל זמן, כסף, אנשים, סיכון, מידע זמין, אילוצים ובעלי עניין.",
  },
  {
    number: "02",
    title: "החלטה",
    body: "המשתמש מחליט במילים שלו ומסביר מה הוא עושה, למה, עם אילו משאבים ומה הוא בוחר שלא לעשות.",
  },
  {
    number: "03",
    title: "תגובה",
    body: "המנוע מעדכן את מצב הסימולציה בהתאם לכללים שהוגדרו בתרחיש.",
  },
  {
    number: "04",
    title: "ראיות",
    body: "המערכת שומרת את רצף ההחלטות, המידע שנרכש, האירועים, השינויים והראיות שנוצרו לאורך הדרך.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
        מה באמת קורה בתוך הסימולציה?
      </h2>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mg-text-secondary">
        ManaGame בנויה סביב רעיון פשוט: החלטה טובה אינה מתקיימת בחלל ריק. היא מתקבלת
        בתוך מערכת. לכן כל סבב מתחיל במצב מסוים, עובר דרך החלטה, מעדכן את המערכת ומייצר
        נקודת פתיחה חדשה.
      </p>

      <div className="mt-14 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="hidden lg:block absolute top-8 right-0 left-0 h-px bg-mg-border"
          aria-hidden
        />
        {steps.map((step) => (
          <Card key={step.number} className="relative">
            <CardContent>
              <span className="ltr-num block text-2xl font-bold text-mg-teal">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-mg-text">{step.title}</h3>
              <p className="mt-2 text-mg-text-secondary leading-relaxed">{step.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

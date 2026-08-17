import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const examples = [
  {
    process: 84,
    outcome: 61,
    caption: "ההחלטה הייתה סבירה. המציאות התפתחה לרעה.",
  },
  {
    process: 52,
    outcome: 87,
    caption: "התוצאה הייתה טובה. זה לא אומר שההחלטה הייתה טובה.",
  },
];

export default function ProcessOutcome() {
  return (
    <section id="process-outcome" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
        החלטה טובה יכולה להיגמר רע.
      </h2>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mg-text-secondary">
        בעולם אמיתי, לא כל תוצאה טובה נולדה מהחלטה טובה, ולא כל תוצאה רעה מוכיחה שההחלטה
        הייתה גרועה. לפעמים מנהל מקבל החלטה סבירה בתנאים קשים, ואז אירוע בלתי צפוי משנה
        את המציאות. לפעמים תוצאה חיובית נוצרת למרות החלטה חלשה. לכן ManaGame מפרידה בין
        איכות התהליך לבין התוצאה שנוצרה.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example, i) => (
          <Card key={i} className="relative">
            <CardContent>
              <Badge variant="illustrative" className="absolute top-5 left-5">
                Demo Data
              </Badge>

              <div className="space-y-5">
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-mg-text">ציון תהליך</span>
                    <span className="ltr-num font-semibold text-mg-text">
                      {example.process}
                    </span>
                  </div>
                  <Progress value={example.process} className="mt-2" />
                </div>

                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-mg-text">ציון תוצאה</span>
                    <span className="ltr-num font-semibold text-mg-text">
                      {example.outcome}
                    </span>
                  </div>
                  <Progress value={example.outcome} className="mt-2" />
                </div>
              </div>

              <p className="mt-6 text-mg-text-secondary leading-relaxed">
                {example.caption}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

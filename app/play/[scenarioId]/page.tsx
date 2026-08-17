import { notFound } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { beginSessionAction } from "@/app/play/[scenarioId]/actions";
import { WhatToKnowToggle } from "@/components/candidate/what-to-know-toggle";
import { ROLE_LEVEL_LABEL_HE } from "@/lib/scenario-schema";

export default async function WelcomePage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();
  const domain = getDomain(scenario.domainKey);

  return (
    <div className="mx-auto max-w-2xl pt-6 sm:pt-14">
      <Card className="p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {domain && <Badge variant="mint">{domain.name_he}</Badge>}
          <Badge variant="neutral">{ROLE_LEVEL_LABEL_HE[scenario.roleLevel]}</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-mg-text leading-tight">ברוכים הבאים ל-ManaGame</h1>
        <p className="mt-3 text-lg text-mg-text-secondary">סימולציה קצרה של קבלת החלטות בתנאי אי-ודאות.</p>

        <div className="mt-6 space-y-4 text-mg-text-secondary leading-relaxed">
          <p>
            במהלך הסימולציה תקבלו מצבים עסקיים משתנים ותתבקשו להחליט מה הייתם עושים בכל שלב. אין צורך להשתמש בניסוחים
            מקצועיים מיוחדים, ואין צורך לנחש מה המערכת &quot;רוצה לשמוע&quot;.
          </p>
          <p>המטרה היא להבין את ההחלטה שלכם, את ההיגיון שמאחוריה ואת האופן שבו אתם מגיבים כאשר המציאות משתנה.</p>
          <p>
            משך הסימולציה הוא בדרך כלל {scenario.estimatedMinutes[0]}–{scenario.estimatedMinutes[1]} דקות, והיא כוללת
            מספר תורות שבהם המצב העסקי מתפתח.
          </p>
        </div>

        <form action={beginSessionAction.bind(null, scenarioId)} className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button type="submit" size="lg" className="sm:flex-1">
            מתחילים
          </Button>
          <WhatToKnowToggle />
        </form>
      </Card>

      <CardContent className="text-center mt-4">
        <p className="text-xs text-mg-text-secondary">
          {scenario.title_he} · {domain?.name_he}
        </p>
      </CardContent>
    </div>
  );
}

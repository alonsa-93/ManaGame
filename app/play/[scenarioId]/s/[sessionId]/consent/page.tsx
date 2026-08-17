import { notFound } from "next/navigation";
import Link from "next/link";
import { getScenario } from "@/content/scenarios";
import { getStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { consentAction } from "@/app/play/[scenarioId]/s/[sessionId]/actions";

export default async function ConsentPage({
  params,
}: {
  params: Promise<{ scenarioId: string; sessionId: string }>;
}) {
  const { scenarioId, sessionId } = await params;
  const scenario = getScenario(scenarioId);
  const session = await getStore().getSession(sessionId);
  if (!scenario || !session) notFound();

  return (
    <div className="mx-auto max-w-2xl pt-6 sm:pt-14">
      <Card className="p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-mg-text">לפני שמתחילים</h1>

        <div className="mt-5 space-y-4 text-mg-text-secondary leading-relaxed">
          <p>במהלך הסימולציה תתבקשו להתמודד עם מצב עסקי משתנה ולקבל החלטות במילים שלכם.</p>
          <p>
            הסימולציה אורכת בדרך כלל {scenario.estimatedMinutes[0]}–{scenario.estimatedMinutes[1]} דקות.
          </p>
          <p>ההחלטות והמידע שנוצרו במהלך הסשן נשמרים בהתאם למדיניות המערכת וההרשאות שהוגדרו לארגון.</p>
          <p>המידע עשוי להיות זמין למעריך ולמשתמשים מורשים בארגון, בהתאם להרשאות הגישה שהוגדרו.</p>
        </div>

        <Alert variant="info" title="חשוב לדעת" className="mt-6">
          ManaGame אינה מקבלת החלטת העסקה במקום המעריך. המערכת מספקת מידע, ראיות והערכות מובנות שנועדו לתמוך בשיקול
          דעת אנושי.
        </Alert>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <form action={consentAction.bind(null, scenarioId, sessionId)} className="sm:flex-1">
            <Button type="submit" size="lg" className="w-full">
              אני מסכים/ה ומתחיל/ה
            </Button>
          </form>
          <Link href="/" className="sm:flex-1">
            <Button type="button" variant="secondary" size="lg" className="w-full">
              לא עכשיו
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

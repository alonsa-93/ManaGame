import { notFound } from "next/navigation";
import Link from "next/link";
import { getScenario } from "@/content/scenarios";
import { resolveSession } from "@/lib/session-cache";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default async function CompletePage({
  params,
}: {
  params: Promise<{ scenarioId: string; sessionId: string }>;
}) {
  const { scenarioId, sessionId } = await params;
  const scenario = getScenario(scenarioId);
  const session = await resolveSession(sessionId);
  if (!scenario || !session) notFound();

  return (
    <div className="mx-auto max-w-2xl pt-10 sm:pt-20 text-center">
      <Card className="p-8 sm:p-12">
        <div className="mx-auto w-14 h-14 rounded-full bg-mg-mint flex items-center justify-center mb-6">
          <CheckCircle2 className="h-7 w-7 text-mg-teal" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-mg-text">סיימתם את הסימולציה</h1>
        <p className="mt-4 text-lg text-mg-text-secondary leading-relaxed">
          תודה. ההחלטות שלכם נשמרו והועברו למעריך בהתאם להרשאות שהוגדרו.
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button size="lg">סיום</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

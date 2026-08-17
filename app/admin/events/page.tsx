import { listScenarios } from "@/content/scenarios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminEventsPage() {
  const events = listScenarios().flatMap((s) =>
    s.turns
      .filter((t) => t.event_he)
      .map((t) => ({ scenario: s.title_he, scenarioId: s.id, turn: t.index, text: t.event_he! }))
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-mg-text mb-1">אירועים</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        כל האירועים (&quot;עדכון חדש&quot;) המוגדרים בתרחישי המערכת, כולל הסתעפויות המוגדרות ברמת האפשרות.
      </p>
      <div className="space-y-3">
        {events.map((e, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neutral">{e.scenario}</Badge>
              <Badge variant="sand" className="ltr-num">
                תור {e.turn}
              </Badge>
            </div>
            <p className="text-sm text-mg-text-secondary whitespace-pre-line">{e.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

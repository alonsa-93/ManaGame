import Link from "next/link";
import { getStore } from "@/lib/store";
import { getScenario } from "@/content/scenarios";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CRITERIA } from "@/lib/scenario-schema";
import type { SessionRecord } from "@/lib/store/types";

export const dynamic = "force-dynamic";

type CriteriaScore = { criterion: string; label_he: string; measured: boolean; score100: number | null };

function scoresOf(criteriaScores: unknown): Map<string, number | null> {
  const rows = (criteriaScores as CriteriaScore[] | undefined) ?? [];
  return new Map(rows.map((r) => [r.criterion, r.measured ? r.score100 : null]));
}

function label(session: SessionRecord): string {
  return `${session.candidateName ?? "ללא שם"} · ${new Date(session.createdAt).toLocaleDateString("he-IL")}`;
}

export default async function ComparisonPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const store = getStore();
  const sessions = (await store.listSessions()).filter((s) => s.status === "completed");

  // Only same-scenario pairs are comparable at all — the D7 rule below.
  const byScenario = new Map<string, SessionRecord[]>();
  for (const s of sessions) {
    byScenario.set(s.scenarioId, [...(byScenario.get(s.scenarioId) ?? []), s]);
  }
  const comparable = [...byScenario.entries()].filter(([, list]) => list.length >= 2);

  const left = sessions.find((s) => s.id === a);
  const right = sessions.find((s) => s.id === b);
  const validPair = left && right && left.id !== right.id && left.scenarioId === right.scenarioId;

  const [leftReport, rightReport] = validPair
    ? await Promise.all([store.getReport(left.id), store.getReport(right.id)])
    : [null, null];

  const scenario = validPair ? getScenario(left.scenarioId) : undefined;
  // Outcome depends on the environment's random draw, so it is only directly
  // comparable when both runs were seeded identically.
  const sameSeed = validPair ? left.seed === right.seed : false;

  const leftScores = scoresOf(leftReport?.criteriaScores);
  const rightScores = scoresOf(rightReport?.criteriaScores);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">השוואה</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        השוואה בין מועמדים אינה דירוג. היא כלי לבחינת הבדלים התנהגותיים בתוך אותו תרחיש.
      </p>

      {comparable.length === 0 ? (
        <Card className="p-6 mb-6">
          <div className="rounded-mg-md border border-mg-border">
            <EmptyState
              title="עדיין אין זוג סשנים שניתן להשוות."
              description="נדרשים לפחות שני סשנים שהושלמו על אותו תרחיש. סשנים על תרחישים שונים אינם ברי-השוואה."
            />
          </div>
        </Card>
      ) : (
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-medium text-mg-text mb-3">בחרו זוג להשוואה</h2>
          <div className="space-y-4">
            {comparable.map(([scenarioId, list]) => (
              <div key={scenarioId}>
                <div className="text-sm text-mg-text-secondary mb-2">{getScenario(scenarioId)?.title_he ?? scenarioId}</div>
                <div className="flex flex-wrap gap-2">
                  {list.flatMap((first, i) =>
                    list.slice(i + 1).map((second) => (
                      <Link
                        key={`${first.id}-${second.id}`}
                        href={`/assessor/comparison?a=${first.id}&b=${second.id}`}
                        className={`rounded-mg-sm border px-3 py-1.5 text-xs transition-colors ${
                          validPair && left.id === first.id && right.id === second.id
                            ? "border-mg-teal bg-mg-mint text-mg-text"
                            : "border-mg-border text-mg-text-secondary hover:border-mg-teal"
                        }`}
                      >
                        {label(first)} ↔ {label(second)}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {validPair && (
        <>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-mg-text mb-1">{scenario?.title_he}</h2>
            <p className="text-sm text-mg-text-secondary mb-5">
              {label(left)} מול {label(right)}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mg-border text-mg-text-secondary">
                    <th className="py-2.5 font-medium text-start">קריטריון</th>
                    <th className="py-2.5 font-medium text-start">{left.candidateName ?? "א׳"}</th>
                    <th className="py-2.5 font-medium text-start">{right.candidateName ?? "ב׳"}</th>
                    <th className="py-2.5 font-medium text-start">פער</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-mg-border">
                    <td className="py-2.5 text-mg-text font-medium">ציון תהליך</td>
                    <td className="py-2.5 ltr-num text-mg-text">{leftReport?.processScore ?? "—"}</td>
                    <td className="py-2.5 ltr-num text-mg-text">{rightReport?.processScore ?? "—"}</td>
                    <td className="py-2.5 ltr-num text-mg-text-secondary">
                      {leftReport?.processScore != null && rightReport?.processScore != null
                        ? Math.abs(leftReport.processScore - rightReport.processScore)
                        : "—"}
                    </td>
                  </tr>
                  {CRITERIA.map((c) => {
                    const l = leftScores.get(c.key) ?? null;
                    const r = rightScores.get(c.key) ?? null;
                    return (
                      <tr key={c.key} className="border-b border-mg-border last:border-0">
                        <td className="py-2.5 text-mg-text-secondary">{c.label_he}</td>
                        <td className="py-2.5 ltr-num text-mg-text">{l ?? <span className="text-mg-text-secondary">לא נמדד</span>}</td>
                        <td className="py-2.5 ltr-num text-mg-text">{r ?? <span className="text-mg-text-secondary">לא נמדד</span>}</td>
                        <td className="py-2.5 ltr-num text-mg-text-secondary">
                          {l != null && r != null ? Math.abs(l - r) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-mg-text">ציון תוצאה</h2>
              <Badge variant={sameSeed ? "mint" : "sand"}>{sameSeed ? "Seed זהה" : "Seed שונה"}</Badge>
            </div>
            {sameSeed ? (
              <p className="text-sm text-mg-text">
                <span className="ltr-num">{leftReport?.outcomeScore ?? "—"}</span> מול{" "}
                <span className="ltr-num">{rightReport?.outcomeScore ?? "—"}</span>
              </p>
            ) : (
              <p className="text-sm text-mg-text-secondary leading-relaxed">
                הריצות מבוססות על Seed שונה ולכן ציון התוצאה אינו מוצג כהשוואה ישירה. ציון התהליך שלמעלה
                נותר בר-השוואה.
              </p>
            )}
          </Card>
        </>
      )}

      <Alert variant="info" title="כלל ההשוואה (D7 / Seed)">
        השוואת ציון תהליך אפשרית כאשר זהות ה-D7 מתקיימת. השוואת ציון תוצאה אפשרית רק כאשר גם זהות ה-Seed מתקיימת. אם
        ה-Seed שונה בין הריצות, ציון התוצאה לא יוצג כהשוואה ישירה — &quot;הריצות מבוססות על Seed שונה ולכן ציון
        התוצאה אינו מוצג כהשוואה ישירה.&quot; ציון התהליך עשוי להישאר ניתן להשוואה בהתאם לכללי המערכת.
      </Alert>
    </div>
  );
}

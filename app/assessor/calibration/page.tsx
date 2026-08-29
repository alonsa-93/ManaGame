import { getStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { CRITERIA } from "@/lib/scenario-schema";
import { CalibrationAnchorsPanel } from "@/components/assessor/calibration-anchors-panel";

export const dynamic = "force-dynamic";

type CriteriaScore = { criterion: string; measured: boolean; score100: number | null };

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** Population standard deviation, rounded. Null below two samples. */
function spread(values: number[]): number | null {
  if (values.length < 2) return null;
  const m = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
  return Math.round(Math.sqrt(variance));
}

export default async function CalibrationPage() {
  const store = getStore();
  const sessions = (await store.listSessions()).filter((s) => s.status === "completed");
  const reports = (await Promise.all(sessions.map((s) => store.getReport(s.id)))).filter(
    (r): r is NonNullable<typeof r> => r !== null
  );

  // criterion -> every score it has ever received
  const observed = new Map<string, number[]>(CRITERIA.map((c) => [c.key, []]));
  for (const report of reports) {
    for (const row of (report.criteriaScores as CriteriaScore[] | undefined) ?? []) {
      if (row.measured && typeof row.score100 === "number") {
        observed.get(row.criterion)?.push(row.score100);
      }
    }
  }

  const processScores = reports.map((r) => r.processScore).filter((v): v is number => v !== null);
  const unscored = reports.filter((r) => r.processScore === null).length;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">כיול</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        כיול משמש לבדיקת עקביות בין הרצות שופט ולבחינת רגישות הרובריקה לאורך זמן.
      </p>

      <CalibrationAnchorsPanel />

      {reports.length === 0 ? (
        <Card className="p-6">
          <div className="rounded-mg-md border border-mg-border">
            <EmptyState
              title="עדיין אין נתוני כיול מבוססי־סשנים להצגה."
              description="עוגני הכיול למעלה זמינים כבר עכשיו. כשיצטברו סשנים שהושלמו, פילוח הכיסוי והפיזור של הרובריקה יופיע כאן."
            />
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-mg-text mb-4">בסיס הנתונים</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-mg-text-secondary">סשנים שהושלמו</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{reports.length}</div>
              </div>
              <div>
                <div className="text-mg-text-secondary">ציון תהליך חציוני</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{mean(processScores) ?? "—"}</div>
              </div>
              <div>
                <div className="text-mg-text-secondary">פיזור ציוני תהליך</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{spread(processScores) ?? "—"}</div>
              </div>
              <div>
                <div className="text-mg-text-secondary">ללא ציון תהליך</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{unscored}</div>
              </div>
            </div>
            {unscored > 0 && (
              <p className="mt-4 text-sm text-mg-text-secondary leading-relaxed">
                סשן ללא ציון תהליך הוא סשן שבו נמדדו פחות משלושה קריטריונים. אם המספר הזה אינו אפס, כדאי
                להריץ <code className="font-mono" dir="ltr">npm run lint:content</code> ולבדוק את התרחישים שבהם זה קרה.
              </p>
            )}
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-mg-text mb-1">כיסוי הרובריקה</h2>
            <p className="text-sm text-mg-text-secondary mb-5">
              קריטריון שנמדד לעיתים רחוקות אינו מבחין בין מועמדים. קריטריון שכל המועמדים מקבלים בו אותו
              ציון אינו מבחין ביניהם גם אם הוא נמדד תמיד.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mg-border text-mg-text-secondary">
                    <th className="py-2.5 font-medium text-start">קריטריון</th>
                    <th className="py-2.5 font-medium text-start">נמדד</th>
                    <th className="py-2.5 font-medium text-start">ממוצע</th>
                    <th className="py-2.5 font-medium text-start">פיזור</th>
                    <th className="py-2.5 font-medium text-start">הבחנה</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map((c) => {
                    const values = observed.get(c.key) ?? [];
                    const coverage = Math.round((values.length / reports.length) * 100);
                    const sd = spread(values);
                    // "Discriminating" needs both: measured on most runs, and
                    // producing different answers when it is.
                    const discriminating = coverage >= 60 && sd !== null && sd >= 8;
                    const tooFlat = coverage >= 60 && sd !== null && sd < 8;
                    return (
                      <tr key={c.key} className="border-b border-mg-border last:border-0">
                        <td className="py-2.5 text-mg-text">{c.label_he}</td>
                        <td className="py-2.5 ltr-num text-mg-text-secondary">{coverage}%</td>
                        <td className="py-2.5 ltr-num text-mg-text">{mean(values) ?? "—"}</td>
                        <td className="py-2.5 ltr-num text-mg-text-secondary">{sd ?? "—"}</td>
                        <td className="py-2.5">
                          {discriminating ? (
                            <Badge variant="mint">מבחין</Badge>
                          ) : tooFlat ? (
                            <Badge variant="sand">אחיד מדי</Badge>
                          ) : (
                            <Badge variant="neutral">נמדד מעט</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Alert variant="info" title="איך לקרוא את הטבלה">
            הנתונים כאן מתארים את הרובריקה, לא את המועמדים. &quot;נמדד מעט&quot; מצביע בדרך כלל על פער בתוכן
            התרחישים ולא על תכונה של המועמדים. &quot;אחיד מדי&quot; אומר שהקריטריון נמדד אבל כמעט כולם מקבלים
            בו את אותו ציון — כלומר הוא אינו תורם להבחנה, גם אם הוא נשמע חשוב.
          </Alert>
        </>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { getStore } from "@/lib/store";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { CRITERIA, CRITERIA_GROUP_LABEL_HE, ROLE_LEVEL_LABEL_HE, type CriterionDef } from "@/lib/scenario-schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { PrintReportButton } from "@/components/assessor/print-report-button";
import { ConversationTranscript } from "@/components/assessor/conversation-transcript";

export default async function ReportPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const store = getStore();
  const session = await store.getSession(sessionId);
  if (!session) notFound();
  const scenario = getScenario(session.scenarioId);
  if (!scenario) notFound();
  const domain = getDomain(scenario.domainKey);

  const [report, decisions, evidence, conversation] = await Promise.all([
    store.getReport(sessionId),
    store.listDecisions(sessionId),
    store.listEvidence(sessionId),
    store.listConversationMessages(sessionId),
  ]);

  const criteriaScores = (report?.criteriaScores as
    | { criterion: string; label_he: string; measured: boolean; score100: number | null }[]
    | undefined) ?? CRITERIA.map((c) => ({ criterion: c.key, label_he: c.label_he, measured: false, score100: null }));

  const groups: CriterionDef["group"][] = ["operational_financial", "ambiguity", "human_capital"];

  const flaggedDecisions = decisions.filter((d) => d.needsHumanReview);

  const advocacyDecisions = decisions
    .filter((d) => !d.needsHumanReview && d.matchedOptionKeys.length > 0)
    .slice(0, 3);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-mg-text-secondary mb-1">ManaGame · דוח סימולציית קבלת החלטות</p>
            <h1 className="text-2xl font-semibold text-mg-text">{session.candidateName ?? "מועמד ללא שם"}</h1>
          </div>
          <PrintReportButton />
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-mg-text-secondary">
          <span>תפקיד: {ROLE_LEVEL_LABEL_HE[scenario.roleLevel]}</span>
          <span>·</span>
          <span>
            תרחיש: {scenario.title_he} {domain && `(${domain.name_he})`}
          </span>
          <span>·</span>
          <span>
            תאריך: <span className="ltr-num">{new Date(session.createdAt).toLocaleDateString("he-IL")}</span>
          </span>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <p className="text-mg-text-secondary leading-relaxed">
          הדוח מסכם את רצף ההחלטות שנצפה במהלך הסימולציה, את השינויים שהתרחשו בסביבה ואת הראיות שנאספו לאורך התהליך.
        </p>
        <p className="text-mg-text-secondary leading-relaxed mt-2">
          הדוח אינו מהווה החלטת העסקה ואינו מחליף שיקול דעת אנושי. מטרתו לספק למעריך תמונה מובנית של ההתנהגות
          שנצפתה בתוך התרחיש הספציפי.
        </p>
      </Card>

      {flaggedDecisions.length > 0 && (
        <Alert variant="warning" title="נדרשת בדיקה אנושית" className="mb-6">
          המערכת זיהתה {flaggedDecisions.length} מהלכים שלא ניתן היה לפרש באופן אוטומטי בביטחון מלא (תור
          {" "}
          {flaggedDecisions.map((d) => d.turnIndex).join(", ")}). מומלץ לעבור על הראיות והנתונים שנשמרו לפני אישור
          הדוח.
        </Alert>
      )}

      {session.status !== "completed" ? (
        <Card className="p-6 mb-6">
          <p className="text-mg-text-secondary">הסשן עדיין בתהליך — הדוח הסופי יופיע לאחר השלמת הסימולציה.</p>
        </Card>
      ) : (
        <>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-mg-text mb-5">תהליך מול תוצאה</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-mg-text">ציון תהליך</span>
                  <span className="text-sm font-semibold text-mg-text ltr-num">
                    {report?.processScore ?? "—"} / 100
                  </span>
                </div>
                <Progress value={report?.processScore ?? 0} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-mg-text">ציון תוצאה</span>
                  <span className="text-sm font-semibold text-mg-text ltr-num">{report?.outcomeScore ?? 0} / 100</span>
                </div>
                <Progress value={report?.outcomeScore ?? 0} />
              </div>
            </div>
            <p className="text-sm text-mg-text-secondary leading-relaxed mt-5">
              ציון התהליך מתאר את איכות ההחלטות כפי שנצפו בתנאי הסימולציה. ציון התוצאה מתאר את מצב התוצאה שנוצר
              בעקבות התפתחות הסימולציה. השניים אינם זהים. החלטה סבירה יכולה להסתיים בתוצאה שלילית כאשר המציאות
              מתפתחת באופן בלתי צפוי. באופן דומה, תוצאה חיובית אינה בהכרח הוכחה לכך שההחלטה שהובילה אליה הייתה
              איכותית. לכן ManaGame מציגה את שני הממדים בנפרד.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-mg-text mb-1">ראיות לפי קריטריון</h2>
            <p className="text-sm text-mg-text-secondary mb-5">
              אנחנו לא מחפשים &quot;אישיות&quot;. אנחנו מחפשים התנהגויות שניתן לצפות בהן בתוך ההחלטות.
            </p>
            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group}>
                  <h3 className="text-sm font-semibold text-mg-text-secondary mb-3">{CRITERIA_GROUP_LABEL_HE[group]}</h3>
                  <div className="space-y-4">
                    {CRITERIA.filter((c) => c.group === group).map((c) => {
                      const cs = criteriaScores.find((x) => x.criterion === c.key);
                      const relatedEvidence = evidence.filter((e) => e.criterion === c.key);
                      return (
                        <div key={c.key} className="border-b border-mg-border last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-mg-text font-medium">{c.label_he}</span>
                            <span className="text-sm text-mg-text-secondary ltr-num">
                              {cs?.measured ? `${cs.score100}/100` : "לא נמדד בסשן זה"}
                            </span>
                          </div>
                          {relatedEvidence.length > 0 ? (
                            <ul className="space-y-1.5 mt-2">
                              {relatedEvidence.map((e) => (
                                <li key={e.id} className="text-sm text-mg-text-secondary leading-relaxed">
                                  <span className="text-mg-text">ראיה:</span> &quot;{e.evidenceHe}&quot;{" "}
                                  <span className="text-xs">
                                    (מקור: תור <span className="ltr-num">{e.sourceTurn}</span>)
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-mg-text-secondary/70">אין ראיה שנצפתה בסשן זה עבור קריטריון זה.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {advocacyDecisions.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-mg-text mb-1">שאלות שכדאי להעמיק בהן</h2>
              <p className="text-sm text-mg-text-secondary mb-5">
                הדוח לא נועד לסגור את השיחה. הוא נועד לשפר אותה.
              </p>
              <ul className="space-y-4">
                {advocacyDecisions.map((d) => (
                  <li key={d.id} className="text-mg-text-secondary leading-relaxed">
                    <span className="text-mg-text">
                      בתור {d.turnIndex} נבחרה החלטה שכללה &quot;{d.matchedOptionKeys.join(", ")}&quot;.
                    </span>{" "}
                    מה עמד מאחורי ההחלטה?
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      <ConversationTranscript messages={conversation} />

      <CardContent className="mt-2">
        <Badge variant="illustrative">Session ID: {session.id.slice(0, 8)}</Badge>
      </CardContent>
    </div>
  );
}

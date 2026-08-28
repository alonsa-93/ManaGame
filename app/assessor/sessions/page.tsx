import Link from "next/link";
import { getStore } from "@/lib/store";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ROLE_LEVEL_LABEL_HE } from "@/lib/scenario-schema";

// Session list must always reflect current data — never statically cached.
export const dynamic = "force-dynamic";

const STATUS_LABEL_HE: Record<string, string> = {
  not_started: "טרם החל",
  in_progress: "בתהליך",
  completed: "הושלם",
};

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ flagged?: string }>;
}) {
  const { flagged } = await searchParams;
  const onlyFlagged = flagged === "1";

  const store = getStore();
  // One aggregate for the whole table rather than a listDecisions call per
  // row — this column used to render a hardcoded em dash, which made every
  // session look clean whether or not it was.
  const [allSessions, reviewCounts] = await Promise.all([store.listSessions(), store.reviewFlagCounts()]);

  const flaggedTotal = allSessions.filter((s) => (reviewCounts[s.id] ?? 0) > 0).length;
  const sessions = onlyFlagged ? allSessions.filter((s) => (reviewCounts[s.id] ?? 0) > 0) : allSessions;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-mg-text mb-1">סשנים</h1>
      <p className="text-sm text-mg-text-secondary mb-4">כל הסשנים שנוצרו במערכת, מהחדש לישן.</p>

      {allSessions.length > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/assessor/sessions"
            className={`rounded-mg-sm px-3 py-1.5 transition-colors ${
              onlyFlagged ? "text-mg-text-secondary hover:text-mg-text" : "bg-mg-mint text-mg-text font-medium"
            }`}
          >
            הכול (<span className="ltr-num">{allSessions.length}</span>)
          </Link>
          <Link
            href="/assessor/sessions?flagged=1"
            className={`rounded-mg-sm px-3 py-1.5 transition-colors ${
              onlyFlagged ? "bg-mg-coral text-mg-text font-medium" : "text-mg-text-secondary hover:text-mg-text"
            }`}
          >
            דורשים בדיקה (<span className="ltr-num">{flaggedTotal}</span>)
          </Link>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="rounded-mg-lg border border-mg-border bg-white">
          <EmptyState
            title={onlyFlagged ? "אין סשנים שממתינים לבדיקה." : "עדיין אין סשנים להצגה."}
            description={
              onlyFlagged
                ? "החלטה מסומנת לבדיקה כשהמערכת לא הצליחה לסווג אותה בביטחון מספק."
                : "כשהסשן הראשון ייווצר, הוא יופיע כאן."
            }
          />
        </div>
      ) : (
        <div className="rounded-mg-lg border border-mg-border bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mg-border text-start text-mg-text-secondary">
                <th className="px-4 py-3 font-medium text-start">מועמד</th>
                <th className="px-4 py-3 font-medium text-start">תפקיד</th>
                <th className="px-4 py-3 font-medium text-start">תרחיש</th>
                <th className="px-4 py-3 font-medium text-start">סטטוס</th>
                <th className="px-4 py-3 font-medium text-start">בדיקה נדרשת</th>
                <th className="px-4 py-3 font-medium text-start">תאריך</th>
                <th className="px-4 py-3 font-medium text-start">דוח</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const scenario = getScenario(s.scenarioId);
                const domain = scenario ? getDomain(scenario.domainKey) : undefined;
                const flags = reviewCounts[s.id] ?? 0;
                return (
                  <tr key={s.id} className="border-b border-mg-border last:border-0 hover:bg-black/[.015]">
                    <td className="px-4 py-3 text-mg-text">{s.candidateName ?? "ללא שם"}</td>
                    <td className="px-4 py-3 text-mg-text-secondary">
                      {scenario ? ROLE_LEVEL_LABEL_HE[scenario.roleLevel] : "—"}
                    </td>
                    <td className="px-4 py-3 text-mg-text-secondary">
                      {scenario?.title_he} {domain && <span className="text-xs">· {domain.name_he}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === "completed" ? "mint" : "neutral"}>{STATUS_LABEL_HE[s.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {flags > 0 ? (
                        <Badge variant="coral">
                          <span className="ltr-num">{flags}</span> החלטות
                        </Badge>
                      ) : (
                        <span className="text-mg-text-secondary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-mg-text-secondary ltr-num">
                      {new Date(s.createdAt).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-4 py-3">
                      {s.status === "completed" ? (
                        <Link href={`/assessor/sessions/${s.id}`} className="text-mg-teal hover:underline">
                          לצפייה בדוח
                        </Link>
                      ) : (
                        <span className="text-mg-text-secondary">בתהליך</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

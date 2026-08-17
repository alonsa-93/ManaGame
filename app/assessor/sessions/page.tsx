import Link from "next/link";
import { getStore } from "@/lib/store";

// Session list must always reflect current data — never statically cached.
export const dynamic = "force-dynamic";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ROLE_LEVEL_LABEL_HE } from "@/lib/scenario-schema";

const STATUS_LABEL_HE: Record<string, string> = {
  not_started: "טרם החל",
  in_progress: "בתהליך",
  completed: "הושלם",
};

export default async function SessionsPage() {
  const sessions = await getStore().listSessions();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-mg-text mb-1">סשנים</h1>
      <p className="text-sm text-mg-text-secondary mb-6">כל הסשנים שנוצרו במערכת, מהחדש לישן.</p>

      {sessions.length === 0 ? (
        <div className="rounded-mg-lg border border-mg-border bg-white">
          <EmptyState
            title="עדיין אין סשנים להצגה."
            description="כשהסשן הראשון ייווצר, הוא יופיע כאן."
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
                    <td className="px-4 py-3 text-mg-text-secondary">—</td>
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

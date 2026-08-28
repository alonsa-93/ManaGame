import { getStore, hasDatabase } from "@/lib/store";
import { listScenarios } from "@/content/scenarios";
import { DOMAINS } from "@/content/domains";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentPingButton } from "@/components/admin/agent-ping-button";
import { isAuthEnabled } from "@/lib/auth/admin-session";
import { aiUsageSummary } from "@/lib/ai-usage";

// Otherwise this page (env-var/DB status) would be statically prerendered
// once at build time and never reflect the actual runtime environment.
export const dynamic = "force-dynamic";

const PURPOSE_LABEL_HE: Record<string, string> = {
  conversational_turn: "תור שיחה",
  decision_parse: "פענוח החלטה",
  connection_test: "בדיקת חיבור",
};

function usd(value: number): string {
  return value < 0.01 && value > 0 ? "< $0.01" : `$${value.toFixed(2)}`;
}

export default async function AdminSystemPage() {
  const db = hasDatabase();
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const usage = aiUsageSummary();

  const sessions = await getStore().listSessions();
  const completed = sessions.filter((s) => s.status === "completed").length;
  const inProgress = sessions.filter((s) => s.status === "in_progress").length;
  const costPerCompleted = completed > 0 ? usage.estimatedUsd / completed : null;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">מערכת</h1>
      <p className="text-sm text-mg-text-secondary mb-6">מצב תשתית, תוכן ועלויות.</p>

      <Card className="p-5 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">מסד נתונים</span>
          <Badge variant={db ? "mint" : "sand"}>{db ? "מחובר (Postgres)" : "In-process store (demo)"}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">הרשאות לאזור הפנימי</span>
          <Badge variant={isAuthEnabled() ? "mint" : "coral"}>
            {isAuthEnabled() ? "מוגן בסיסמה" : "פתוח — ADMIN_PASSWORD לא מוגדר"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">סוכן שיחה + שיפוט (AI)</span>
          <div className="flex items-center gap-3">
            <Badge variant={hasKey ? "mint" : "sand"}>
              {hasKey ? "מפתח מוגדר" : "מפענח דטרמיניסטי (heuristic)"}
            </Badge>
            {hasKey && <AgentPingButton />}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">התראות ל-Make</span>
          <Badge variant={process.env.MAKE_WEBHOOK_URL ? "mint" : "sand"}>
            {process.env.MAKE_WEBHOOK_URL ? "מחובר" : "לא מוגדר"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">תחומים</span>
          <span className="text-sm text-mg-text-secondary ltr-num">{DOMAINS.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">תרחישים</span>
          <span className="text-sm text-mg-text-secondary ltr-num">{listScenarios().length}</span>
        </div>
      </Card>

      <Card className="p-5 mb-6">
        <h2 className="text-lg font-semibold text-mg-text mb-4">פעילות</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-mg-text-secondary">סשנים</div>
            <div className="text-2xl text-mg-text ltr-num mt-1">{sessions.length}</div>
          </div>
          <div>
            <div className="text-mg-text-secondary">הושלמו</div>
            <div className="text-2xl text-mg-text ltr-num mt-1">{completed}</div>
          </div>
          <div>
            <div className="text-mg-text-secondary">בתהליך</div>
            <div className="text-2xl text-mg-text ltr-num mt-1">{inProgress}</div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-mg-text mb-1">עלות AI</h2>
        <p className="text-sm text-mg-text-secondary mb-5 leading-relaxed">
          אומדן לפי מחירון רשמי ומספר הטוקנים שהוחזר בפועל מכל קריאה. המונים חיים בזיכרון התהליך ומתאפסים
          בכל פריסה מחדש או cold start — זה עונה על &quot;כמה עולה סשן עכשיו&quot;, ואינו תחליף לחשבונית.
        </p>

        {usage.calls === 0 ? (
          <p className="text-sm text-mg-text-secondary">
            {hasKey ? "עדיין לא בוצעו קריאות מאז העלייה האחרונה." : "לא מוגדר מפתח — אין קריאות ואין עלות."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-5">
              <div>
                <div className="text-mg-text-secondary">קריאות</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{usage.calls}</div>
              </div>
              <div>
                <div className="text-mg-text-secondary">טוקני קלט</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{usage.inputTokens.toLocaleString("en-US")}</div>
              </div>
              <div>
                <div className="text-mg-text-secondary">טוקני פלט</div>
                <div className="text-2xl text-mg-text ltr-num mt-1">{usage.outputTokens.toLocaleString("en-US")}</div>
              </div>
              <div>
                <div className="text-mg-text-secondary">עלות מוערכת</div>
                <div className="text-2xl text-mg-text ltr-num mt-1" dir="ltr">
                  {usd(usage.estimatedUsd)}
                </div>
              </div>
            </div>

            {costPerCompleted !== null && (
              <p className="text-sm text-mg-text mb-5">
                עלות ממוצעת לסשן שהושלם:{" "}
                <span className="ltr-num" dir="ltr">
                  {usd(costPerCompleted)}
                </span>
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mg-border text-mg-text-secondary">
                    <th className="py-2 font-medium text-start">סוג קריאה</th>
                    <th className="py-2 font-medium text-start">קריאות</th>
                    <th className="py-2 font-medium text-start">טוקנים</th>
                    <th className="py-2 font-medium text-start">עלות</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(usage.byPurpose).map(([purpose, b]) => (
                    <tr key={purpose} className="border-b border-mg-border last:border-0">
                      <td className="py-2 text-mg-text">{PURPOSE_LABEL_HE[purpose] ?? purpose}</td>
                      <td className="py-2 ltr-num text-mg-text-secondary">{b.calls}</td>
                      <td className="py-2 ltr-num text-mg-text-secondary">
                        {(b.inputTokens + b.outputTokens).toLocaleString("en-US")}
                      </td>
                      <td className="py-2 ltr-num text-mg-text-secondary" dir="ltr">
                        {usd(b.estimatedUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

import { hasDatabase } from "@/lib/store";
import { listScenarios } from "@/content/scenarios";
import { DOMAINS } from "@/content/domains";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentPingButton } from "@/components/admin/agent-ping-button";

// Otherwise this page (env-var/DB status) would be statically prerendered
// once at build time and never reflect the actual runtime environment.
export const dynamic = "force-dynamic";

export default function AdminSystemPage() {
  const db = hasDatabase();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">מערכת</h1>
      <p className="text-sm text-mg-text-secondary mb-6">מצב תשתית ותוכן.</p>

      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">מסד נתונים</span>
          <Badge variant={db ? "mint" : "sand"}>{db ? "מחובר (Postgres)" : "In-process store (demo)"}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mg-text">סוכן שיחה + שיפוט (AI)</span>
          <div className="flex items-center gap-3">
            <Badge variant={process.env.ANTHROPIC_API_KEY ? "mint" : "sand"}>
              {process.env.ANTHROPIC_API_KEY ? "מפתח מוגדר" : "מפענח דטרמיניסטי (heuristic)"}
            </Badge>
            {process.env.ANTHROPIC_API_KEY && <AgentPingButton />}
          </div>
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
    </div>
  );
}

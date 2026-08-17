import { hasDatabase } from "@/lib/store";
import { listScenarios } from "@/content/scenarios";
import { DOMAINS } from "@/content/domains";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <span className="text-sm text-mg-text">שכבת פרשנות (AI)</span>
          <Badge variant={process.env.ANTHROPIC_API_KEY ? "mint" : "sand"}>
            {process.env.ANTHROPIC_API_KEY ? "מודל שפה מחובר" : "מפענח דטרמיניסטי (heuristic)"}
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
    </div>
  );
}

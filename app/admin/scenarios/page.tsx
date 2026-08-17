import Link from "next/link";
import { listScenarios } from "@/content/scenarios";
import { DOMAINS } from "@/content/domains";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_LEVEL_LABEL_HE } from "@/lib/scenario-schema";

export default function AdminScenariosPage() {
  const scenarios = listScenarios();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold text-mg-text">תרחישים</h1>
        <Badge variant="neutral" className="ltr-num">
          {scenarios.length} תרחישים · {DOMAINS.length} תחומים
        </Badge>
      </div>
      <p className="text-sm text-mg-text-secondary mb-8">
        ספריית התרחישים של המערכת. כל תרחיש מוגדר ברמת תפקיד, קושי, KPI, תורות והסתעפויות.
      </p>

      <div className="space-y-10">
        {DOMAINS.map((domain) => {
          const domainScenarios = scenarios.filter((s) => s.domainKey === domain.key);
          if (domainScenarios.length === 0) return null;
          return (
            <div key={domain.key}>
              <h2 className="text-lg font-semibold text-mg-text mb-1">{domain.name_he}</h2>
              <p className="text-sm text-mg-text-secondary mb-4">{domain.description_he}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {domainScenarios.map((s) => (
                  <Card key={s.id} className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="mint">{ROLE_LEVEL_LABEL_HE[s.roleLevel]}</Badge>
                      <Badge variant="neutral" className="ltr-num">
                        קושי {s.difficulty}/5
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-mg-text">{s.title_he}</h3>
                    <p className="text-sm text-mg-text-secondary mt-1 leading-relaxed">{s.summary_he}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-mg-text-secondary ltr-num">
                      <span>{s.turns.length} תורות</span>
                      <span>·</span>
                      <span>
                        {s.estimatedMinutes[0]}–{s.estimatedMinutes[1]} דק&apos;
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/admin/scenarios/${s.id}`}>
                        <Button size="sm" variant="secondary">
                          עריכה ותצוגה
                        </Button>
                      </Link>
                      <Link href={`/play/${s.id}`}>
                        <Button size="sm" variant="ghost">
                          הפעלה כמועמד
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

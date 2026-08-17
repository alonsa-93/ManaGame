import { notFound } from "next/navigation";
import Link from "next/link";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CRITERIA, ROLE_LEVEL_LABEL_HE } from "@/lib/scenario-schema";
import { CheckCircle2 } from "lucide-react";

function DeltaPill({ kpiKey, value, unit }: { kpiKey: string; value: number; unit?: string }) {
  if (value === 0) return null;
  const positive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ltr-num ${
        positive ? "bg-mg-mint text-[#0f6a5f]" : "bg-mg-coral text-[#9a4340]"
      }`}
    >
      {kpiKey} {positive ? "+" : ""}
      {value}
      {unit}
    </span>
  );
}

export default async function ScenarioDetailPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();
  const domain = getDomain(scenario.domainKey);

  const usedCriteria = new Set(
    scenario.turns.flatMap((t) => t.options.flatMap((o) => Object.keys(o.criteriaSignals)))
  );

  const validation = [
    { label: "כל הקריטריונים הנדרשים ממופים", pass: usedCriteria.size >= 5 },
    { label: "KPI בעלי טווח (min/max) תקין", pass: scenario.kpis.every((k) => k.max > k.min) },
    { label: `מספר KPI גלוי (מקסימום 4)`, pass: scenario.kpis.length <= 4 },
    { label: "לכל תור יש לפחות 3 אפשרויות פעולה קנוניות", pass: scenario.turns.every((t) => t.options.length >= 3) },
    { label: "קיימת הסתעפות (nextEvent_he) לפחות פעם אחת", pass: scenario.turns.some((t) => t.options.some((o) => o.nextEvent_he)) },
    { label: "לכל אפשרות יש טקסט ראיה (evidence_he)", pass: scenario.turns.every((t) => t.options.every((o) => o.evidence_he.length > 0)) },
  ];
  const allPass = validation.every((v) => v.pass);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {domain && <Badge variant="mint">{domain.name_he}</Badge>}
            <Badge variant="neutral">{ROLE_LEVEL_LABEL_HE[scenario.roleLevel]}</Badge>
            <Badge variant="neutral" className="ltr-num">
              קושי {scenario.difficulty}/5
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-mg-text">{scenario.title_he}</h1>
          <p className="text-sm text-mg-text-secondary mt-1">{scenario.summary_he}</p>
        </div>
        <Link href={`/play/${scenario.id}`}>
          <Button variant="secondary">הפעלה כמועמד</Button>
        </Link>
      </div>

      <Card className="p-5 my-6">
        <h2 className="text-sm font-semibold text-mg-text-secondary mb-3">01 · KPI</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {scenario.kpis.map((k) => (
            <div key={k.key} className="rounded-mg-md border border-mg-border p-3">
              <div className="text-xs text-mg-text-secondary">{k.label_he}</div>
              <div className="text-sm text-mg-text mt-1 ltr-num">
                start: {k.start} · range: [{k.min}, {k.max}]
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-5">
        {scenario.turns.map((turn) => (
          <Card key={turn.index} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-mg-text">
                תור <span className="ltr-num">{turn.index}</span>
              </h3>
              {turn.event_he && <Badge variant="sand">עדכון חדש</Badge>}
            </div>
            <p className="text-sm text-mg-text-secondary leading-relaxed mb-3 whitespace-pre-line">{turn.situation_he}</p>
            {turn.event_he && (
              <p className="text-sm text-mg-text-secondary leading-relaxed mb-3 bg-mg-sand/50 rounded-mg-sm p-3 whitespace-pre-line">
                {turn.event_he}
              </p>
            )}

            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-semibold text-mg-text-secondary">אפשרויות פעולה (Delta Editor)</h4>
              {turn.options.map((opt) => (
                <div key={opt.key} className="rounded-mg-md border border-mg-border p-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-medium text-mg-text">{opt.label_he}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scenario.kpis.map((k) => (
                        <DeltaPill key={k.key} kpiKey={k.key} value={opt.deltas[k.key] ?? 0} />
                      ))}
                      {opt.nextEvent_he && <Badge variant="blue">מסתעף</Badge>}
                    </div>
                  </div>
                  <p className="text-xs text-mg-text-secondary mt-2">ראיה: {opt.evidence_he}</p>
                  {Object.keys(opt.criteriaSignals).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(opt.criteriaSignals).map(([k, v]) => (
                        <span key={k} className="text-[11px] text-mg-text-secondary bg-black/[.03] rounded-full px-2 py-0.5 ltr-num">
                          {CRITERIA.find((c) => c.key === k)?.label_he ?? k}: {v}/5
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 mt-6">
        <h2 className="text-sm font-semibold text-mg-text-secondary mb-3">Validation</h2>
        <ul className="space-y-2">
          {validation.map((v) => (
            <li key={v.label} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`h-4 w-4 ${v.pass ? "text-mg-success" : "text-mg-text-secondary/40"}`} />
              <span className={v.pass ? "text-mg-text" : "text-mg-text-secondary"}>{v.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button disabled={!allPass}>{allPass ? "Publish" : "Publish (חסום עד לעמידה בכל הבדיקות)"}</Button>
        </div>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { CRITERIA, CRITERIA_GROUP_LABEL_HE, type CriterionDef } from "@/lib/scenario-schema";

const GROUPS: CriterionDef["group"][] = ["operational_financial", "ambiguity", "human_capital"];

export default function AdminRubricPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-mg-text mb-1">רובריקה</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        תשעת הקריטריונים הקבועים שבהם נעשה שימוש בכל התרחישים במערכת. קריטריונים אלה מאפשרים דוחות וראיות
        השוואתיים בין תרחישים ותחומים שונים.
      </p>
      <div className="grid sm:grid-cols-3 gap-5">
        {GROUPS.map((group) => (
          <Card key={group} className="p-5">
            <h2 className="text-sm font-semibold text-mg-text-secondary mb-3">{CRITERIA_GROUP_LABEL_HE[group]}</h2>
            <ul className="space-y-2">
              {CRITERIA.filter((c) => c.group === group).map((c) => (
                <li key={c.key} className="text-sm text-mg-text">
                  {c.label_he}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

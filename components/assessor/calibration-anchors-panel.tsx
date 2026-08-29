import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CRITERIA, CRITERIA_GROUP_LABEL_HE, type CriterionDef } from "@/lib/scenario-schema";
import { CALIBRATION_ANCHORS } from "@/content/calibration-anchors";

const GROUPS: CriterionDef["group"][] = ["operational_financial", "ambiguity", "human_capital"];

/**
 * Anchor answers, one low/mid/high example per criterion — what the plan
 * asked for: something concrete an assessor compares a candidate's evidence
 * sentence against before agreeing or disagreeing with the model's score.
 *
 * Static reference content, not derived from session data, so it renders
 * unconditionally: it's exactly as useful before the first session completes
 * as after the thousandth.
 */
export function CalibrationAnchorsPanel() {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-semibold text-mg-text mb-1">עוגני כיול</h2>
      <p className="text-sm text-mg-text-secondary mb-6 leading-relaxed">
        דוגמה אחת לכל רמת ציון בכל קריטריון — לא ציטוטים מתרחיש אמיתי, אלא עוגן להשוואה. כשהראיה בדוח
        קרובה יותר לדוגמה הגבוהה או לנמוכה, זה סימן להסכים עם הציון; כשהיא לא דומה לאף אחת מהן, זה סימן
        לבדוק לעומק.
      </p>

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-mg-text-secondary mb-3">{CRITERIA_GROUP_LABEL_HE[group]}</h3>
            <div className="space-y-5">
              {CRITERIA.filter((c) => c.group === group).map((c) => {
                const anchors = CALIBRATION_ANCHORS[c.key];
                return (
                  <div key={c.key} className="rounded-mg-md border border-mg-border p-4">
                    <div className="text-sm font-medium text-mg-text mb-3">{c.label_he}</div>
                    <div className="space-y-2.5">
                      {(
                        [
                          ["low", "נמוך", "coral"],
                          ["mid", "בינוני", "sand"],
                          ["high", "גבוה", "mint"],
                        ] as const
                      ).map(([band, label, variant]) => {
                        const a = anchors[band];
                        return (
                          <div key={band} className="flex items-start gap-3">
                            <Badge variant={variant} className="shrink-0 mt-0.5 ltr-num">
                              {label} · {a.score}
                            </Badge>
                            <div className="text-sm">
                              <p className="text-mg-text leading-relaxed">{a.example_he}</p>
                              <p className="text-mg-text-secondary text-xs mt-0.5">{a.rationale_he}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

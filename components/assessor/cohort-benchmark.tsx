import { Card } from "@/components/ui/card";
import { cohortStats, describePercentile, MIN_COHORT, percentileRank } from "@/lib/engine/benchmarks";

/**
 * Where this run sits among other runs of the same scenario.
 *
 * Renders nothing at all below MIN_COHORT — a percentile drawn from a handful
 * of runs is a lie told with a real number, and an assessor who sees "top
 * quartile" has no way to know it meant "best of four".
 */
export function CohortBenchmark({
  processScore,
  cohort,
  scenarioTitle,
}: {
  processScore: number | null;
  cohort: number[];
  scenarioTitle: string;
}) {
  if (processScore === null) return null;

  const rank = percentileRank(processScore, cohort);
  const stats = cohortStats(cohort);
  if (rank === null || stats === null) return null;

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-semibold text-mg-text mb-1">מיקום מול ריצות אחרות</h2>
      <p className="text-sm text-mg-text-secondary mb-5">
        מבוסס על <span className="ltr-num">{stats.count}</span> ריצות שהושלמו בתרחיש &quot;{scenarioTitle}&quot;.
        ההשוואה תקפה בתוך התרחיש הזה בלבד.
      </p>

      <p className="text-mg-text mb-5">
        ציון התהליך <span className="ltr-num font-medium">{processScore}</span> נמצא {describePercentile(rank)}.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-mg-text-secondary">רבעון תחתון</div>
          <div className="text-mg-text ltr-num mt-0.5">{stats.q1}</div>
        </div>
        <div>
          <div className="text-mg-text-secondary">חציון</div>
          <div className="text-mg-text ltr-num mt-0.5">{stats.median}</div>
        </div>
        <div>
          <div className="text-mg-text-secondary">רבעון עליון</div>
          <div className="text-mg-text ltr-num mt-0.5">{stats.q3}</div>
        </div>
        <div>
          <div className="text-mg-text-secondary">טווח</div>
          <div className="text-mg-text ltr-num mt-0.5">
            {stats.min}–{stats.max}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-mg-text-secondary leading-relaxed">
        אחוזון אינו ציון ואינו המלצה. הוא מתאר את פיזור הריצות שנאספו עד כה, ומוצג רק כשיש לפחות{" "}
        <span className="ltr-num">{MIN_COHORT}</span> ריצות — מתחת לזה המספר מטעה יותר משהוא מסביר.
      </p>
    </Card>
  );
}

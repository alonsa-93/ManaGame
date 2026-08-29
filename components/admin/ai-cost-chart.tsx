import type { AiUsageDay } from "@/lib/ai-usage";

/**
 * Daily AI spend. Single series (estimated USD) — bars, not a line: each day
 * is a discrete, independent total, not a continuous quantity, so a bar
 * correctly implies no interpolation between days the way a line would.
 */
export function AiCostChart({ days }: { days: AiUsageDay[] }) {
  if (days.length < 2) {
    return <p className="text-sm text-mg-text-secondary">נדרשים לפחות שני ימים עם קריאות כדי לצייר מגמה.</p>;
  }

  const width = 640;
  const height = 160;
  const padTop = 16;
  const padBottom = 28;
  const padStart = 40;
  const padEnd = 8;
  const plotW = width - padStart - padEnd;
  const plotH = height - padTop - padBottom;

  const maxUsd = Math.max(...days.map((d) => d.estimatedUsd), 0.01);
  const barSlot = plotW / days.length;
  const barWidth = Math.min(24, barSlot - 4); // capped, never fills the slot — see marks-and-anatomy.

  const y = (usd: number) => padTop + plotH - (usd / maxUsd) * plotH;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="עלות AI יומית משוערת">
        <line x1={padStart} x2={width - padEnd} y1={padTop + plotH} y2={padTop + plotH} stroke="var(--mg-border)" strokeWidth={1} />
        <text x={0} y={padTop + plotH + 4} fontSize={10} fill="var(--mg-text-secondary)">
          $0
        </text>
        <text x={0} y={padTop + 4} fontSize={10} fill="var(--mg-text-secondary)">
          ${maxUsd.toFixed(2)}
        </text>

        {days.map((d, i) => {
          const barH = padTop + plotH - y(d.estimatedUsd);
          const cx = padStart + i * barSlot + barSlot / 2;
          return (
            <g key={d.date}>
              <rect
                x={cx - barWidth / 2}
                y={y(d.estimatedUsd)}
                width={barWidth}
                height={Math.max(barH, d.estimatedUsd > 0 ? 2 : 0)}
                rx={4}
                fill="var(--mg-gradient-from)"
              >
                <title>
                  {new Date(`${d.date}T00:00:00Z`).toLocaleDateString("he-IL")} · {d.calls} קריאות · $
                  {d.estimatedUsd.toFixed(3)}
                </title>
              </rect>
            </g>
          );
        })}
      </svg>

      <details className="mt-2">
        <summary className="text-xs text-mg-text-secondary cursor-pointer select-none">נתונים בטבלה</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-mg-text-secondary">
                <th className="text-start font-medium py-1">תאריך</th>
                <th className="text-start font-medium py-1">קריאות</th>
                <th className="text-start font-medium py-1">עלות משוערת</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date} className="border-t border-mg-border">
                  <td className="py-1 ltr-num">{new Date(`${d.date}T00:00:00Z`).toLocaleDateString("he-IL")}</td>
                  <td className="py-1 ltr-num">{d.calls}</td>
                  <td className="py-1 ltr-num" dir="ltr">
                    ${d.estimatedUsd.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

import type { ScoreTrendPoint } from "@/lib/engine/score-trend";

/**
 * Process score over time, across every completed session.
 *
 * Single series (process score) — no legend box; the title already says what
 * is plotted. Server-rendered SVG: no client JS, and the point values are
 * still inspectable via each dot's native `<title>` plus the table fallback
 * below, so nothing here depends on hover working.
 */
export function ScoreTrendChart({ points }: { points: ScoreTrendPoint[] }) {
  const scored = points.filter((p): p is ScoreTrendPoint & { processScore: number } => p.processScore !== null);

  if (scored.length < 2) {
    return (
      <p className="text-sm text-mg-text-secondary">
        נדרשות לפחות שתי סימולציות עם ציון תהליך כדי לצייר מגמה.
      </p>
    );
  }

  const width = 640;
  const height = 200;
  const padTop = 16;
  const padBottom = 28;
  const padStart = 8;
  const padEnd = 8;
  const plotW = width - padStart - padEnd;
  const plotH = height - padTop - padBottom;

  const x = (i: number) => padStart + (scored.length === 1 ? plotW / 2 : (i / (scored.length - 1)) * plotW);
  // Fixed 0–100 scale: the axis means the same thing on every render, so a
  // reader comparing two visits never has to re-read the axis first.
  const y = (score: number) => padTop + plotH - (score / 100) * plotH;

  const linePath = scored.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.processScore).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${x(scored.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${x(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  const last = scored[scored.length - 1]!;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="ציון תהליך לאורך זמן">
        {/* Gridlines: hairline, recessive, one step off the surface. */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line
              x1={padStart}
              x2={width - padEnd}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--mg-border)"
              strokeWidth={1}
            />
            <text x={0} y={y(tick) + 4} fontSize={10} fill="var(--mg-text-secondary)">
              {tick}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="var(--mg-teal)" opacity={0.1} />
        <path d={linePath} fill="none" stroke="var(--mg-teal)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {scored.map((p, i) => (
          <circle
            key={p.sessionId}
            cx={x(i)}
            cy={y(p.processScore)}
            r={i === scored.length - 1 ? 5 : 3}
            fill="var(--mg-teal)"
            stroke="var(--mg-surface)"
            strokeWidth={2}
          >
            <title>
              {new Date(p.date).toLocaleDateString("he-IL")} · ציון תהליך {p.processScore}
            </title>
          </circle>
        ))}

        {/* Endpoint label — the one point the story is about. */}
        <text
          x={x(scored.length - 1) - 6}
          y={y(last.processScore) - 10}
          fontSize={12}
          fontWeight={600}
          textAnchor="end"
          fill="var(--mg-text)"
        >
          {last.processScore}
        </text>
      </svg>

      <details className="mt-2">
        <summary className="text-xs text-mg-text-secondary cursor-pointer select-none">נתונים בטבלה</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-mg-text-secondary">
                <th className="text-start font-medium py-1">תאריך</th>
                <th className="text-start font-medium py-1">ציון תהליך</th>
              </tr>
            </thead>
            <tbody>
              {scored.map((p) => (
                <tr key={p.sessionId} className="border-t border-mg-border">
                  <td className="py-1 ltr-num">{new Date(p.date).toLocaleDateString("he-IL")}</td>
                  <td className="py-1 ltr-num">{p.processScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

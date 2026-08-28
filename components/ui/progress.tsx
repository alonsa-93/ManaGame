export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  /**
   * What this bar is measuring. Required in spirit: an ARIA progressbar with
   * no accessible name is announced as an unlabelled percentage, which tells a
   * screen-reader user nothing about what moved. Caught by Lighthouse's
   * aria-progressbar-name audit on every KPI bar on the homepage.
   */
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-black/[.06] ${className ?? ""}`}
      role="progressbar"
      aria-label={label ?? "התקדמות"}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full mg-gradient-bg rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`שלב ${current} מתוך ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i < current ? "bg-mg-teal" : "bg-black/[.08]"
          }`}
        />
      ))}
    </div>
  );
}

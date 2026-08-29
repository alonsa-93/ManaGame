import type { SessionRecord, ReportRecord } from "@/lib/store/types";

/** One completed session's scores, ordered for a trend chart. */
export interface ScoreTrendPoint {
  sessionId: string;
  /** ISO date the session completed, or its creation date as a fallback. */
  date: string;
  processScore: number | null;
  outcomeScore: number | null;
}

/**
 * Completed sessions paired with their reports, oldest first.
 *
 * Pure and store-agnostic on purpose: the caller (the /admin/system page)
 * already has both lists from the store, and keeping the pairing logic here
 * — rather than inline in the page — makes it directly testable without
 * spinning up a store.
 */
export function scoreTrend(sessions: SessionRecord[], reports: (ReportRecord | null)[]): ScoreTrendPoint[] {
  const points = sessions
    .map((session, i) => ({ session, report: reports[i] ?? null }))
    .filter(({ session }) => session.status === "completed")
    .map(({ session, report }) => ({
      sessionId: session.id,
      date: session.completedAt ?? session.createdAt,
      processScore: report?.processScore ?? null,
      outcomeScore: report?.outcomeScore ?? null,
    }));

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

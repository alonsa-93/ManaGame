/**
 * Token accounting for the Anthropic calls.
 *
 * Every conversational turn is billed, and until now nothing recorded how much.
 * That makes the running cost of an assessment unknowable — which matters both
 * for pricing the product and for noticing a regression that doubles the prompt.
 *
 * Counters live in the process, like the rate limiters, so a cold start resets
 * them. That is fine for what this answers ("what is a session costing right
 * now?") and wrong for accounting; the dashboard says so rather than implying
 * these are books.
 */

/**
 * USD per million tokens. These are list prices and they change — treat the
 * figure on the dashboard as an estimate, which is how it is labelled.
 */
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-5": { input: 3, output: 15 },
};

const DEFAULT_PRICING = { input: 3, output: 15 };

export interface AiCallRecord {
  model: string;
  purpose: "conversational_turn" | "decision_parse" | "connection_test";
  inputTokens: number;
  outputTokens: number;
  at: string;
}

export interface AiUsageSummary {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  estimatedUsd: number;
  byPurpose: Record<string, { calls: number; inputTokens: number; outputTokens: number; estimatedUsd: number }>;
  since: string | null;
}

export interface AiUsageDay {
  /** UTC calendar date, `YYYY-MM-DD`. */
  date: string;
  calls: number;
  estimatedUsd: number;
}

const MAX_RECORDS = 5000;

// Survives hot reload in dev the same way the memory store does.
const g = globalThis as unknown as { __managameAiUsage?: AiCallRecord[] };
const records: AiCallRecord[] = g.__managameAiUsage ?? (g.__managameAiUsage = []);

export function costOf(model: string, inputTokens: number, outputTokens: number): number {
  const price = PRICING[model] ?? DEFAULT_PRICING;
  return (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
}

/**
 * Never throws and never blocks: accounting must not be able to fail a
 * candidate's turn. Called with whatever `usage` the SDK returned, which can be
 * absent on some responses.
 *
 * `at` is a test seam for exercising aiUsageDaily()'s day-bucketing — real call
 * sites never pass it, so production timestamps are always the true call time.
 */
export function recordAiCall(record: Omit<AiCallRecord, "at"> & { at?: string }): void {
  try {
    records.push({ ...record, at: record.at ?? new Date().toISOString() });
    if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS);
  } catch {
    // Accounting is never worth an exception on the request path.
  }
}

export function aiUsageSummary(): AiUsageSummary {
  const byPurpose: AiUsageSummary["byPurpose"] = {};
  let inputTokens = 0;
  let outputTokens = 0;
  let estimatedUsd = 0;

  for (const r of records) {
    const cost = costOf(r.model, r.inputTokens, r.outputTokens);
    inputTokens += r.inputTokens;
    outputTokens += r.outputTokens;
    estimatedUsd += cost;

    const bucket = (byPurpose[r.purpose] ??= { calls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0 });
    bucket.calls += 1;
    bucket.inputTokens += r.inputTokens;
    bucket.outputTokens += r.outputTokens;
    bucket.estimatedUsd += cost;
  }

  return {
    calls: records.length,
    inputTokens,
    outputTokens,
    estimatedUsd,
    byPurpose,
    since: records[0]?.at ?? null,
  };
}

/**
 * Daily spend, oldest first, for the trend chart on /admin/system.
 *
 * Built from `records` directly rather than from `aiUsageSummary()`'s totals —
 * a running total has no shape over time, only a day-by-day bucketing does.
 * Days with zero calls between the first and last recorded day are included
 * with a zero, so a chart drawn from this never silently skips a gap.
 */
export function aiUsageDaily(): AiUsageDay[] {
  if (records.length === 0) return [];

  const byDay = new Map<string, { calls: number; estimatedUsd: number }>();
  for (const r of records) {
    const date = r.at.slice(0, 10); // UTC calendar date from the ISO timestamp.
    const bucket = byDay.get(date) ?? { calls: 0, estimatedUsd: 0 };
    bucket.calls += 1;
    bucket.estimatedUsd += costOf(r.model, r.inputTokens, r.outputTokens);
    byDay.set(date, bucket);
  }

  const days = [...byDay.keys()].sort();
  const first = new Date(`${days[0]}T00:00:00Z`);
  const last = new Date(`${days[days.length - 1]}T00:00:00Z`);

  const out: AiUsageDay[] = [];
  for (let d = new Date(first); d <= last; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    const bucket = byDay.get(date);
    out.push({ date, calls: bucket?.calls ?? 0, estimatedUsd: bucket?.estimatedUsd ?? 0 });
  }
  return out;
}

/** Test seam. */
export function resetAiUsage(): void {
  records.length = 0;
}

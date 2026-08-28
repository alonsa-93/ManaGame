import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getScenario } from "@/content/scenarios";
import { authenticateRequest } from "@/lib/api/auth";
import { toSessionSummary } from "@/lib/api/serialize";
import { createRateLimiter } from "@/lib/rate-limit";

// Reads live data; must never be cached at the edge.
export const dynamic = "force-dynamic";

/** Generous for a polling integration, low enough to bound a runaway loop. */
const limiter = createRateLimiter({ limit: 120, windowMs: 60 * 1000 });

export async function GET(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const gate = limiter.check(ip);
  if (!gate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(gate.retryAfterMs / 1000)) } }
    );
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");
  const scenarioFilter = url.searchParams.get("scenarioId");

  const store = getStore();
  const [sessions, flagCounts] = await Promise.all([store.listSessions(), store.reviewFlagCounts()]);

  const filtered = sessions.filter(
    (s) => (!statusFilter || s.status === statusFilter) && (!scenarioFilter || s.scenarioId === scenarioFilter)
  );

  // One getReport per session. Acceptable at this scale (listSessions caps at
  // 200) and worth revisiting as a join if the cap ever rises.
  const reports = await Promise.all(filtered.map((s) => store.getReport(s.id)));

  return NextResponse.json({
    data: filtered.map((s, i) => toSessionSummary(s, getScenario(s.scenarioId), reports[i]!, flagCounts[s.id] ?? 0)),
    count: filtered.length,
  });
}

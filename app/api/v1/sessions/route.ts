import { NextResponse } from "next/server";
import { getStore, hasDatabase } from "@/lib/store";
import { getScenario } from "@/content/scenarios";
import { authenticateRequest } from "@/lib/api/auth";
import { toSessionSummary } from "@/lib/api/serialize";
import { validateCreateSessionInput } from "@/lib/api/create-session-input";
import { createRateLimiter } from "@/lib/rate-limit";
import { startSession } from "@/lib/engine/session";
import { canonicalSiteUrl } from "@/lib/site-url";

// Reads live data; must never be cached at the edge.
export const dynamic = "force-dynamic";

/** Generous for a polling integration, low enough to bound a runaway loop. */
const listLimiter = createRateLimiter({ limit: 120, windowMs: 60 * 1000 });

/**
 * Stricter than the list limiter: creating a session is a heavier, billable
 * action (it becomes a real assessment invite, and — once ANTHROPIC_API_KEY
 * is set — a stream of paid model calls), not a cheap poll. Thirty per hour
 * comfortably covers a real ATS pushing candidates through in batches.
 */
const createLimiter = createRateLimiter({ limit: 30, windowMs: 60 * 60 * 1000 });

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const gate = listLimiter.check(clientIp(request));
  if (!gate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(gate.retryAfterMs / 1000)) } }
    );
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");
  const scenarioFilter = url.searchParams.get("scenarioId");
  const externalRefFilter = url.searchParams.get("externalRef");

  const store = getStore();
  const [sessions, flagCounts] = await Promise.all([store.listSessions(), store.reviewFlagCounts()]);

  const filtered = sessions.filter(
    (s) =>
      (!statusFilter || s.status === statusFilter) &&
      (!scenarioFilter || s.scenarioId === scenarioFilter) &&
      (!externalRefFilter || s.externalRef === externalRefFilter)
  );

  // One getReport per session. Acceptable at this scale (listSessions caps at
  // 200) and worth revisiting as a join if the cap ever rises.
  const reports = await Promise.all(filtered.map((s) => store.getReport(s.id)));

  return NextResponse.json({
    data: filtered.map((s, i) => toSessionSummary(s, getScenario(s.scenarioId), reports[i]!, flagCounts[s.id] ?? 0)),
    count: filtered.length,
  });
}

/**
 * Creates a session and returns the candidate-facing link — the other half
 * of "send a candidate to the simulation and get a report back" (the report
 * side is GET /api/v1/sessions/{id}, already read-only-safe).
 *
 * Honest limitation, not silently hidden: without DATABASE_URL, the store is
 * per-process memory (see lib/store/memory.ts). A session created here by the
 * ATS's backend and a session opened moments later by the candidate's browser
 * are two different requests that Vercel has no reason to route to the same
 * warm instance — so in no-database mode, a session created through this
 * endpoint can 404 for the candidate the instant it lands on a different
 * instance. The candidate-initiated flow doesn't have this problem (the
 * session-cache cookie carries it), but an API-created session has no browser
 * to hold that cookie until the candidate's first request. Reliable delivery
 * through this endpoint requires a real database.
 */
export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const gate = createLimiter.check(clientIp(request));
  if (!gate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(gate.retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = validateCreateSessionInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const scenario = getScenario(validation.input.scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: `Unknown scenarioId: ${validation.input.scenarioId}` }, { status: 404 });
  }

  const session = await startSession(scenario, {
    candidateName: validation.input.candidateName,
    candidateEmail: validation.input.candidateEmail,
    externalRef: validation.input.externalRef,
  });

  return NextResponse.json(
    {
      data: {
        sessionId: session.id,
        externalRef: session.externalRef ?? null,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title_he,
        // The candidate's entry point — the welcome screen, not a turn deep
        // link, so consent is always collected before anything is shown.
        playUrl: `${canonicalSiteUrl()}/play/${scenario.id}/s/${session.id}/consent`,
        durableDelivery: hasDatabase(),
      },
    },
    { status: 201 }
  );
}

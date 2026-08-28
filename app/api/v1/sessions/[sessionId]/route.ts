import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getScenario } from "@/content/scenarios";
import { authenticateRequest } from "@/lib/api/auth";
import { toSessionDetail } from "@/lib/api/serialize";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const auth = authenticateRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { sessionId } = await params;
  const store = getStore();
  const session = await store.getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const [report, decisions] = await Promise.all([store.getReport(sessionId), store.listDecisions(sessionId)]);

  return NextResponse.json({
    data: toSessionDetail(session, getScenario(session.scenarioId), report, decisions),
  });
}

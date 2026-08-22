"use server";

import { redirect } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { getStore } from "@/lib/store";
import { previewDecision, submitDecision, submitConversationalTurn, type ConfirmedPreview } from "@/lib/engine/session";
import { toScenarioPublicView, type ScenarioPublicView } from "@/lib/engine/turn-view";
import { persistSessionCookie, resolveSession } from "@/lib/session-cache";

/**
 * The client only ever holds a pruned ScenarioPublicView (see
 * lib/engine/turn-view.ts) — never the full Scenario, which carries the
 * scoring answer key. So whenever a turn advances, the action response must
 * hand the client the next turn's view directly; there's nothing on the
 * client to derive it from.
 */
function nextViewFor(scenario: ReturnType<typeof getScenario>, isFinalTurn: boolean, currentTurn: number): ScenarioPublicView | null {
  if (!scenario || isFinalTurn) return null;
  return toScenarioPublicView(scenario, currentTurn);
}

export async function consentAction(scenarioId: string, sessionId: string) {
  const existing = await resolveSession(sessionId);
  if (!existing) throw new Error("סשן לא נמצא");

  const store = getStore();
  const updated = await store.updateSession(sessionId, {
    consentAt: new Date().toISOString(),
    status: "in_progress",
  });
  if (updated) await persistSessionCookie(updated);

  redirect(`/play/${scenarioId}/s/${sessionId}/turn`);
}

export async function previewDecisionAction(scenarioId: string, sessionId: string, rawText: string) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");
  const session = await resolveSession(sessionId);
  if (!session) throw new Error("סשן לא נמצא");
  return previewDecision(scenario, session, rawText);
}

/**
 * expectedTurn: the candidate's client-side session.currentTurn at the
 * moment they submitted — passed through to submitDecision as an
 * idempotency guard against retries/double-clicks/replays. See
 * submitDecision's doc comment in lib/engine/session.ts.
 *
 * confirmedPreview: the exact previewDecisionAction result the candidate
 * confirmed on the "is this what you meant?" screen — reused directly
 * (when its rawTextHash still matches) instead of re-parsing, so committing
 * can't diverge from what was shown and confirmed.
 */
export async function commitDecisionAction(
  scenarioId: string,
  sessionId: string,
  rawText: string,
  expectedTurn: number,
  confirmedPreview?: ConfirmedPreview
) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");
  const session = await resolveSession(sessionId);
  if (!session) throw new Error("סשן לא נמצא");
  const result = await submitDecision(scenario, session, rawText, expectedTurn, confirmedPreview);
  await persistSessionCookie(result.session);
  return { ...result, nextView: nextViewFor(scenario, result.isFinalTurn, result.session.currentTurn) };
}

/** Conversational-agent equivalent of commitDecisionAction — see lib/engine/conversational-agent.ts. */
export async function submitConversationalTurnAction(scenarioId: string, sessionId: string, rawText: string, expectedTurn: number) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");
  const session = await resolveSession(sessionId);
  if (!session) throw new Error("סשן לא נמצא");
  const result = await submitConversationalTurn(scenario, session, rawText, expectedTurn);
  await persistSessionCookie(result.session);
  const nextView = result.kind === "advance" ? nextViewFor(scenario, result.isFinalTurn ?? false, result.session.currentTurn) : null;
  return { ...result, nextView };
}

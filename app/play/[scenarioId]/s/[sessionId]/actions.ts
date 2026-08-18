"use server";

import { redirect } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { getStore } from "@/lib/store";
import { previewDecision, submitDecision } from "@/lib/engine/session";
import { persistSessionCookie, resolveSession } from "@/lib/session-cache";

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

export async function commitDecisionAction(scenarioId: string, sessionId: string, rawText: string) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");
  const session = await resolveSession(sessionId);
  if (!session) throw new Error("סשן לא נמצא");
  const result = await submitDecision(scenario, session, rawText);
  await persistSessionCookie(result.session);
  return result;
}

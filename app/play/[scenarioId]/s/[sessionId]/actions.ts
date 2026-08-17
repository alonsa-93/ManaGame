"use server";

import { redirect } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { getStore } from "@/lib/store";
import { previewDecision, submitDecision } from "@/lib/engine/session";

export async function consentAction(scenarioId: string, sessionId: string) {
  const store = getStore();
  await store.updateSession(sessionId, { consentAt: new Date().toISOString(), status: "in_progress" });
  redirect(`/play/${scenarioId}/s/${sessionId}/turn`);
}

export async function previewDecisionAction(scenarioId: string, sessionId: string, rawText: string) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");
  const store = getStore();
  const session = await store.getSession(sessionId);
  if (!session) throw new Error("סשן לא נמצא");
  return previewDecision(scenario, session, rawText);
}

export async function commitDecisionAction(scenarioId: string, sessionId: string, rawText: string) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");
  const store = getStore();
  const session = await store.getSession(sessionId);
  if (!session) throw new Error("סשן לא נמצא");
  return submitDecision(scenario, session, rawText);
}

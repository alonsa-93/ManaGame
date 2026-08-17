"use server";

import { redirect } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { startSession } from "@/lib/engine/session";

export async function beginSessionAction(scenarioId: string, formData: FormData) {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error("תרחיש לא נמצא");

  const candidateName = String(formData.get("candidateName") ?? "").trim() || undefined;
  const session = await startSession(scenario, { candidateName });

  redirect(`/play/${scenarioId}/s/${session.id}/consent`);
}

import { notFound, redirect } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { getStore } from "@/lib/store";
import { resolveSession } from "@/lib/session-cache";
import { DecisionFlow } from "@/components/candidate/decision-flow";

export default async function TurnPage({
  params,
}: {
  params: Promise<{ scenarioId: string; sessionId: string }>;
}) {
  const { scenarioId, sessionId } = await params;
  const scenario = getScenario(scenarioId);
  const store = getStore();
  const session = await resolveSession(sessionId);
  if (!scenario || !session) notFound();
  if (!session.consentAt) redirect(`/play/${scenarioId}/s/${sessionId}/consent`);
  if (session.status === "completed") redirect(`/play/${scenarioId}/s/${sessionId}/complete`);

  const domain = getDomain(scenario.domainKey);

  // Reconstruct the event text for the current turn on a fresh page load
  // (e.g. after a refresh) — prefer the persisted branch event, fall back
  // to the turn's authored default.
  const events = await store.listEvents(sessionId);
  const persistedEvent = events.find((e) => e.turnIndex === session.currentTurn)?.eventHe;
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  const initialEventHe = session.currentTurn === 1 ? undefined : persistedEvent ?? turn?.event_he;

  return (
    <DecisionFlow
      scenarioId={scenarioId}
      scenario={scenario}
      domainNameHe={domain?.name_he}
      initialSession={session}
      initialEventHe={initialEventHe}
    />
  );
}

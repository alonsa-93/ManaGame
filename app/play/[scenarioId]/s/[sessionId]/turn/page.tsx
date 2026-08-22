import { notFound, redirect } from "next/navigation";
import { getScenario } from "@/content/scenarios";
import { getDomain } from "@/content/domains";
import { getStore } from "@/lib/store";
import { resolveSession } from "@/lib/session-cache";
import { toScenarioPublicView } from "@/lib/engine/turn-view";
import { DecisionFlow } from "@/components/candidate/decision-flow";
import { AgentChatFlow } from "@/components/candidate/agent-chat-flow";

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
  const useAgentChat = Boolean(process.env.ANTHROPIC_API_KEY);

  // Independent reads — fetched concurrently rather than awaited one at a
  // time. Conversation history is only meaningful for the agent-chat flow,
  // but fetching it unconditionally keeps this a single Promise.all instead
  // of a second sequential round trip inside the branch below.
  const [events, conversation] = await Promise.all([
    store.listEvents(sessionId),
    useAgentChat ? store.listConversationMessages(sessionId, session.currentTurn) : Promise.resolve([]),
  ]);

  // Reconstruct the event text for the current turn on a fresh page load
  // (e.g. after a refresh) — prefer the persisted branch event, fall back
  // to the turn's authored default.
  const persistedEvent = events.find((e) => e.turnIndex === session.currentTurn)?.eventHe;
  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  const initialEventHe = session.currentTurn === 1 ? undefined : persistedEvent ?? turn?.event_he;

  // The client only ever gets a pruned view of the current turn — never the
  // full Scenario, which carries the option vocabulary, KPI deltas and
  // criteria signals (i.e. the scoring answer key). See lib/engine/turn-view.ts.
  const view = toScenarioPublicView(scenario, session.currentTurn);

  // Conversational-agent flow is the default whenever a real model is
  // connected; otherwise fall back to the deterministic composer-only flow
  // (see components/candidate/agent-chat-flow.tsx and decision-flow.tsx).
  if (useAgentChat) {
    return (
      <AgentChatFlow
        scenarioId={scenarioId}
        view={view}
        domainNameHe={domain?.name_he}
        initialSession={session}
        initialEventHe={initialEventHe}
        initialConversation={conversation.map((m) => ({ role: m.role, textHe: m.textHe }))}
      />
    );
  }

  return (
    <DecisionFlow
      scenarioId={scenarioId}
      view={view}
      domainNameHe={domain?.name_he}
      initialSession={session}
      initialEventHe={initialEventHe}
    />
  );
}

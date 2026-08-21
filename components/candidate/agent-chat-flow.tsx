"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Scenario } from "@/lib/scenario-schema";
import type { SessionRecord } from "@/lib/store/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StepProgress } from "@/components/ui/progress";
import { KpiStrip } from "@/components/candidate/kpi-strip";
import { submitConversationalTurnAction } from "@/app/play/[scenarioId]/s/[sessionId]/actions";
import { Info } from "lucide-react";

type ChatMessage = { role: "candidate" | "agent"; textHe: string };

/**
 * Conversational-agent counterpart to DecisionFlow (components/candidate/
 * decision-flow.tsx). Rendered instead of it when ANTHROPIC_API_KEY is
 * configured (see turn/page.tsx) — the agent converses about the current
 * turn (at most one clarifying follow-up) and scores the decision itself,
 * then the session advances exactly like the deterministic flow.
 */
export function AgentChatFlow({
  scenarioId,
  scenario,
  domainNameHe,
  initialSession,
  initialEventHe,
  initialConversation,
}: {
  scenarioId: string;
  scenario: Scenario;
  domainNameHe?: string;
  initialSession: SessionRecord;
  initialEventHe?: string;
  initialConversation: ChatMessage[];
}) {
  const router = useRouter();
  const [session, setSession] = useState(initialSession);
  const [eventHe, setEventHe] = useState(initialEventHe);
  const [messages, setMessages] = useState<ChatMessage[]>(initialConversation);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotice, setReviewNotice] = useState(false);
  const [previousKpiState, setPreviousKpiState] = useState(session.kpiState);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  const totalTurns = scenario.turns.length;

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!turn) return null;

  async function handleSend() {
    const text = draft.trim();
    if (text.length < 10 || text.length > 4000) return;
    setError(null);
    setSending(true);
    const outgoing: ChatMessage = { role: "candidate", textHe: text };
    setMessages((prev) => [...prev, outgoing]);
    setDraft("");

    try {
      const result = await submitConversationalTurnAction(scenarioId, session.id, text);
      setMessages((prev) => [...prev, { role: "agent", textHe: result.agentMessageHe }]);
      setReviewNotice(result.needsHumanReview);

      if (result.kind === "advance") {
        setPreviousKpiState(session.kpiState);
        setSession(result.session);

        if (result.isFinalTurn) {
          router.push(`/play/${scenarioId}/s/${session.id}/complete`);
          return;
        }

        setEventHe(result.nextEventHe);
        setMessages([]);
      }
    } catch {
      setError("משהו השתבש. ההודעה שלך נשמרה ואפשר לנסות שוב.");
    } finally {
      setSending(false);
    }
  }

  const canSend = draft.trim().length >= 10 && draft.trim().length <= 4000;

  return (
    <div className="mx-auto max-w-3xl pt-4 sm:pt-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm text-mg-text-secondary">
          <span>
            סבב <span className="ltr-num">{session.currentTurn}</span> מתוך{" "}
            <span className="ltr-num">{totalTurns}</span>
          </span>
          {domainNameHe && <Badge variant="mint">{domainNameHe}</Badge>}
        </div>
        <StepProgress current={session.currentTurn} total={totalTurns} />
      </div>

      <Card className="p-6 sm:p-8 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-mg-text mb-4">{scenario.title_he}</h1>
        <KpiStrip kpis={scenario.kpis} state={session.kpiState} previous={previousKpiState} />
      </Card>

      {eventHe && messages.length === 0 && (
        <Card className="p-5 sm:p-6 mb-6 bg-mg-sand border-[#e8d4ad]">
          {eventHe.split("\n\n").map((line, i) => (
            <p key={i} className={i === 0 ? "font-semibold text-mg-text mb-1.5" : "text-mg-text-secondary leading-relaxed"}>
              {line}
            </p>
          ))}
        </Card>
      )}

      {reviewNotice && (
        <div className="mb-6 flex items-center gap-2 text-xs text-mg-text-secondary">
          <Info className="h-3.5 w-3.5" />
          <span>ההודעה הקודמת שלך סומנה לבדיקה אנושית — זה לא אומר שהיא שגויה, ואפשר להמשיך.</span>
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <p className="text-mg-text-secondary leading-relaxed mb-5 whitespace-pre-line">{turn.situation_he}</p>

        {turn.constraints_he && turn.constraints_he.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {turn.constraints_he.map((c) => (
              <Badge key={c} variant="blue">
                {c}
              </Badge>
            ))}
          </div>
        )}

        {turn.availableIntel && turn.availableIntel.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {turn.availableIntel.map((intel) => (
              <div key={intel.label_he} className="rounded-mg-md border border-mg-border p-3 text-sm">
                <div className="text-mg-text">{intel.label_he}</div>
                <div className="text-xs text-mg-text-secondary mt-1">
                  עלות: <span className="ltr-num">{intel.cost}</span> · דיוק:{" "}
                  <span className="ltr-num">{intel.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold text-mg-text mb-2">{turn.decisionPrompt_he ?? "מה היית עושה עכשיו?"}</h2>
        <p className="text-sm text-mg-text-secondary mb-5">
          מדובר בשיחה עם סוכן: ייתכן שהוא ישאל שאלת המשך קצרה אחת לפני שהמהלך שלכם ייבחן. אין צורך לכתוב תשובה
          &quot;מושלמת&quot; — חשוב להסביר את ההחלטה כפי שהייתם מקבלים אותה במצב הזה.
        </p>

        {messages.length > 0 && (
          <div className="mb-5 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "candidate" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "candidate"
                      ? "max-w-[85%] rounded-mg-md bg-mg-teal/10 border border-mg-teal/20 px-4 py-2.5 text-sm text-mg-text leading-relaxed"
                      : "max-w-[85%] rounded-mg-md bg-mg-sand border border-[#e8d4ad] px-4 py-2.5 text-sm text-mg-text leading-relaxed"
                  }
                >
                  {m.textHe}
                </div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>
        )}

        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={messages.length === 0 ? "מה היית עושה עכשיו?" : "התשובה שלך לסוכן..."}
          maxLength={4000}
          disabled={sending}
          aria-invalid={draft.length > 0 && !canSend}
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-mg-text-secondary">
          <span>אפשר לכתוב בצורה חופשית. אין צורך להשתמש במונחים מקצועיים מסוימים.</span>
          <span className="ltr-num shrink-0 ms-2">{draft.length}/4000</span>
        </div>

        {error && <p className="mt-3 text-sm text-mg-error">{error}</p>}

        <div className="mt-6">
          <Button size="lg" disabled={!canSend || sending} onClick={handleSend}>
            {sending ? "שולח..." : "שליחה"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

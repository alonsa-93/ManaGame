"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Scenario } from "@/lib/scenario-schema";
import type { SessionRecord } from "@/lib/store/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StepProgress } from "@/components/ui/progress";
import { KpiStrip } from "@/components/candidate/kpi-strip";
import {
  previewDecisionAction,
  commitDecisionAction,
} from "@/app/play/[scenarioId]/s/[sessionId]/actions";
import { CheckCircle2, Info } from "lucide-react";

type View = "composer" | "confirming" | "processing";

export function DecisionFlow({
  scenarioId,
  scenario,
  domainNameHe,
  initialSession,
  initialEventHe,
}: {
  scenarioId: string;
  scenario: Scenario;
  domainNameHe?: string;
  initialSession: SessionRecord;
  initialEventHe?: string;
}) {
  const router = useRouter();
  const [session, setSession] = useState(initialSession);
  const [eventHe, setEventHe] = useState(initialEventHe);
  const [rawText, setRawText] = useState("");
  const [view, setView] = useState<View>("composer");
  const [confirmation, setConfirmation] = useState<{ labels: string[]; needsReview: boolean } | null>(null);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotice, setReviewNotice] = useState(false);
  const [previousKpiState, setPreviousKpiState] = useState(session.kpiState);

  const turn = scenario.turns.find((t) => t.index === session.currentTurn);
  const totalTurns = scenario.turns.length;

  useEffect(() => {
    if (view !== "processing") return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [view]);

  if (!turn) return null;

  async function handleSubmitDecision() {
    setError(null);
    setView("processing");
    setSlow(false);
    try {
      const result = await previewDecisionAction(scenarioId, session.id, rawText);
      setConfirmation({ labels: result.matchedLabels, needsReview: result.needsHumanReview });
      setView("confirming");
    } catch {
      setError("משהו השתבש. ההחלטה שלך נשמרה ואפשר להמשיך.");
      setView("composer");
    }
  }

  async function handleConfirm() {
    setError(null);
    setView("processing");
    setSlow(false);
    try {
      const result = await commitDecisionAction(scenarioId, session.id, rawText);
      setPreviousKpiState(session.kpiState);
      setSession(result.session);
      setReviewNotice(result.needsHumanReview);

      if (result.isFinalTurn) {
        router.push(`/play/${scenarioId}/s/${session.id}/complete`);
        return;
      }

      setEventHe(result.nextEventHe);
      setRawText("");
      setConfirmation(null);
      setView("composer");
    } catch {
      setError("משהו השתבש. ההחלטה שלך נשמרה ואפשר להמשיך.");
      setView("confirming");
    }
  }

  function handleReject() {
    setConfirmation(null);
    setView("composer");
  }

  const charCount = rawText.trim().length;
  const canSubmit = charCount >= 10 && charCount <= 4000;

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

      {eventHe && view === "composer" && (
        <Card className="p-5 sm:p-6 mb-6 bg-mg-sand border-[#e8d4ad]">
          {eventHe.split("\n\n").map((line, i) => (
            <p key={i} className={i === 0 ? "font-semibold text-mg-text mb-1.5" : "text-mg-text-secondary leading-relaxed"}>
              {line}
            </p>
          ))}
        </Card>
      )}

      {reviewNotice && view === "composer" && (
        <div className="mb-6 flex items-center gap-2 text-xs text-mg-text-secondary">
          <Info className="h-3.5 w-3.5" />
          <span>ההחלטה הקודמת שלך סומנה לבדיקה אנושית — זה לא אומר שהיא שגויה, ואפשר להמשיך.</span>
        </div>
      )}

      {view === "composer" && (
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
          <p className="text-sm text-mg-text-secondary mb-4">
            תארו בקצרה: מה אתם עושים, למה, איזה מידע חשוב לכם, אילו משאבים אתם מקצים, ומה אתם בוחרים שלא לעשות כרגע.
            אין צורך לכתוב תשובה &quot;מושלמת&quot;. חשוב להסביר את ההחלטה כפי שהייתם מקבלים אותה במצב הזה.
          </p>

          <Textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="מה היית עושה עכשיו?"
            maxLength={4000}
            aria-invalid={rawText.length > 0 && !canSubmit}
          />
          <div className="mt-1.5 flex items-center justify-between text-xs text-mg-text-secondary">
            <span>אפשר לכתוב בצורה חופשית. אין צורך להשתמש במונחים מקצועיים מסוימים.</span>
            <span className="ltr-num shrink-0 ms-2">{rawText.length}/4000</span>
          </div>

          {error && <p className="mt-3 text-sm text-mg-error">{error}</p>}

          <div className="mt-6">
            <Button size="lg" disabled={!canSubmit} onClick={handleSubmitDecision}>
              המשך
            </Button>
          </div>
        </Card>
      )}

      {view === "processing" && (
        <Card className="p-10 flex flex-col items-center text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-mg-teal border-t-transparent mb-4" aria-hidden />
          <p className="text-mg-text font-medium">מעבדים את ההחלטה...</p>
          <p className="text-sm text-mg-text-secondary mt-1">המערכת מנתחת את הפעולה ומכינה את השלב הבא בסימולציה.</p>
          {slow && (
            <p className="text-sm text-mg-text-secondary mt-4 max-w-sm">
              זה לוקח קצת יותר זמן מהרגיל. ההחלטה שלכם נשמרה ואפשר להישאר כאן עד שהשלב הבא יהיה מוכן.
            </p>
          )}
        </Card>
      )}

      {view === "confirming" && confirmation && (
        <Card className="p-6 sm:p-8">
          <p className="font-medium text-mg-text mb-3">זה מה שהמערכת הבינה מההחלטה שלכם:</p>

          {confirmation.labels.length > 0 ? (
            <ul className="space-y-2 mb-5">
              {confirmation.labels.map((label) => (
                <li key={label} className="flex items-start gap-2 text-mg-text">
                  <CheckCircle2 className="h-4 w-4 text-mg-teal mt-0.5 shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-5 rounded-mg-md bg-mg-sand border border-[#e8d4ad] p-4 text-sm text-mg-text-secondary leading-relaxed">
              <p>לא הצלחנו לסווג את המהלך באופן מלא.</p>
              <p className="mt-1">זה אינו אומר שהמהלך שגוי.</p>
              <p className="mt-1">הפעולה נשמרה כפי שנקלטה והיא זמינה לבדיקה אנושית.</p>
            </div>
          )}

          <p className="text-mg-text-secondary mb-5">זה אכן מה שהתכוונתם לעשות?</p>

          {error && <p className="mb-3 text-sm text-mg-error">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="sm:flex-1" onClick={handleConfirm}>
              מאשר/ת
            </Button>
            <Button size="lg" variant="secondary" className="sm:flex-1" onClick={handleReject}>
              לא לזה התכוונתי
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

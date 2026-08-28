import { Card } from "@/components/ui/card";
import type { ConversationMessageRecord } from "@/lib/store/types";

/**
 * The full exchange between the agent and the candidate, grouped by turn.
 *
 * This is the primary evidence in the conversational flow. The scores in the
 * rest of the report are the agent's reading of *this* — so an assessor who
 * wants to check a score, or disagree with one, has to be able to see the words
 * it was drawn from. Without the transcript the report asks to be trusted; with
 * it, the report can be audited.
 */
export function ConversationTranscript({ messages }: { messages: ConversationMessageRecord[] }) {
  if (messages.length === 0) return null;

  const turns = [...new Set(messages.map((m) => m.turnIndex))].sort((a, b) => a - b);

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-semibold text-mg-text mb-1">תמליל השיחה</h2>
      <p className="text-sm text-mg-text-secondary mb-5">
        הציונים בדוח נגזרו מהדברים שנאמרו כאן. התמליל מוצג במלואו כדי שניתן יהיה לבדוק כל ציון מול
        מה שנאמר בפועל — ולחלוק עליו.
      </p>

      <div className="space-y-6">
        {turns.map((turn) => (
          <div key={turn}>
            <div className="text-xs font-medium text-mg-text-secondary mb-2.5">
              סבב <span className="ltr-num">{turn}</span>
            </div>
            <div className="space-y-2.5">
              {messages
                .filter((m) => m.turnIndex === turn)
                .map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "candidate"
                        ? "rounded-mg-md bg-mg-mint p-3.5"
                        : "rounded-mg-md border border-mg-border p-3.5"
                    }
                  >
                    <div className="text-xs text-mg-text-secondary mb-1">
                      {m.role === "candidate" ? "המועמד/ת" : "הסוכן"}
                    </div>
                    <p className="text-sm text-mg-text leading-relaxed whitespace-pre-line">{m.textHe}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

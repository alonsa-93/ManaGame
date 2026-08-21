"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { pingAgentAction } from "@/app/admin/system/actions";

/**
 * On-demand only — deliberately NOT called on every /admin/system render,
 * since that would fire a real (billed) Anthropic call on every page view.
 */
export function AgentPingButton() {
  const [result, setResult] = useState<{ ok: boolean; detail: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setResult(null);
    try {
      setResult(await pingAgentAction());
    } catch {
      setResult({ ok: false, detail: "הבדיקה נכשלה." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" size="sm" onClick={handleClick} loading={loading}>
        בדיקת חיבור לסוכן
      </Button>
      {result && (
        <span className={result.ok ? "text-xs text-mg-teal" : "text-xs text-mg-error"}>{result.detail}</span>
      )}
    </div>
  );
}

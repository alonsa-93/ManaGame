import { createHash } from "node:crypto";
import type { ScenarioTurn } from "@/lib/scenario-schema";
import type { MatchedOption } from "@/lib/engine/parser";

/**
 * Lets submitDecision trust a previously-confirmed preview instead of
 * re-running the (non-deterministic) LLM parse a second time at commit —
 * without this, a candidate could confirm one interpretation on the
 * "is this what you meant?" screen and be scored on a different one the
 * second call happened to produce. hashRawText binds a preview result to
 * the exact text it was computed from; submitDecision only reuses the
 * preview when the hash still matches what the candidate is committing.
 */
export function hashRawText(rawText: string): string {
  return createHash("sha256").update(rawText).digest("base64url");
}

/** Resolves confirmed option keys against the turn's real vocabulary — never fabricates an option. */
export function matchesFromConfirmedKeys(turn: ScenarioTurn, keys: string[]): MatchedOption[] {
  return keys
    .map((key) => turn.options.find((o) => o.key === key))
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .map((option) => ({ option, score: 1 }));
}

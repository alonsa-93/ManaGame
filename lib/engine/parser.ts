import type { DecisionOption, ScenarioTurn } from "@/lib/scenario-schema";
import { scanForInjection } from "@/lib/engine/security";

export interface MatchedOption {
  option: DecisionOption;
  score: number;
}

export interface ParseResult {
  matches: MatchedOption[];
  confidence: number;
  needsHumanReview: boolean;
  reviewReason?: string;
  flaggedInjection: boolean;
}

function normalize(text: string): string {
  return text.replace(/[֑-ׇ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Deterministic heuristic matcher used when no LLM parser is configured
 * (ANTHROPIC_API_KEY unset), and as a always-on cross-check when it is.
 * Scores each canonical option by keyword-phrase presence in the raw text.
 */
export function heuristicParse(rawText: string, turn: ScenarioTurn): ParseResult {
  const scan = scanForInjection(rawText);
  const normalized = normalize(rawText);

  const matches: MatchedOption[] = turn.options
    .map((option) => {
      let score = 0;
      for (const kw of option.keywords_he) {
        if (normalized.includes(normalize(kw))) score += 1;
      }
      return { option, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  const topScore = matches[0]?.score ?? 0;
  const confidence = topScore === 0 ? 0 : Math.min(1, topScore / 3);

  const tooShort = rawText.trim().length < 10;

  const needsHumanReview = scan.flagged || matches.length === 0 || tooShort;
  let reviewReason: string | undefined;
  if (scan.flagged) reviewReason = "injection_flagged";
  else if (tooShort) reviewReason = "insufficient_content";
  else if (matches.length === 0) reviewReason = "unmatched_intent";

  return {
    matches: matches.slice(0, 4),
    confidence,
    needsHumanReview,
    reviewReason,
    flaggedInjection: scan.flagged,
  };
}

import type { CriterionKey, DecisionOption } from "@/lib/scenario-schema";
import type { MatchedOption } from "@/lib/engine/parser";

export interface EvidenceEntry {
  criterion: CriterionKey;
  score: number; // 0-5, as authored on the matched option
  evidence_he: string;
  sourceTurn: number;
}

/**
 * The judge does not invent a score. It reads the criteria signals already
 * authored on the matched canonical option(s) and turns them into evidence
 * entries tied to the turn they came from. Aggregation into a final score
 * happens deterministically downstream (see aggregator.ts).
 */
export function buildEvidence(matches: MatchedOption[], turnIndex: number): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];
  for (const { option } of matches) {
    for (const [criterion, score] of Object.entries(option.criteriaSignals) as [CriterionKey, number][]) {
      if (!score) continue;
      entries.push({
        criterion,
        score,
        evidence_he: option.evidence_he,
        sourceTurn: turnIndex,
      });
    }
  }
  return entries;
}

export function bestMatchLabel(matches: MatchedOption[]): DecisionOption[] {
  return matches.slice(0, 4).map((m) => m.option);
}

/**
 * Shared content contract for ManaGame scenarios.
 *
 * Every domain scenario (authored as a TS module in content/scenarios/*)
 * must conform to this shape. Keeping it uniform lets the engine, the
 * candidate UI, the assessor report and the comparison rules stay
 * domain-agnostic — only the authored content changes per domain.
 *
 * Criteria are FIXED across all domains/scenarios (see CRITERIA below),
 * mirroring Master Spec §65. This is what makes cross-scenario evidence
 * and reports comparable without a bespoke rubric per scenario.
 */

export type RoleLevel = "team_lead" | "manager" | "director" | "vp" | "ceo";

export const ROLE_LEVEL_LABEL_HE: Record<RoleLevel, string> = {
  team_lead: "ראש צוות",
  manager: "מנהל/ת",
  director: "דירקטור/ית",
  vp: "סמנכ\"ל",
  ceo: "מנכ\"ל",
};

export interface KpiDef {
  key: string;
  label_he: string;
  unit?: string;
  start: number;
  min: number;
  max: number;
  higherIsBetter: boolean;
}

export type CriterionKey =
  | "diagnosis_before_action"
  | "financial_awareness"
  | "realism"
  | "information_acquisition"
  | "prioritization"
  | "knowing_when_to_stop"
  | "knowledge_protection"
  | "communication"
  | "workload_management";

export interface CriterionDef {
  key: CriterionKey;
  group: "operational_financial" | "ambiguity" | "human_capital";
  label_he: string;
}

export const CRITERIA: CriterionDef[] = [
  { key: "diagnosis_before_action", group: "operational_financial", label_he: "אבחון לפני פעולה" },
  { key: "financial_awareness", group: "operational_financial", label_he: "מודעות כספית" },
  { key: "realism", group: "operational_financial", label_he: "ריאליזם" },
  { key: "information_acquisition", group: "ambiguity", label_he: "רכישת מידע" },
  { key: "prioritization", group: "ambiguity", label_he: "תעדוף חלופות" },
  { key: "knowing_when_to_stop", group: "ambiguity", label_he: "נכונות לעצור" },
  { key: "knowledge_protection", group: "human_capital", label_he: "הגנה על ידע" },
  { key: "communication", group: "human_capital", label_he: "תקשורת" },
  { key: "workload_management", group: "human_capital", label_he: "ניהול עומס" },
];

export const CRITERIA_GROUP_LABEL_HE: Record<CriterionDef["group"], string> = {
  operational_financial: "שיקול דעת תפעולי ופיננסי",
  ambiguity: "קבלת החלטות בתנאי אי-ודאות",
  human_capital: "החלטות הנוגעות להון אנושי",
};

/** A single canonical, pre-authored decision an option-vocabulary can match. */
export interface DecisionOption {
  key: string;
  label_he: string;
  /** Hebrew keyword / phrase hints used by the heuristic parser to match free text. */
  keywords_he: string[];
  /** KPI key -> delta applied to session state when this option is (best-)matched. */
  deltas: Record<string, number>;
  /** Evidence sentence rendered verbatim in the report, e.g. "רכש מידע לפני שהתחייב למשאב". */
  evidence_he: string;
  /** Criterion key -> signal strength (0-5) this option contributes when matched. */
  criteriaSignals: Partial<Record<CriterionKey, number>>;
  /** Overrides the next turn's event text when this branch is taken. */
  nextEvent_he?: string;
}

export interface IntelOption {
  label_he: string;
  cost: number;
  accuracy: number;
}

export interface ScenarioTurn {
  index: number;
  situation_he: string;
  event_he?: string;
  constraints_he?: string[];
  availableIntel?: IntelOption[];
  decisionPrompt_he?: string;
  options: DecisionOption[];
}

export interface Scenario {
  id: string;
  domainKey: string;
  title_he: string;
  roleLevel: RoleLevel;
  difficulty: 1 | 2 | 3 | 4 | 5;
  summary_he: string;
  estimatedMinutes: [number, number];
  kpis: KpiDef[];
  turns: ScenarioTurn[];
}

export interface Domain {
  key: string;
  name_he: string;
  name_en: string;
  icon: string;
  description_he: string;
}

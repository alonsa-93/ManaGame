import type { KpiState } from "@/lib/engine/state";
import type { CriterionKey } from "@/lib/scenario-schema";

export type SessionStatus = "not_started" | "in_progress" | "completed";

/**
 * Compact per-criterion evidence accumulated on the session itself (not
 * just in the decisions/decision_evidence tables), so scoring survives a
 * cold serverless instance when no database is connected — see
 * lib/session-cache.ts and finalizeReport() in lib/engine/session.ts.
 * Deliberately excludes the evidence quote text to keep the session (and
 * therefore the resiliency cookie) small; quotes for the assessor UI still
 * come from decision_evidence via the store.
 */
export interface TurnEvidenceEntry {
  criterion: CriterionKey;
  score: number;
  sourceTurn: number;
}

export interface SessionRecord {
  id: string;
  scenarioId: string;
  candidateName?: string;
  candidateEmail?: string;
  status: SessionStatus;
  seed: string;
  currentTurn: number;
  kpiState: KpiState;
  kpiHistory: { turn: number; state: KpiState }[];
  turnEvidence: TurnEvidenceEntry[];
  consentAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface DecisionRecord {
  id: string;
  sessionId: string;
  turnIndex: number;
  rawText: string;
  matchedOptionKeys: string[];
  confidence: number | null;
  needsHumanReview: boolean;
  reviewReason?: string;
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  decisionId: string;
  criterion: string;
  score: number;
  evidenceHe: string;
  sourceTurn: number;
}

export interface SessionEventRecord {
  id: string;
  sessionId: string;
  turnIndex: number;
  eventHe: string;
  createdAt: string;
}

export interface ReportRecord {
  sessionId: string;
  processScore: number | null;
  outcomeScore: number;
  criteriaScores: unknown;
  generatedAt: string;
}

export interface ConversationMessageRecord {
  id: string;
  sessionId: string;
  turnIndex: number;
  role: "candidate" | "agent";
  textHe: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  email: string;
  whatToTest?: string;
  orgSize?: string;
  createdAt: string;
}

export interface Store {
  createSession(input: Omit<SessionRecord, "createdAt" | "status"> & { status?: SessionStatus }): Promise<SessionRecord>;
  getSession(id: string): Promise<SessionRecord | null>;
  updateSession(id: string, patch: Partial<SessionRecord>): Promise<SessionRecord | null>;
  listSessions(): Promise<SessionRecord[]>;
  /**
   * Re-seeds a session record into this store instance without going
   * through createSession's insert semantics. Used only by the
   * cookie-fallback resiliency layer (lib/session-cache.ts) to self-heal a
   * cold serverless instance's in-process store from the candidate's own
   * session cookie. No-op on a real database, which is already authoritative.
   */
  hydrateSession(session: SessionRecord): Promise<void>;

  addDecision(record: Omit<DecisionRecord, "createdAt">): Promise<DecisionRecord>;
  listDecisions(sessionId: string): Promise<DecisionRecord[]>;

  addEvidence(records: Omit<EvidenceRecord, "id">[]): Promise<void>;
  listEvidence(sessionId: string): Promise<EvidenceRecord[]>;

  addEvent(record: Omit<SessionEventRecord, "createdAt">): Promise<void>;
  listEvents(sessionId: string): Promise<SessionEventRecord[]>;

  saveReport(record: Omit<ReportRecord, "generatedAt">): Promise<ReportRecord>;
  getReport(sessionId: string): Promise<ReportRecord | null>;

  addContactSubmission(record: Omit<ContactSubmission, "createdAt">): Promise<void>;

  /** Chat transcript for the conversational-agent turn flow (lib/engine/conversational-agent.ts). */
  addConversationMessage(record: Omit<ConversationMessageRecord, "id" | "createdAt">): Promise<void>;
  listConversationMessages(sessionId: string, turnIndex?: number): Promise<ConversationMessageRecord[]>;
}

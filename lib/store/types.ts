import type { KpiState } from "@/lib/engine/state";

export type SessionStatus = "not_started" | "in_progress" | "completed";

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

  addDecision(record: Omit<DecisionRecord, "createdAt">): Promise<DecisionRecord>;
  listDecisions(sessionId: string): Promise<DecisionRecord[]>;

  addEvidence(records: Omit<EvidenceRecord, "id">[]): Promise<void>;
  listEvidence(sessionId: string): Promise<EvidenceRecord[]>;

  addEvent(record: Omit<SessionEventRecord, "createdAt">): Promise<void>;
  listEvents(sessionId: string): Promise<SessionEventRecord[]>;

  saveReport(record: Omit<ReportRecord, "generatedAt">): Promise<ReportRecord>;
  getReport(sessionId: string): Promise<ReportRecord | null>;

  addContactSubmission(record: Omit<ContactSubmission, "createdAt">): Promise<void>;
}

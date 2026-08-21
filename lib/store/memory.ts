import type {
  Store,
  SessionRecord,
  DecisionRecord,
  EvidenceRecord,
  SessionEventRecord,
  ReportRecord,
  ContactSubmission,
  ConversationMessageRecord,
} from "@/lib/store/types";

/**
 * In-process fallback store. Used automatically whenever DATABASE_URL is
 * not configured, so the full product works end-to-end without any
 * external database. Data lives for the lifetime of the server process —
 * durable across requests during normal use, but not guaranteed across
 * cold starts / multiple serverless instances. Connect a real Postgres
 * database (see README) for durable, cross-instance storage.
 */
class MemoryStore implements Store {
  sessions = new Map<string, SessionRecord>();
  decisions = new Map<string, DecisionRecord>();
  evidence: EvidenceRecord[] = [];
  events: SessionEventRecord[] = [];
  reports = new Map<string, ReportRecord>();
  contacts: ContactSubmission[] = [];
  conversationMessages: ConversationMessageRecord[] = [];

  async createSession(input: Omit<SessionRecord, "createdAt" | "status"> & { status?: SessionRecord["status"] }) {
    const record: SessionRecord = {
      ...input,
      status: input.status ?? "not_started",
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(record.id, record);
    return record;
  }

  async getSession(id: string) {
    return this.sessions.get(id) ?? null;
  }

  async hydrateSession(session: SessionRecord) {
    this.sessions.set(session.id, session);
  }

  async updateSession(id: string, patch: Partial<SessionRecord>) {
    const existing = this.sessions.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    this.sessions.set(id, updated);
    return updated;
  }

  async listSessions() {
    return [...this.sessions.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async addDecision(record: Omit<DecisionRecord, "createdAt">) {
    const full: DecisionRecord = { ...record, createdAt: new Date().toISOString() };
    this.decisions.set(full.id, full);
    return full;
  }

  async listDecisions(sessionId: string) {
    return [...this.decisions.values()]
      .filter((d) => d.sessionId === sessionId)
      .sort((a, b) => a.turnIndex - b.turnIndex);
  }

  async addEvidence(records: Omit<EvidenceRecord, "id">[]) {
    for (const r of records) {
      this.evidence.push({ ...r, id: crypto.randomUUID() });
    }
  }

  async listEvidence(sessionId: string) {
    const decisionIds = new Set([...this.decisions.values()].filter((d) => d.sessionId === sessionId).map((d) => d.id));
    return this.evidence.filter((e) => decisionIds.has(e.decisionId));
  }

  async addEvent(record: Omit<SessionEventRecord, "createdAt">) {
    this.events.push({ ...record, createdAt: new Date().toISOString() });
  }

  async listEvents(sessionId: string) {
    return this.events.filter((e) => e.sessionId === sessionId).sort((a, b) => a.turnIndex - b.turnIndex);
  }

  async saveReport(record: Omit<ReportRecord, "generatedAt">) {
    const full: ReportRecord = { ...record, generatedAt: new Date().toISOString() };
    this.reports.set(record.sessionId, full);
    return full;
  }

  async getReport(sessionId: string) {
    return this.reports.get(sessionId) ?? null;
  }

  async addContactSubmission(record: Omit<ContactSubmission, "createdAt">) {
    this.contacts.push({ ...record, createdAt: new Date().toISOString() });
  }

  async addConversationMessage(record: Omit<ConversationMessageRecord, "id" | "createdAt">) {
    this.conversationMessages.push({ ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  }

  async listConversationMessages(sessionId: string, turnIndex?: number) {
    return this.conversationMessages.filter(
      (m) => m.sessionId === sessionId && (turnIndex === undefined || m.turnIndex === turnIndex)
    );
  }
}

// Module-level singleton, reused across requests within the same server process.
const g = globalThis as unknown as { __managameMemoryStore?: MemoryStore };
export const memoryStore = g.__managameMemoryStore ?? (g.__managameMemoryStore = new MemoryStore());

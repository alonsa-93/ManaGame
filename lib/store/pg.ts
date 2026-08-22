import { getPool } from "@/lib/db/client";
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

function rowToSession(row: Record<string, unknown>): SessionRecord {
  return {
    id: row.id as string,
    scenarioId: row.scenario_id as string,
    candidateName: (row.candidate_name as string) ?? undefined,
    candidateEmail: (row.candidate_email as string) ?? undefined,
    status: row.status as SessionRecord["status"],
    seed: row.seed as string,
    currentTurn: row.current_turn as number,
    kpiState: row.kpi_state as SessionRecord["kpiState"],
    kpiHistory: row.kpi_history as SessionRecord["kpiHistory"],
    turnEvidence: (row.turn_evidence as SessionRecord["turnEvidence"]) ?? [],
    consentAt: row.consent_at ? new Date(row.consent_at as string).toISOString() : undefined,
    completedAt: row.completed_at ? new Date(row.completed_at as string).toISOString() : undefined,
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

function rowToDecision(row: Record<string, unknown>): DecisionRecord {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    turnIndex: row.turn_index as number,
    rawText: row.raw_text as string,
    matchedOptionKeys: row.matched_option_keys as string[],
    confidence: row.confidence === null ? null : Number(row.confidence),
    needsHumanReview: row.needs_human_review as boolean,
    reviewReason: (row.review_reason as string) ?? undefined,
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

export class PgStore implements Store {
  private pool() {
    const p = getPool();
    if (!p) throw new Error("DATABASE_URL not configured");
    return p;
  }

  async createSession(input: Omit<SessionRecord, "createdAt" | "status"> & { status?: SessionRecord["status"] }) {
    const status = input.status ?? "not_started";
    const { rows } = await this.pool().query(
      `insert into sessions (id, scenario_id, candidate_name, candidate_email, status, seed, current_turn, kpi_state, kpi_history, turn_evidence, consent_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *`,
      [
        input.id,
        input.scenarioId,
        input.candidateName ?? null,
        input.candidateEmail ?? null,
        status,
        input.seed,
        input.currentTurn,
        JSON.stringify(input.kpiState),
        JSON.stringify(input.kpiHistory ?? []),
        JSON.stringify(input.turnEvidence ?? []),
        input.consentAt ?? null,
      ]
    );
    return rowToSession(rows[0]);
  }

  async getSession(id: string) {
    const { rows } = await this.pool().query(`select * from sessions where id = $1`, [id]);
    return rows[0] ? rowToSession(rows[0]) : null;
  }

  // No-op: Postgres is already the authoritative, shared store — there is
  // no "cold instance" to self-heal, and a real miss here is a real miss.
  async hydrateSession() {}

  async updateSession(id: string, patch: Partial<SessionRecord>) {
    const existing = await this.getSession(id);
    if (!existing) return null;
    const merged = { ...existing, ...patch };
    const { rows } = await this.pool().query(
      `update sessions set candidate_name=$2, candidate_email=$3, status=$4, current_turn=$5, kpi_state=$6, kpi_history=$7, turn_evidence=$8, consent_at=$9, completed_at=$10 where id=$1 returning *`,
      [
        id,
        merged.candidateName ?? null,
        merged.candidateEmail ?? null,
        merged.status,
        merged.currentTurn,
        JSON.stringify(merged.kpiState),
        JSON.stringify(merged.kpiHistory),
        JSON.stringify(merged.turnEvidence ?? []),
        merged.consentAt ?? null,
        merged.completedAt ?? null,
      ]
    );
    return rows[0] ? rowToSession(rows[0]) : null;
  }

  async listSessions() {
    const { rows } = await this.pool().query(`select * from sessions order by created_at desc limit 200`);
    return rows.map(rowToSession);
  }

  async addDecision(record: Omit<DecisionRecord, "createdAt">) {
    const { rows } = await this.pool().query(
      `insert into decisions (id, session_id, turn_index, raw_text, matched_option_keys, confidence, needs_human_review, review_reason)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
      [
        record.id,
        record.sessionId,
        record.turnIndex,
        record.rawText,
        record.matchedOptionKeys,
        record.confidence,
        record.needsHumanReview,
        record.reviewReason ?? null,
      ]
    );
    return rowToDecision(rows[0]);
  }

  async listDecisions(sessionId: string) {
    const { rows } = await this.pool().query(`select * from decisions where session_id=$1 order by turn_index asc`, [sessionId]);
    return rows.map(rowToDecision);
  }

  async addEvidence(records: Omit<EvidenceRecord, "id">[]) {
    if (records.length === 0) return;
    // Single multi-row insert via unnest() instead of one round trip per
    // criterion (a turn typically evidences 3-9) — same statement shape
    // regardless of batch size, one network round trip either way.
    await this.pool().query(
      `insert into decision_evidence (id, decision_id, criterion, score, evidence_he, source_turn)
       select * from unnest($1::text[], $2::text[], $3::text[], $4::numeric[], $5::text[], $6::int[])`,
      [
        records.map(() => crypto.randomUUID()),
        records.map((r) => r.decisionId),
        records.map((r) => r.criterion),
        records.map((r) => r.score),
        records.map((r) => r.evidenceHe),
        records.map((r) => r.sourceTurn),
      ]
    );
  }

  async listEvidence(sessionId: string) {
    const { rows } = await this.pool().query(
      `select de.* from decision_evidence de join decisions d on d.id = de.decision_id where d.session_id = $1 order by de.source_turn asc`,
      [sessionId]
    );
    return rows.map((r) => ({
      id: r.id,
      decisionId: r.decision_id,
      criterion: r.criterion,
      score: Number(r.score),
      evidenceHe: r.evidence_he,
      sourceTurn: r.source_turn,
    }));
  }

  async addEvent(record: Omit<SessionEventRecord, "createdAt">) {
    await this.pool().query(`insert into session_events (id, session_id, turn_index, event_he) values ($1,$2,$3,$4)`, [
      record.id,
      record.sessionId,
      record.turnIndex,
      record.eventHe,
    ]);
  }

  async listEvents(sessionId: string) {
    const { rows } = await this.pool().query(`select * from session_events where session_id=$1 order by turn_index asc`, [sessionId]);
    return rows.map((r) => ({
      id: r.id,
      sessionId: r.session_id,
      turnIndex: r.turn_index,
      eventHe: r.event_he,
      createdAt: new Date(r.created_at).toISOString(),
    }));
  }

  async saveReport(record: Omit<ReportRecord, "generatedAt">) {
    const { rows } = await this.pool().query(
      `insert into reports (session_id, process_score, outcome_score, criteria_scores)
       values ($1,$2,$3,$4)
       on conflict (session_id) do update set process_score=$2, outcome_score=$3, criteria_scores=$4, generated_at=now()
       returning *`,
      [record.sessionId, record.processScore, record.outcomeScore, JSON.stringify(record.criteriaScores)]
    );
    const r = rows[0];
    return {
      sessionId: r.session_id,
      processScore: r.process_score,
      outcomeScore: r.outcome_score,
      criteriaScores: r.criteria_scores,
      generatedAt: new Date(r.generated_at).toISOString(),
    };
  }

  async getReport(sessionId: string) {
    const { rows } = await this.pool().query(`select * from reports where session_id=$1`, [sessionId]);
    if (!rows[0]) return null;
    const r = rows[0];
    return {
      sessionId: r.session_id,
      processScore: r.process_score,
      outcomeScore: r.outcome_score,
      criteriaScores: r.criteria_scores,
      generatedAt: new Date(r.generated_at).toISOString(),
    };
  }

  async addContactSubmission(record: Omit<ContactSubmission, "createdAt">) {
    await this.pool().query(
      `insert into contact_submissions (id, name, role, organization, email, what_to_test, org_size) values ($1,$2,$3,$4,$5,$6,$7)`,
      [record.id, record.name, record.role ?? null, record.organization ?? null, record.email, record.whatToTest ?? null, record.orgSize ?? null]
    );
  }

  async addConversationMessage(record: Omit<ConversationMessageRecord, "id" | "createdAt">) {
    await this.pool().query(
      `insert into turn_conversations (id, session_id, turn_index, role, text_he) values ($1,$2,$3,$4,$5)`,
      [crypto.randomUUID(), record.sessionId, record.turnIndex, record.role, record.textHe]
    );
  }

  async listConversationMessages(sessionId: string, turnIndex?: number) {
    const { rows } = await this.pool().query(
      turnIndex === undefined
        ? `select * from turn_conversations where session_id=$1 order by created_at asc`
        : `select * from turn_conversations where session_id=$1 and turn_index=$2 order by created_at asc`,
      turnIndex === undefined ? [sessionId] : [sessionId, turnIndex]
    );
    return rows.map((r) => ({
      id: r.id,
      sessionId: r.session_id,
      turnIndex: r.turn_index,
      role: r.role,
      textHe: r.text_he,
      createdAt: new Date(r.created_at).toISOString(),
    })) as ConversationMessageRecord[];
  }
}

/**
 * Validation for POST /api/v1/sessions — kept separate from the route so it's
 * testable without constructing a Request/Response pair.
 */

export interface CreateSessionInput {
  scenarioId: string;
  candidateName?: string;
  candidateEmail?: string;
  externalRef?: string;
}

export type CreateSessionValidation = { ok: true; input: CreateSessionInput } | { ok: false; error: string };

const MAX_FIELD_LENGTH = 300;

function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, MAX_FIELD_LENGTH) : undefined;
}

export function validateCreateSessionInput(body: unknown): CreateSessionValidation {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const record = body as Record<string, unknown>;
  const scenarioId = cleanString(record.scenarioId);
  if (!scenarioId) {
    return { ok: false, error: "scenarioId is required." };
  }

  const candidateEmail = cleanString(record.candidateEmail);
  if (candidateEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
    return { ok: false, error: "candidateEmail is not a valid email address." };
  }

  return {
    ok: true,
    input: {
      scenarioId,
      candidateName: cleanString(record.candidateName),
      candidateEmail,
      externalRef: cleanString(record.externalRef),
    },
  };
}

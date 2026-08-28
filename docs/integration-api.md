# ManaGame Integration API (v1)

Read-only HTTP API for pulling assessment outcomes into an ATS or HRIS.

**Disabled by default.** Set `ATS_API_TOKEN` to enable it. With no token
configured every endpoint returns `503` — it is not merely unauthenticated, it
is off, so a deployment with a blank env var cannot accidentally expose
candidate data.

## Authentication

```
Authorization: Bearer <ATS_API_TOKEN>
```

The token is compared in constant time. It is deliberately **not** the operator
passphrase (`ADMIN_PASSWORD`): an integration is a machine with a long-lived,
read-only credential; an operator is a person with a browser session and full
access. One secret for both would mean rotating an integration locks out a
human, and would give a vendor's integration an administrator's reach.

## What this API will not return

By design, and at any verbosity:

- **The candidate's free-text answers.** Every word they wrote.
- **The agent conversation transcript.**
- **The scenario's option keys** — the scoring answer key.
- **The candidate's email address.**

These are the most sensitive things the system holds, and an integration that
copies them into a third-party system moves that exposure somewhere this
codebase cannot see. An assessor who needs the words reads them in the report,
behind the operator gate.

## Endpoints

### `GET /api/v1/sessions`

Optional query parameters: `status` (`not_started` / `in_progress` /
`completed`), `scenarioId`.

```json
{
  "count": 1,
  "data": [
    {
      "id": "…",
      "scenarioId": "supply-chain-manager-1",
      "scenarioTitle": "עיכוב אספקה מספק יחיד",
      "roleLevel": "manager",
      "candidateName": "דנה כהן",
      "status": "completed",
      "createdAt": "2026-08-01T10:00:00.000Z",
      "completedAt": "2026-08-01T10:35:00.000Z",
      "processScore": 72,
      "outcomeScore": 55,
      "needsHumanReview": true
    }
  ]
}
```

Rate limited to 120 requests per minute per IP; `429` carries `Retry-After`.

### `GET /api/v1/sessions/{sessionId}`

Adds `criteriaScores` (all nine, each with `measured` and `score100`),
`turnsCompleted` / `totalTurns`, `reviewFlags` (turn index and reason, never the
text behind them), and a `disclaimer` field.

`404` for an unknown session.

## Two things a consumer must handle

1. **`processScore` can be `null`.** It means fewer than three criteria were
   measured, not a low score. Treating null as zero — or as a rejection — is the
   most likely way to misuse this API.
2. **`needsHumanReview: true` means a decision was not classified confidently.**
   It is a request for a person to look, not a negative signal about the
   candidate.

ManaGame produces structured evidence. It does not make hiring decisions, and
no field in this API should be wired directly to an automated reject.

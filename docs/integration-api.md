# ManaGame Integration API (v1)

HTTP API for connecting an ATS or HRIS to ManaGame: send a candidate to a
simulation, and get their report back. That's the whole shape — one write
endpoint to start an assessment, two read endpoints to pull the result.

**Disabled by default.** Set `ATS_API_TOKEN` to enable it. With no token
configured every endpoint returns `503` — it is not merely unauthenticated, it
is off, so a deployment with a blank env var cannot accidentally expose
candidate data or let anyone spin up sessions.

## Authentication

```
Authorization: Bearer <ATS_API_TOKEN>
```

The token is compared in constant time. It is deliberately **not** the operator
passphrase (`ADMIN_PASSWORD`): an integration is a machine with a long-lived
credential; an operator is a person with a browser session and full access.
One secret for both would mean rotating an integration locks out a human, and
would give a vendor's integration an administrator's reach.

## What this API will not return

By design, and at any verbosity, on any endpoint:

- **The candidate's free-text answers.** Every word they wrote.
- **The agent conversation transcript.**
- **The scenario's option keys** — the scoring answer key.
- **The candidate's email address.**

These are the most sensitive things the system holds, and an integration that
copies them into a third-party system moves that exposure somewhere this
codebase cannot see. An assessor who needs the words reads them in the report,
behind the operator gate.

## Endpoints

### `POST /api/v1/sessions` — send a candidate to a simulation

```json
{
  "scenarioId": "supply-chain-manager-1",
  "candidateName": "דנה כהן",
  "candidateEmail": "dana@example.com",
  "externalRef": "your-own-application-id"
}
```

Only `scenarioId` is required. `externalRef` is your own correlation id —
store nothing on your side but that, and look the session up by it later (see
below) instead of having to persist ManaGame's session id.

```json
{
  "data": {
    "sessionId": "…",
    "externalRef": "your-own-application-id",
    "scenarioId": "supply-chain-manager-1",
    "scenarioTitle": "עיכוב אספקה מספק יחיד",
    "playUrl": "https://…/play/supply-chain-manager-1/s/…/consent",
    "durableDelivery": true
  }
}
```

Send `playUrl` to the candidate — it's a deep link straight to the consent
screen, so nothing about the welcome page needs reproducing on your side.

`400` for a missing `scenarioId` or a malformed `candidateEmail`; `404` for an
unknown `scenarioId`. Rate limited to 30 creations per hour per IP — stricter
than the read endpoints, because creating a session is a real, billable
assessment invite, not a cheap poll.

**`durableDelivery: false` is a real warning, read it.** It means no database
is connected (`DATABASE_URL` unset), so the store is per-process memory. The
request that creates a session and the request the candidate's browser makes
moments later are not guaranteed to land on the same server instance — there
is no reason they would be — so a session created through this endpoint can
404 for the candidate the instant it lands on a different instance. The
candidate-initiated flow (starting from the ManaGame welcome page) doesn't
have this problem, because the session-cache cookie carries the session with
the browser; an API-created session has no browser yet to hold that cookie.
**Reliable delivery through this endpoint requires `DATABASE_URL` to be set.**
Treat a `false` here as a go/no-go signal before wiring this into anything a
real candidate will hit.

### `GET /api/v1/sessions` — list, or look one up by your own id

Optional query parameters: `status` (`not_started` / `in_progress` /
`completed`), `scenarioId`, `externalRef` — pass the id you set at creation to
find the session without having stored ManaGame's `sessionId` at all.

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
      "externalRef": "your-own-application-id",
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

### `GET /api/v1/sessions/{sessionId}` — the full report

Adds `criteriaScores` (all nine, each with `measured` and `score100`),
`turnsCompleted` / `totalTurns`, `reviewFlags` (turn index and reason, never the
text behind them), and a `disclaimer` field.

`404` for an unknown session.

## Three things a consumer must handle

1. **`processScore` can be `null`.** It means fewer than three criteria were
   measured, not a low score. Treating null as zero — or as a rejection — is the
   most likely way to misuse this API.
2. **`needsHumanReview: true` means a decision was not classified confidently.**
   It is a request for a person to look, not a negative signal about the
   candidate.
3. **`durableDelivery: false` on session creation means don't ship it to real
   candidates yet.** Connect a database first (see the README's "Connecting a
   database" section) — no code changes needed on either side once you do.

ManaGame produces structured evidence. It does not make hiring decisions, and
no field in this API should be wired directly to an automated reject.

## End-to-end example

```bash
# 1. Send a candidate.
curl -X POST https://your-deployment/api/v1/sessions \
  -H "Authorization: Bearer $ATS_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"scenarioId":"supply-chain-manager-1","candidateName":"דנה כהן","externalRef":"app-4471"}'
# -> { "data": { "playUrl": "https://your-deployment/play/…/consent", ... } }
# Email playUrl to the candidate, or drop it straight into your ATS's UI.

# 2. Poll for the result, by your own id — no need to have stored ours.
curl "https://your-deployment/api/v1/sessions?externalRef=app-4471" \
  -H "Authorization: Bearer $ATS_API_TOKEN"
# -> status moves not_started -> in_progress -> completed as the candidate plays.
```

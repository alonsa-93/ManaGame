# ManaGame

A dynamic decision-simulation platform: candidates and managers are placed inside changing
business environments and observed as they decide — not asked how they *would* decide.

Built from the ManaGame Master Brand/UX/UI Spec (v2.0) and the accompanying product PRD.

## Live

**https://mana-game-git-claude-managem-b-c96eb9-alonsa1993-1326s-projects.vercel.app**

This is Vercel's stable "git branch" alias — it always serves the latest push to
`claude/managem-brand-uiux-spec-7zci61`, deployment protection is off, and it's been
verified live (homepage, `/technology`, and `/play/supply-chain-manager-1` all return 200
with correct RTL Hebrew content).

It is **not** `mana-game-amber.vercel.app`. That "production" alias is still pointing at the
very first deployment and hasn't picked up any commit since — the Vercel project's
Production Branch setting doesn't match this branch, and the two tools available in this
session (`create_git_project`, which errors on this repo with `incorrect_git_source_info`,
and no dedicated "set production branch" / "promote deployment" tool) couldn't fix that
part. Repointing it takes one dashboard action: **Vercel → mana-game → Settings → Git →
Production Branch → `claude/managem-brand-uiux-spec-7zci61`** (or merge this branch into
whatever branch that setting already points to). Everything else about the deployment is
fine — build succeeds, routes correctly (see the `vercel.json` fix below), and is public.

## What's here

**Product** (the simulation platform)
- Candidate experience: welcome → consent → turn-by-turn decisions → parse confirmation →
  event ("reality changes") → completion. `app/play/[scenarioId]/...`
- Assessor experience: session list, per-session report (process vs. outcome score, evidence
  per criterion, human-review flag, advocacy-inquiry questions), comparison-rule explainer.
  `app/assessor/...`
- Admin: scenario library browser, turn/delta viewer, publish-validation checklist, event and
  rubric views. `app/admin/...` — scoped down from the full wizard-based builder in the spec;
  scenario content is authored as versioned TypeScript, not edited at runtime (see below).
- 10 business domains × 2 role-tier scenarios each (20 scenarios, ~4 branching turns apiece):
  supply chain, finance, product/R&D, sales, healthcare/medical devices, semiconductors,
  aviation & defense, retail, people/HR, cybersecurity. `content/scenarios/*.ts`

**Discoverability & site metadata**
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` — generated from one shared route list
  (`lib/public-routes.ts`), so the sitemap can never list a URL robots.txt disallows. `/admin`,
  `/assessor` and `/play` are excluded from both *and* carry `noindex` in their layouts: robots.txt
  stops crawling, `noindex` stops indexing of a URL someone links to from elsewhere. `/play` is
  public but must stay unindexed — a scenario situation in search results is a candidate reading
  the simulation before sitting it.
- `app/opengraph-image.tsx` — the share card, generated at build time by `next/og`. Hebrew text runs
  through `lib/rtl-visual.ts` first: Satori (the renderer behind `next/og`) has no bidi engine and
  paints characters left-to-right, so without it the Hebrew comes out mirrored. That helper is for
  Satori only — never use it for page content, where the browser's own bidi handles `dir="rtl"`.
- `lib/site-url.ts` — `canonicalSiteUrl()` (stable: `metadataBase`, canonicals, sitemap, JSON-LD)
  and `deploymentUrl()` (per-deploy: links inside outbound notifications) are deliberately separate.
  Using the per-deployment URL as the canonical would publish a different origin on every push.
- `components/marketing/structured-data.tsx` — Organization + WebSite + FAQPage JSON-LD, generated
  from the same `content/faq.ts` the page renders visibly.

**Website** (`app/(marketing)/...`) — hero, problem/shift narrative, interactive state demo,
how-it-works, technology teaser, process-vs-outcome, evidence & human review, use cases,
security teaser, philosophy/trust/"what we know", FAQ, contact; a full `/technology` deep-dive
(architecture map, state engine, determinism lab, event engine, judge pipeline, an interactive
client-side Security Lab); and a real, playable `/experience` demo (not a video — it launches an
actual scenario through the same engine).

**Decision engine** (`lib/engine/`) — pure, testable, deterministic:
- `state.ts` — KPI deltas, clamped to each KPI's declared range.
- `parser.ts` / `llm-parser.ts` — free text → matched canonical actions. Deterministic keyword
  heuristic by default; upgrades automatically to Claude-assisted classification when
  `ANTHROPIC_API_KEY` is set. Either path returns the same shape, so nothing downstream changes.
- `judge.ts` — turns matched actions into evidence entries (criterion, score, evidence sentence,
  source turn) using only what's authored on the scenario content — no invented scores.
- `aggregator.ts` — deterministic process-score / outcome-score computation from evidence + final
  KPI state. Pure function; same input always gives the same output.
- `turn-advance.ts` — pure KPI/branching/completion math for one turn, shared by both flows below.
- `session.ts` — orchestrates one turn: parse → judge → state update → persist, plus a
  parse-only `previewDecision` used for the "is this what you meant?" confirmation step.
- `conversational-agent.ts` — the AI-as-judge path (see "Conversational agent" below): converses
  about a turn (at most one clarifying follow-up) and scores the fixed rubric directly from what
  was said, instead of reading a pre-authored option's static score.

## Runs out of the box

No database and no LLM key are required to run the full product end-to-end — every screen,
the whole candidate → assessor loop, and all 20 scenarios work immediately:

- **Storage**: `lib/store/` picks a Postgres-backed store when `DATABASE_URL` is set, otherwise
  an in-process store (`lib/store/memory.ts`). Same interface either way (`lib/store/types.ts`).
- **Decision parsing**: deterministic heuristic matcher by default; Claude-assisted when
  `ANTHROPIC_API_KEY` is set.
- **Serverless resiliency**: on Vercel, consecutive requests aren't guaranteed to hit the same
  warm instance, which would otherwise lose an in-process session mid-flow. `lib/session-cache.ts`
  writes a compact, HMAC-signed session snapshot into an httpOnly cookie on every mutation
  (`lib/session-cookie-sign.ts` — signing prevents a candidate from editing the cookie via
  devtools/curl to forge their own KPI state or turn progress) and rehydrates the in-process store
  from it on a miss (only when no database is configured — inert once one is). The snapshot
  includes accumulated per-criterion evidence (not just KPI state), so the final report still
  scores correctly even when a session's turns land on different cold serverless instances.
  Verified with a script that wipes the store mid-session and confirms the flow still completes.
- **`vercel.json`** pins `"framework": "nextjs"`. Without it, this project's Vercel dashboard
  setting was somehow unset, which built fine but served 404s for every route at the edge —
  declaring it in-repo fixed that regardless of dashboard state.

### Protecting the internal area

`/admin` and `/assessor` hold every candidate's answers, evidence and scores — the most sensitive
thing this system stores. Set `ADMIN_PASSWORD` and `proxy.ts` gates both behind a passphrase,
issuing a signed 12-hour session cookie (`lib/auth/admin-session.ts`; Web Crypto rather than
`node:crypto` because proxy runs on the Edge runtime).

It is a shared passphrase, not user accounts, and that is a deliberate limit rather than an
oversight: with one operator today, real per-assessor identity — with roles and an access audit
trail — would be a fake if built now. What the passphrase does give is a genuine boundary: signed,
expiring, and invalidated the moment the passphrase changes.

**When `ADMIN_PASSWORD` is unset the gate is off** so local development and the existing deployment
keep working unchanged — and every internal page then carries a standing, non-dismissible warning
saying so. Failing open silently would be the worse bug.

`docs/personal-data-map.md` is the engineering inventory behind this: what personal data exists,
where it goes (including the two outbound paths — Anthropic and Make), who can reach it, and the
gaps that remain before real candidates use the system.

### Connecting a database (optional, for durable/cross-instance storage)

The in-process store is real and fully functional, but it lives in server memory — fine for
demoing and for light use, not guaranteed durable across deploys or multiple server instances.
To upgrade:

1. Get a Postgres connection string from any provider (a new free Supabase or Neon project both
   work in ~30 seconds; Vercel Postgres too).
2. Set `DATABASE_URL` in your environment (see `.env.example`).
3. `npm run db:migrate` (or it auto-applies via your provider's migration flow).

No code changes needed — `lib/store/index.ts` switches automatically.

> **Why this isn't already wired to a database:** this build ran unattended against the
> account's existing Supabase organization, which was already at its 2-project free-tier limit
> with two other live, in-use projects (real client data — not placeholders). Creating a new
> project was blocked, and pausing or repurposing either existing one would have risked another
> project's data without asking first. Rather than do either, the app was built to run fully
> without a database and upgrade automatically the moment one is connected.

### Connecting an LLM (optional, for AI-assisted parsing and the conversational agent)

Set `ANTHROPIC_API_KEY`. Two independent capabilities turn on together:

- **Parsing** (`llm-parser.ts`): free text → matched canonical action, via a forced tool call.
  The engine still computes state deterministically either way (heuristic or model-assisted).
- **Conversational agent** (`conversational-agent.ts`): the candidate-facing turn UI switches from
  the composer-only `DecisionFlow` to the chat-based `AgentChatFlow`
  (`components/candidate/agent-chat-flow.tsx`). The agent may ask exactly one clarifying
  follow-up question per turn, then scores the fixed 9-criterion rubric directly from the
  conversation (`decision_evidence`) while still using the turn's canonical option vocabulary to
  drive deterministic KPI deltas and branching — so `/assessor` needs no changes to display it.
  The full exchange is logged in `turn_conversations` (run `npm run db:migrate` after pulling this
  to pick up the new table). Falls back to the deterministic `DecisionFlow` automatically when no
  key is set. `/admin/system` has an on-demand "בדיקת חיבור לסוכן" button that makes one real
  (cheap) call to confirm the key actually works — not just that it's present.

### Connecting Make (optional, for notifications/automation)

Set `MAKE_WEBHOOK_URL` to a Make.com "Custom webhook" URL. `lib/integrations/make-webhook.ts`
POSTs a small JSON event (`{event, sessionId, candidateName, scenarioTitle, reportUrl, ...}`) to
it on two triggers: `session_completed` (session finished, includes process/outcome scores) and
`needs_human_review` (a decision got flagged, from either the deterministic or conversational-agent
flow). All routing — send an email, post to Slack, add a CRM row, whatever — is configured inside
the Make scenario itself, not in this repo; ManaGame only knows the webhook URL and event shape.
Never blocks the candidate/session flow: a down or unconfigured webhook is a silent no-op.

A third event, `contact_lead`, fires when someone submits the marketing contact form. It reuses the
same payload shape (so it needs no new Make configuration) and adds a `lead` object with the
enquiry itself. This matters more than it looks: without a database the store is process memory, so
the Make copy is the *only* record of a lead that survives a cold start.

A starter scenario (webhook → router → "session completed" / "needs review" email) already exists
in the account this was built for — see Make scenario `ManaGame — אירועי סימולציה`.

### Contact form and leads

`/admin/leads` lists every enquiry (newest first) and says plainly when it's showing memory-only
data. The form itself carries two no-third-party spam guards — a decoy field and a minimum
fill-time (`lib/spam-guard.ts`) — plus a per-IP rate limit (`lib/rate-limit.ts`). Read the doc
comments on both: the rate limiter's counters live in the process, so on Vercel it is enforced per
warm instance and is a speed bump rather than a guarantee until a shared store backs it.

## Scope notes / what's intentionally lighter than the full spec

- **Admin** is a content *browser* (scenario/turn/delta viewer, event list, fixed rubric view,
  validation checklist), not the full drag-and-drop Scenario Builder wizard (§27-31). Scenario
  content lives in `content/scenarios/*.ts` — versioned with the code, reviewed like code.
- **English toggle**: the spec calls for one, and a "עברית | English" control used to sit in the
  header with no `onClick` and no English site behind it. It has been removed rather than left
  decorative — on a product that sells evidence and honesty, a control that does nothing is worse
  than no control. Restore it alongside a real locale route, not before.
- **Comparison** (`/assessor/comparison`) explains and enforces the D7/seed comparability rule in
  copy, but doesn't yet have two completed same-scenario sessions to compare against each other
  in this fresh environment.
- Fixed 9-criterion rubric (`lib/scenario-schema.ts`, `CRITERIA`) shared across every domain —
  this is what keeps cross-domain evidence, reports and (future) comparisons apples-to-apples
  without a bespoke rubric per scenario.
- **Known content gap**: run `npm run lint:content`. It walks every path through every scenario
  (exhaustively — one option per turn) and reports that all 20 scenarios have at least one
  candidate path accumulating fewer than 3 distinct measured criteria, which `aggregator.ts`
  requires for a non-null process score. In 9 of the 20 the worst path measures *zero* criteria,
  and 74 of 331 options (22.4%) carry no `criteriaSignals` at all. That worst path tends to be
  exactly the "spin/centralize/minimize-disclosure" pattern you'd most want to be able to score.
  Fixing it means adding `criteriaSignals` to specific options across `content/scenarios/*.ts` —
  a content-authoring task, not a code fix; not done in this pass. Once it is, `npm run
  lint:content -- --strict` exits non-zero while any scenario still has an unscoreable path, so
  it works as the completion gate.
- `scripts/smoke-test.mjs` drives the deterministic composer flow (`DecisionFlow`) specifically —
  it will fail if it runs somewhere `ANTHROPIC_API_KEY` is set, since `/turn` then renders the
  conversational `AgentChatFlow` instead. Not yet updated to detect and exercise both flows.

## Local development

```bash
npm install
npm run dev
```

## Verifying a build

```bash
npm test                    # unit tests (vitest) — pure engine logic: agent-output validation,
                             # turn-advance math, memory store, site URLs, spam guard, rate limiter
npm run lint                # eslint
npm run lint:content        # scenario criteria-coverage report (see "Known content gap")
npm run build
npm run start -- -p 3100   # in one terminal
npm run smoke               # in another — Playwright checks every page + a full candidate run
```

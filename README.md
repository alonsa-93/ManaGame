# ManaGame

A dynamic decision-simulation platform: candidates and managers are placed inside changing
business environments and observed as they decide — not asked how they *would* decide.

Built from the ManaGame Master Brand/UX/UI Spec (v2.0) and the accompanying product PRD.

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
- `session.ts` — orchestrates one turn: parse → judge → state update → persist, plus a
  parse-only `previewDecision` used for the "is this what you meant?" confirmation step.

## Runs out of the box

No database and no LLM key are required to run the full product end-to-end — every screen,
the whole candidate → assessor loop, and all 20 scenarios work immediately:

- **Storage**: `lib/store/` picks a Postgres-backed store when `DATABASE_URL` is set, otherwise
  an in-process store (`lib/store/memory.ts`). Same interface either way (`lib/store/types.ts`).
- **Decision parsing**: deterministic heuristic matcher by default; Claude-assisted when
  `ANTHROPIC_API_KEY` is set.

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

### Connecting an LLM (optional, for AI-assisted parsing)

Set `ANTHROPIC_API_KEY`. The rest of the pipeline (state engine, judge, aggregator) is identical
either way — per spec, the model interprets language, the engine still computes state
deterministically.

## Scope notes / what's intentionally lighter than the full spec

- **Admin** is a content *browser* (scenario/turn/delta viewer, event list, fixed rubric view,
  validation checklist), not the full drag-and-drop Scenario Builder wizard (§27-31). Scenario
  content lives in `content/scenarios/*.ts` — versioned with the code, reviewed like code.
- **English toggle** in the header is present per spec but not yet wired to a translated site —
  the product is Hebrew-first per the spec's V1 default.
- **Comparison** (`/assessor/comparison`) explains and enforces the D7/seed comparability rule in
  copy, but doesn't yet have two completed same-scenario sessions to compare against each other
  in this fresh environment.
- Fixed 9-criterion rubric (`lib/scenario-schema.ts`, `CRITERIA`) shared across every domain —
  this is what keeps cross-domain evidence, reports and (future) comparisons apples-to-apples
  without a bespoke rubric per scenario.

## Local development

```bash
npm install
npm run dev
```

## Verifying a build

```bash
npm run build
npm run start -- -p 3100   # in one terminal
npm run smoke               # in another — Playwright checks every page + a full candidate run
```

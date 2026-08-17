-- ManaGame data schema. Portable Postgres — works with any provider
-- (Supabase, Neon, Vercel Postgres, RDS...) via a plain DATABASE_URL.
-- Run with: npm run db:migrate
--
-- Scenario/domain CONTENT is authored in-repo (content/scenarios/*.ts) and
-- read directly by the app — it is static, versioned with the code, and
-- does not need a database round-trip. Only session-runtime data (what a
-- candidate actually did) is persisted here.

create table if not exists sessions (
  id text primary key,
  scenario_id text not null,
  candidate_name text,
  candidate_email text,
  status text not null default 'in_progress',
  seed text not null,
  current_turn int not null default 1,
  kpi_state jsonb not null,
  kpi_history jsonb not null default '[]',
  consent_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists sessions_scenario_idx on sessions(scenario_id);
create index if not exists sessions_created_idx on sessions(created_at desc);

create table if not exists decisions (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  turn_index int not null,
  raw_text text not null,
  matched_option_keys text[] not null default '{}',
  confidence numeric,
  needs_human_review boolean not null default false,
  review_reason text,
  created_at timestamptz not null default now()
);
create index if not exists decisions_session_idx on decisions(session_id);

create table if not exists decision_evidence (
  id text primary key,
  decision_id text not null references decisions(id) on delete cascade,
  criterion text not null,
  score numeric not null,
  evidence_he text not null,
  source_turn int not null
);
create index if not exists evidence_decision_idx on decision_evidence(decision_id);

create table if not exists session_events (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  turn_index int not null,
  event_he text not null,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  session_id text primary key references sessions(id) on delete cascade,
  process_score int,
  outcome_score int not null,
  criteria_scores jsonb not null,
  generated_at timestamptz not null default now()
);

create table if not exists contact_submissions (
  id text primary key,
  name text not null,
  role text,
  organization text,
  email text not null,
  what_to_test text,
  org_size text,
  created_at timestamptz not null default now()
);

-- =============================================================
-- Wacky Works — project enquiries
-- =============================================================
-- Stores every "Start a project" form submission so a lead is
-- never lost, even if the notification email hiccups. The public
-- site never touches this table directly — the browser POSTs to
-- the `send-enquiry` edge function, which writes here with the
-- service role and then emails elliot@wackyworks.co.uk.
--
-- Paste into Supabase → SQL Editor → New query → Run. Idempotent.
-- =============================================================

create table if not exists public.project_enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  venue_setting text,              -- Indoors | Outdoors | Both
  venue_status  text,              -- Existing venue | New venue
  location      text,              -- location in the UK
  holes         text,              -- 9 | 18 | 27 | 36
  opening_date  text,              -- free text ("Spring 2027")
  budget        text,              -- free text
  heard         text,              -- Word of mouth | Google | Social media | Other
  first_name    text,
  last_name     text,
  email         text,
  phone         text,
  emailed       boolean not null default false,   -- did the notification send?
  user_agent    text
);

create index if not exists project_enquiries_created_idx
  on public.project_enquiries (created_at desc);

-- RLS on, with NO anon policies: the table is reachable only through
-- the edge function (service role bypasses RLS) and the admin. The
-- public anon key can neither read nor write it directly.
alter table public.project_enquiries enable row level security;

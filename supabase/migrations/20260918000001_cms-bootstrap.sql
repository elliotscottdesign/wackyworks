-- =============================================================
-- Wacky Works — CMS bootstrap
-- =============================================================
-- One-stop schema for the wackyworks.co.uk content editor,
-- ported from the nodice.bar CMS (page_content + gallery_images
-- + media_library + media bucket + policies) and simplified to
-- a single, idempotent, re-runnable file.
--
-- Paste this into Supabase → SQL Editor → New query → Run.
-- Safe to re-run (all statements use IF NOT EXISTS / ON CONFLICT
-- / DROP-then-CREATE).
-- =============================================================


-- -------------------------------------------------------------
-- 0. shared function used by updated_at triggers
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =============================================================
-- 1. page_content — every editable text / image slot on the site
-- =============================================================
create table if not exists public.page_content (
  key         text primary key,
  value       text not null default '',
  page        text not null,                          -- "home", "case-studies", "contact"…
  field_kind  text not null default 'text'
               check (field_kind in ('text', 'textarea', 'html', 'image', 'url')),
  label       text not null,                          -- shown in admin form
  helper      text,                                   -- placeholder/help text in admin
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);

create index if not exists page_content_page on public.page_content (page, sort_order);

drop trigger if exists page_content_updated_at on public.page_content;
create trigger page_content_updated_at
  before update on public.page_content
  for each row execute function public.set_updated_at();

alter table public.page_content enable row level security;

drop policy if exists "public read page content" on public.page_content;
create policy "public read page content" on public.page_content
  for select to anon, authenticated using (true);

drop policy if exists "auth write page content" on public.page_content;
create policy "auth write page content" on public.page_content
  for all to authenticated using (true) with check (true);

grant select on public.page_content to anon;
grant select, insert, update, delete on public.page_content to authenticated;


-- =============================================================
-- 2. media_library — every uploaded file
-- =============================================================
create table if not exists public.media_library (
  id          uuid primary key default gen_random_uuid(),
  filename    text not null,
  storage_path text not null,
  public_url  text not null,
  alt         text,
  bytes       int,
  uploaded_at timestamptz not null default now()
);

create index if not exists media_library_uploaded on public.media_library (uploaded_at desc);

alter table public.media_library enable row level security;

drop policy if exists "public read media" on public.media_library;
create policy "public read media" on public.media_library
  for select to anon, authenticated using (true);

drop policy if exists "auth write media" on public.media_library;
create policy "auth write media" on public.media_library
  for all to authenticated using (true) with check (true);

grant select on public.media_library to anon;
grant select, insert, update, delete on public.media_library to authenticated;


-- =============================================================
-- 3. gallery_images — flat per-gallery image lists w/ focal point
-- =============================================================
create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  gallery_key   text not null,
  src           text not null,
  alt           text,
  caption       text,
  sort_order    int  not null default 0,
  active        boolean not null default true,
  position_x    int  not null default 50   check (position_x    between 0 and 100),
  position_y    int  not null default 50   check (position_y    between 0 and 100),
  position_zoom numeric(4,2) not null default 1.0 check (position_zoom between 1 and 4),
  position_fit  text not null default 'cover' check (position_fit in ('cover', 'contain')),
  created_at    timestamptz not null default now()
);

create index if not exists gallery_images_key on public.gallery_images (gallery_key, sort_order);

alter table public.gallery_images enable row level security;

drop policy if exists "public read gallery images" on public.gallery_images;
create policy "public read gallery images" on public.gallery_images
  for select to anon, authenticated using (active = true);

drop policy if exists "auth write gallery images" on public.gallery_images;
create policy "auth write gallery images" on public.gallery_images
  for all to authenticated using (true) with check (true);

grant select on public.gallery_images to anon;
grant select, insert, update, delete on public.gallery_images to authenticated;


-- =============================================================
-- 4. storage bucket "media" + policies
-- =============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "auth upload media bucket" on storage.objects;
create policy "auth upload media bucket" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists "auth update media bucket" on storage.objects;
create policy "auth update media bucket" on storage.objects
  for update to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "auth delete media bucket" on storage.objects;
create policy "auth delete media bucket" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media');


-- =============================================================
-- 5. seed page_content — every editable slot on wackyworks.co.uk
-- =============================================================
-- Re-runnable: existing values are preserved (ON CONFLICT DO UPDATE
-- overwrites only metadata, never the saved value).

insert into public.page_content (key, page, field_kind, label, helper, sort_order, value) values
  -- HEADER -----------------------------------------------------
  ('header.wordmark_1',      'header', 'text', 'Wordmark part 1',      'The "WACKY" half of the logotype.',                            1, ''),
  ('header.wordmark_2',      'header', 'text', 'Wordmark part 2',      'The "WORKS" half of the logotype.',                            2, ''),
  ('header.email',           'header', 'text', 'Contact email',        'Shown top-right and in the footer / CTA buttons.',             3, ''),

  -- HERO -------------------------------------------------------
  ('hero.eyebrow',           'home', 'text',     'Hero eyebrow',       'Small uppercase line above the headline.',                     1, ''),
  ('hero.headline_1',        'home', 'text',     'Headline line 1',    'Big display headline, first line.',                            2, ''),
  ('hero.headline_2',        'home', 'text',     'Headline line 2',    'Big display headline, second (lime) line.',                    3, ''),
  ('hero.subhead',           'home', 'textarea', 'Sub-copy',           'One-paragraph pitch under the headline.',                      4, ''),
  ('hero.cta_label',         'home', 'text',     'CTA button label',   'Wording on the primary "Start a project" button.',             5, ''),

  -- THE CRAFT (intro) ------------------------------------------
  ('craft.eyebrow',          'home', 'text',     'Craft eyebrow',      '',                                                             10, ''),
  ('craft.stat',             'home', 'text',     'Craft big number',   'e.g. "1,000,000+"',                                            11, ''),
  ('craft.stat_label',       'home', 'text',     'Craft stat label',   'The line beneath the big number.',                             12, ''),
  ('craft.body',             'home', 'textarea', 'Craft body copy',    'Two paragraphs — separate with a blank line.',                 13, ''),
  ('craft.layout_image',     'home', 'image',    'Layout ideas image', '',                                                             14, ''),

  -- OBSTACLES SECTION HEADER -----------------------------------
  ('obstacles.eyebrow',      'home', 'text',     'Obstacles eyebrow',  '',                                                             20, ''),
  ('obstacles.title',        'home', 'text',     'Obstacles heading',  '',                                                             21, ''),
  ('obstacles.intro',        'home', 'textarea', 'Obstacles intro',    '',                                                             22, ''),

  -- FINISHES SECTION HEADER ------------------------------------
  ('finishes.eyebrow',       'home', 'text',     'Finishes eyebrow',   '',                                                             30, ''),
  ('finishes.title',         'home', 'text',     'Finishes heading',   '',                                                             31, ''),
  ('finishes.intro',         'home', 'textarea', 'Finishes intro',     '',                                                             32, ''),

  -- SERVICES SECTION HEADER ------------------------------------
  ('services.eyebrow',       'home', 'text',     'Services eyebrow',   '',                                                             40, ''),
  ('services.title',         'home', 'text',     'Services heading',   '',                                                             41, ''),
  ('services.intro',         'home', 'textarea', 'Services intro',     '',                                                             42, ''),

  -- PACKAGES SECTION HEADER + NOTES ----------------------------
  ('packages.eyebrow',       'home', 'text',     'Packages eyebrow',   '',                                                             50, ''),
  ('packages.title',         'home', 'text',     'Packages heading',   '',                                                             51, ''),
  ('packages.intro',         'home', 'textarea', 'Packages intro',     '',                                                             52, ''),
  ('packages.notes',         'home', 'textarea', 'Package notes',      'Bulleted notes shown under the pricing cards. One per line.',  53, ''),
  ('packages.reference_sheet','home','image',    'Pricing sheet image','The full price-breakdown image from the catalogue.',           54, ''),

  -- CLOSING CTA ------------------------------------------------
  ('cta.eyebrow',            'home', 'text',     'CTA eyebrow',        '',                                                             60, ''),
  ('cta.headline_1',         'home', 'text',     'CTA headline line 1','',                                                             61, ''),
  ('cta.headline_2',         'home', 'text',     'CTA headline line 2','Highlighted lime portion of the closing headline.',            62, ''),
  ('cta.body',               'home', 'textarea', 'CTA body copy',      '',                                                             63, ''),

  -- FOOTER -----------------------------------------------------
  ('footer.address',         'footer', 'text', 'Footer address',       '',                                                             1, ''),
  ('footer.company',         'footer', 'text', 'Footer company name',  'Legal entity shown next to the © line.',                       2, ''),

  -- NAV --------------------------------------------------------
  ('header.nav',             'header', 'textarea', 'Header nav',       'One row per link, format:  Label | #anchor-or-URL',            10, '')
on conflict (key) do update
  set page       = excluded.page,
      field_kind = excluded.field_kind,
      label      = excluded.label,
      helper     = excluded.helper,
      sort_order = excluded.sort_order;


-- =============================================================
-- 6. seed page_content — per-item slots for the four grids
-- =============================================================
-- 14 obstacles × 4 fields, 3 finishes × 5 fields, 3 services × 3
-- fields, 3 packages × 3 fields. Editing is per-scalar; adding a
-- brand-new obstacle/finish/service/package is a code change (v1).

do $$
declare
  i int;
begin
  -- Obstacles (14)
  for i in 1..14 loop
    insert into public.page_content (key, page, field_kind, label, helper, sort_order, value) values
      ('obstacles.item_' || i || '.name',  'obstacles', 'text',     'Obstacle ' || i || ' — name',  '', i*10 + 1, ''),
      ('obstacles.item_' || i || '.size',  'obstacles', 'text',     'Obstacle ' || i || ' — size',  '', i*10 + 2, ''),
      ('obstacles.item_' || i || '.image', 'obstacles', 'image',    'Obstacle ' || i || ' — image', '', i*10 + 3, ''),
      ('obstacles.item_' || i || '.blurb', 'obstacles', 'textarea', 'Obstacle ' || i || ' — blurb', '', i*10 + 4, '')
    on conflict (key) do update
      set page = excluded.page, field_kind = excluded.field_kind,
          label = excluded.label, helper = excluded.helper, sort_order = excluded.sort_order;
  end loop;

  -- Finishes (3)
  for i in 1..3 loop
    insert into public.page_content (key, page, field_kind, label, helper, sort_order, value) values
      ('finishes.item_' || i || '.name',     'finishes', 'text',     'Finish ' || i || ' — name',     '', i*10 + 1, ''),
      ('finishes.item_' || i || '.image',    'finishes', 'image',    'Finish ' || i || ' — image',    '', i*10 + 2, ''),
      ('finishes.item_' || i || '.tagline',  'finishes', 'text',     'Finish ' || i || ' — tagline',  '', i*10 + 3, ''),
      ('finishes.item_' || i || '.price',    'finishes', 'text',     'Finish ' || i || ' — price line','', i*10 + 4, ''),
      ('finishes.item_' || i || '.includes', 'finishes', 'textarea', 'Finish ' || i || ' — includes', 'One tick per line.', i*10 + 5, '')
    on conflict (key) do update
      set page = excluded.page, field_kind = excluded.field_kind,
          label = excluded.label, helper = excluded.helper, sort_order = excluded.sort_order;
  end loop;

  -- Services (3)
  for i in 1..3 loop
    insert into public.page_content (key, page, field_kind, label, helper, sort_order, value) values
      ('services.item_' || i || '.name',   'services', 'text',     'Service ' || i || ' — name',   '', i*10 + 1, ''),
      ('services.item_' || i || '.image',  'services', 'image',    'Service ' || i || ' — image',  '', i*10 + 2, ''),
      ('services.item_' || i || '.detail', 'services', 'textarea', 'Service ' || i || ' — detail', '', i*10 + 3, '')
    on conflict (key) do update
      set page = excluded.page, field_kind = excluded.field_kind,
          label = excluded.label, helper = excluded.helper, sort_order = excluded.sort_order;
  end loop;

  -- Packages (3)
  for i in 1..3 loop
    insert into public.page_content (key, page, field_kind, label, helper, sort_order, value) values
      ('packages.item_' || i || '.name',  'packages', 'text',     'Package ' || i || ' — name',  '', i*10 + 1, ''),
      ('packages.item_' || i || '.total', 'packages', 'text',     'Package ' || i || ' — total', 'Big price. Include the currency.', i*10 + 2, ''),
      ('packages.item_' || i || '.lines', 'packages', 'textarea', 'Package ' || i || ' — lines', 'One line item per row, format:  Description | Amount', i*10 + 3, '')
    on conflict (key) do update
      set page = excluded.page, field_kind = excluded.field_kind,
          label = excluded.label, helper = excluded.helper, sort_order = excluded.sort_order;
  end loop;
end$$;


-- Done. Confirm with:
--   select page, count(*) from public.page_content group by page order by page;

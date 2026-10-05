-- Sabiora website — database schema.
-- This file is the record of the database. Change it here, then run it in the Supabase
-- SQL editor (Dashboard → SQL Editor → paste → Run). It is safe to run more than once.
--
-- Access model: the website reads with the public (publishable) key, so every table has
-- Row Level Security on and the only policy is "anyone may read rows that are published".
-- Nothing can be written with the public key. Editing is done in the Supabase dashboard.

-- ------------------------------------------------------------------ helpers

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------ blog posts

create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  -- Becomes the address: /blog/<slug>. Lowercase letters, numbers and single hyphens only.
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (length(trim(title)) > 0),
  -- One or two sentences, shown on the blog list and in search results.
  excerpt          text not null default '',
  -- The article body, written in Markdown.
  content_md       text not null default '',
  -- Optional. A full https:// address, e.g. a file in the "media" storage bucket.
  cover_image_url  text check (cover_image_url is null or cover_image_url ~ '^https://'),
  cover_image_alt  text not null default '',
  author_name      text not null default 'Sabiora Technologies',
  tags             text[] not null default '{}',
  -- A row is public only when published is true AND published_at is not in the future.
  published        boolean not null default false,
  published_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists posts_published_at_idx on public.posts (published_at desc) where published;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  to anon, authenticated
  using (published and published_at <= now());

grant select on public.posts to anon, authenticated;

-- ------------------------------------------------------------------ careers

create table if not exists public.jobs (
  id               uuid primary key default gen_random_uuid(),
  -- Becomes the address: /careers/<slug>.
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (length(trim(title)) > 0),
  department       text not null default '',
  location         text not null default 'Kathmandu, Nepal',
  remote           boolean not null default false,
  employment_type  text not null default 'FULL_TIME'
                   check (employment_type in ('FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN')),
  -- One or two sentences, shown on the careers list.
  summary          text not null default '',
  -- The full role description, written in Markdown.
  description_md   text not null default '',
  -- Where applications go. Leave empty to use the site's general contact address.
  apply_email      text check (apply_email is null or apply_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  -- A role is public when published is true, posted_at has passed and closes_at has not.
  published        boolean not null default false,
  posted_at        timestamptz not null default now(),
  closes_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc) where published;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

alter table public.jobs enable row level security;

drop policy if exists "Public can read open jobs" on public.jobs;
create policy "Public can read open jobs"
  on public.jobs for select
  to anon, authenticated
  using (published and posted_at <= now() and (closes_at is null or closes_at >= now()));

grant select on public.jobs to anon, authenticated;

-- ------------------------------------------------------------------ services

-- The services shown on the home page and at /services/<id>.
-- While this table is empty the site uses the defaults in lib/data.ts; run supabase/seed.sql to load them.
create table if not exists public.services (
  -- Becomes the address: /services/<id>. Lowercase letters, numbers and single hyphens only.
  id          text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null check (length(trim(title)) > 0),
  -- One or two sentences under the title.
  blurb       text not null default '',
  -- Short labels shown as chips on the home-page card (three or four is plenty).
  features    text[] not null default '{}',
  -- The full "what's included" list on the service's own page.
  details     text[] not null default '{}',
  -- Optional longer description for the service page, in Markdown.
  body_md     text not null default '',
  -- Which illustration the card uses. They are drawn in code, so only these names exist.
  visual      text not null default 'dashboard'
              check (visual in ('phones', 'browser', 'checkout', 'pipeline', 'canvas', 'api', 'dashboard', 'uptime')),
  -- How many of the three desktop columns the card takes. The site widens cards if a row would have a hole.
  span        smallint not null default 1 check (span between 1 and 3),
  -- Lower numbers come first.
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;

drop policy if exists "Public can read published services" on public.services;
create policy "Public can read published services"
  on public.services for select
  to anon, authenticated
  using (published);

grant select on public.services to anon, authenticated;

-- ------------------------------------------------------------------ projects

-- The projects shown on the home page and at /projects/<slug>.
-- While this table is empty the site uses the defaults in lib/data.ts; run supabase/seed.sql to load them.
create table if not exists public.projects (
  -- Becomes the address: /projects/<slug>.
  slug          text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (length(trim(title)) > 0),
  -- e.g. "Web Application", "Mobile Application".
  category      text not null default '',
  -- 'web' shows the image in a browser frame; 'mobile' shows it as a portrait poster.
  platform      text not null default 'web' check (platform in ('web', 'mobile')),
  industry      text[] not null default '{}',
  description   text not null default '',
  -- One factual line for the badge on the card. Never an invented metric.
  highlight     text not null default '',
  -- The "what we built" bullet points.
  highlights    text[] not null default '{}',
  -- Optional longer write-up for the project page, in Markdown.
  body_md       text not null default '',
  -- A path on the site (/images/...) or a full https:// address, e.g. a file in the "media" bucket.
  image_url     text not null check (image_url ~ '^(https://|/)'),
  -- The image's real size in pixels, so the page can reserve space for it.
  image_width   integer check (image_width > 0),
  image_height  integer check (image_height > 0),
  -- Technologies used.
  tags          text[] not null default '{}',
  client        text not null default '',
  year          text not null default '',
  -- The first three featured projects get full cards on the home page.
  featured      boolean not null default false,
  -- Store or external links: [{"label": "App Store", "url": "https://..."}]
  links         jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array'),
  sort_order    integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published);

grant select on public.projects to anon, authenticated;

-- ------------------------------------------------------------------ tech stack

-- The layers in the Tech Stack section (Backend, Frontend, ...), and the technologies in each.
-- While these tables are empty the site uses the defaults in lib/data.ts; run supabase/seed.sql to load them.
create table if not exists public.tech_categories (
  id          text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label       text not null check (length(trim(label)) > 0),
  -- The sentence shown when the category is selected.
  summary     text not null default '',
  sort_order  integer not null default 0
);

create table if not exists public.technologies (
  name         text primary key check (length(trim(name)) > 0),
  -- Two letters shown in the badge, e.g. "Pg".
  abbr         text not null default '',
  -- What we use it for, e.g. "Event streaming".
  purpose      text not null default '',
  category_id  text not null references public.tech_categories (id) on update cascade on delete cascade,
  sort_order   integer not null default 0
);

create index if not exists technologies_category_idx on public.technologies (category_id);

alter table public.tech_categories enable row level security;
alter table public.technologies enable row level security;

drop policy if exists "Public can read tech categories" on public.tech_categories;
create policy "Public can read tech categories"
  on public.tech_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read technologies" on public.technologies;
create policy "Public can read technologies"
  on public.technologies for select
  to anon, authenticated
  using (true);

grant select on public.tech_categories, public.technologies to anon, authenticated;

-- ------------------------------------------------------------------ images

-- A public bucket for cover images. Upload in Dashboard → Storage → media, then copy the
-- file's public URL into posts.cover_image_url. Uploading needs the dashboard (or the secret
-- key); the public key can only read.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Tell the Data API about the new tables straight away.
notify pgrst, 'reload schema';

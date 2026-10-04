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

-- ------------------------------------------------------------------ images

-- A public bucket for cover images. Upload in Dashboard → Storage → media, then copy the
-- file's public URL into posts.cover_image_url. Uploading needs the dashboard (or the secret
-- key); the public key can only read.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Tell the Data API about the new tables straight away.
notify pgrst, 'reload schema';

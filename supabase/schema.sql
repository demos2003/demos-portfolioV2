-- Run this once in the Supabase SQL editor to set up the admin dashboard schema.
-- All access happens server-side via the service role key, so RLS is left disabled
-- (no anon/client-side Supabase access exists in this app).

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  technologies text[] not null default '{}',
  live_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  image_url text,
  post_date text not null,
  read_time text not null,
  tags text[] not null default '{}',
  url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists skill_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  color text not null default 'from-purple-600 to-pink-600',
  display_order int not null default 0
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories(id) on delete cascade,
  name text not null,
  display_order int not null default 0
);

create table if not exists about_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  display_order int not null default 0
);

-- Singleton key/value content: about bio paragraphs, contact info, etc.
create table if not exists site_settings (
  key text primary key,
  value jsonb not null
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists skills_category_id_idx on skills(category_id);
create index if not exists contact_submissions_created_at_idx on contact_submissions(created_at desc);

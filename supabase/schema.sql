-- ============================================================
-- Utopia — Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension (already enabled by default in Supabase)
-- create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 100),
  content     text not null check (char_length(content) between 1 and 5000),
  is_anonymous boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  content     text not null check (char_length(content) between 1 and 500),
  is_anonymous boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.likes (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (post_id, user_id)  -- prevent duplicate likes
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_user_id_idx    on public.posts (user_id);
create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists likes_post_id_idx    on public.likes (post_id);
create index if not exists likes_user_id_idx    on public.likes (user_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ============================================================
-- VIEW: posts_with_counts
-- Joins like_count, comment_count, and author email
-- ============================================================

create or replace view public.posts_with_counts as
select
  p.id,
  p.user_id,
  p.title,
  p.content,
  p.is_anonymous,
  p.created_at,
  p.updated_at,
  count(distinct l.id)::int as like_count,
  count(distinct c.id)::int as comment_count,
  case when p.is_anonymous then null else u.email end as author_email
from public.posts p
left join public.likes    l on l.post_id = p.id
left join public.comments c on c.post_id = p.id
left join auth.users      u on u.id = p.user_id
group by p.id, u.email;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.posts    enable row level security;
alter table public.comments enable row level security;
alter table public.likes    enable row level security;

-- Posts: anyone can read; only owner can insert/delete
create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);

-- Comments: anyone can read; only owner can insert/delete
create policy "comments_select" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_delete" on public.comments for delete using (auth.uid() = user_id);

-- Likes: anyone can read; only owner can insert/delete
create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

-- Grant view access to anon and authenticated roles
grant select on public.posts_with_counts to anon, authenticated;

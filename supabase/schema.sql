-- ============================================================
-- Utopia — Database Schema
-- Supabase SQL Editor 에서 전체 복붙 후 Run
-- ============================================================


-- ============================================================
-- 1. PUBLIC USERS VIEW
--    comments 에서 users(email) 조인이 가능하도록
--    auth.users 를 public 스키마에 노출
-- ============================================================

create or replace view public.users as
  select id, email from auth.users;

grant select on public.users to anon, authenticated;


-- ============================================================
-- 2. TABLES
-- ============================================================

create table if not exists public.posts (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  title        text        not null check (char_length(title) between 1 and 100),
  content      text        not null check (char_length(content) between 1 and 5000),
  is_anonymous boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.comments (
  id           uuid        primary key default gen_random_uuid(),
  post_id      uuid        not null references public.posts(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  content      text        not null check (char_length(content) between 1 and 500),
  is_anonymous boolean     not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.likes (
  id           uuid        primary key default gen_random_uuid(),
  post_id      uuid        not null references public.posts(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (post_id, user_id)
);


-- ============================================================
-- 3. INDEXES
-- ============================================================

create index if not exists posts_created_at_idx  on public.posts    (created_at desc);
create index if not exists posts_user_id_idx     on public.posts    (user_id);
create index if not exists comments_post_id_idx  on public.comments (post_id);
create index if not exists comments_created_at_idx on public.comments (created_at asc);
create index if not exists likes_post_id_idx     on public.likes    (post_id);
create index if not exists likes_user_post_idx   on public.likes    (user_id, post_id);


-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();


-- ============================================================
-- 5. VIEW: posts_with_counts
--    getPosts / getPost 에서 사용
--    like_count, comment_count, author_email 을 한번에 반환
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
  count(distinct l.id)::int                                        as like_count,
  count(distinct c.id)::int                                        as comment_count,
  case when p.is_anonymous then null else u.email end              as author_email
from public.posts     p
left join public.likes    l on l.post_id = p.id
left join public.comments c on c.post_id = p.id
left join auth.users      u on u.id = p.user_id
group by p.id, u.email;

grant select on public.posts_with_counts to anon, authenticated;


-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table public.posts    enable row level security;
alter table public.comments enable row level security;
alter table public.likes    enable row level security;

-- posts
drop policy if exists "posts_select" on public.posts;
drop policy if exists "posts_insert" on public.posts;
drop policy if exists "posts_delete" on public.posts;

create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);

-- comments
drop policy if exists "comments_select" on public.comments;
drop policy if exists "comments_insert" on public.comments;
drop policy if exists "comments_delete" on public.comments;

create policy "comments_select" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_delete" on public.comments for delete using (auth.uid() = user_id);

-- likes
drop policy if exists "likes_select" on public.likes;
drop policy if exists "likes_insert" on public.likes;
drop policy if exists "likes_delete" on public.likes;

create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

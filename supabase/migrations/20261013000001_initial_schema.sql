-- Migration: 20261013000001_initial_schema.sql
-- Description: Sets up initial tables (profiles, pieces, penpals, comments) with Row Level Security (RLS)

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  penpal_id text unique not null,
  avatar text,
  bio text,
  favorite_drink text,
  favorite_quote text,
  writing_goal_words integer default 500,
  role text default 'writer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. PIECES (Poems, Stories, Journals)
create table if not exists public.pieces (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  type text not null check (type in ('poem', 'story', 'journal', 'letter')),
  status text not null check (status in ('draft', 'published', 'penpals')),
  mood_tags text[] default array[]::text[],
  card_tint text default 'default',
  stars integer default 0,
  word_count integer default 0,
  read_time_minutes integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Pieces
alter table public.pieces enable row level security;

create policy "Published pieces are readable by everyone"
  on public.pieces for select
  using (status = 'published');

create policy "Authors can see all their own pieces (including drafts)"
  on public.pieces for select
  using (auth.uid() = author_id);

create policy "Users can insert pieces"
  on public.pieces for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own pieces"
  on public.pieces for update
  using (auth.uid() = author_id);

create policy "Users can delete their own pieces"
  on public.pieces for delete
  using (auth.uid() = author_id);

-- 3. PENPAL CONNECTIONS
create table if not exists public.penpals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  penpal_id text references public.profiles(penpal_id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, penpal_id)
);

alter table public.penpals enable row level security;

create policy "Users can manage their penpal circle"
  on public.penpals for all
  using (auth.uid() = user_id);

-- 4. COMMENTS
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  piece_id uuid references public.pieces(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments on public pieces are readable by everyone"
  on public.comments for select
  using (true);

create policy "Authenticated users can post comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

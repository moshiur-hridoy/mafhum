-- Mafhum foundation schema
-- Run this in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.words (
  id text primary key,
  arabic text not null,
  transliteration text not null,
  meaning text not null,
  bengali_meaning text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  number integer not null unique,
  title text not null,
  subtitle text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_words (
  lesson_id text not null references public.lessons(id) on delete cascade,
  word_id text not null references public.words(id) on delete cascade,
  position integer not null,
  primary key (lesson_id, word_id)
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  streak integer not null default 0,
  hearts integer not null default 5,
  completed_lessons text[] not null default '{}',
  daily_answers integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_words enable row level security;
alter table public.user_progress enable row level security;

create policy "Public can read curriculum" on public.words for select using (true);
create policy "Public can read lessons" on public.lessons for select using (true);
create policy "Public can read lesson words" on public.lesson_words for select using (true);
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can create own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

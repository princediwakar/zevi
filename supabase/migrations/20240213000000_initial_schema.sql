-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create tables
-- Users table (extends auth.users)
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions table
create table if not exists public.questions (
  id uuid default uuid_generate_v4() primary key,
  question_text text not null,
  category text not null,
  difficulty text not null,
  company text,
  interview_type text,
  framework_hint text,
  expert_answer text,
  evaluation_rubric jsonb,
  mcq_version jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Practice Sessions table
create table if not exists public.practice_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  session_type text not null, -- 'mcq' or 'text'
  user_answer text,
  ai_feedback jsonb,
  mcq_answers jsonb,
  score integer,
  time_spent_seconds integer default 0,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress table
create table if not exists public.user_progress (
  user_id uuid references auth.users(id) on delete cascade primary key,
  total_questions_completed integer default 0,
  total_mcq_completed integer default 0,
  total_text_completed integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_practice_date timestamp with time zone,
  category_progress jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drafts table
create table if not exists public.drafts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  draft_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, question_id)
);

-- 3. Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.questions enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.user_progress enable row level security;
alter table public.drafts enable row level security;

-- Policies
-- User Profiles: Users can see/edit their own profile
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);

-- Questions: Everyone can view questions (authenticated)
create policy "Authenticated users can view questions" on public.questions for select using (auth.role() = 'authenticated');

-- Practice Sessions: Users can CRUD their own sessions
create policy "Users can view own sessions" on public.practice_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.practice_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.practice_sessions for update using (auth.uid() = user_id);

-- User Progress: Users can view/update own progress
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

-- Drafts: Users can CRUD their own drafts
create policy "Users can view own drafts" on public.drafts for select using (auth.uid() = user_id);
create policy "Users can insert own drafts" on public.drafts for insert with check (auth.uid() = user_id);
create policy "Users can update own drafts" on public.drafts for update using (auth.uid() = user_id);
create policy "Users can delete own drafts" on public.drafts for delete using (auth.uid() = user_id);

-- 4. RPC Functions

-- Increment Completion Count
create or replace function public.increment_completion_count(
  p_user_id uuid,
  p_session_type text,
  p_category text
)
returns void
language plpgsql
security definer
as $$
declare
  v_progress_exists boolean;
  v_current_category_count int;
  v_category_progress jsonb;
begin
  -- Check if progress record exists
  select exists(select 1 from public.user_progress where user_id = p_user_id) into v_progress_exists;
  
  if not v_progress_exists then
    insert into public.user_progress (user_id, total_questions_completed, total_mcq_completed, total_text_completed, category_progress)
    values (p_user_id, 0, 0, 0, '{}'::jsonb);
  end if;

  -- Get current category progress
  select category_progress into v_category_progress from public.user_progress where user_id = p_user_id;
  v_current_category_count := coalesce((v_category_progress->>p_category)::int, 0);

  -- Update progress
  update public.user_progress
  set 
    total_questions_completed = total_questions_completed + 1,
    total_mcq_completed = case when p_session_type = 'mcq' then total_mcq_completed + 1 else total_mcq_completed end,
    total_text_completed = case when p_session_type = 'text' then total_text_completed + 1 else total_text_completed end,
    category_progress = jsonb_set(coalesce(category_progress, '{}'::jsonb), array[p_category], to_jsonb(v_current_category_count + 1)),
    updated_at = now()
  where user_id = p_user_id;

end;
$$;

-- Update User Streak
create or replace function public.update_user_streak(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_last_practice_date timestamptz;
  v_current_streak int;
  v_longest_streak int;
  v_today date := current_date;
  v_last_date date;
begin
  select last_practice_date, current_streak, longest_streak
  into v_last_practice_date, v_current_streak, v_longest_streak
  from public.user_progress
  where user_id = p_user_id;

  if v_last_practice_date is null then
    -- First practice ever
    update public.user_progress
    set current_streak = 1, longest_streak = 1, last_practice_date = now()
    where user_id = p_user_id;
    return;
  end if;

  v_last_date := v_last_practice_date::date;

  if v_last_date = v_today then
    -- Already practiced today, do nothing to streak
  elsif v_last_date = v_today - 1 then
    -- Practiced yesterday, increment streak
    update public.user_progress
    set 
      current_streak = current_streak + 1,
      longest_streak = greatest(longest_streak, current_streak + 1),
      last_practice_date = now()
    where user_id = p_user_id;
  else
    -- Streak broken
    update public.user_progress
    set current_streak = 1, last_practice_date = now()
    where user_id = p_user_id;
  end if;
end;
$$;

-- 5. Trigger to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  insert into public.user_progress (user_id)
  values (new.id);
  
  return new;
end;
$$;

-- Trigger only if not exists (safer to just drop and recreate or ignore)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

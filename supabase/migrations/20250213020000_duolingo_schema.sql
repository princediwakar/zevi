-- Create learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('product_sense', 'execution', 'strategy', 'behavioral', 'technical')),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_hours INTEGER,
    prerequisites UUID[] DEFAULT '{}',
    order_index INTEGER NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    icon_name TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create units table
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    estimated_minutes INTEGER,
    xp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('learn', 'practice', 'story', 'quiz', 'review')),
    order_index INTEGER NOT NULL,
    content JSONB DEFAULT '{}'::jsonb, -- Stores flexible lesson content
    estimated_minutes INTEGER DEFAULT 5,
    xp_reward INTEGER DEFAULT 10,
    is_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alter user_profiles table (renamed from users in plan to match existing schema)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
-- avatar_url already exists in initial schema
ADD COLUMN IF NOT EXISTS target_role TEXT CHECK (target_role IN ('apm', 'pm', 'spm', 'gpm')),
ADD COLUMN IF NOT EXISTS target_companies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('new_grad', 'career_switcher', 'current_pm')),
ADD COLUMN IF NOT EXISTS interview_date DATE,
ADD COLUMN IF NOT EXISTS weekly_goal INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS preferred_practice_time TEXT,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lives INTEGER DEFAULT 5;

-- Update user_progress table
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS current_path_id UUID REFERENCES public.learning_paths(id),
ADD COLUMN IF NOT EXISTS current_unit_id UUID REFERENCES public.units(id),
ADD COLUMN IF NOT EXISTS current_lesson_id UUID REFERENCES public.lessons(id),
ADD COLUMN IF NOT EXISTS completed_lessons UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_units UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_paths UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS locked_lessons UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS weak_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS category_mastery JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS daily_goal_xp INTEGER DEFAULT 50,
DROP COLUMN IF EXISTS total_mcq_completed, -- Replacing specific counts with broader stats or just keeping total
DROP COLUMN IF EXISTS total_text_completed;

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    xp_reward INTEGER DEFAULT 0,
    requirement JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_new BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, achievement_id)
);

-- Create streaks table (extended tracking)
CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    freeze_count INTEGER DEFAULT 0,
    last_practice_date DATE,
    streak_milestone_reached INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update questions table to link to lessons
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.lessons(id);

-- Update practice_sessions to link to lessons
ALTER TABLE public.practice_sessions
ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.lessons(id),
ADD COLUMN IF NOT EXISTS xp_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lives_lost INTEGER DEFAULT 0;

-- RLS Policies (Basic examples, refine as needed)
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public learning paths are viewable by everyone" ON public.learning_paths FOR SELECT USING (true);

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public units are viewable by everyone" ON public.units FOR SELECT USING (true);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

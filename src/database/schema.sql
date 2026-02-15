-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier text default 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  company TEXT,
  interview_type TEXT CHECK (interview_type IN ('phone', 'video', 'in_person', 'take_home')),
  expert_answer TEXT,
  rubric JSONB,
  acceptance_rate INTEGER,
  pattern_type TEXT,
  mcq_version JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions policies (public read access)
CREATE POLICY "Anyone can view questions"
  ON public.questions FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_company ON public.questions(company);

-- ============================================
-- PRACTICE SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('mcq', 'text')),
  user_answer TEXT,
  mcq_answers JSONB,
  score INTEGER,
  time_spent_seconds INTEGER,
  completed BOOLEAN DEFAULT false,
  ai_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- Practice sessions policies
CREATE POLICY "Users can view their own sessions"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.practice_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_question_id ON public.practice_sessions(question_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_created_at ON public.practice_sessions(created_at DESC);

-- ============================================
-- USER PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  total_questions_completed INTEGER DEFAULT 0,
  total_mcq_completed INTEGER DEFAULT 0,
  total_text_completed INTEGER DEFAULT 0,
  category_progress JSONB DEFAULT '{}',
  weekly_questions_used INTEGER DEFAULT 0,
  week_reset_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);

-- ============================================
-- DRAFTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  draft_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Drafts policies
CREATE POLICY "Users can view their own drafts"
  ON public.drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON public.drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_question_id ON public.drafts(question_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_practice_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Get current progress
  SELECT last_practice_date, current_streak, longest_streak
  INTO v_last_practice_date, v_current_streak, v_longest_streak
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- If no progress record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id, current_streak, longest_streak, last_practice_date)
    VALUES (p_user_id, 1, 1, v_today);
    RETURN;
  END IF;

  -- Calculate new streak
  IF v_last_practice_date IS NULL THEN
    v_current_streak := 1;
  ELSIF v_last_practice_date = v_today THEN
    -- Already practiced today, no change
    RETURN;
  ELSIF v_last_practice_date = v_today - INTERVAL '1 day' THEN
    -- Practiced yesterday, increment streak
    v_current_streak := v_current_streak + 1;
  ELSE
    -- Streak broken, reset to 1
    v_current_streak := 1;
  END IF;

  -- Update longest streak if necessary
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  -- Update progress
  UPDATE public.user_progress
  SET 
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_practice_date = v_today,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment question completion count
CREATE OR REPLACE FUNCTION increment_completion_count(
  p_user_id UUID,
  p_session_type TEXT,
  p_category TEXT
)
RETURNS void AS $$
BEGIN
  -- Update total counts
  UPDATE public.user_progress
  SET
    total_questions_completed = total_questions_completed + 1,
    total_mcq_completed = CASE WHEN p_session_type = 'mcq' THEN total_mcq_completed + 1 ELSE total_mcq_completed END,
    total_text_completed = CASE WHEN p_session_type = 'text' THEN total_text_completed + 1 ELSE total_text_completed END,
    category_progress = jsonb_set(
      COALESCE(category_progress, '{}'),
      ARRAY[p_category],
      to_jsonb(COALESCE((category_progress->>p_category)::int, 0) + 1)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- If no row was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (
      user_id,
      total_questions_completed,
      total_mcq_completed,
      total_text_completed,
      category_progress
    ) VALUES (
      p_user_id,
      1,
      CASE WHEN p_session_type = 'mcq' THEN 1 ELSE 0 END,
      CASE WHEN p_session_type = 'text' THEN 1 ELSE 0 END,
      jsonb_build_object(p_category, 1)
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limit for AI feedback
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT DEFAULT 'ai_feedback'
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INTEGER,
  reset_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_weekly_limit INTEGER := 50;  -- Free tier limit per week
  v_current_count INTEGER;
  v_week_start DATE;
  v_user_tier TEXT;
BEGIN
  -- Get user subscription tier
  SELECT subscription_tier INTO v_user_tier
  FROM public.user_profiles
  WHERE id = p_user_id;

  -- Premium users get unlimited access
  IF v_user_tier = 'premium' THEN
    RETURN QUERY SELECT true, 999, NOW() + INTERVAL '1 week';
    RETURN;
  END IF;

  -- Get the start of the current week (Monday)
  v_week_start := CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER;

  -- Count requests this week
  SELECT COALESCE(COUNT(*), 0) INTO v_current_count
  FROM public.practice_sessions
  WHERE user_id = p_user_id
    AND created_at >= v_week_start
    AND ai_feedback IS NOT NULL;

  -- Check if under limit
  IF v_current_count < v_weekly_limit THEN
    RETURN QUERY SELECT true, v_weekly_limit - v_current_count, v_week_start + INTERVAL '7 days';
  ELSE
    RETURN QUERY SELECT false, 0, v_week_start + INTERVAL '7 days';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete practice session (transactional)
CREATE OR REPLACE FUNCTION complete_practice_session(
  p_user_id UUID,
  p_session_type TEXT,
  p_category TEXT
)
RETURNS void AS $$
BEGIN
  -- Increment completion count and category progress
  PERFORM increment_completion_count(p_user_id, p_session_type, p_category);

  -- Update streak
  PERFORM update_user_streak(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_sessions_updated_at BEFORE UPDATE ON public.practice_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at BEFORE UPDATE ON public.drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

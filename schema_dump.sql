-- Schema Dump from Remote Supabase Database
-- Generated: 2026-02-17T18:41:12.822Z

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: achievements
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon_name text,
  tier text,
  xp_reward integer DEFAULT 0,
  requirement jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- TABLE: drafts
-- ============================================
CREATE TABLE IF NOT EXISTS public.drafts (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id uuid,
  question_id uuid,
  draft_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE
);

ALTER TABLE public.drafts ADD UNIQUE (user_id, question_id);

-- ============================================
-- TABLE: learning_paths
-- ============================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  name text NOT NULL,
  category text,
  description text,
  difficulty_level integer,
  estimated_hours integer,
  prerequisites ARRAY DEFAULT '{}'::uuid[],
  order_index integer NOT NULL,
  is_premium boolean DEFAULT false,
  icon_name text,
  color text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- TABLE: lessons
-- ============================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  unit_id uuid,
  name text NOT NULL,
  type text NOT NULL,
  order_index integer NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  estimated_minutes integer DEFAULT 5,
  xp_reward integer DEFAULT 10,
  is_locked boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: practice_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL,
  question_id uuid,
  session_type text NOT NULL,
  user_answer text,
  answer_data jsonb DEFAULT '{}'::jsonb,
  ai_feedback jsonb,
  mcq_answers jsonb,
  score integer,
  time_spent_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  lives_lost integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_correct boolean,
  FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: questions
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  question_text text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  company text,
  framework_hint text,
  expert_answer text,
  evaluation_rubric jsonb,
  lesson_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  framework_name text,
  pattern_type text,
  framework_steps jsonb DEFAULT '[]'::jsonb,
  expert_outline jsonb DEFAULT '{}'::jsonb,
  rubric jsonb DEFAULT '{}'::jsonb,
  mcq_version jsonb,
  FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: units
-- ============================================
CREATE TABLE IF NOT EXISTS public.units (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  learning_path_id uuid,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL,
  estimated_minutes integer,
  xp_reward integer DEFAULT 50,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  framework_name text,
  FOREIGN KEY (learning_path_id) REFERENCES public.learning_paths(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: user_achievements
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid,
  achievement_id uuid,
  unlocked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_new boolean DEFAULT true,
  FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE
);

ALTER TABLE public.user_achievements ADD UNIQUE (user_id, achievement_id);

-- ============================================
-- TABLE: user_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid NOT NULL PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  subscription_tier text DEFAULT 'free'::text,
  display_name text,
  target_role text,
  target_companies ARRAY DEFAULT '{}'::text[],
  experience_level text,
  interview_date date,
  weekly_goal integer DEFAULT 5,
  preferred_practice_time text,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  gems integer DEFAULT 0,
  lives integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- TABLE: user_progress
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_practice_date timestamp with time zone,
  total_questions_completed integer DEFAULT 0,
  category_progress jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  weekly_questions_used integer DEFAULT 0,
  week_reset_date timestamp with time zone,
  current_path_id uuid,
  current_unit_id uuid,
  current_lesson_id uuid,
  completed_lessons jsonb DEFAULT '[]'::jsonb,
  completed_units jsonb DEFAULT '[]'::jsonb,
  completed_paths jsonb DEFAULT '[]'::jsonb,
  locked_lessons jsonb DEFAULT '[]'::jsonb,
  weak_areas jsonb DEFAULT '[]'::jsonb,
  category_mastery jsonb DEFAULT '{}'::jsonb,
  daily_goal_xp integer DEFAULT 0,
  total_mcq_completed integer DEFAULT 0,
  total_text_completed integer DEFAULT 0,
  lessons_completed_per_category jsonb DEFAULT '{}'::jsonb,
  quick_quiz_completed boolean DEFAULT false,
  framework_mastery jsonb DEFAULT '{}'::jsonb,
  pattern_mastery jsonb DEFAULT '{}'::jsonb,
  interview_readiness_score integer DEFAULT 0,
  daily_xp integer DEFAULT 0,
  questions_practiced integer DEFAULT 0,
  readiness_score integer DEFAULT 0,
  readiness_by_category jsonb DEFAULT '{}'::jsonb
);

-- ============================================
-- INDEXES
-- ============================================

CREATE UNIQUE INDEX drafts_user_id_question_id_key ON public.drafts USING btree (user_id, question_id);
CREATE INDEX idx_drafts_question_id ON public.drafts USING btree (question_id);
CREATE INDEX idx_drafts_user_id ON public.drafts USING btree (user_id);
CREATE INDEX idx_drafts_user_question ON public.drafts USING btree (user_id, question_id);
CREATE INDEX idx_questions_mcq_version ON public.questions USING btree (mcq_version) WHERE (mcq_version IS NOT NULL);
CREATE UNIQUE INDEX user_achievements_user_id_achievement_id_key ON public.user_achievements USING btree (user_id, achievement_id);
CREATE INDEX idx_user_progress_current_lesson_id ON public.user_progress USING btree (current_lesson_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress USING btree (user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.complete_practice_session(p_user_id uuid, p_session_type text, p_category text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Increment completion count and category progress
  PERFORM public.increment_completion_count(p_user_id, p_session_type, p_category);

  -- Update streak
  PERFORM public.update_user_streak(p_user_id);
END;
$function$


CREATE OR REPLACE FUNCTION public.set_current_lesson(p_user_id uuid, p_lesson_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.user_progress
  SET current_lesson_id = p_lesson_id, updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no row was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (user_id, current_lesson_id)
    VALUES (p_user_id, p_lesson_id);
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_next_lesson(p_completed_lesson_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_next_lesson_id UUID;
  v_unit_id UUID;
  v_order_index INTEGER;
  v_path_id UUID;
  v_unit_order_index INTEGER;
BEGIN
  -- Get the completed lesson's unit and order
  SELECT unit_id, order_index INTO v_unit_id, v_order_index
  FROM public.lessons
  WHERE id = p_completed_lesson_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Get the unit's order and path
  SELECT order_index, learning_path_id INTO v_unit_order_index, v_path_id
  FROM public.units
  WHERE id = v_unit_id;
  
  -- Try to find next lesson in same unit
  SELECT id INTO v_next_lesson_id
  FROM public.lessons
  WHERE unit_id = v_unit_id
    AND order_index > v_order_index
  ORDER BY order_index ASC
  LIMIT 1;
  
  -- If no next lesson in same unit, try next unit
  IF v_next_lesson_id IS NULL THEN
    SELECT id INTO v_unit_id
    FROM public.units
    WHERE learning_path_id = v_path_id
      AND order_index > v_unit_order_index
    ORDER BY order_index ASC
    LIMIT 1;
    
    IF v_unit_id IS NOT NULL THEN
      -- Get first lesson of next unit
      SELECT id INTO v_next_lesson_id
      FROM public.lessons
      WHERE unit_id = v_unit_id
      ORDER BY order_index ASC
      LIMIT 1;
    END IF;
  END IF;
  
  RETURN v_next_lesson_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.advance_to_next_lesson(p_user_id uuid, p_completed_lesson_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_next_lesson_id UUID;
BEGIN
  -- Get the next lesson in sequence
  v_next_lesson_id := get_next_lesson(p_completed_lesson_id);
  
  -- Update user's current lesson
  PERFORM set_current_lesson(p_user_id, v_next_lesson_id);
END;
$function$


CREATE OR REPLACE FUNCTION public.update_framework_mastery(p_user_id uuid, p_framework_name text, p_score integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.user_progress
  SET 
    framework_mastery = jsonb_set(
      COALESCE(framework_mastery, '{}'),
      ARRAY[p_framework_name],
      to_jsonb(p_score)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- If no row was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (
      user_id,
      framework_mastery
    ) VALUES (
      p_user_id,
      jsonb_build_object(p_framework_name, p_score)
    );
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.update_pattern_mastery(p_user_id uuid, p_pattern_name text, p_score integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.user_progress
  SET 
    pattern_mastery = jsonb_set(
      COALESCE(pattern_mastery, '{}'),
      ARRAY[p_pattern_name],
      to_jsonb(p_score)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- If no row was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (
      user_id,
      pattern_mastery
    ) VALUES (
      p_user_id,
      jsonb_build_object(p_pattern_name, p_score)
    );
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, subscription_tier, total_xp)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    0
  );
  RETURN NEW;
END;
$function$


CREATE OR REPLACE FUNCTION public.calculate_readiness_score(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_framework_avg NUMERIC := 0;
  v_pattern_avg NUMERIC := 0;
  v_category_avg NUMERIC := 0;
  v_volume_score NUMERIC := 0;
  v_readiness INTEGER;
  v_progress RECORD;
BEGIN
  -- Get current progress
  SELECT * INTO v_progress
  FROM public.user_progress
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate framework average
  IF jsonb_object_keys(COALESCE(v_progress.framework_mastery, '{}')) IS NOT NULL THEN
    SELECT COALESCE(avg(value), 0)::NUMERIC INTO v_framework_avg
    FROM jsonb_each_text(v_progress.framework_mastery);
  END IF;

  -- Calculate pattern average
  IF jsonb_object_keys(COALESCE(v_progress.pattern_mastery, '{}')) IS NOT NULL THEN
    SELECT COALESCE(avg(value), 0)::NUMERIC INTO v_pattern_avg
    FROM jsonb_each_text(v_progress.pattern_mastery);
  END IF;

  -- Calculate category completion average (normalize: each question count / 10 * 100)
  IF jsonb_object_keys(COALESCE(v_progress.category_progress, '{}')) IS NOT NULL THEN
    SELECT COALESCE(avg(LEAST((value::INTEGER::NUMERIC / 10) * 100, 100)), 0) INTO v_category_avg
    FROM jsonb_each_text(v_progress.category_progress);
  END IF;

  -- Calculate volume score (max at 50 questions = 100%)
  v_volume_score := LEAST((v_progress.total_questions_completed::NUMERIC / 50) * 100, 100);

  -- Calculate overall readiness using weights
  v_readiness := ROUND(
    v_framework_avg * 0.4 +
    v_pattern_avg * 0.3 +
    v_category_avg * 0.2 +
    v_volume_score * 0.1
  )::INTEGER;

  -- Update readiness score
  UPDATE public.user_progress
  SET 
    readiness_score = v_readiness,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_weak_category_questions(p_user_id uuid, p_category text, p_limit integer DEFAULT 10)
 RETURNS TABLE(id uuid, question_text text, category text, difficulty text, company text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.question_text,
    q.category,
    q.difficulty,
    q.company
  FROM public.questions q
  WHERE q.category = p_category
    AND NOT EXISTS (
      SELECT 1 FROM public.practice_sessions ps
      WHERE ps.user_id = p_user_id
        AND ps.question_id = q.id
        AND (ps.is_correct = true OR ps.mcq_answers IS NOT NULL)
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$function$


-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: update_drafts_updated_at on drafts
EXECUTE FUNCTION update_updated_at_column()


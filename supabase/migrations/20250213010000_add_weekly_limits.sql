-- Migration: Add weekly limits for free tier users
-- This migration adds weekly question limits to enforce the 3-question free tier

-- 0. Enable pgcrypto extension for gen_random_uuid() (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Add weekly limit columns to user_progress table
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS weekly_questions_used integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS week_reset_date timestamp with time zone;

-- Update existing rows to have a default week_reset_date (next Monday)
UPDATE public.user_progress
SET week_reset_date =
  CASE
    WHEN EXTRACT(DOW FROM CURRENT_TIMESTAMP) = 1 THEN CURRENT_DATE  -- Monday
    ELSE CURRENT_DATE + (8 - EXTRACT(DOW FROM CURRENT_TIMESTAMP))::integer  -- Next Monday
  END
WHERE week_reset_date IS NULL;

-- 2. Update increment_completion_count to increment weekly_questions_used
-- We need to recreate the function with the new logic
CREATE OR REPLACE FUNCTION public.increment_completion_count(
  p_user_id uuid,
  p_session_type text,
  p_category text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_progress_exists boolean;
  v_current_category_count int;
  v_category_progress jsonb;
  v_weekly_questions_used int;
  v_week_reset_date timestamptz;
  v_today date := CURRENT_DATE;
BEGIN
  -- Check if progress record exists
  SELECT EXISTS(SELECT 1 FROM public.user_progress WHERE user_id = p_user_id) INTO v_progress_exists;

  IF NOT v_progress_exists THEN
    INSERT INTO public.user_progress (
      user_id,
      total_questions_completed,
      total_mcq_completed,
      total_text_completed,
      category_progress,
      weekly_questions_used,
      week_reset_date
    )
    VALUES (
      p_user_id,
      0,
      0,
      0,
      '{}'::jsonb,
      0,
      -- Set reset date to next Monday
      CASE
        WHEN EXTRACT(DOW FROM CURRENT_TIMESTAMP) = 1 THEN CURRENT_DATE  -- Monday
        ELSE CURRENT_DATE + (8 - EXTRACT(DOW FROM CURRENT_TIMESTAMP))::integer  -- Next Monday
      END
    );
  END IF;

  -- Get current progress and weekly limits
  SELECT weekly_questions_used, week_reset_date, category_progress
  INTO v_weekly_questions_used, v_week_reset_date, v_category_progress
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- Check if week has reset (it's Monday or past reset date)
  IF v_week_reset_date IS NULL OR v_today >= v_week_reset_date::date THEN
    -- Reset weekly counter and set next Monday as reset date
    v_weekly_questions_used := 0;
    v_week_reset_date := v_today + (8 - EXTRACT(DOW FROM v_today))::integer;  -- Next Monday
  END IF;

  v_current_category_count := COALESCE((v_category_progress->>p_category)::int, 0);

  -- Update progress with weekly increment
  UPDATE public.user_progress
  SET
    total_questions_completed = total_questions_completed + 1,
    total_mcq_completed = CASE WHEN p_session_type = 'mcq' THEN total_mcq_completed + 1 ELSE total_mcq_completed END,
    total_text_completed = CASE WHEN p_session_type = 'text' THEN total_text_completed + 1 ELSE total_text_completed END,
    category_progress = jsonb_set(COALESCE(category_progress, '{}'::jsonb), ARRAY[p_category], to_jsonb(v_current_category_count + 1)),
    weekly_questions_used = v_weekly_questions_used + 1,
    week_reset_date = v_week_reset_date,
    updated_at = NOW()
  WHERE user_id = p_user_id;

END;
$$;

-- 3. Create reset_weekly_counters function for scheduled job
CREATE OR REPLACE FUNCTION public.reset_weekly_counters()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset weekly counters for all users
  UPDATE public.user_progress
  SET
    weekly_questions_used = 0,
    week_reset_date = CURRENT_DATE + (8 - EXTRACT(DOW FROM CURRENT_DATE))::integer,  -- Next Monday
    updated_at = NOW()
  WHERE week_reset_date IS NULL OR CURRENT_DATE >= week_reset_date::date;

  RAISE NOTICE 'Weekly counters reset for all users';
END;
$$;

-- 4. Create check_weekly_limit function to enforce free tier limit
CREATE OR REPLACE FUNCTION public.check_weekly_limit(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_weekly_questions_used int;
  v_week_reset_date timestamptz;
  v_subscription_tier text;
  v_today date := CURRENT_DATE;
  v_result json;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_subscription_tier
  FROM public.user_profiles
  WHERE id = p_user_id;

  -- Get weekly usage
  SELECT weekly_questions_used, week_reset_date
  INTO v_weekly_questions_used, v_week_reset_date
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- If no progress record exists, user hasn't used any questions this week
  IF NOT FOUND THEN
    v_weekly_questions_used := 0;
    v_week_reset_date := v_today + (8 - EXTRACT(DOW FROM v_today))::integer;  -- Next Monday
  END IF;

  -- Check if week has reset
  IF v_week_reset_date IS NULL OR v_today >= v_week_reset_date::date THEN
    v_weekly_questions_used := 0;
  END IF;

  -- Check limit based on subscription tier
  IF v_subscription_tier = 'premium' THEN
    v_result := json_build_object(
      'allowed', true,
      'weekly_used', v_weekly_questions_used,
      'limit', -1,  -- -1 indicates unlimited
      'reset_date', v_week_reset_date,
      'message', 'Premium users have unlimited access'
    );
  ELSE
    -- Free tier: limit of 3 questions per week
    IF v_weekly_questions_used < 3 THEN
      v_result := json_build_object(
        'allowed', true,
        'weekly_used', v_weekly_questions_used,
        'limit', 3,
        'remaining', 3 - v_weekly_questions_used,
        'reset_date', v_week_reset_date,
        'message', 'Free tier: ' || (3 - v_weekly_questions_used) || ' questions remaining this week'
      );
    ELSE
      v_result := json_build_object(
        'allowed', false,
        'weekly_used', v_weekly_questions_used,
        'limit', 3,
        'remaining', 0,
        'reset_date', v_week_reset_date,
        'message', 'Free tier limit reached. Upgrade to premium for unlimited access.'
      );
    END IF;
  END IF;

  RETURN v_result;
END;
$$;

-- 5. Combined function for completing a practice session (transactional)
CREATE OR REPLACE FUNCTION public.complete_practice_session(
  p_user_id uuid,
  p_session_type text,
  p_category text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call existing increment function (which now includes weekly limits)
  PERFORM public.increment_completion_count(p_user_id, p_session_type, p_category);
  -- Update streak
  PERFORM public.update_user_streak(p_user_id);
END;
$$;

-- 6. Function to migrate guest data transactionally
CREATE OR REPLACE FUNCTION public.migrate_guest_data_transactional(
  p_new_user_id uuid,
  p_sessions jsonb,
  p_drafts jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert sessions if any
  IF p_sessions IS NOT NULL AND jsonb_array_length(p_sessions) > 0 THEN
    INSERT INTO public.practice_sessions (
      user_id, question_id, session_type, completed, time_spent_seconds,
      user_answer, mcq_answers, created_at, updated_at
    )
    SELECT
      p_new_user_id,
      (item->>'question_id')::uuid,
      item->>'session_type',
      (item->>'completed')::boolean,
      (item->>'time_spent_seconds')::integer,
      item->>'user_answer',
      (item->>'mcq_answers')::jsonb,
      (item->>'created_at')::timestamptz,
      (item->>'updated_at')::timestamptz
    FROM jsonb_array_elements(p_sessions) AS item
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert drafts if any
  IF p_drafts IS NOT NULL AND jsonb_array_length(p_drafts) > 0 THEN
    INSERT INTO public.drafts (
      user_id, question_id, draft_text, created_at, updated_at
    )
    SELECT
      p_new_user_id,
      (item->>'question_id')::uuid,
      item->>'draft_text',
      (item->>'created_at')::timestamptz,
      (item->>'updated_at')::timestamptz
    FROM jsonb_array_elements(p_drafts) AS item
    ON CONFLICT (user_id, question_id) DO UPDATE
    SET
      draft_text = EXCLUDED.draft_text,
      updated_at = NOW();
  END IF;
END;
$$;

-- Function to merge guest progress with existing user progress
CREATE OR REPLACE FUNCTION public.merge_guest_progress(
  p_new_user_id uuid,
  p_guest_progress jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_progress jsonb;
  v_guest_progress jsonb;
  v_merged_progress jsonb;
  v_category text;
  v_guest_category_progress jsonb;
  v_existing_category_progress jsonb;
BEGIN
  -- If no guest progress, nothing to do
  IF p_guest_progress IS NULL OR jsonb_typeof(p_guest_progress) = 'null' THEN
    RETURN;
  END IF;

  v_guest_progress := p_guest_progress;

  -- Get existing progress if any
  SELECT category_progress INTO v_existing_progress
  FROM public.user_progress
  WHERE user_id = p_new_user_id;

  -- If no existing progress, insert guest progress as is
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (
      user_id,
      total_questions_completed,
      total_mcq_completed,
      total_text_completed,
      current_streak,
      longest_streak,
      last_practice_date,
      category_progress,
      weekly_questions_used,
      week_reset_date
    ) VALUES (
      p_new_user_id,
      COALESCE((v_guest_progress->>'total_questions_completed')::int, 0),
      COALESCE((v_guest_progress->>'total_mcq_completed')::int, 0),
      COALESCE((v_guest_progress->>'total_text_completed')::int, 0),
      COALESCE((v_guest_progress->>'current_streak')::int, 0),
      COALESCE((v_guest_progress->>'longest_streak')::int, 0),
      (v_guest_progress->>'last_practice_date')::timestamptz,
      COALESCE(v_guest_progress->'category_progress', '{}'::jsonb),
      0, -- weekly_questions_used starts at 0 for new user
      CASE
        WHEN EXTRACT(DOW FROM CURRENT_TIMESTAMP) = 1 THEN CURRENT_DATE
        ELSE CURRENT_DATE + (8 - EXTRACT(DOW FROM CURRENT_TIMESTAMP))::integer
      END
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN;
  END IF;

  -- Merge category progress
  v_guest_category_progress := COALESCE(v_guest_progress->'category_progress', '{}'::jsonb);
  v_existing_category_progress := COALESCE(v_existing_progress, '{}'::jsonb);

  -- For each category in guest progress, add to existing
  FOR v_category IN SELECT jsonb_object_keys(v_guest_category_progress)
  LOOP
    v_existing_category_progress := jsonb_set(
      v_existing_category_progress,
      ARRAY[v_category],
      to_jsonb(
        COALESCE((v_existing_category_progress->>v_category)::int, 0) +
        COALESCE((v_guest_category_progress->>v_category)::int, 0)
      )
    );
  END LOOP;

  -- Update user progress with merged totals
  UPDATE public.user_progress
  SET
    total_questions_completed = total_questions_completed + COALESCE((v_guest_progress->>'total_questions_completed')::int, 0),
    total_mcq_completed = total_mcq_completed + COALESCE((v_guest_progress->>'total_mcq_completed')::int, 0),
    total_text_completed = total_text_completed + COALESCE((v_guest_progress->>'total_text_completed')::int, 0),
    current_streak = GREATEST(current_streak, COALESCE((v_guest_progress->>'current_streak')::int, 0)),
    longest_streak = GREATEST(longest_streak, COALESCE((v_guest_progress->>'longest_streak')::int, 0)),
    category_progress = v_existing_category_progress,
    updated_at = NOW()
  WHERE user_id = p_new_user_id;
END;
$$;

-- 7. Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_week_reset_date
ON public.user_progress(week_reset_date);

-- 6. Rate limiting table for edge functions
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_user_endpoint
ON public.api_rate_limits(user_id, endpoint);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_start
ON public.api_rate_limits(window_start);

-- Function to check rate limit (5 requests per minute per user per endpoint)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT DEFAULT 'evaluate-answer'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_limit INTEGER := 5;
  v_window_minutes INTEGER := 1;
  v_request_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- Get or create rate limit record
  INSERT INTO public.api_rate_limits (user_id, endpoint, request_count, window_start)
  VALUES (p_user_id, p_endpoint, 1, NOW())
  ON CONFLICT (user_id, endpoint) DO UPDATE
  SET
    request_count = CASE
      WHEN api_rate_limits.window_start > NOW() - (v_window_minutes || ' minutes')::INTERVAL
      THEN api_rate_limits.request_count + 1
      ELSE 1
    END,
    window_start = CASE
      WHEN api_rate_limits.window_start > NOW() - (v_window_minutes || ' minutes')::INTERVAL
      THEN api_rate_limits.window_start
      ELSE NOW()
    END,
    updated_at = NOW()
  RETURNING request_count, window_start INTO v_request_count, v_window_start;

  -- Return true if under limit, false if over limit
  RETURN v_request_count <= v_limit;
END;
$$;

COMMENT ON TABLE public.api_rate_limits IS 'Stores rate limit data for API endpoints';
COMMENT ON FUNCTION public.check_rate_limit(uuid, text) IS 'Checks if user has exceeded rate limit (5 requests per minute per endpoint)';

-- 7. Add comment explaining the weekly limit system
COMMENT ON COLUMN public.user_progress.weekly_questions_used IS 'Number of questions used in the current week (resets every Monday)';
COMMENT ON COLUMN public.user_progress.week_reset_date IS 'Date when weekly counter resets (next Monday)';
COMMENT ON FUNCTION public.reset_weekly_counters() IS 'Resets weekly question counters for all users (should be scheduled to run daily)';
COMMENT ON FUNCTION public.check_weekly_limit(uuid) IS 'Checks if user has reached their weekly question limit based on subscription tier';
-- Add genuinely missing functions: update_user_streak and check_weekly_limit
-- These were in the initial schema but never applied to production

-- ============================================
-- 1. update_user_streak
-- ============================================
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_practice_date timestamptz;
  v_current_streak int;
  v_longest_streak int;
  v_today date := CURRENT_DATE;
  v_last_date date;
BEGIN
  SELECT last_practice_date, current_streak, longest_streak
  INTO v_last_practice_date, v_current_streak, v_longest_streak
  FROM public.user_progress
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF v_last_practice_date IS NULL THEN
    UPDATE public.user_progress
    SET current_streak = 1,
        longest_streak = 1,
        last_practice_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    RETURN;
  END IF;

  v_last_date := v_last_practice_date::date;

  IF v_last_date = v_today THEN
    NULL; -- already practiced today
  ELSIF v_last_date = v_today - 1 THEN
    UPDATE public.user_progress
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_practice_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public.user_progress
    SET current_streak = 1,
        last_practice_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

-- ============================================
-- 2. Recreate complete_practice_session to reference the now-existing update_user_streak
-- ============================================
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
  PERFORM public.increment_completion_count(p_user_id, p_session_type, p_category);
  PERFORM public.update_user_streak(p_user_id);
END;
$$;

-- ============================================
-- 3. check_weekly_limit (called by progressService.checkWeeklyLimit)
-- ============================================
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
BEGIN
  SELECT subscription_tier INTO v_subscription_tier
  FROM public.user_profiles WHERE id = p_user_id;

  SELECT weekly_questions_used, week_reset_date
  INTO v_weekly_questions_used, v_week_reset_date
  FROM public.user_progress WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    v_weekly_questions_used := 0;
    v_week_reset_date := v_today + (8 - EXTRACT(DOW FROM v_today)::int);
  END IF;

  IF v_week_reset_date IS NULL OR v_today >= v_week_reset_date::date THEN
    v_weekly_questions_used := 0;
  END IF;

  IF v_subscription_tier = 'premium' THEN
    RETURN json_build_object(
      'allowed', true,
      'weekly_used', v_weekly_questions_used,
      'limit', -1,
      'remaining', 999,
      'reset_date', v_week_reset_date,
      'message', 'Premium users have unlimited access'
    );
  ELSE
    RETURN json_build_object(
      'allowed', v_weekly_questions_used < 3,
      'weekly_used', v_weekly_questions_used,
      'limit', 3,
      'remaining', GREATEST(0, 3 - v_weekly_questions_used),
      'reset_date', v_week_reset_date,
      'message', CASE WHEN v_weekly_questions_used < 3
        THEN 'Free tier: ' || (3 - v_weekly_questions_used) || ' questions remaining'
        ELSE 'Free tier limit reached. Upgrade to premium for unlimited access.'
      END
    );
  END IF;
END;
$$;

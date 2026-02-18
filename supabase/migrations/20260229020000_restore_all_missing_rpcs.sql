-- Restore ALL missing RPC functions that were defined in early migrations
-- but are absent from production DB due to migration history sync issues

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
    RETURN; -- No progress record, nothing to update
  END IF;

  IF v_last_practice_date IS NULL THEN
    -- First practice ever
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
    -- Already practiced today, streak unchanged
    NULL;
  ELSIF v_last_date = v_today - 1 THEN
    -- Practiced yesterday → increment streak
    UPDATE public.user_progress
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_practice_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Streak broken → reset to 1
    UPDATE public.user_progress
    SET current_streak = 1,
        last_practice_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

-- ============================================
-- 2. increment_completion_count (idempotent fix, no ON CONFLICT)
-- ============================================
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
  v_current_category_count int;
  v_category_progress jsonb;
  v_weekly_questions_used int;
  v_week_reset_date timestamptz;
  v_today date := CURRENT_DATE;
  v_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.user_progress WHERE user_id = p_user_id) INTO v_exists;
  IF NOT v_exists THEN
    INSERT INTO public.user_progress (user_id) VALUES (p_user_id);
  END IF;

  SELECT
    COALESCE(weekly_questions_used, 0),
    week_reset_date,
    COALESCE(category_progress, '{}'::jsonb)
  INTO v_weekly_questions_used, v_week_reset_date, v_category_progress
  FROM public.user_progress
  WHERE user_id = p_user_id;

  IF v_week_reset_date IS NULL OR v_today >= v_week_reset_date::date THEN
    v_weekly_questions_used := 0;
    v_week_reset_date := v_today + (8 - EXTRACT(DOW FROM v_today)::int);
  END IF;

  v_current_category_count := COALESCE((v_category_progress ->> p_category)::int, 0);

  UPDATE public.user_progress
  SET
    total_questions_completed = total_questions_completed + 1,
    total_mcq_completed  = CASE WHEN p_session_type = 'mcq'  THEN total_mcq_completed  + 1 ELSE total_mcq_completed  END,
    total_text_completed = CASE WHEN p_session_type = 'text' THEN total_text_completed + 1 ELSE total_text_completed END,
    weekly_questions_used = v_weekly_questions_used + 1,
    week_reset_date = v_week_reset_date,
    category_progress = jsonb_set(
      COALESCE(category_progress, '{}'::jsonb),
      ARRAY[p_category],
      to_jsonb(v_current_category_count + 1)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

-- ============================================
-- 3. complete_practice_session
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
-- 4. update_framework_mastery (used by progressService)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_framework_mastery(
  p_user_id uuid,
  p_framework_name text,
  p_score numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_progress
  SET
    framework_mastery = jsonb_set(
      COALESCE(framework_mastery, '{}'::jsonb),
      ARRAY[p_framework_name],
      to_jsonb(p_score)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

-- ============================================
-- 5. update_pattern_mastery (used by progressService)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_pattern_mastery(
  p_user_id uuid,
  p_pattern_name text,
  p_score numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_progress
  SET
    pattern_mastery = jsonb_set(
      COALESCE(pattern_mastery, '{}'::jsonb),
      ARRAY[p_pattern_name],
      to_jsonb(p_score)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

-- ============================================
-- 6. calculate_readiness_score (used by progressService)
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_readiness_score(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_framework_avg numeric := 0;
  v_pattern_avg numeric := 0;
  v_category_avg numeric := 0;
  v_volume_score numeric := 0;
  v_readiness numeric;
  v_progress record;
BEGIN
  SELECT * INTO v_progress FROM public.user_progress WHERE user_id = p_user_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Framework average
  SELECT COALESCE(AVG(value::numeric), 0)
  INTO v_framework_avg
  FROM jsonb_each_text(COALESCE(v_progress.framework_mastery, '{}'::jsonb));

  -- Pattern average
  SELECT COALESCE(AVG(value::numeric), 0)
  INTO v_pattern_avg
  FROM jsonb_each_text(COALESCE(v_progress.pattern_mastery, '{}'::jsonb));

  -- Category average (normalize: count/10*100, cap at 100)
  SELECT COALESCE(AVG(LEAST((value::numeric / 10) * 100, 100)), 0)
  INTO v_category_avg
  FROM jsonb_each_text(COALESCE(v_progress.category_progress, '{}'::jsonb));

  -- Volume score (max at 50 questions = 100)
  v_volume_score := LEAST((COALESCE(v_progress.total_questions_completed, 0)::numeric / 50) * 100, 100);

  v_readiness := ROUND(
    v_framework_avg * 0.4 +
    v_pattern_avg   * 0.3 +
    v_category_avg  * 0.2 +
    v_volume_score  * 0.1
  );

  UPDATE public.user_progress
  SET readiness_score = v_readiness, updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN v_readiness;
END;
$$;

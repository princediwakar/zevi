-- Restore increment_completion_count and complete_practice_session functions
-- These functions may be missing if migration history was out of sync

-- Recreate increment_completion_count (with weekly limits support)
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
BEGIN
  -- Ensure user_progress record exists
  INSERT INTO public.user_progress (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get current progress and weekly limits
  SELECT
    COALESCE(weekly_questions_used, 0),
    week_reset_date,
    COALESCE(category_progress, '{}'::jsonb)
  INTO v_weekly_questions_used, v_week_reset_date, v_category_progress
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- Reset weekly counter if past reset date
  IF v_week_reset_date IS NULL OR v_today >= v_week_reset_date::date THEN
    v_weekly_questions_used := 0;
    v_week_reset_date := v_today + (8 - EXTRACT(DOW FROM v_today)::int);
  END IF;

  v_current_category_count := COALESCE((v_category_progress ->> p_category)::int, 0);

  -- Update all progress fields
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

-- Recreate complete_practice_session (calls increment + streak update)
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

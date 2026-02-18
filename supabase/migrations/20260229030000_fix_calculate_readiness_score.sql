-- Fix calculate_readiness_score: drop and recreate with correct return type
-- (CREATE OR REPLACE fails when return type differs from existing function)

DROP FUNCTION IF EXISTS public.calculate_readiness_score(uuid);

CREATE FUNCTION public.calculate_readiness_score(p_user_id uuid)
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

  SELECT COALESCE(AVG(value::numeric), 0)
  INTO v_framework_avg
  FROM jsonb_each_text(COALESCE(v_progress.framework_mastery, '{}'::jsonb));

  SELECT COALESCE(AVG(value::numeric), 0)
  INTO v_pattern_avg
  FROM jsonb_each_text(COALESCE(v_progress.pattern_mastery, '{}'::jsonb));

  SELECT COALESCE(AVG(LEAST((value::numeric / 10) * 100, 100)), 0)
  INTO v_category_avg
  FROM jsonb_each_text(COALESCE(v_progress.category_progress, '{}'::jsonb));

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

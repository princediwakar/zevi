-- Add framework_mastery and pattern_mastery columns to user_progress
-- These will store mastery scores for each framework and pattern (0-100)

ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS framework_mastery JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pattern_mastery JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS readiness_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS readiness_by_category JSONB DEFAULT '{}';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_readiness ON public.user_progress(readiness_score);

-- Function to update framework mastery after a practice session
CREATE OR REPLACE FUNCTION update_framework_mastery(
  p_user_id UUID,
  p_framework_name TEXT,
  p_score INTEGER
)
RETURNS void AS $$
DECLARE
  v_current_mastery INTEGER;
  v_new_mastery INTEGER;
BEGIN
  -- Get current mastery score for this framework
  SELECT (framework_mastery->>p_framework_name)::INTEGER INTO v_current_mastery
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- If no existing mastery, start with the new score
  IF v_current_mastery IS NULL THEN
    v_new_mastery := p_score;
  ELSE
    -- Calculate moving average (80% old, 20% new)
    v_new_mastery := ROUND(v_current_mastery * 0.8 + p_score * 0.2);
  END IF;

  -- Update the framework mastery
  UPDATE public.user_progress
  SET 
    framework_mastery = jsonb_set(
      COALESCE(framework_mastery, '{}'),
      ARRAY[p_framework_name],
      to_jsonb(v_new_mastery)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update pattern mastery after a practice session
CREATE OR REPLACE FUNCTION update_pattern_mastery(
  p_user_id UUID,
  p_pattern_name TEXT,
  p_score INTEGER
)
RETURNS void AS $$
DECLARE
  v_current_mastery INTEGER;
  v_new_mastery INTEGER;
BEGIN
  -- Get current mastery score for this pattern
  SELECT (pattern_mastery->>p_pattern_name)::INTEGER INTO v_current_mastery
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- If no existing mastery, start with the new score
  IF v_current_mastery IS NULL THEN
    v_new_mastery := p_score;
  ELSE
    -- Calculate moving average (80% old, 20% new)
    v_new_mastery := ROUND(v_current_mastery * 0.8 + p_score * 0.2);
  END IF;

  -- Update the pattern mastery
  UPDATE public.user_progress
  SET 
    pattern_mastery = jsonb_set(
      COALESCE(pattern_mastery, '{}'),
      ARRAY[p_pattern_name],
      to_jsonb(v_new_mastery)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate readiness score based on NEW_PLAN spec
-- weights: framework_mastery: 0.4, pattern_mastery: 0.3, category_completion: 0.2, practice_volume: 0.1
CREATE OR REPLACE FUNCTION calculate_readiness_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_framework_mastery JSONB;
  v_pattern_mastery JSONB;
  v_category_progress JSONB;
  v_total_questions_completed INTEGER;
  
  v_framework_avg NUMERIC := 0;
  v_pattern_avg NUMERIC := 0;
  v_category_avg NUMERIC := 0;
  v_volume_score NUMERIC := 0;
  
  v_framework_keys TEXT[];
  v_pattern_keys TEXT[];
  v_key TEXT;
  v_readiness INTEGER;
BEGIN
  -- Get user progress data
  SELECT framework_mastery, pattern_mastery, category_progress, total_questions_completed
  INTO v_framework_mastery, v_pattern_mastery, v_category_progress, v_total_questions_completed
  FROM public.user_progress
  WHERE user_id = p_user_id;

  -- Calculate framework mastery average
  IF v_framework_mastery IS NOT NULL AND jsonb_object_keys(v_framework_mastery) IS NOT NULL THEN
    v_framework_keys := array(SELECT jsonb_object_keys(v_framework_mastery));
    FOR v_key IN SELECT unnest(v_framework_keys) LOOP
      v_framework_avg := v_framework_avg + COALESCE((v_framework_mastery->>v_key)::INTEGER, 0);
    END LOOP;
    v_framework_avg := v_framework_avg / NULLIF(array_length(v_framework_keys, 1), 0);
  END IF;

  -- Calculate pattern mastery average
  IF v_pattern_mastery IS NOT NULL AND jsonb_object_keys(v_pattern_mastery) IS NOT NULL THEN
    v_pattern_keys := array(SELECT jsonb_object_keys(v_pattern_mastery));
    FOR v_key IN SELECT unnest(v_pattern_keys) LOOP
      v_pattern_avg := v_pattern_avg + COALESCE((v_pattern_mastery->>v_key)::INTEGER, 0);
    END LOOP;
    v_pattern_avg := v_pattern_avg / NULLIF(array_length(v_pattern_keys, 1), 0);
  END IF;

  -- Calculate category progress average (normalized to 0-100)
  IF v_category_progress IS NOT NULL AND jsonb_object_keys(v_category_progress) IS NOT NULL THEN
    v_key := jsonb_object_keys(v_category_progress)[1];
    IF v_key IS NOT NULL THEN
      v_category_avg := (SELECT AVG(COALESCE((value)::INTEGER, 0)) FROM jsonb_each_text(v_category_progress));
    END IF;
  END IF;

  -- Calculate volume score (max at 50 questions = 100%)
  v_volume_score := LEAST(v_total_questions_completed::NUMERIC / 50 * 100, 100);

  -- Calculate overall readiness using weights from NEW_PLAN
  -- framework_mastery: 0.4, pattern_mastery: 0.3, category_completion: 0.2, practice_volume: 0.1
  v_readiness := ROUND(
    COALESCE(v_framework_avg, 0) * 0.4 +
    COALESCE(v_pattern_avg, 0) * 0.3 +
    COALESCE(v_category_avg, 0) * 0.2 +
    v_volume_score * 0.1
  );

  -- Update readiness score in database
  UPDATE public.user_progress
  SET readiness_score = v_readiness, updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN v_readiness;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update category readiness
CREATE OR REPLACE FUNCTION update_category_readiness(
  p_user_id UUID,
  p_category TEXT,
  p_completion_percentage INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE public.user_progress
  SET 
    readiness_by_category = jsonb_set(
      COALESCE(readiness_by_category, '{}'),
      ARRAY[p_category],
      to_jsonb(p_completion_percentage)
    ),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

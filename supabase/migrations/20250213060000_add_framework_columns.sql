-- Add framework columns to questions table if not exist
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS framework_name TEXT,
ADD COLUMN IF NOT EXISTS framework_steps JSONB,
ADD COLUMN IF NOT EXISTS expert_outline JSONB;

-- Add display_name to user_profiles if not exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update existing questions with framework_name based on pattern_type
UPDATE public.questions 
SET framework_name = CASE 
  WHEN pattern_type IN ('design_x_for_y', 'improve_x') THEN 'CIRCLES'
  WHEN pattern_type = 'behavioral_star' THEN 'STAR'
  WHEN pattern_type IN ('investigate_drop', 'metrics_for_x') THEN 'METRICS'
  WHEN pattern_type = 'strategy' THEN 'PROBLEM_STATEMENT'
  ELSE NULL
END
WHERE framework_name IS NULL;

-- Note: This migration adds the columns without creating duplicate policies

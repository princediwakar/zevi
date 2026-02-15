-- Add experience level targeting columns to questions
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS target_levels TEXT[] DEFAULT ARRAY['new_grad', 'career_switcher', 'apm', 'pm', 'current_pm', 'spm', 'senior_pm'],
ADD COLUMN IF NOT EXISTS difficulty_hint TEXT;

-- Update all questions to have appropriate target levels based on difficulty
UPDATE public.questions 
SET target_levels = CASE
  -- Beginner questions for everyone
  WHEN difficulty = 'beginner' THEN ARRAY['new_grad', 'career_switcher', 'apm', 'pm', 'current_pm', 'spm', 'senior_pm']
  -- Intermediate for PM+
  WHEN difficulty = 'intermediate' THEN ARRAY['pm', 'current_pm', 'spm', 'senior_pm']
  -- Advanced for SPM only
  WHEN difficulty = 'advanced' THEN ARRAY['spm', 'senior_pm']
  ELSE ARRAY['new_grad', 'career_switcher', 'apm', 'pm', 'current_pm', 'spm', 'senior_pm']
END,
difficulty_hint = difficulty
WHERE target_levels IS NULL;

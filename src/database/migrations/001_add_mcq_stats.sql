-- Migration to add missing progress tracking columns
-- Run this in your Supabase SQL Editor

ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS total_mcq_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_text_completed INTEGER DEFAULT 0;

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

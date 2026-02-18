-- Fix set_current_lesson function to handle foreign key constraint
-- Drop existing functions first
DROP FUNCTION IF EXISTS set_current_lesson(UUID, UUID);
DROP FUNCTION IF EXISTS advance_to_next_lesson(UUID, UUID);

-- Function to set current lesson for a user
CREATE FUNCTION set_current_lesson(p_user_id UUID, p_lesson_id UUID)
RETURNS void AS $$
BEGIN
  -- First try to update existing row
  UPDATE public.user_progress
  SET current_lesson_id = p_lesson_id, updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no row was updated, check if user_progress exists and insert/update accordingly
  IF NOT FOUND THEN
    -- Check if a row exists
    IF EXISTS (SELECT 1 FROM public.user_progress WHERE user_id = p_user_id) THEN
      -- Row exists but wasn't updated (maybe same value), just update
      UPDATE public.user_progress
      SET current_lesson_id = p_lesson_id, updated_at = NOW()
      WHERE user_id = p_user_id;
    ELSE
      -- No row exists, insert with required defaults
      INSERT INTO public.user_progress (user_id, current_lesson_id, current_streak, longest_streak, total_questions_completed, total_mcq_completed, total_text_completed, category_progress, framework_mastery, pattern_mastery, readiness_score, readiness_by_category, weekly_questions_used, week_reset_date)
      VALUES (p_user_id, p_lesson_id, 0, 0, 0, 0, 0, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, 0, '{}'::jsonb, 0, NOW());
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to advance to next lesson after completion
CREATE FUNCTION advance_to_next_lesson(p_user_id UUID, p_completed_lesson_id UUID)
RETURNS void AS $$
DECLARE
  v_next_lesson_id UUID;
BEGIN
  -- Get the next lesson in sequence
  v_next_lesson_id := get_next_lesson(p_completed_lesson_id);
  
  -- Update user's current lesson
  PERFORM set_current_lesson(p_user_id, v_next_lesson_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

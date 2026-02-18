-- Add current_lesson_id column to track the user's current position in the course
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS current_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_current_lesson_id ON public.user_progress(current_lesson_id);

-- Function to set current lesson for a user
CREATE OR REPLACE FUNCTION set_current_lesson(p_user_id UUID, p_lesson_id UUID)
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

-- Function to get the next lesson in sequence after completing a lesson
CREATE OR REPLACE FUNCTION get_next_lesson(p_completed_lesson_id UUID)
RETURNS UUID AS $$
DECLARE
  v_next_lesson_id UUID;
  v_unit_id UUID;
  v_order_index INTEGER;
  v_path_id UUID;
  v_unit_order_index INTEGER;
BEGIN
  -- Get the completed lesson's unit and order
  SELECT unit_id, order_index INTO v_unit_id, v_order_index
  FROM public.lessons
  WHERE id = p_completed_lesson_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Get the unit's order and path
  SELECT order_index, learning_path_id INTO v_unit_order_index, v_path_id
  FROM public.units
  WHERE id = v_unit_id;
  
  -- Try to find next lesson in same unit
  SELECT id INTO v_next_lesson_id
  FROM public.lessons
  WHERE unit_id = v_unit_id
    AND order_index > v_order_index
  ORDER BY order_index ASC
  LIMIT 1;
  
  -- If no next lesson in same unit, try next unit
  IF v_next_lesson_id IS NULL THEN
    SELECT id INTO v_unit_id
    FROM public.units
    WHERE learning_path_id = v_path_id
      AND order_index > v_unit_order_index
    ORDER BY order_index ASC
    LIMIT 1;
    
    IF v_unit_id IS NOT NULL THEN
      -- Get first lesson of next unit
      SELECT id INTO v_next_lesson_id
      FROM public.lessons
      WHERE unit_id = v_unit_id
      ORDER BY order_index ASC
      LIMIT 1;
    END IF;
  END IF;
  
  RETURN v_next_lesson_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to advance to next lesson after completion
CREATE OR REPLACE FUNCTION advance_to_next_lesson(p_user_id UUID, p_completed_lesson_id UUID)
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

-- Function to complete practice session (transactional)
CREATE OR REPLACE FUNCTION public.complete_practice_session(
  p_user_id UUID,
  p_session_type TEXT,
  p_category TEXT
)
RETURNS void AS $$
BEGIN
  -- Increment completion count and category progress
  PERFORM public.increment_completion_count(p_user_id, p_session_type, p_category);

  -- Update streak
  PERFORM public.update_user_streak(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

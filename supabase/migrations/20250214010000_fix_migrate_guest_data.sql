-- Migration: Fix migrate_guest_data_transactional function
-- Fixes: "cannot get array length of a scalar" error

DROP FUNCTION IF EXISTS public.migrate_guest_data_transactional(uuid, jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.migrate_guest_data_transactional(
  p_new_user_id uuid,
  p_sessions jsonb,
  p_drafts jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS \$\$
BEGIN
  -- Insert sessions if any - now with proper jsonb_typeof check
  IF p_sessions IS NOT NULL AND jsonb_typeof(p_sessions) = 'array' AND jsonb_array_length(p_sessions) > 0 THEN
    INSERT INTO public.practice_sessions (
      user_id, question_id, session_type, completed, time_spent_seconds,
      user_answer, mcq_answers, created_at, updated_at
    )
    SELECT
      p_new_user_id,
      (item->>'question_id')::uuid,
      item->>'session_type',
      (item->>'completed')::boolean,
      (item->>'time_spent_seconds')::integer,
      item->>'user_answer',
      (item->>'mcq_answers')::jsonb,
      (item->>'created_at')::timestamptz,
      (item->>'updated_at')::timestamptz
    FROM jsonb_array_elements(p_sessions) AS item
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert drafts if any - now with proper jsonb_typeof check
  IF p_drafts IS NOT NULL AND jsonb_typeof(p_drafts) = 'array' AND jsonb_array_length(p_drafts) > 0 THEN
    INSERT INTO public.drafts (
      user_id, question_id, draft_text, created_at, updated_at
    )
    SELECT
      p_new_user_id,
      (item->>'question_id')::uuid,
      item->>'draft_text',
      (item->>'created_at')::timestamptz,
      (item->>'updated_at')::timestamptz
    FROM jsonb_array_elements(p_drafts) AS item
    ON CONFLICT (user_id, question_id) DO UPDATE
    SET
      draft_text = EXCLUDED.draft_text,
      updated_at = NOW();
  END IF;
END;
\$\$;

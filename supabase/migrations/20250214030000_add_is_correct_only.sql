-- Add is_correct column to practice_sessions table (standalone migration)
-- This migration only adds the column and indexes, avoiding policy conflicts

ALTER TABLE public.practice_sessions 
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN;

-- Create index for faster queries on is_correct (use IF NOT EXISTS to avoid error)
CREATE INDEX IF NOT EXISTS idx_practice_sessions_is_correct ON public.practice_sessions(is_correct);

-- Create index for user_id + is_correct combination (use IF NOT EXISTS to avoid error)
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_is_correct ON public.practice_sessions(user_id, is_correct);

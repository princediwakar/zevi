-- Add is_correct column to practice_sessions table
ALTER TABLE public.practice_sessions 
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN;

-- Create index for faster queries on is_correct
CREATE INDEX IF NOT EXISTS idx_practice_sessions_is_correct ON public.practice_sessions(is_correct);

-- Create index for user_id + is_correct combination
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_is_correct ON public.practice_sessions(user_id, is_correct);

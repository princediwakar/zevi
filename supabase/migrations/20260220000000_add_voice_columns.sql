-- Add voice transcription columns to practice_sessions table
-- This migration only adds columns without touching existing data

ALTER TABLE public.practice_sessions 
ADD COLUMN IF NOT EXISTS transcription TEXT;

ALTER TABLE public.practice_sessions 
ADD COLUMN IF NOT EXISTS answer_type TEXT DEFAULT 'text';

ALTER TABLE public.practice_sessions 
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER;

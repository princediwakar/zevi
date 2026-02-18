-- Add mcq_version column to questions table
-- This column stores the MCQ version of questions with sub-questions and options

ALTER TABLE questions ADD COLUMN IF NOT EXISTS mcq_version JSONB;

-- Add index for faster queries on mcq_version
CREATE INDEX IF NOT EXISTS idx_questions_mcq_version ON questions(mcq_version) WHERE mcq_version IS NOT NULL;

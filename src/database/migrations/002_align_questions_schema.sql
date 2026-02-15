-- Add new columns to questions table to support new curriculum structure
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS correct_answer jsonb,
ADD COLUMN IF NOT EXISTS options jsonb,
ADD COLUMN IF NOT EXISTS explanation text,
ADD COLUMN IF NOT EXISTS framework text,
ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 10;

-- Comment on new columns
COMMENT ON COLUMN questions.type IS 'Type of question: mcq, text, fill_blank, match, order';
COMMENT ON COLUMN questions.correct_answer IS 'JSON structure for the correct answer';
COMMENT ON COLUMN questions.options IS 'JSON array of options for MCQ questions';
COMMENT ON COLUMN questions.explanation IS 'Explanation text shown after answering';
COMMENT ON COLUMN questions.framework IS 'Framework associated with the question (e.g., CIRCLES, STAR)';
COMMENT ON COLUMN questions.xp_reward IS 'XP points awarded for answering correctly';

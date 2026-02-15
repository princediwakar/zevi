-- Add framework support to questions table
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS framework_name TEXT,
ADD COLUMN IF NOT EXISTS framework_steps JSONB,
ADD COLUMN IF NOT EXISTS expert_outline JSONB,
ADD COLUMN IF NOT EXISTS evaluation_rubric JSONB;

-- Create indexes for framework queries
CREATE INDEX IF NOT EXISTS idx_questions_framework_name ON public.questions(framework_name);
CREATE INDEX IF NOT EXISTS idx_questions_framework_steps ON public.questions USING GIN(framework_steps);

-- Add framework-specific constraints
ALTER TABLE public.questions
ADD CONSTRAINT chk_framework_name
CHECK (framework_name IN ('CIRCLES', 'STAR', 'METRICS', 'PRIORITIZATION', 'PROBLEM_STATEMENT') OR framework_name IS NULL);

-- Update existing questions with framework data (example)
UPDATE public.questions
SET
  framework_name = 'CIRCLES',
  framework_steps = '["Comprehend", "Identify", "Report", "Clarify", "Evaluate", "Summarize"]',
  expert_outline = '{"comprehend": ["Clarify the problem"], "identify": ["Identify key areas"], "report": ["Report findings"], "clarify": ["Clarify assumptions"], "evaluate": ["Evaluate solutions"], "summarize": ["Summarize key points"]}',
  evaluation_rubric = '{"comprehend": {"weight": 0.2, "criteria": ["Problem clarity", "Scope definition"]}, "identify": {"weight": 0.2, "criteria": ["Key areas identified", "Thorough analysis"]}, "report": {"weight": 0.15, "criteria": ["Clear findings", "Data support"]}, "clarify": {"weight": 0.15, "criteria": ["Assumptions stated", "Constraints identified"]}, "evaluate": {"weight": 0.15, "criteria": ["Multiple solutions", "Trade-offs discussed"]}, "summarize": {"weight": 0.15, "criteria": ["Concise summary", "Key takeaways"]}}'
WHERE category = 'product_sense' AND framework_name IS NULL;
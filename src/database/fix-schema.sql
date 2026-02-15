-- Fix for interview_type check constraint
-- Original constraint missing 'video' type used in seed data

ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_interview_type_check;

ALTER TABLE public.questions 
  ADD CONSTRAINT questions_interview_type_check 
  CHECK (interview_type IN ('phone', 'video', 'in_person', 'take_home'));

-- Seed Learning Paths
DO $$
DECLARE
    v_path_id UUID;
    v_unit_id UUID;
BEGIN
    -- Only seed if empty to avoid duplicates
    IF NOT EXISTS (SELECT 1 FROM public.learning_paths) THEN

        -- ==========================================
        -- PATH 1: Product Sense Fundamentals
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Product Sense Fundamentals', 'Master the art of breaking down ambiguous problems.', 'product_sense', 1, 6, 1, false, 'lightbulb', '#FFD700')
        RETURNING id INTO v_path_id;

        -- Unit 1.1: Introduction
        INSERT INTO public.units (learning_path_id, name, description, order_index, estimated_minutes)
        VALUES (v_path_id, 'Introduction to PM Interviews', 'Understand what interviewers are looking for.', 1, 30)
        RETURNING id INTO v_unit_id;

        INSERT INTO public.lessons (unit_id, name, type, order_index) VALUES 
        (v_unit_id, 'What is Product Sense?', 'learn', 1),
        (v_unit_id, 'The PM Mindset', 'learn', 2),
        (v_unit_id, 'Common Pitfalls', 'quiz', 3);

        -- Unit 1.2: CIRCLES Framework
        INSERT INTO public.units (learning_path_id, name, description, order_index, estimated_minutes)
        VALUES (v_path_id, 'The CIRCLES Framework', 'A structured approach to design questions.', 2, 45)
        RETURNING id INTO v_unit_id;

        INSERT INTO public.lessons (unit_id, name, type, order_index) VALUES 
        (v_unit_id, 'Intro to CIRCLES', 'learn', 1),
        (v_unit_id, 'Comprehend the Situation', 'practice', 2),
        (v_unit_id, 'Identify the Customer', 'practice', 3),
        (v_unit_id, 'Report Needs', 'practice', 4),
        (v_unit_id, 'Cut Through Prioritization', 'quiz', 5);

        -- Unit 1.3: Clarifying the Problem
        INSERT INTO public.units (learning_path_id, name, description, order_index, estimated_minutes)
        VALUES (v_path_id, 'Clarifying the Problem', 'Asking the right questions upfront.', 3, 40)
        RETURNING id INTO v_unit_id;

        INSERT INTO public.lessons (unit_id, name, type, order_index) VALUES 
        (v_unit_id, 'Why Clarify?', 'learn', 1),
        (v_unit_id, 'Practice: Ambiguous Prompts', 'practice', 2),
        (v_unit_id, 'Defining Success', 'practice', 3);


        -- ==========================================
        -- PATH 2: Execution Mastery
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Execution Mastery', 'Demonstrate your ability to get things done.', 'execution', 2, 5, 2, false, 'rocket', '#FF6347')
        RETURNING id INTO v_path_id;

        -- Unit 2.1: Understanding Metrics
        INSERT INTO public.units (learning_path_id, name, description, order_index, estimated_minutes)
        VALUES (v_path_id, 'Understanding Metrics', 'Key metrics for product success.', 1, 40)
        RETURNING id INTO v_unit_id;

        INSERT INTO public.lessons (unit_id, name, type, order_index) VALUES 
        (v_unit_id, 'Metric Types', 'learn', 1),
        (v_unit_id, 'Practice: Selecting Metrics', 'practice', 2),
        (v_unit_id, 'North Star Metric', 'quiz', 3);

        -- Unit 2.2: Root Cause Analysis
        INSERT INTO public.units (learning_path_id, name, description, order_index, estimated_minutes)
        VALUES (v_path_id, 'Root Cause Analysis', 'Debugging product issues systematically.', 2, 50)
        RETURNING id INTO v_unit_id;

        INSERT INTO public.lessons (unit_id, name, type, order_index) VALUES 
        (v_unit_id, 'The 5 Whys', 'learn', 1),
        (v_unit_id, 'Investigating Drops', 'practice', 2),
        (v_unit_id, 'Internal vs External Factors', 'quiz', 3);

    END IF;
END $$;

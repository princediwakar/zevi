-- Seed lesson content for existing lessons
-- This migration adds rich content to lessons

-- First, let's check if we have lessons without content and add content
DO $$
DECLARE
    v_lesson_id UUID;
BEGIN
    -- Update existing lessons with content if they don't have content yet
    
    -- Find a lesson named 'What is Product Sense?' and update it
    SELECT id INTO v_lesson_id FROM lessons WHERE name = 'What is Product Sense?' AND (content IS NULL OR content = '{}'::jsonb) LIMIT 1;
    IF v_lesson_id IS NOT NULL THEN
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "What is Product Sense?", "description": "Learn the fundamentals of product sense", "learn_content": {"cards": [{"title": "What is Product Sense?", "content": "Product sense is your ability to understand user needs, identify opportunities, and design solutions that create value. In PM interviews, you demonstrate this through product design questions."}, {"title": "Why It Matters", "content": "Interviewers want to see you can think like a PM - identifying problems, prioritizing solutions, and making data-driven decisions."}, {"title": "Key Components", "content": "1) User understanding 2) Problem identification 3) Solution design 4) Metric definition 5) Trade-off analysis"}, {"title": "Common Mistakes", "content": "1) Jumping to solutions without clarification 2) Ignoring constraints 3) Not defining success metrics 4) Missing trade-offs"}, {"title": "The Framework Approach", "content": "Use structured frameworks like CIRCLES, REDI, or PAM to organize your thinking and ensure comprehensive answers."}]}}',
            estimated_minutes = 10,
            xp_reward = 10
        WHERE id = v_lesson_id;
    END IF;

    -- Find 'Intro to CIRCLES' lesson
    SELECT id INTO v_lesson_id FROM lessons WHERE name = 'Intro to CIRCLES' AND (content IS NULL OR content = '{}'::jsonb) LIMIT 1;
    IF v_lesson_id IS NOT NULL THEN
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Intro to CIRCLES", "description": "Learn the CIRCLES framework", "learn_content": {"cards": [{"title": "What is CIRCLES?", "content": "CIRCLES is a framework for answering product design questions: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize."}, {"title": "C - Comprehend", "content": "Understand the question. Ask clarifying questions about users, constraints, and goals. Example: Who is the user? What problem are we solving?"}, {"title": "I - Identify", "content": "Identify the target user and their needs. Segment users into groups based on behavior, demographics, or needs."}, {"title": "R - Report", "content": "Report back the key findings. Summarize user segments and their top pain points."}, {"title": "C - Cut", "content": "Cut through prioritization. Decide which user segment and problem to focus on based on impact and feasibility."}, {"title": "L - List", "content": "List solutions. Brainstorm multiple solutions for the chosen problem."}, {"title": "E - Evaluate", "content": "Evaluate trade-offs. Analyze pros and cons of each solution."}, {"title": "S - Summarize", "content": "Summarize your recommendation. Present your top solution with success metrics."}]}}',
            estimated_minutes = 15,
            xp_reward = 10
        WHERE id = v_lesson_id;
    END IF;

    -- Find 'Why Clarify?' lesson
    SELECT id INTO v_lesson_id FROM lessons WHERE name = 'Why Clarify?' AND (content IS NULL OR content = '{}'::jsonb) LIMIT 1;
    IF v_lesson_id IS NOT NULL THEN
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Why Clarify?", "description": "Learn why clarification matters", "learn_content": {"cards": [{"title": "The Importance of Clarification", "content": "Never assume you understand the problem. Clarifying questions show you think critically."}, {"title": "What to Clarify", "content": "1) Who is the user? 2) What specific problem? 3) Constraints? 4) Success metrics? 5) Timeline?"}, {"title": "Good Clarifying Questions", "content": "What does success look like? Who are we solving for? What constraints exist? What have you tried before?"}, {"title": "Common Mistakes", "content": "1) Not asking any questions 2) Asking too many questions 3) Not listening to answers 4) Making assumptions"}]}}',
            estimated_minutes = 10,
            xp_reward = 10
        WHERE id = v_lesson_id;
    END IF;

    -- Find 'Metric Types' lesson
    SELECT id INTO v_lesson_id FROM lessons WHERE name = 'Metric Types' AND (content IS NULL OR content = '{}'::jsonb) LIMIT 1;
    IF v_lesson_id IS NOT NULL THEN
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Metric Types", "description": "Learn different types of metrics", "learn_content": {"cards": [{"title": "Leading vs Lagging", "content": "Leading indicators predict future outcomes. Lagging indicators measure results. You need both!"}, {"title": "North Star Metric", "content": "The single metric that best captures the value you deliver to customers. Example: Airbnb - Booking leads"}, {"title": "Vanity vs Actionable", "content": "Vanity metrics look good but cannot be acted upon. Actionable metrics drive decisions."}, {"title": "Metric Frameworks", "content": "HEART: Happiness, Engagement, Adoption, Retention, Task success. AARRR: Acquisition, Activation, Retention, Referral, Revenue."}]}}',
            estimated_minutes = 15,
            xp_reward = 10
        WHERE id = v_lesson_id;
    END IF;

    -- Find 'The 5 Whys' lesson
    SELECT id INTO v_lesson_id FROM lessons WHERE name = 'The 5 Whys' AND (content IS NULL OR content = '{}'::jsonb) LIMIT 1;
    IF v_lesson_id IS NOT NULL THEN
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "The 5 Whys", "description": "Learn root cause analysis", "learn_content": {"cards": [{"title": "What is 5 Whys?", "content": "A technique to find the root cause of a problem by asking why 5 times."}, {"title": "When to Use", "content": "When you see a metric drop and need to understand why. When users complain and you need deeper insight."}, {"title": "Example Walkthrough", "content": "Why did conversion drop? -> Traffic source changed. Why? -> Marketing campaign ended. Why? -> Budget cuts. Why? -> Q4 priorities. Why? -> Leadership focus shifted. Root cause: Leadership priorities changed."}]}}',
            estimated_minutes = 10,
            xp_reward = 10
        WHERE id = v_lesson_id;
    END IF;

    RAISE NOTICE 'Lesson content migration completed';
END $$;

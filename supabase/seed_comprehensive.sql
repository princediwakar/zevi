-- Comprehensive Seed Data for Zevi PM Interview Prep App
-- This file seeds learning paths, units, lessons, and questions with full framework support

DO $$
DECLARE
    v_path_id UUID;
    v_unit_id UUID;
    v_lesson_id UUID;
BEGIN
    -- ============================================
    -- LEARNING PATHS SEEDING
    -- ============================================
    
    -- Only seed if tables are empty
    IF NOT EXISTS (SELECT 1 FROM public.learning_paths) THEN
        
        -- ==========================================
        -- PATH 1: Product Sense Fundamentals
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Product Sense Fundamentals', 'Master the art of breaking down ambiguous product design problems using structured frameworks.', 'product_sense', 1, 8, 1, false, 'lightbulb', '#FFD700')
        RETURNING id INTO v_path_id;

        -- Unit 1.1: Introduction to Product Sense
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'Introduction to PM Interviews', 'Understand what interviewers are looking for in product sense questions.', NULL, 1, 30, 10)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'What is Product Sense?', 'learn', 1, '{"type": "learn", "cards": [{"title": "What is Product Sense?", "content": "Product sense is your ability to understand user needs, identify opportunities, and design solutions that create value. In PM interviews, you demonstrate this through product design questions."}, {"title": "Why It Matters", "content": "Interviewers want to see you can think like a PM - identifying problems, prioritizing solutions, and making data-driven decisions."}, {"title": "Key Components", "content": "1) User understanding 2) Problem identification 3) Solution design 4) Metric definition 5) Trade-off analysis"}, {"title": "Common Mistakes", "content": "1) Jumping to solutions without clarification 2) Ignoring constraints 3) Not defining success metrics 4) Missing trade-offs"}, {"title": "The Framework Approach", "content": "Use structured frameworks like CIRCLES,REDI, or PAM to organize your thinking and ensure comprehensive answers."}]}', 10, 10),
        (v_unit_id, 'The PM Mindset', 'learn', 2, '{"type": "learn", "cards": [{"title": "Think Like a PM", "content": "Product managers balance user needs, business goals, and technical constraints."}, {"title": "User-Centric Thinking", "content": "Always start with understanding the user. Who are they? What problem do they have? What does success look like to them?"}, {"title": "Data-Driven Decisions", "content": "Support your recommendations with data. Define metrics upfront and explain how you would measure success."}]}', 10, 10),
        (v_unit_id, 'Introduction Quiz', 'quiz', 3, '{"type": "quiz", "questions": [{"text": "What is the first step in answering a product design question?", "options": ["Brainstorm solutions", "Clarify the problem", "Define metrics", "Present your idea", "Correct Answer: Clarify the problem"], "correct_answer": 1}, {"text": "Why is it important to define success metrics early?", "options": ["It is not important", "To understand what to optimize for", "To impress the interviewer", "Because the interviewer asks"], "correct_answer": 1}], "passing_score": 80}', 10, 20);

        -- Unit 1.2: CIRCLES Framework
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'The CIRCLES Framework', 'A structured approach to product design questions.', 'CIRCLES', 2, 60, 20)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'Intro to CIRCLES', 'learn', 1, '{"type": "learn", "cards": [{"title": "What is CIRCLES?", "content": "CIRCLES is a framework for answering product design questions: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize."}, {"title": "C - Comprehend", "content": "Understand the question. Ask clarifying questions about users, constraints, and goals. Example: Who is the user? What problem are we solving?"}, {"title": "I - Identify", "content": "Identify the target user and their needs. Segment users into groups based on behavior, demographics, or needs."}, {"title": "R - Report", "content": "Report back the key findings. Summarize user segments and their top pain points."}, {"title": "C - Cut", "content": "Cut through prioritization. Decide which user segment and problem to focus on based on impact and feasibility."}, {"title": "L - List", "content": "List solutions. Brainstorm multiple solutions for the chosen problem."}, {"title": "E - Evaluate", "content": "Evaluate trade-offs. Analyze pros and cons of each solution."}, {"title": "S - Summarize", "content": "Summarize your recommendation. Present your top solution with success metrics."}]}', 15, 10),
        (v_unit_id, 'Comprehend Step Drill', 'drill', 2, '{"type": "drill", "focus_step": "Comprehend", "questions": [{"text": "Design a coffee ordering app. What clarification questions would you ask first?", "correct_options": ["Who is the target user?", "What is the budget?", "How many coffee shops are involved?", "What is the technical stack?"], "incorrect_options": ["What color should the app be?", "What database to use?", "Who is the competitor?", "What is the marketing budget?"], "feedback": {"correct": "Great clarification! Always clarify target users first.", "incorrect": "Technical and business questions come later. Start with user understanding."}}, {"text": "You are asked to improve Amazon. What clarification questions are most important?", "correct_options": ["Which user segment?", "What problem to solve?", "Any constraints?", "Success criteria?"], "incorrect_options": ["How many engineers?", "What is the budget?", "Who is the CEO?"], "feedback": {"correct": "Perfect! User and problem clarification are key.", "incorrect": "Start with understanding the problem space, not technical details."}}]}', 10, 15),
        (v_unit_id, 'Identify Step Practice', 'pattern', 3, '{"type": "pattern", "pattern_name": "User Segmentation", "template": ["Target User Segment", "User Needs", "Pain Points", "Current Solutions"], "questions": [{"text": "For a grocery delivery app, identify key user segments", "framework_name": "CIRCLES"}]}', 15, 20),
        (v_unit_id, 'CIRCLES Quiz', 'quiz', 4, '{"type": "quiz", "questions": [{"text": "What does the C in CIRCLES stand for?", "options": ["Create", "Comprehend", "Consider", "Choose"], "correct_answer": 1}, {"text": "Which step comes after identifying users?", "options": ["Cut", "List", "Report", "Evaluate"], "correct_answer": 2}], "passing_score": 80}', 10, 25);

        -- Unit 1.3: User Research & Segmentation
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'User Research & Segmentation', 'Learn to identify and prioritize user segments.', NULL, 3, 45, 15)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'User Segmentation Basics', 'learn', 1, '{"type": "learn", "cards": [{"title": "Why Segment Users?", "content": "Not all users are equal. Segmentation helps you prioritize which problems to solve first."}, {"title": "Segmentation Dimensions", "content": "1) Demographics 2) Behavior 3) Needs 4) Value 5) Geography"}, {"title": "Prioritization Matrix", "content": "Use impact vs frequency matrix to prioritize segments."}]}', 10, 10),
        (v_unit_id, 'Segment Practice', 'practice', 2, '{"type": "pattern", "pattern_name": "User Segmentation", "template": ["Segment Name", "Size", "Needs", "Pain Points", "Priority"], "questions": [{"text": "Segment users for a fitness app", "framework_name": "CIRCLES"}]}', 15, 15),
        (v_unit_id, 'Segmentation Quiz', 'quiz', 3, '{"type": "quiz", "questions": [{"text": "What is the best way to prioritize user segments?", "options": ["Alphabetical order", "Impact x Frequency", "Random selection", "Company preference"], "correct_answer": 1}], "passing_score": 80}', 10, 20);

        -- ==========================================
        -- PATH 2: Execution Mastery
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Execution Mastery', 'Demonstrate your ability to ship products and drive metrics.', 'execution', 2, 6, 2, false, 'rocket', '#FF6347')
        RETURNING id INTO v_path_id;

        -- Unit 2.1: Metrics Deep Dive
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'Product Metrics', 'Master the art of defining and selecting metrics.', 'METRICS', 1, 50, 20)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'Types of Metrics', 'learn', 1, '{"type": "learn", "cards": [{"title": "Leading vs Lagging", "content": "Leading indicators predict future outcomes. Lagging indicators measure results. You need both!"}, {"title": "North Star Metric", "content": "The single metric that best captures the value you deliver to customers. Example: Airbnb - Booking leads"}, {"title": "Vanity vs Actionable", "content": "Vanity metrics look good but cannot be acted upon. Actionable metrics drive decisions."}, {"title": "Metric Frameworks", "content": "HEART: Happiness, Engagement, Adoption, Retention, Task success. AARRR: Acquisition, Activation, Retention, Referral, Revenue."}]}', 15, 10),
        (v_unit_id, 'Metric Selection Drill', 'drill', 2, '{"type": "drill", "focus_step": "Define Metrics", "questions": [{"text": "For a social media app, which is the best north star metric?", "correct_options": ["Daily Active Users", "Time spent", "Posts created", "Messages sent"], "incorrect_options": ["Page views", "Total registered users", "App downloads"], "feedback": {"correct": "DAU is often best - it shows active engagement.", "incorrect": "Consider which metric most directly captures user value delivered."}}]}', 10, 15),
        (v_unit_id, 'Define Metrics Practice', 'full_practice', 3, '{"type": "full_practice", "question": "What metrics would you track for a new fitness tracking feature in Spotify?", "mode": "outline", "framework_name": "METRICS", "framework_steps": ["Define Success", "Measure", "Analyze", "Optimize"], "expert_outline": {"Define Success": ["Increase user engagement with fitness content", "Drive premium conversions", "Improve retention"], "Measure": ["Daily Active Users of feature", "Time spent on fitness content", "Conversion to premium from fitness", "Feature completion rate"], "Analyze": ["Cohort analysis", "Funnel drop-off", "Correlation with overall engagement"], "Optimize": ["A/B test features", "Personalize recommendations", "Push notification optimization"]}}', 15, 25),
        (v_unit_id, 'Metrics Quiz', 'quiz', 4, '{"type": "quiz", "questions": [{"text": "What is a leading indicator?", "options": ["Revenue", "DAU", "Sign-ups that become active", "Churn rate"], "correct_answer": 2}, {"text": "Why avoid vanity metrics?", "options": ["They are too complex", "They do not drive decisions", "They are inaccurate", "They are not measurable"], "correct_answer": 1}], "passing_score": 80}', 10, 20);

        -- Unit 2.2: Root Cause Analysis
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'Root Cause Analysis', 'Debug product issues systematically.', NULL, 2, 45, 15)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'The 5 Whys Method', 'learn', 1, '{"type": "learn", "cards": [{"title": "What is 5 Whys?", "content": "A technique to find the root cause of a problem by asking why 5 times."}, {"title": "When to Use", "content": "When you see a metric drop and need to understand why. When users complain and you need deeper insight."}, {"title": "Example", "content": "Why did conversion drop? -> Traffic source changed. Why? -> Marketing campaign ended. Why? -> Budget cuts. Why? -> Q4 priorities. Keep going until actionable!"}]}', 10, 10),
        (v_unit_id, 'Root Cause Practice', 'full_practice', 2, '{"type": "full_practice", "question": "Facebook Events usage is down 10% this month. Diagnose the issue.", "mode": "outline", "framework_name": "METRICS", "framework_steps": ["Define", "Measure", "Analyze", "Optimize"], "expert_outline": {"Define": ["Understand what Events means to users", "Define success for Events feature"], "Measure": ["Segment by user type", "Segment by device", "Segment by geography", "Look at funnels"], "Analyze": ["Check for technical bugs", "Check for UX changes", "Check seasonality", "Check competition"], "Optimize": ["Fix bugs", "Revert harmful changes", "Launch engagement features"]}}', 15, 20),
        (v_unit_id, 'Root Cause Quiz', 'quiz', 3, '{"type": "quiz", "questions": [{"text": "What is the first step in root cause analysis?", "options": ["Ask why 5 times", "Define the problem clearly", "Look at competitors", "Check technical logs"], "correct_answer": 1}], "passing_score": 80}', 10, 15);

        -- ==========================================
        -- PATH 3: Behavioral Questions
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Behavioral Mastery', 'Tell compelling stories about your experience.', 'behavioral', 1, 4, 3, false, 'message-circle', '#7C3AED')
        RETURNING id INTO v_path_id;

        -- Unit 3.1: STAR Method
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'The STAR Framework', 'Structure your behavioral answers effectively.', 'STAR', 1, 30, 15)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'STAR Introduction', 'learn', 1, '{"type": "learn", "cards": [{"title": "What is STAR?", "content": "Situation: Set the context. Task: Explain your responsibility. Action: Describe what YOU did. Result: Share the outcome."}, {"title": "Why STAR Works", "content": "Provides structure so you do not ramble. Highlights your specific contributions. Shows outcomes with metrics when possible."}, {"title": "Common Mistakes", "content": "1) Being too vague 2) Talking about team instead of self 3) Forgetting the result 4) Being too long"}]}', 10, 10),
        (v_unit_id, 'STAR Practice', 'practice', 2, '{"type": "pattern", "pattern_name": "STAR Stories", "template": ["Situation", "Task", "Action", "Result"], "questions": [{"text": "Tell me about a time you had a conflict with a teammate", "framework_name": "STAR"}]}', 15, 20),
        (v_unit_id, 'STAR Quiz', 'quiz', 3, '{"type": "quiz", "questions": [{"text": "In STAR, what does the A stand for?", "options": ["Analysis", "Action", "Achievement", "Answer"], "correct_answer": 1}], "passing_score": 80}', 10, 15);

        -- ==========================================
        -- PATH 4: Strategy Questions
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Strategy & Prioritization', 'Demonstrate strategic thinking and prioritization skills.', 'strategy', 3, 5, 4, false, 'target', '#059669')
        RETURNING id INTO v_path_id;

        -- Unit 4.1: Prioritization Frameworks
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'Prioritization Frameworks', 'Learn to prioritize features and projects.', 'PRIORITIZATION', 1, 40, 15)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'RICE Framework', 'learn', 1, '{"type": "learn", "cards": [{"title": "What is RICE?", "content": "Reach x Impact x Confidence / Effort. A scoring framework for prioritization."}, {"title": "Reach", "content": "How many users will this affect per quarter?"}, {"title": "Impact", "content": "How much will this improve user experience? (3=massive, 2=high, 1=medium, 0.5=low)"}, {"title": "Confidence", "content": "How sure are you about the estimates? (100%=high, 80%=medium, 50%=low)"}, {"title": "Effort", "content": "Person-weeks required to build the feature."}]}', 15, 10),
        (v_unit_id, 'Kano Model', 'learn', 2, '{"type": "learn", "cards": [{"title": "Kano Model Categories", "content": "1) Must-be: Minimum requirements 2) Performance: More is better 3) Delighters: Unexpected joy 4) Indifferent: Users do not care 5) Reverse: Some users dislike"}, {"title": "Application", "content": "Focus on Must-bes first, then Performance, then Delighters. Avoid building Indifferent or Reverse features."}]}', 10, 10),
        (v_unit_id, 'Prioritization Practice', 'full_practice', 3, '{"type": "full_practice", "question": "You have 3 features to prioritize: 1) Dark mode (easy, some users want), 2) Search improvements (medium, many users need), 3) AI recommendations (hard, could be game-changing). How do you prioritize?", "mode": "outline", "framework_name": "PRIORITIZATION", "framework_steps": ["Value vs Effort", "RICE Scoring", "Kano Analysis"], "expert_outline": {"Value vs Effort": ["Dark mode: Low value, Low effort", "Search: High value, Medium effort", "AI: High potential, High effort"], "RICE Scoring": ["Dark mode: 1000 x 0.5 x 80% / 1 = 400", "Search: 2000 x 2 x 90% / 3 = 1200", "AI: 500 x 3 x 50% / 8 = 94"], "Kano Analysis": ["Search is Must-be (basic need)", "Dark mode is Delighter (nice to have)", "AI is Performance (could delight)"]}}', 15, 20);

        -- ==========================================
        -- PATH 5: Estimation Questions
        -- ==========================================
        INSERT INTO public.learning_paths (name, description, category, difficulty_level, estimated_hours, order_index, is_premium, icon_name, color)
        VALUES ('Estimation Skills', 'Master guesstimates and market sizing.', 'estimation', 2, 3, 5, false, 'calculator', '#EA580C')
        RETURNING id INTO v_path_id;

        -- Unit 5.1: Market Sizing
        INSERT INTO public.units (learning_path_id, name, description, framework_name, order_index, estimated_minutes, xp_reward)
        VALUES (v_path_id, 'Market Sizing', 'Learn to estimate market size quickly.', NULL, 1, 30, 15)
        RETURNING id INTO v_unit_id;
        INSERT INTO public.lessons (unit_id, name, type, order_index, content, estimated_minutes, xp_reward) VALUES 
        (v_unit_id, 'Top-Down vs Bottom-Up', 'learn', 1, '{"type": "learn", "cards": [{"title": "Top-Down", "content": "Start with total market and work down to your target. Example: US population -> internet users -> online shoppers -> your category buyers."}, {"title": "Bottom-Up", "content": "Start with your known data points and scale up. Example: 1 store -> 100 customers/day -> 365 days -> 36,500/year -> multiply by stores."}, {"title": "When to Use Each", "content": "Top-down for TAM calculations. Bottom-up when you have specific data points."}]}', 10, 10),
        (v_unit_id, 'Estimation Practice', 'practice', 2, '{"type": "pattern", "pattern_name": "Market Sizing", "template": ["Assumptions", "Calculation", "Validation"], "questions": [{"text": "Estimate the market size for dog walking in San Francisco", "framework_name": "PROBLEM_STATEMENT"}]}', 15, 20);

    END IF;

    -- ============================================
    -- QUESTIONS SEEDING (Only if questions table is empty)
    -- ============================================
    IF NOT EXISTS (SELECT 1 FROM public.questions LIMIT 1) THEN
        
        -- Product Sense Questions
        INSERT INTO public.questions (question_text, category, difficulty, company, interview_type, pattern_type, framework_name, expert_answer, framework_steps, expert_outline, rubric, mcq_version)
        VALUES
        -- Product Design Questions
        ('Design a product for finding roommates in a new city.', 'product_sense', 'intermediate', 'Facebook', 'video', 'design_x_for_y', 'CIRCLES', 
         'Target users: young professionals moving to new cities. Pain points: trust, compatibility, timing. Solution: Roommate Match with verified profiles, lifestyle quizzes, video intros. Key features: ID verification, compatibility scoring, secure messaging. Success metrics: matches made, conversion to in-person meetings.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         '{"Comprehend": ["Target: young professionals in new cities", "Goal: find compatible roommates safely"], "Identify": ["Segment: age 22-35", "Segment: students vs professionals", "Segment: budget-conscious"], "Report": ["Pain point: trust with strangers", "Pain point: compatibility unknown", "Pain point: scheduling"], "Cut": ["Prioritize: trust & safety first", "Priority: young professionals"], "List": ["ID verification", "Lifestyle quiz", "Video intros", "Compatibility score", "Secure messaging"], "Evaluate": ["Trust features most important", "Video builds comfort", "Scoring drives matches"], "Summarize": ["Recommend: Roommate Match", "Metrics: matches, meetings, retention"]}',
         '{"Comprehend": {"weight": 0.15, "criteria": ["Asked about target users", "Clarified constraints"], "description": "Understand the problem scope"}, "Identify": {"weight": 0.2, "criteria": ["Identified key user segments", "Understood user needs"], "description": "Identify target customers"}, "Cut": {"weight": 0.15, "criteria": ["Prioritized effectively", "Used clear criteria"], "description": "Prioritize the problem"}, "List": {"weight": 0.2, "criteria": ["Generated multiple solutions", "Covered key features"], "description": "List solutions"}, "Evaluate": {"weight": 0.15, "criteria": ["Discussed trade-offs", "Justified recommendation"], "description": "Evaluate options"}, "Summarize": {"weight": 0.15, "criteria": ["Clear recommendation", "Defined success metrics"], "description": "Summarize recommendation"}}',
         '{"enabled": true, "sub_questions": [{"prompt": "What is the biggest challenge in a roommate finder product?", "options": [{"text": "Trust & Safety", "correct": true, "explanation": "Living with strangers carries safety risks"}, {"text": "Payment processing", "correct": false, "explanation": "Solved by existing platforms"}, {"text": "UI Design", "correct": false, "explanation": "Important but not the biggest challenge"}, {"text": "Marketing", "correct": false, "explanation": "Secondary concern"}], "difficulty": "beginner"}]}'),

        ('Design an alarm clock for deaf people.', 'product_sense', 'intermediate', 'Google', 'video', 'design_x_for_y', 'CIRCLES',
         'Sensory inputs: Vibration (wearable or under pillow), Light (gradually brightening room), Scent (release fragrance). Integration with smart home devices. Fail-safe: battery backup, multiple alert methods. Key metrics: wake-up success rate, user satisfaction.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         '{"Comprehend": ["Deaf users cannot hear alarms", "Need visual/tactile alerts", "Must work while sleeping"], "Identify": ["Heavy sleepers", "Light sleepers", "Elderly deaf"], "Report": ["Current solutions inadequate", "Safety risk if missed alarm"], "Cut": ["Prioritize: vibration + light combo"], "List": ["Bed shaker", "Smart light integration", "Wearable vibration", "Scent release"], "Evaluate": ["Vibration most reliable", "Light needs darkness", "Combination best"], "Summarize": ["Recommend: Smart hub with shaker + lights", "Metric: wake success rate"]}',
         NULL,
         '{"enabled": true, "sub_questions": [{"prompt": "Which sensory channel is most effective for deaf users?", "options": [{"text": "Vibration", "correct": true, "explanation": "Tactile feedback is most reliable"}, {"text": "Sound", "correct": false, "explanation": "Cannot hear"}, {"text": "Light", "correct": false, "explanation": "Does not work while sleeping"}, {"text": "Scent", "correct": false, "explanation": "Too slow for waking up"}], "difficulty": "beginner"}]}'),

        ('How would you improve the Google Maps app?', 'product_sense', 'beginner', 'Google', 'video', 'improve_x', 'CIRCLES',
         'Problems: information overload, unreliable real-time data, poor indoor navigation. Solutions: AI-powered recommendations, AR walking directions, improved ETA predictions, integrated transit delays. Metrics: daily active users, navigation completion rate, user satisfaction.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         '{"Comprehend": ["Current Maps: navigation, Explore, traffic"], "Identify": ["Commuters", "Travelers", "Local explorers"], "Report": ["Pain: too many options", "Pain: inaccurate ETAs", "Pain: indoor confusion"], "Cut": ["Focus: daily commuters"], "List": ["AI recommendations", "AR navigation", "Real-time transit", "Improved indoor maps"], "Evaluate": ["AR highest impact", "AI drives engagement"], "Summarize": ["Recommend: AI + AR", "Metric: DAU, completion"]}',
         NULL,
         NULL),

        ('Design a unified messaging inbox for all your messaging apps.', 'product_sense', 'intermediate', 'Slack', 'video', 'design_x_for_y', 'CIRCLES',
         'Aggregate: WhatsApp, iMessage, Slack, Discord. Features: unified inbox, smart replies, cross-app search, notification management. Challenges: platform restrictions, security, privacy. Metrics: messages synced, time saved, user satisfaction.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         NULL,
         NULL,
         '{"enabled": true, "sub_questions": [{"prompt": "What is the biggest technical challenge for a unified inbox?", "options": [{"text": "Platform restrictions", "correct": true, "explanation": "iOS/Android limit access to other apps"}, {"text": "User interface", "correct": false, "explanation": "UI is solvable"}, {"text": "Storage", "correct": false, "explanation": "Cloud storage is cheap"}, {"text": "Search functionality", "correct": false, "explanation": "Search is a solvable problem"}], "difficulty": "intermediate"}]}'),

        -- Strategy Questions
        ('Should Twitter launch a subscription model?', 'strategy', 'advanced', 'Twitter', 'video', 'strategy', 'PROBLEM_STATEMENT',
         'Pros: diversify revenue, reduce ad dependence, premium features. Cons: slower growth, churn, cannibalize ad revenue. Recommendation: Freemium model with Twitter Blue (edit button, folders, no ads for subscribers). Keeps core free, adds premium for power users.',
         '["User", "Need", "Insight"]',
         '{"User": ["Advertisers (B2B)", "Users who want premium (B2C)", "Free users"], "Need": ["More revenue diversity", "Higher ARPU", "User growth"], "Insight": ["Ad market is volatile", "Power users will pay for features", "Network effects keep free users"], "Strategy": ["Freemium: Twitter Blue", "Keep core free", "Premium: edit, folders, no ads"]}',
         '{"User": {"weight": 0.33, "criteria": ["Identified key stakeholders"], "description": "Identify users"}, "Need": {"weight": 0.33, "criteria": ["Understood business needs"], "description": "Understand needs"}, "Insight": {"weight": 0.34, "criteria": ["Provided strategic insight"], "description": "Provide insight"}}',
         NULL),

        ('Should Netflix add live sports?', 'strategy', 'advanced', 'Netflix', 'video', 'strategy', 'PROBLEM_STATEMENT',
         'Pros: retain subscribers, high engagement, differentiate from streaming. Cons: extremely expensive rights, content fragmentation. Recommendation: Start with non-exclusive sports, experiment with lower-tier sports first (documentaries, smaller leagues), then expand.',
         '["User", "Need", "Insight"]',
         '{"User": ["Subscribers", "Sports fans", "Non-sports viewers"], "Need": ["More content", "Live events", "Exclusive content"], "Insight": ["Sports rights very expensive", "Fragmentation risk", "Drive to compete with Amazon/Apple"], "Strategy": ["Experiment with lower-tier sports", "Documentary-style content first", "Avoid exclusive NFL/NBA initially"]}',
         NULL,
         NULL),

        -- Execution/Metrics Questions
        ('Facebook Events usage is down 10%. Diagnose the issue.', 'execution', 'advanced', 'Meta', 'video', 'investigate_drop', 'METRICS',
         '1) Rule out tech issues: check for bugs, latency. 2) Segment: by region, device, user type. 3) Analyze: compare to baseline, check seasonality, competition. 4) Hypothesis: UX changes, competitor growth (Partiful), event creation friction.',
         '["Define", "Measure", "Analyze", "Optimize"]',
         '{"Define": ["Events: create/join/discover local events", "Success: DAU, event creation, attendance"], "Measure": ["Segment by region", "Segment by device", "Segment by user age", "Funnel: views->creates->attends"], "Analyze": ["Check for bugs", "Check UX changes", "Check seasonality (post-holidays)", "Check competition (Partiful)"], "Optimize": ["Fix technical issues", "Revert harmful UX", "Add engagement features"]}',
         '{"Define": {"weight": 0.2, "criteria": ["Clear problem definition"], "description": "Define the problem"}, "Measure": {"weight": 0.3, "criteria": ["Proper segmentation", "Right metrics"], "description": "Measure the right things"}, "Analyze": {"weight": 0.3, "criteria": ["Root cause identified", "Data-driven"], "description": "Analyze systematically"}, "Optimize": {"weight": 0.2, "criteria": ["Actionable recommendations"], "description": "Recommend solutions"}}',
         '{"enabled": true, "sub_questions": [{"prompt": "What is the first step when you see a metric drop?", "options": [{"text": "Check for data issues/bugs", "correct": true, "explanation": "Always rule out data quality first"}, {"text": "Ask stakeholders", "correct": false, "explanation": "Data first"}, {"text": "Launch a fix", "correct": false, "explanation": "Need diagnosis first"}, {"text": "Check competitors", "correct": false, "explanation": "Internal first"}], "difficulty": "beginner"}]}'),

        ('What metrics would you track for Uber Pool?', 'execution', 'intermediate', 'Uber', 'video', 'metrics_for_x', 'METRICS',
         'North Star: matches per trip (efficiency). Supporting: discount vs UberX time added (value), driver earnings per hour (supply), cancellation rate (reliability), pool uptake rate.',
         '["Define", "Measure", "Analyze", "Optimize"]',
         '{"Define": ["Uber Pool: shared rides for lower cost", "Goal: efficient matching, user value, driver income"], "Measure": ["North Star: matches per trip", "User value: discount vs UberX time added", "Supply: driver earnings/hour", "Reliability: cancellation rate", "Uptake: pool vs UberX conversion"], "Analyze": ["Segment by city", "Segment by time of day", "Cohort analysis"], "Optimize": ["Match algorithm", "Pricing strategy", "Driver incentives"]}',
         NULL,
         '{"enabled": true, "sub_questions": [{"prompt": "What is the best north star for a rideshare pool product?", "options": [{"text": "Matches per trip", "correct": true, "explanation": "Measures efficiency of matching"}, {"text": "Total rides", "correct": false, "explanation": "Vanity metric"}, {"text": "Revenue", "correct": false, "explanation": "Too far from product value"}, {"text": "Driver count", "correct": false, "explanation": "Supply metric, not success"}], "difficulty": "intermediate"}]}'),

        -- Estimation Questions
        ('Estimate the bandwidth used by TikTok in a day.', 'estimation', 'advanced', 'ByteDance', 'phone', 'estimation', NULL,
         'Assumptions: 1B DAU, avg 60 mins/day, video bitrate 1-2 Mbps. Calculation: 1B users * 60 min * 60 sec * 1.5 Mbps = bits. Convert: bits/8 = bytes, divide by TB. ~500-1000 PB/day.',
         NULL,
         NULL,
         NULL,
         NULL),

        ('Estimate the number of elevators in NYC.', 'estimation', 'intermediate', 'Google', 'phone', 'estimation', NULL,
         'NYC pop: 8M. Buildings: ~1M. High-rises (6+ floors): ~10% = 100k. Elevators per building: avg 2-3. Total: ~200k-300k. (Actual ~84k, but reasoning matters more than exact.)',
         NULL,
         NULL,
         NULL,
         NULL),

        ('Estimate the market size for dog walking in San Francisco.', 'estimation', 'beginner', 'Rover', 'phone', 'estimation', NULL,
         'SF households: 350k. Dog ownership: ~30% = 100k dogs. Need walkers: ~50% = 50k dogs. Walks per week: avg 3. Price: $20/walk. Weekly TAM: 50k * 3 * $20 = $3M/week. Annual: ~$150M.',
         NULL,
         NULL,
         NULL,
         NULL),

        -- Behavioral Questions
        ('Tell me about a time you had a conflict with an engineer.', 'behavioral', 'intermediate', 'General', 'video', 'behavioral_star', 'STAR',
         'STAR: Situation - launch timeline conflict. Task - deliver feature on time. Action - 1:1 to understand constraints, found technical debt, negotiated scope, pair programmed. Result - launched on time, created process for future.',
         '["Situation", "Task", "Action", "Result"]',
         '{"Situation": "Product launch in 2 weeks, engineer said feature impossible", "Task": "Deliver feature that was promised to stakeholders", "Action": ["1:1 to understand constraints", "Found unexpected technical debt", "Negotiated scope with stakeholders", "Pair programmed evenings"], "Result": ["Launched on time", "Feature worked well", "Created tech debt review process"]}',
         '{"Situation": {"weight": 0.25, "criteria": ["Clear context", "Brief setup"]}, "Task": {"weight": 0.25, "criteria": ["Your specific responsibility", "Clear goal"]}, "Action": {"weight": 0.25, "criteria": ["Used I not we", "Specific steps", "Showed initiative"]}, "Result": {"weight": 0.25, "criteria": ["Quantified where possible", "Learned something"]}}',
         '{"enabled": true, "sub_questions": [{"prompt": "In STAR, what should you focus on in the Action section?", "options": [{"text": "What YOU specifically did", "correct": true, "explanation": "Interviewers want to see your individual contribution"}, {"text": "What the team did", "correct": false, "explanation": "Focus on your actions"}, {"text": "What the manager decided", "correct": false, "explanation": "This is about your actions"}, {"text": "What went wrong", "correct": false, "explanation": "Focus on positive actions and results"}], "difficulty": "beginner"}]}'),

        ('Tell me about a time you failed.', 'behavioral', 'intermediate', 'General', 'video', 'behavioral_star', 'STAR',
         'STAR: Situation - launched feature that users hated. Task - as PM, own the product. Action - analyzed feedback, identified root cause (launched too fast), created beta program. Result - rebuilt with beta input, launched successfully, learned importance of validation.',
         '["Situation", "Task", "Action", "Result"]',
         '{"Situation": "Launched a new feature, user feedback extremely negative", "Task": "As the PM, needed to fix the situation", "Action": ["Analyzed all feedback", "Identified: launched without testing", "Created beta program for future launches", "Rebuilt with user input"], "Result": ["Feature relaunched successfully", "Created user beta program", "Learned: validation before launch"], "Reflection": "Would add more user testing upfront next time"}}',
         NULL,
         NULL),

        ('Describe a time you influenced without authority.', 'behavioral', 'intermediate', 'General', 'video', 'behavioral_star', 'STAR',
         'STAR: Situation - needed design help from another team. Task - get UX resources for my project. Action - Built relationship, showed data, aligned incentives, offered reciprocation. Result - got design support, feature launched successfully.',
         '["Situation", "Task", "Action", "Result"]',
         '{"Situation": "Needed UX help from another team, no authority", "Task": "Get design resources for my project", "Action": ["Built relationship with design lead", "Showed data on user impact", "Aligned incentives with their goals", "Offered to help their project in return"], "Result": ["Got design support", "Feature launched successfully", "Created cross-team collaboration process"], "Key learning": "Influence comes from relationships and data"}',
         NULL,
         NULL),

        -- More Product Sense
        ('Design a bookshelf for children.', 'product_sense', 'beginner', 'Amazon', 'video', 'design_x_for_y', 'CIRCLES',
         'Users: Kids (independence) + Parents (storage). Features: Front-facing covers (browse by image), adjustable height, integrated reading nook, durable materials, fun colors. Success: usage frequency, parent satisfaction.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         NULL,
         NULL,
         NULL),

        ('Improve the experience of visiting a museum.', 'product_sense', 'beginner', 'Google', 'video', 'improve_x', 'CIRCLES',
         'Pain points: crowds, lack of context, getting lost. Solutions: AR guides, personalized routes, crowd-avoidance. Metrics: visitor satisfaction, time spent, repeat visits.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         NULL,
         NULL,
         NULL),

        ('Design a smart shoe.', 'product_sense', 'beginner', 'Nike', 'video', 'design_x_for_y', 'CIRCLES',
         'Target: runners. Features: auto-lacing, gait analysis, GPS tracking, haptic feedback. Success: usage, health improvements.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         NULL,
         NULL,
         NULL),

        ('Critique the Spotify app.', 'product_sense', 'intermediate', 'Spotify', 'phone', 'improve_x', 'CIRCLES',
         'Good: Discover Weekly, dark mode. Bad: podcast integration cluttered, too many tabs. Improve: separate podcast app, better algorithm, social features.',
         '["Comprehend", "Identify", "Report", "Cut", "List", "Evaluate", "Summarize"]',
         NULL,
         NULL,
         NULL),

        -- More Execution
        ('How would you reduce cancellations for Uber?', 'execution', 'intermediate', 'Uber', 'video', 'investigate_drop', 'METRICS',
         'Analyze when cancellations happen: pre-match (ETA), post-match (wait time). Solutions: better ETAs, driver incentives for low wait areas, penalties for late cancellations.',
         '["Define", "Measure", "Analyze", "Optimize"]',
         NULL,
         NULL,
         NULL),

        ('Decrease churn for a SaaS platform.', 'execution', 'advanced', 'Salesforce', 'video', 'investigate_drop', 'METRICS',
         'Cohort analysis to find when users churn. Onboarding funnel analysis. Product usage correlation. Solutions: better onboarding, engagement campaigns, customer success.',
         '["Define", "Measure", "Analyze", "Optimize"]',
         NULL,
         NULL,
         NULL);

    END IF;
    
    RAISE NOTICE 'Seed data inserted successfully!';
END $$;

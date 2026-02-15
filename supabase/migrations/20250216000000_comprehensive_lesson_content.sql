-- Comprehensive Lesson Content Migration
-- This adds high-quality, structured lesson content to all lessons
-- Replacing placeholder "Coming Soon" content with real educational material

DO $$
DECLARE
    v_lesson_id UUID;
    v_unit_id UUID;
    v_path_id UUID;
BEGIN
    RAISE NOTICE 'Starting comprehensive lesson content migration...';

    -- ============================================
    -- PATH 1: Product Sense Fundamentals
    -- ============================================
    
    -- Get the Product Sense Fundamentals path
    SELECT id INTO v_path_id FROM learning_paths WHERE category = 'product_sense' LIMIT 1;

    -- UNIT 1.1: Introduction to PM Interviews
    SELECT id INTO v_unit_id FROM units WHERE learning_path_id = v_path_id AND name = 'Introduction to PM Interviews' LIMIT 1;

    -- Lesson 1: What is Product Sense?
    IF v_unit_id IS NOT NULL THEN
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "What is Product Sense?", "description": "Learn the fundamentals of product sense and why it matters in PM interviews", "learn_content": {"cards": [{"title": "What is Product Sense?", "content": "Product sense is your ability to understand user needs, identify opportunities, and design solutions that create value. In PM interviews, you demonstrate this through product design questions where you show you can think like a Product Manager."}, {"title": "Why It Matters", "content": "Interviewers want to see you can think like a PM - identifying problems, prioritizing solutions, and making data-driven decisions. Product sense separates good PMs from great ones."}, {"title": "Key Components of Product Sense", "content": "1) User Understanding: Deep empathy for your target users\\n2) Problem Identification: Recognizing pain points and opportunities\\n3) Solution Design: Creating features that solve real problems\\n4) Metric Definition: Defining how to measure success\\n5) Trade-off Analysis: Making smart prioritization decisions"}, {"title": "Common Mistakes to Avoid", "content": "1) Jumping to solutions without clarification\\n2) Ignoring constraints (time, budget, technical)\\n3) Not defining success metrics upfront\\n4) Missing trade-offs in your analysis\\n5) Designing for everyone instead of specific users"}, {"title": "The Framework Approach", "content": "Use structured frameworks like CIRCLES, REDI, or PAM to organize your thinking. These frameworks ensure you cover all critical aspects of product design questions and present your ideas in a logical, comprehensive manner."}]}}',
            estimated_minutes = 15,
            xp_reward = 15
        WHERE unit_id = v_unit_id AND name = 'What is Product Sense?';
        
        -- Lesson 2: The PM Mindset
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "The PM Mindset", "description": "Develop the thinking pattern of successful Product Managers", "learn_content": {"cards": [{"title": "Think Like a PM", "content": "Product managers balance three things: User needs, Business goals, and Technical constraints. Great PMs find creative solutions that satisfy all three."}, {"title": "User-Centric Thinking", "content": "Always start with understanding the user. Ask yourself: Who are they? What problem do they have? What does success look like to them? What are they willing to trade off?"}, {"title": "Data-Driven Decisions", "content": "Support your recommendations with data. Define metrics upfront and explain how you would measure success. Good PMs have opinions that are backed by evidence."}, {"title": "The 80/20 Rule", "content": "Focus on the 20% of features that deliver 80% of the value. Not every feature needs to be perfect - ship fast, iterate, and learn from real user behavior."}, {"title": "Ownership Mindset", "content": "As a PM, you are the CEO of your product. You own the outcomes, not just the outputs. Take responsibility for both successes and failures."}]}}',
            estimated_minutes = 15,
            xp_reward = 15
        WHERE unit_id = v_unit_id AND name = 'The PM Mindset';
        
        -- Lesson 3: Common Pitfalls (Quiz)
        UPDATE lessons SET 
            content = '{"type": "quiz", "title": "Introduction Quiz", "description": "Test your understanding of product sense fundamentals", "quiz_content": {"questions": [{"id": "q1", "text": "What is the first step in answering a product design question?", "options": ["Brainstorm solutions", "Clarify the problem", "Define metrics", "Present your idea"], "correct_answer": 1, "explanation": "Always clarify the problem first! Never assume you understand what the interviewer is asking."}, {"id": "q2", "text": "Which of these is NOT a key component of product sense?", "options": ["User understanding", "Technical coding", "Problem identification", "Metric definition"], "correct_answer": 1, "explanation": "While technical understanding helps, product sense is about user empathy, problem solving, and strategic thinking - not coding."}, {"id": "q3", "text": "Why is it important to define success metrics early in your answer?", "options": ["It is not important", "To understand what to optimize for", "To impress the interviewer", "Because the interviewer asks"], "correct_answer": 1, "explanation": "Metrics help you stay focused on what matters and demonstrate data-driven thinking."}, {"id": "q4", "text": "What does it mean to think like a PM?", "options": ["Focus only on user needs", "Balance user needs, business goals, and technical constraints", "Technical is most important", "Business goals come first"], "correct_answer": 1, "explanation": "PMs must balance all three: user needs, business goals, and technical constraints."}], "passing_score": 75}}',
            estimated_minutes = 10,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Common Pitfalls';
    END IF;

    -- UNIT 1.2: The CIRCLES Framework
    SELECT id INTO v_unit_id FROM units WHERE learning_path_id = v_path_id AND name = 'The CIRCLES Framework' LIMIT 1;

    IF v_unit_id IS NOT NULL THEN
        -- Lesson 4: Intro to CIRCLES
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Intro to CIRCLES", "description": "Master the CIRCLES framework for product design questions", "learn_content": {"cards": [{"title": "What is CIRCLES?", "content": "CIRCLES is a 7-step framework for answering product design questions: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize. It provides structure to your answer and ensures you cover all critical aspects."}, {"title": "C - Comprehend", "content": "Understand the question. Ask clarifying questions about users, constraints, and goals. Example: Who is the user? What problem are we solving? What are the constraints? This step shows you think before acting."}, {"title": "I - Identify", "content": "Identify the target user and their needs. Segment users into groups based on behavior, demographics, or needs. Not all users are equal - prioritize the most important segment."}, {"title": "R - Report", "content": "Report back the key findings. Summarize user segments and their top pain points. This shows you listened and understood what you learned from your questions."}, {"title": "C - Cut", "content": "Cut through prioritization. Decide which user segment and problem to focus on based on impact and feasibility. Use criteria like: user impact, business value, technical feasibility."}, {"title": "L - List", "content": "List solutions. Brainstorm multiple solutions for the chosen problem. Aim for 3-5 options - not too few (lack of creativity) or too many (cannot evaluate thoroughly)."}, {"title": "E - Evaluate", "content": "Evaluate trade-offs. Analyze pros and cons of each solution. Discuss implementation complexity, time to market, and potential risks. Show you can think critically."}, {"title": "S - Summarize", "content": "Summarize your recommendation. Present your top solution with success metrics. End with a clear recommendation and how you would measure success."}]}}',
            estimated_minutes = 20,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Intro to CIRCLES';
        
        -- Lesson 5: Comprehend the Situation (Practice)
        UPDATE lessons SET 
            content = '{"type": "drill", "title": "Comprehend the Situation", "description": "Practice the Comprehend step of CIRCLES", "drill_content": {"focus_step": "Comprehend", "instructions": "Practice asking clarifying questions. For each scenario, identify what questions you would ask to fully understand the problem.", "questions": [{"id": "d1", "scenario": "Design a coffee ordering app", "prompt": "What clarification questions would you ask first?", "correct_options": [{"text": "Who is the target user?", "explanation": "Always start with user clarification - are they customers, coffee shops, or both?"}, {"text": "What problem are we solving?", "explanation": "Understanding the core problem helps scope your solution"}, {"text": "What are the constraints?", "explanation": "Budget, timeline, and technical constraints shape what is possible"}], "incorrect_options": [{"text": "What color should the app be?", "explanation": "Visual design comes after understanding the problem"}, {"text": "What database should we use?", "explanation": "Technical decisions come later in the process"}, {"text": "Who is the competitor?", "explanation": "Competitive analysis is important but comes after understanding your users"}]}, {"id": "d2", "scenario": "Improve Amazon", "prompt": "What clarification questions are most important?", "correct_options": [{"text": "Which user segment?", "explanation": "Amazon has many user types - buyers, sellers, advertisers"}, {"text": "What problem to solve?", "explanation": "Need to understand what specific pain point we are addressing"}, {"text": "What is the success criteria?", "explanation": "How will we know if we succeeded?"}], "incorrect_options": [{"text": "How many engineers?", "explanation": "Team size is secondary to understanding the problem"}, {"text": "What is the marketing budget?", "explanation": "Budget comes after understanding what we are building"}, {"text": "Who is the CEO?", "explanation": "This does not help you understand user needs"}]}]}}',
            estimated_minutes = 15,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Comprehend the Situation';
        
        -- Lesson 6: Identify the Customer
        UPDATE lessons SET 
            content = '{"type": "pattern", "title": "Identify the Customer", "description": "Practice user segmentation in product design", "pattern_content": {"pattern_name": "User Segmentation", "template": {"headers": ["User Segment", "Demographics", "Needs", "Pain Points", "Priority"], "description": "Learn to identify and prioritize user segments"}, "example": {"segment": "Young Professionals", "demographics": "Age 22-30, urban, tech-savvy", "needs": "Convenience, speed, mobile-first", "pain_points": "Long wait times, complicated UX", "priority": "High"}, "practice_prompts": [{"id": "p1", "question": "For a grocery delivery app, identify key user segments", "hints": ["Consider different lifestyles", "Think about ordering frequency", "Consider budget constraints"]}, {"id": "p2", "question": "For a fitness tracking app, identify key user segments", "hints": ["Casual vs serious athletes", "Weight loss vs muscle gain", "Beginners vs advanced"]}]}}',
            estimated_minutes = 15,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Identify the Customer';
        
        -- Lesson 7: Report Needs
        UPDATE lessons SET 
            content = '{"type": "pattern", "title": "Report Needs", "description": "Learn to effectively report user research findings", "pattern_content": {"pattern_name": "Reporting User Insights", "template": {"headers": ["User Segment", "Key Finding", "Evidence", "Implication"], "description": "Structure your user research findings clearly"}, "example": {"segment": "Busy Parents", "finding": "Need quick meal solutions", "evidence": "80% order between 5-7pm, average order 3 items", "implication": "Priority feature should be quick re-order"}, "practice_prompts": [{"id": "p1", "question": "Report findings for a meditation app user research", "hints": ["Focus on when users meditate", "What triggers their sessions", "What causes them to stop"]}, {"id": "p2", "question": "Report findings for a banking app redesign", "hints": ["What features are most used", "What causes frustration", "What do users want but cannot find"]}]}}',
            estimated_minutes = 15,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Report Needs';
        
        -- Lesson 8: Cut Through Prioritization (Quiz)
        UPDATE lessons SET 
            content = '{"type": "quiz", "title": "CIRCLES Quiz", "description": "Test your CIRCLES framework knowledge", "quiz_content": {"questions": [{"id": "q1", "text": "What does the C in CIRCLES stand for?", "options": ["Create", "Comprehend", "Consider", "Choose"], "correct_answer": 1, "explanation": "CIRCLES stands for Comprehend, Identify, Report, Cut, List, Evaluate, Summarize."}, {"id": "q2", "text": "Which step comes after identifying users in CIRCLES?", "options": ["Cut", "List", "Report", "Evaluate"], "correct_answer": 2, "explanation": "After Identify comes Report - you summarize your findings before making decisions."}, {"id": "q3", "text": "What is the purpose of the Cut step?", "options": ["Remove features from scope", "Prioritize which problem to solve", "Reduce team size", "Cut budget"], "correct_answer": 1, "explanation": "Cut means making prioritization decisions about which user segment and problem to focus on."}, {"id": "q4", "text": "In which step do you discuss trade-offs?", "options": ["Comprehend", "Identify", "List", "Evaluate"], "correct_answer": 3, "explanation": "Evaluate is where you discuss pros, cons, and trade-offs of different solutions."}], "passing_score": 75}}',
            estimated_minutes = 10,
            xp_reward = 25
        WHERE unit_id = v_unit_id AND name = 'Cut Through Prioritization';
    END IF;

    -- UNIT 1.3: Clarifying the Problem
    SELECT id INTO v_unit_id FROM units WHERE learning_path_id = v_path_id AND name = 'Clarifying the Problem' LIMIT 1;

    IF v_unit_id IS NOT NULL THEN
        -- Lesson 9: Why Clarify?
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Why Clarify?", "description": "Master the art of asking clarifying questions", "learn_content": {"cards": [{"title": "The Importance of Clarification", "content": "Never assume you understand the problem. Clarifying questions show you think critically and want to solve the RIGHT problem. The best PMs ask questions before jumping to solutions."}, {"title": "What to Clarify", "content": "1) Who is the user?\\n2) What specific problem are we solving?\\n3) What constraints exist?\\n4) What does success look like?\\n5) What is the timeline?\\n6) What have they tried before?"}, {"title": "Good Clarifying Questions", "content": "- What does success look like for this project?\\n- Who are we solving for specifically?\\n- What constraints should we consider?\\n- What have you already tried?\\n- What is the timeline and budget?"}, {"title": "Common Mistakes", "content": "1) Not asking ANY questions (jumping straight to solutions)\\n2) Asking too many questions (paralyzing the discussion)\\n3) Not listening to the answers\\n4) Making assumptions without verification\\n5) Asking irrelevant technical questions too early"}]}}',
            estimated_minutes = 12,
            xp_reward = 15
        WHERE unit_id = v_unit_id AND name = 'Why Clarify?';
        
        -- Lesson 10: Practice: Ambiguous Prompts
        UPDATE lessons SET 
            content = '{"type": "drill", "title": "Practice: Ambiguous Prompts", "description": "Practice handling vague interview questions", "drill_content": {"focus_step": "Comprehend", "instructions": "Interviewers often give vague prompts. Practice asking the right clarifying questions to narrow down the scope.", "scenarios": [{"id": "s1", "prompt": "Design a product for pets", "good_questions": ["What type of pet?", "What problem are we solving?", "Who is the user - pet owners or vets?"], "target_answer": "I need to clarify: What specific problem are we solving? Who is the target user? What constraints exist?"}, {"id": "s2", "prompt": "Improve Spotify", "good_questions": ["Which user segment?", "What aspect to improve?", "Success metrics?"], "target_answer": "I need to clarify: Which user segment should I focus on? What specific problem should I address?"}, {"id": "s3", "prompt": "Design an alarm clock for deaf people", "good_questions": ["How deaf - born deaf or elderly?", "What sensory cues work best?", "Solo or shared bedroom?"], "target_answer": "I need to clarify: What is the degree of hearing loss? What solutions have been tried?"}]}}',
            estimated_minutes = 15,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Practice: Ambiguous Prompts';
        
        -- Lesson 11: Defining Success
        UPDATE lessons SET 
            content = '{"type": "pattern", "title": "Defining Success", "description": "Learn to define meaningful success metrics", "pattern_content": {"pattern_name": "Success Metrics Definition", "template": {"headers": ["Metric", "Definition", "Target", "Measurement"], "description": "Define clear, measurable success criteria"}, "example": {"metric": "Daily Active Users", "definition": "Users who open the app and complete at least one action", "target": "10% growth in 3 months", "measurement": "Count unique users with session > 0"}, "key_concepts": ["Define metrics before building", "Use leading and lagging indicators", "Make metrics actionable not vanity"], "practice_prompts": [{"id": "p1", "question": "Define success metrics for a new food delivery feature", "hints": ["Consider user acquisition", "Consider engagement", "Consider revenue"]}, {"id": "p2", "question": "Define success metrics for a dark mode feature", "hints": ["Adoption rate", "Time saved", "User satisfaction"]}]}}',
            estimated_minutes = 15,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Defining Success';
    END IF;

    -- ============================================
    -- PATH 2: Execution Mastery
    -- ============================================
    
    SELECT id INTO v_path_id FROM learning_paths WHERE category = 'execution' LIMIT 1;

    -- UNIT 2.1: Understanding Metrics
    SELECT id INTO v_unit_id FROM units WHERE learning_path_id = v_path_id AND name = 'Understanding Metrics' LIMIT 1;

    IF v_unit_id IS NOT NULL THEN
        -- Lesson 12: Metric Types
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Metric Types", "description": "Master different types of product metrics", "learn_content": {"cards": [{"title": "Leading vs Lagging Indicators", "content": "Leading indicators predict future outcomes (sign-ups, trial starts). Lagging indicators measure results (revenue, churn). You need BOTH for a complete picture!"}, {"title": "North Star Metric", "content": "The single metric that best captures the value you deliver to customers. Examples:\\n- Airbnb: Booking leads\\n- Facebook: Daily Active Users\\n- Spotify: Time spent\\nChoose a metric that is measurable, actionable, and inspires your team."}, {"title": "Vanity vs Actionable Metrics", "content": "Vanity metrics look good but cannot be acted upon (total downloads, page views). Actionable metrics drive decisions (conversion rate, retention). Ask: If this metric changes, can I take action?"}, {"title": "HEART Framework", "content": "Google\\'s HEART framework:\\n- Happiness: User satisfaction\\n- Engagement: How users interact\\n- Adoption: New user growth\\n- Retention: User loyalty\\n- Task Success: Completion rates"}, {"title": "AARRR Pirate Metrics", "content": "Dave McClure\\'s funnel:\\n- Acquisition: How users find you\\n- Activation: First positive experience\\n- Retention: Users come back\\n- Referral: Users tell others\\n- Revenue: How you make money"}]}}',
            estimated_minutes = 18,
            xp_reward = 18
        WHERE unit_id = v_unit_id AND name = 'Metric Types';
        
        -- Lesson 13: Practice: Selecting Metrics
        UPDATE lessons SET 
            content = '{"type": "drill", "title": "Practice: Selecting Metrics", "description": "Practice choosing the right metrics for different products", "drill_content": {"focus_step": "Define Metrics", "instructions": "For each product, identify the best metrics. Consider: North Star, leading indicators, and actionable metrics.", "questions": [{"id": "d1", "product": "Social media app", "prompt": "Which is the best north star metric?", "options": [{"text": "Daily Active Users", "correct": true, "explanation": "DAU is often best - shows active engagement"}, {"text": "Total registered users", "correct": false, "explanation": "Vanity metric - does not indicate real engagement"}, {"text": "Posts created", "correct": false, "explanation": "Engagement metric but not the core value"}, {"text": "Messages sent", "correct": false, "explanation": "Feature-specific, not company-wide"}]}, {"id": "d2", "product": "E-commerce app", "prompt": "Which metrics matter most?", "options": [{"text": "Conversion rate + Repeat purchase rate", "correct": true, "explanation": "Shows both acquisition and retention"}, {"text": "App downloads", "correct": false, "explanation": "Vanity metric - does not show actual usage"}, {"text": "Items in catalog", "correct": false, "explanation": "Inventory metric, not user metric"}, {"text": "Customer service tickets", "correct": false, "explanation": "Reverse indicator - fewer is better but not primary"}]}]}}',
            estimated_minutes = 15,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Practice: Selecting Metrics';
        
        -- Lesson 14: North Star Metric (Quiz)
        UPDATE lessons SET 
            content = '{"type": "quiz", "title": "Metrics Quiz", "description": "Test your understanding of product metrics", "quiz_content": {"questions": [{"id": "q1", "text": "What is a leading indicator?", "options": ["Revenue", "DAU", "Sign-ups that become active users", "Churn rate"], "correct_answer": 2, "explanation": "Sign-ups that become active users predicts future revenue and growth."}, {"id": "q2", "text": "Why should you avoid vanity metrics?", "options": ["They are too complex", "They do not drive decisions", "They are inaccurate", "They are not measurable"], "correct_answer": 1, "explanation": "Vanity metrics look good but cannot inform specific actions."}, {"id": "q3", "text": "What does the R in AARRR stand for?", "options": ["Revenue", "Retention", "Referral", "Reach"], "correct_answer": 1, "explanation": "AARRR: Acquisition, Activation, Retention, Referral, Revenue."}, {"id": "q4", "text": "What is a North Star Metric?", "options": ["The only metric that matters", "The metric that captures core value delivered", "The revenue metric", "The growth metric"], "correct_answer": 1, "explanation": "North Star is the single metric that best captures customer value."}], "passing_score": 75}}',
            estimated_minutes = 10,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'North Star Metric';
    END IF;

    -- UNIT 2.2: Root Cause Analysis
    SELECT id INTO v_unit_id FROM units WHERE learning_path_id = v_path_id AND name = 'Root Cause Analysis' LIMIT 1;

    IF v_unit_id IS NOT NULL THEN
        -- Lesson 15: The 5 Whys
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "The 5 Whys", "description": "Master the 5 Whys technique for root cause analysis", "learn_content": {"cards": [{"title": "What is 5 Whys?", "content": "A technique to find the root cause of a problem by asking \"Why?\" 5 times. It was developed by Toyota and is essential for any PM investigating issues."}, {"title": "When to Use 5 Whys", "content": "- When you see a metric drop and need to understand why\\n- When users complain and you need deeper insight\\n- When you encounter a recurring problem\\n- After any significant product issue"}, {"title": "How to Apply It", "content": "1) State the problem clearly\\n2) Ask \"Why did this happen?\"\\n3) For each answer, ask \"Why?\" again\\n4) Repeat until you find the actionable root cause\\n5) Verify you can actually do something about it"}, {"title": "Example Walkthrough", "content": "Problem: Conversion dropped\\n1. Why? → Traffic source changed\\n2. Why? → Marketing campaign ended\\n3. Why? → Budget cuts\\n4. Why? → Q4 priorities shifted\\n5. Why? → Leadership focus changed\\n\\nRoot cause: Leadership priorities (actionable - can address with stakeholders)"}]}}',
            estimated_minutes = 12,
            xp_reward = 15
        WHERE unit_id = v_unit_id AND name = 'The 5 Whys';
        
        -- Lesson 16: Investigating Drops
        UPDATE lessons SET 
            content = '{"type": "full_practice", "title": "Investigating Drops", "description": "Practice diagnosing metric drops systematically", "full_practice_content": {"framework_name": "METRICS", "question": "Facebook Events usage is down 10% this month. Diagnose the issue.", "framework_steps": ["Define the Problem", "Measure & Segment", "Analyze & Hypothesize", "Recommend Solutions"], "expert_outline": {"Define": {"problem": "Events feature usage down 10%", "baseline": "Compare to previous months", "success": "Return to baseline + understand drivers"}, "Measure": {"segments": ["By region - any geographic issues?"], "device": ["Mobile vs desktop"], "user_type": ["New vs returning users"], "funnel": ["Views → Creates → Attends"]}, "Analyze": {"technical": ["Check for bugs or latency"], "ux": ["Recent changes to Events UI"], "seasonality": ["Post-holiday dip?"], "competition": ["Any new competitors like Partiful?"], "metrics": ["Correlation with other features"]}, "Optimize": {"fix_bugs": "Resolve any technical issues found", "ux_fix": "Revert harmful UX changes", "features": "Add engagement features if needed"}}, "rubric": {"Define": {"weight": 0.2, "criteria": ["Clear problem statement", "Defined baseline", "Success criteria"]}, "Measure": {"weight": 0.3, "criteria": ["Proper segmentation", "Right metrics to track", "Comprehensive approach"]}, "Analyze": {"weight": 0.3, "criteria": ["Root cause identification", "Data-driven reasoning", "Multiple hypotheses"]}, "Optimize": {"weight": 0.2, "criteria": ["Actionable recommendations", "Prioritized by impact"]}}}, "estimated_minutes": 20,
            xp_reward = 30
        WHERE unit_id = v_unit_id AND name = 'Investigating Drops';
        
        -- Lesson 17: Internal vs External Factors (Quiz)
        UPDATE lessons SET 
            content = '{"type": "quiz", "title": "Root Cause Analysis Quiz", "description": "Test your root cause analysis skills", "quiz_content": {"questions": [{"id": "q1", "text": "What is the first step in root cause analysis?", "options": ["Ask why 5 times", "Define the problem clearly", "Look at competitors", "Check technical logs"], "correct_answer": 1, "explanation": "Always start with a clear problem definition before diving into analysis."}, {"id": "q2", "text": "When investigating a metric drop, what should you check first?", "options": ["Competitor activity", "Check for data issues or bugs", "Launch a fix", "Ask stakeholders"], "correct_answer": 1, "explanation": "Always rule out data quality issues and technical bugs first."}, {"id": "q3", "text": "What is segmentation in metric analysis?", "options": ["Cutting the team", "Breaking down data by different dimensions", "Prioritizing features", "Writing a report"], "correct_answer": 1, "explanation": "Segmentation means breaking down data by user type, region, device, etc."}, {"id": "q4", "text": "Why is the 5 Whys useful?", "content": "It finds the surface problem", "content": "It finds the actionable root cause", "content": "It creates a report", "content": "It solves the problem", "correct_answer": 1, "explanation": "5 Whys helps you drill down to the actionable root cause, not just symptoms."}], "passing_score": 75}}',
            estimated_minutes = 10,
            xp_reward = 20
        WHERE unit_id = v_unit_id AND name = 'Internal vs External Factors';
    END IF;

    -- ============================================
    -- PATH 3: Estimation Skills
    -- ============================================
    
    SELECT id INTO v_path_id FROM learning_paths WHERE category = 'estimation' LIMIT 1;

    -- UNIT 3.1: Market Sizing
    SELECT id INTO v_unit_id FROM units WHERE learning_path_id = v_path_id AND name = 'Market Sizing' LIMIT 1;

    IF v_unit_id IS NOT NULL THEN
        -- Lesson 18: Top-Down vs Bottom-Up
        UPDATE lessons SET 
            content = '{"type": "learn", "title": "Top-Down vs Bottom-Up", "description": "Master both approaches to market sizing", "learn_content": {"cards": [{"title": "Top-Down Approach", "content": "Start with the total market and work down to your target segment.\\n\\nExample: US population (330M) → Internet users (280M) → Online shoppers (200M) → Pet owners who shop online (60M) → Pet food buyers (40M).\\n\\nBest for: Calculating TAM (Total Addressable Market)"}, {"title": "Bottom-Up Approach", "content": "Start with known data points and scale up.\\n\\nExample: 1 store serves 100 customers/day → 365 days = 36,500 customers/year → 50 stores × 36,500 = 1.8M customers/year.\\n\\nBest for: When you have specific, concrete data points."}, {"title": "When to Use Each", "content": "Use TOP-DOWN when:\\n- You have market research data\\n- Calculating TAM for investors\\n- No specific operational data\\n\\nUse BOTTOM-UP when:\\n- You have pilot data or small scale numbers\\n- Building from first principles\\n- Validating top-down estimates"}, {"title": "Key Assumptions", "content": "Always state your assumptions clearly. Good estimation answers include:\\n- Population/data source assumptions\\n- Penetration rate assumptions\\n- Frequency assumptions\\n- Price assumptions\\n- Be ready to challenge and validate each assumption"}]}}',
            estimated_minutes = 15,
            xp_reward = 15
        WHERE unit_id = v_unit_id AND name = 'Top-Down vs Bottom-Up';
        
        -- Lesson 19: Estimation Practice
        UPDATE lessons SET 
            content = '{"type": "pattern", "title": "Estimation Practice", "description": "Practice market sizing and guesstimation", "pattern_content": {"pattern_name": "Market Sizing", "template": {"headers": ["Assumptions", "Calculation", "Final Estimate", "Sanity Check"], "description": "Structure your estimation answers"}, "example": {"question": "Estimate the market size for dog walking in San Francisco", "assumptions": ["SF households: 350K", "Dog ownership: 30%", "Need walkers: 50%", "Walks/week: 3", "Price: $20/walk"], "calculation": "350K × 0.3 × 0.5 × 3 × $52 = $8.19M/year", "final_estimate": "~$150M annually", "sanity_check": "Uber Pet, Rover data supports similar numbers"}, "practice_prompts": [{"id": "p1", "question": "Estimate how many elevators are in New York City", "hints": ["Start with population", "Estimate building types", "Assume elevators per building type"]}, {"id": "p2", "question": "Estimate the bandwidth used by TikTok daily", "hints": ["Start with DAU", "Video length and quality", "Compression ratios"]}, {"id": "p3", "question": "Estimate the market for electric vehicle charging stations", "hints": ["EV adoption rate", "Home vs public charging", "Revenue per charge"]}]}}',
            estimated_minutes = 20,
            xp_reward = 25
        WHERE unit_id = v_unit_id AND name = 'Estimation Practice';
    END IF;

    RAISE NOTICE 'Comprehensive lesson content migration completed!';
END $$;

-- Seed data for questions table

INSERT INTO public.questions (question_text, category, difficulty, company, interview_type, expert_answer, rubric, acceptance_rate, pattern_type, mcq_version)
VALUES
  (
    'How do you measure success of the Hot Home feature in Redfin?',
    'ab_testing',
    'intermediate',
    'Redfin',
    'in_person',
    'Start by clarifying the goal of Hot Home feature. Then identify key user actions (views, saves, contacts). Choose metrics like engagement rate, conversion to contact, and time on listing. Set specific targets based on baseline data.',
    '{"clarification": ["Asked about Hot Home feature purpose", "Identified target users"], "metrics": ["Defined engagement metrics", "Included conversion metrics", "Mentioned leading vs lagging indicators"], "prioritization": ["Prioritized metrics by importance", "Explained trade-offs"]}',
    65,
    'metrics_for_x',
    '{"enabled": true, "sub_questions": [{"prompt": "What type of metric is \"number of Hot Home views\"?", "options": [{"text": "Leading indicator", "correct": true, "explanation": "Views happen before conversions, making it a leading indicator of user interest."}, {"text": "Lagging indicator", "correct": false, "explanation": "Lagging indicators measure outcomes after the fact."}, {"text": "Vanity metric", "correct": false, "explanation": "While views alone could be vanity, in context they predict conversion."}, {"text": "Counter metric", "correct": false, "explanation": "Counter metrics track negative impacts."}], "difficulty": "beginner"}, {"prompt": "Which metric best measures Hot Home feature success?", "options": [{"text": "Total page views", "correct": false, "explanation": "Too broad - doesn''t show if Hot Home specifically drives value."}, {"text": "Conversion rate from Hot Home view to agent contact", "correct": true, "explanation": "Directly measures if the feature drives the desired action."}, {"text": "Number of Hot Home badges shown", "correct": false, "explanation": "This is an output metric, not a success metric."}, {"text": "Average time on site", "correct": false, "explanation": "Too general - doesn''t isolate Hot Home impact."}], "difficulty": "intermediate"}]}'
  ),
  (
    'How do you improve Slack?',
    'product_sense',
    'intermediate',
    'Dropbox',
    'phone',
    'First, clarify the goal - are we improving for specific users or overall? Identify target users (e.g., remote teams). Report their needs through user research. Prioritize the most impactful pain points. Brainstorm solutions, evaluate trade-offs, and recommend the top solution with clear success metrics.',
    '{"clarification": ["Asked clarifying questions", "Defined scope"], "user_needs": ["Identified specific user segments", "Listed concrete pain points"], "solutions": ["Generated multiple ideas", "Evaluated trade-offs"], "metrics": ["Defined success metrics"]}',
    NULL,
    'improve_x',
    '{"enabled": true, "sub_questions": [{"prompt": "What should you do FIRST when asked to improve Slack?", "options": [{"text": "Brainstorm features", "correct": false, "explanation": "Jumping to solutions without understanding the problem is premature."}, {"text": "Ask clarifying questions", "correct": true, "explanation": "Always clarify the problem space, target users, and goals first."}, {"text": "Define success metrics", "correct": false, "explanation": "Metrics come after understanding the problem."}, {"text": "Analyze competitors", "correct": false, "explanation": "While useful, clarification comes first."}], "difficulty": "beginner"}, {"prompt": "Which user segment should you focus on for Slack improvements?", "options": [{"text": "All users equally", "correct": false, "explanation": "Too broad - different segments have different needs."}, {"text": "The segment with the biggest pain point", "correct": true, "explanation": "Prioritize based on impact and user needs."}, {"text": "Enterprise users only", "correct": false, "explanation": "May not align with business goals without clarification."}, {"text": "New users", "correct": false, "explanation": "Depends on the goal - retention vs acquisition."}], "difficulty": "intermediate"}]}'
  ),
  (
    'How did you turn an adversary into a confidant?',
    'behavioral',
    'intermediate',
    'Facebook',
    'in_person',
    'Describe a specific situation where you had conflict. Explain your task/goal. Detail the actions you took to build trust (active listening, finding common ground, delivering on promises). Share the positive result and what you learned.',
    '{"clarification": ["Provided specific situation", "Explained context clearly"], "user_needs": ["Showed empathy", "Understood other person''s perspective"], "solutions": ["Described concrete actions", "Showed initiative"], "metrics": ["Quantified the result", "Reflected on learnings"]}',
    NULL,
    'behavioral_star',
    '{"enabled": true, "sub_questions": [{"prompt": "In the STAR framework, what does the \"A\" stand for?", "options": [{"text": "Analysis", "correct": false, "explanation": "STAR is Situation, Task, Action, Result."}, {"text": "Action", "correct": true, "explanation": "Action describes what YOU specifically did."}, {"text": "Achievement", "correct": false, "explanation": "Achievement is part of Result."}, {"text": "Approach", "correct": false, "explanation": "While similar, the framework uses \"Action\"."}], "difficulty": "beginner"}]}'
  ),
  (
    'What goals and success metrics would you set for buy & sell groups?',
    'execution',
    'intermediate',
    'Facebook',
    'phone',
    'Business goal: Increase marketplace activity. User goal: Easy buying/selling. Metrics: Active listings, transaction completion rate, repeat sellers, time to sale. Set SMART targets based on current baseline.',
    '{"clarification": ["Defined business and user goals"], "metrics": ["Listed relevant metrics", "Included leading and lagging indicators"], "prioritization": ["Prioritized metrics", "Set realistic targets"]}',
    NULL,
    'metrics_for_x',
    '{"enabled": true, "sub_questions": [{"prompt": "Which is the most important metric for buy & sell groups?", "options": [{"text": "Number of group members", "correct": false, "explanation": "Vanity metric - doesn''t show actual value creation."}, {"text": "Transaction completion rate", "correct": true, "explanation": "Directly measures if the feature achieves its purpose."}, {"text": "Number of posts", "correct": false, "explanation": "Activity metric but doesn''t show successful transactions."}, {"text": "Page views", "correct": false, "explanation": "Too broad and doesn''t measure success."}], "difficulty": "intermediate"}]}'
  ),
  (
    'You are the PM of Facebook Lite, what goals would you set?',
    'execution',
    'intermediate',
    'Facebook',
    'phone',
    'Facebook Lite targets emerging markets with limited connectivity. Goals: 1) Increase DAU in target markets, 2) Reduce data usage per session, 3) Improve app performance on low-end devices. Metrics: DAU growth rate, data consumption, app load time, crash rate.',
    '{"clarification": ["Understood Facebook Lite''s purpose", "Identified target users"], "metrics": ["Set specific, measurable goals", "Aligned with user needs"], "prioritization": ["Prioritized goals by impact"]}',
    NULL,
    'metrics_for_x',
    '{"enabled": true, "sub_questions": [{"prompt": "What is the primary target market for Facebook Lite?", "options": [{"text": "US power users", "correct": false, "explanation": "Lite is designed for emerging markets."}, {"text": "Emerging markets with limited connectivity", "correct": true, "explanation": "Lite optimizes for low bandwidth and low-end devices."}, {"text": "Enterprise customers", "correct": false, "explanation": "Facebook Lite is a consumer product."}, {"text": "Developers", "correct": false, "explanation": "Lite targets end users, not developers."}], "difficulty": "beginner"}]}'
  ),
  (
    'Design a better way to find roommates in a new city.',
    'product_sense',
    'intermediate',
    'Facebook',
    'video',
    'Users: Young professionals, students. Pain points: Trust, compatibility, timing. Solution: ''Roommate Match'' with verified profiles, lifestyle quizzes, and video intros. Monetize via freemium (boosted profiles).',
    NULL, NULL, NULL,
    '{"enabled": true, "sub_questions": [{"prompt": "What is the biggest risk in a roommate finder app?", "difficulty": "intermediate", "options": [{"text": "Safety/Trust", "correct": true, "explanation": "Living with strangers carries high safety risks."}, {"text": "Payment processing", "correct": false, "explanation": "Solved by other platforms."}, {"text": "UI Design", "correct": false, "explanation": "Important but not the biggest risk."}]}]}'
  ),
  (
    'Improve the experience of visiting a museum.',
    'product_sense',
    'beginner',
    'Google',
    'video',
    'Pain points: Crowds, lack of context, getting lost. Features: AR guides, personalized routes based on time/interest, ''crowd-avoidance'' routing. Metric: Visitor satisfaction score.',
    NULL, NULL, NULL,
    '{"enabled": true, "sub_questions": [{"prompt": "Which feature best addresses ''lack of context''?", "difficulty": "beginner", "options": [{"text": "AR Guide overlay", "correct": true, "explanation": "Provides instant info on art pieces."}, {"text": "Ticket booking", "correct": false, "explanation": "Logistical only."}, {"text": "Cafe locator", "correct": false, "explanation": "Amenity only."}]}]}'
  ),
  (
    'Design a product for the elderly to help them stay connected.',
    'product_sense',
    'intermediate',
    'Meta',
    'video',
    'Focus on accessibility (large text, voice control) and simplicity. Device: ''Smart Photo Frame'' that auto-updates with family photos and allows one-touch video calls. Metric: Daily active usage.',
    NULL, NULL, NULL, NULL
  ),
  (
    'How would you design a bookshelf for children?',
    'product_sense',
    'beginner',
    'Amazon',
    'video',
    'Users: Kids (access) & Parents (storage). Features: Front-facing covers (kids pick by image), adjustable height, integrated reading nook, durable/safe materials.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Design an alarm clock for the deaf.',
    'product_sense',
    'intermediate',
    'Google',
    'phone',
    'Sensory inputs: Vibration (wearable or under pillow), Light (gradual brightening), Scent. Integration with smart home lights. Fail-safe battery backup.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Should Twitter launch a subscription model?',
    'strategy',
    'advanced',
    'Twitter',
    'video',
    'Pros: Diversify revenue, reduce ad dependence. Cons: slower user growth, churn. Strategy: Freemium. ''Twitter Blue'' for power users (edit button, folders, no ads) while keeping core free.',
    NULL, NULL, NULL,
    '{"enabled": true, "sub_questions": [{"prompt": "What is the primary risk of a paywall?", "difficulty": "intermediate", "options": [{"text": "Reduced user growth", "correct": true, "explanation": "Paywalls add friction to unparalleled access."}, {"text": "Server costs", "correct": false, "explanation": "Negligible."}, {"text": "Ad revenue increase", "correct": false, "explanation": "Subscription usually cannibalizes or complements ad revenue."}]}]}'
  ),
  (
    'How would you monetize WhatsApp?',
    'strategy',
    'advanced',
    'Meta',
    'video',
    'Avoid user fees to maintain growth. Monetize B2C: WhatsApp Business API for customer support, transactions, and notifications. Payments integration.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Estimate the bandwidth used by TikTok in a day.',
    'estimation',
    'advanced',
    'ByteDance',
    'phone',
    'DAU: 1B. Avg time: 60 mins. Video bitrate: 1-2Mbps. Calculation: 1B users * 1 hr * 3600s * 1.5Mbps = Total bits. Convert to Petabytes.',
    NULL, NULL, NULL, NULL
  ),
  (
    'How many elevators are in NYC?',
    'estimation',
    'intermediate',
    'Google',
    'phone',
    'NYC population 8M. Buildings ~1M. High-rises (6+ floors) need elevators. Guess 10% are high-rise = 100k. Avg elevators per building = 2. Total ~200k-300k. (Actual is ~84k, but logic matters).',
    NULL, NULL, NULL, NULL
  ),
  (
    'Facebook events usage is down 10%. Why?',
    'execution',
    'advanced',
    'Meta',
    'video',
    '1. Tech glitch? 2. Seasonality (post-holidays)? 3. Competitor (Partiful)? 4. UX change (buried entry point)? Segment by region and device to isolate.',
    NULL, NULL, NULL,
    '{"enabled": true, "sub_questions": [{"prompt": "What is the first thing to check?", "difficulty": "beginner", "options": [{"text": "Data accuracy/Tech bugs", "correct": true, "explanation": "Always rule out logging errors first."}, {"text": "Competitors", "correct": false, "explanation": "Too external for step 1."}, {"text": "Marketing spend", "correct": false, "explanation": "Less likely to cause sudden drop."}]}]}'
  ),
  (
    'What success metrics would you set for Uber Pool?',
    'execution',
    'intermediate',
    'Uber',
    'video',
    'Northstar: Matches per trip (Efficiency). Others: Discount vs. UberX time added (User value), Driver earnings per hour (Supply side), Cancellation rate.',
    NULL, NULL, NULL, NULL
  ),
  (
    'How do you handle a conflict with an engineer?',
    'behavioral',
    'beginner',
    'General',
    'video',
    'Understand their constraints. Is it technical debt? Complexity? Revisit the ''Why''. Compromise on scope, not quality. Data-driven decision making.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Tell me about a product you failed to launch.',
    'behavioral',
    'intermediate',
    'General',
    'video',
    'STAR method. Focus on what you learned. ''We incorrectly validated demand... I learned to do cleaner MVP tests first.''',
    NULL, NULL, NULL, NULL
  ),
  (
    'Design a smart shoe.',
    'product_sense',
    'beginner',
    'Nike',
    'video',
    'Target: Runners. Features: Auto-lacing, gait analysis sensors, GPS tracking, haptic feedback for directions. App integration for stats.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Design a vending machine for blind people.',
    'product_sense',
    'intermediate',
    'Google',
    'video',
    'Audio interface (voice guide). Braille labels. NFC payment (tap to pay). Tactile selection buttons or voice command. Tray at accessible height.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Should Netflix add live sports?',
    'strategy',
    'advanced',
    'Netflix',
    'video',
    'Pros: Retains subscribers, high engagement. Cons: Extremely expensive rights, fragmentation. Recommendation: Experiment with lower-tier sports or ''Sports entertainment'' (Drive to Survive) first.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Critique the Spotify app.',
    'product_sense',
    'intermediate',
    'Spotify',
    'phone',
    'Good: Discovery (Discover Weekly), Dark mode UI. Bad: Podcast integration feels cluttered. Improvement: Separate tab or app for Podcasts to declutter Music.',
    NULL, NULL, NULL, NULL
  ),
  (
    'How would you reduce cancellations for Uber?',
    'execution',
    'intermediate',
    'Uber',
    'video',
    'Analyze when cancellations happen (Pre-match? Post-match?). Post-match: Better ETAs, penalty for late cancels, driver incentives. Pre-match: Faster matching.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Design a bicycle for the mass market in 2050.',
    'product_sense',
    'intermediate',
    'Tesla',
    'video',
    'Context: Cities are car-free. Bike: Electric, self-balancing, theft-proof (biometric lock), modular cargo attachment, solar paint for trickle charging.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Maximize revenue for a movie theater.',
    'strategy',
    'beginner',
    'Cinemark',
    'video',
    'Utilization is key. Dynamic pricing (cheaper Tue AM). Subscription (MoviePass style). Alternative content (E-sports, Corporate events off-hours). Premium food/bev.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Estimate the market size for dog walking in SF.',
    'estimation',
    'beginner',
    'Rover',
    'phone',
    'Households in SF (350k). Dog ownership rate (30%) -> 100k dogs. % needing walkers (busy professionals) -> 50% -> 50k dogs. Avg walks per week (3) * Price ($20). Calculate weekly/yearly TAM.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Design a remote control for an Apple TV.',
    'product_sense',
    'beginner',
    'Apple',
    'video',
    'Simplify. Voice first (Siri button). Touchpad navigation. Find my Remote feature (beeps). Solar charging on back.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Should Google launch a ride-sharing service?',
    'strategy',
    'advanced',
    'Google',
    'video',
    'Already have Waymo (Autonomous). Launching human ride-share competes with partners (Uber). Strategy: Focus on autonomous fleet (Waymo One) to leapfrog Uber, don''t compete on human labor.',
    NULL, NULL, NULL, NULL
  ),
  (
    'How to improve Gmail?',
    'product_sense',
    'intermediate',
    'Google',
    'video',
    'Problem: Email overload. Solution: AI summary of threads. ''To-Do'' mode (turn emails into tasks). Better unsubscribe management. Integrated scheduling.',
    NULL, NULL, NULL, NULL
  ),
  (
    'Estimate how many golf balls fit in a 747.',
    'estimation',
    'intermediate',
    'Boeing',
    'phone',
    'Volume of 747 fuselage. Volume of golf ball + packing efficiency (70%). Division.',
    NULL, NULL, NULL, NULL
  ),
  ('Design a kitchen for the blind.', 'product_sense', 'intermediate', 'General', NULL, NULL, NULL, NULL, NULL, NULL),
  ('How would you improve Google Maps?', 'product_sense', 'beginner', 'Google', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Metric for engagement on Facebook Groups?', 'execution', 'intermediate', 'Meta', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Should Amazon buy a grocery chain?', 'strategy', 'advanced', 'Amazon', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Launch a new product for Spotify.', 'product_sense', 'intermediate', 'Spotify', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Decrease churn for a SaaS platform.', 'execution', 'advanced', 'Salesforce', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Design a unified messaging inbox.', 'product_sense', 'intermediate', 'Slack', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Estimate daily flights from ATL airport.', 'estimation', 'beginner', 'Delta', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Prioritize features for a Startup MVP.', 'execution', 'intermediate', 'Startup', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Tell me about a time you led a team.', 'behavioral', 'beginner', 'General', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Design a travel app for solo travelers.', 'product_sense', 'intermediate', 'Airbnb', NULL, NULL, NULL, NULL, NULL, NULL),
  ('How to measure success of reaction buttons?', 'execution', 'intermediate', 'LinkedIn', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Should Apple build a search engine?', 'strategy', 'advanced', 'Apple', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Design a better airport experience.', 'product_sense', 'intermediate', 'General', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Estimate revenue of a corner store.', 'estimation', 'beginner', 'General', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Improve the Amazon returns process.', 'product_sense', 'intermediate', 'Amazon', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Key metrics for a dating app?', 'execution', 'beginner', 'Tinder', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Tell me about a mistake you made.', 'behavioral', 'intermediate', 'General', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Design a fitness app for kids.', 'product_sense', 'beginner', 'Nike', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Should Facebook acquire Discord?', 'strategy', 'advanced', 'Meta', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Design a water bottle for hikers.', 'product_sense', 'beginner', 'Yeti', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Estimate number of windows in Seattle.', 'estimation', 'intermediate', 'Microsoft', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Metric for YouTube Recommendations?', 'execution', 'advanced', 'Google', NULL, NULL, NULL, NULL, NULL, NULL),
  ('How to improve Slack notifications?', 'product_sense', 'intermediate', 'Slack', NULL, NULL, NULL, NULL, NULL, NULL),
  ('Design a better umbrella.', 'product_sense', 'beginner', 'General', NULL, NULL, NULL, NULL, NULL, NULL);

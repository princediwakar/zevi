-- Migration: Replace Low-Quality Questions with High-Quality Ones
-- Deletes questions where:
-- - expert_answer is NULL or empty
-- - question_text length < 30 characters
-- Then inserts high-quality questions covering all pattern types

BEGIN;

-- ============================================
-- STEP 1: Delete Low-Quality Questions
-- ============================================

-- Delete questions without expert_answer
DELETE FROM public.questions 
WHERE expert_answer IS NULL 
   OR expert_answer = ''
   OR TRIM(expert_answer) = '';

-- Delete questions with very short question text (likely incomplete)
DELETE FROM public.questions 
WHERE LENGTH(question_text) < 30;

-- ============================================
-- STEP 2: Insert High-Quality Questions
-- ============================================

-- Product Sense - Design X for Y (8 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'Instagram just launched Reels. How would you measure whether it''s successful after 6 months?',
  'product_sense', 'intermediate', 'Meta',
  'Use HEART framework: Happiness → Engagement → Adoption → Retention → Task Success',
  'Clarify Instagram''s strategic goal for Reels (competing with TikTok, increasing time spent). Key metrics: watch time per user, creation rate, share rate, follower growth from Reels, and conversion from Reels to following. Track negative signals: reduced DMs, lower quality content, reduced Story usage. Use cohort analysis to measure retention of new Reels users vs non-users.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified strategic goal", "Identified target users"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented users", "Identified key needs"]}, "Report": {"weight": 0.15, "criteria": ["Listed key pain points", "Prioritized correctly"]}, "Cut": {"weight": 0.15, "criteria": ["Made clear trade-offs", "Justified focus"]}, "List": {"weight": 0.15, "criteria": ["Generated multiple solutions", "Covered key features"]}, "Evaluate": {"weight": 0.1, "criteria": ["Discussed trade-offs", "Justified recommendation"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation", "Defined success metrics"]}}'
),
(
  'Netflix is considering adding a "Watch Together" feature that lets friends sync their viewing and chat while watching. How would you prioritize this against other potential features?',
  'product_sense', 'advanced', 'Netflix',
  'Use RICE framework: Reach → Impact → Confidence → Effort',
  'Score Watch Together using RICE. Reach: estimate monthly active users who would use social viewing features. Impact: high for engagement but lower for retention - quantify. Confidence: medium - unclear if social viewing drives retention. Effort: medium-high for real-time sync infrastructure. Compare scores with other feature proposals. Consider dependencies on existing social features.',
  'RICE', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.1, "criteria": ["Clarified feature scope", "Identified users"]}, "Identify": {"weight": 0.2, "criteria": ["Identified key user needs", "Segmented users"]}, "Report": {"weight": 0.15, "criteria": ["Quantified impact", "Identified dependencies"]}, "Cut": {"weight": 0.15, "criteria": ["Used scoring framework", "Justified prioritization"]}, "List": {"weight": 0.15, "criteria": ["Listed alternatives", "Compared approaches"]}, "Evaluate": {"weight": 0.15, "criteria": ["Discussed trade-offs", "Provided data-driven rationale"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation", "Next steps defined"]}}'
),
(
  'Airbnb wants to launch a "split stay" feature where users can stay at two different listings during one trip. Design the product requirement document for this feature.',
  'product_sense', 'advanced', 'Airbnb',
  'Structure: Problem → User Stories → Success Metrics → Technical → Risks → Timeline',
  'Define problem: travelers want longer trips but listings have date conflicts. User stories: traveler books split stay, host manages availability across stays. Success metrics: incremental bookings, revenue per trip, host satisfaction, trip completion rate. Technical: handle dual calendars, split payments, luggage storage between stays. Risks: complexity in UX, host confusion, price transparency, cancellation policies.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified feature scope", "Identified constraints"]}, "Identify": {"weight": 0.2, "criteria": ["Identified user segments", "Listed needs"]}, "Report": {"weight": 0.15, "criteria": ["Quantified opportunity", "Identified risks"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized MVP features", "Made trade-offs"]}, "List": {"weight": 0.15, "criteria": ["Covered core functionality", "Listed nice-to-haves"]}, "Evaluate": {"weight": 0.1, "criteria": ["Assessed feasibility", "Identified dependencies"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear PRD outline", "Success metrics defined"]}}'
),
(
  'Design a unified messaging inbox for all your messaging apps.',
  'product_sense', 'intermediate', 'Slack',
  'Use CIRCLES: Comprehend → Identify → Report → Cut → List → Evaluate → Summarize',
  'Aggregate: WhatsApp, iMessage, Slack, Discord, Teams. Features: unified inbox with smart sorting, cross-app search, smart replies, notification management. Challenges: platform restrictions (iOS/Android limit access), security concerns, privacy implications. Success metrics: messages synced, time saved, user satisfaction, cross-app conversation continuity.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified scope", "Identified platforms"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented users", "Identified needs"]}, "Report": {"weight": 0.15, "criteria": ["Listed key pain points"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized core features"]}, "List": {"weight": 0.15, "criteria": ["Generated solutions"]}, "Evaluate": {"weight": 0.1, "criteria": ["Discussed trade-offs"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation"]}}'
),
(
  'Design an alarm clock app for deaf people.',
  'product_sense', 'intermediate', 'Google',
  'Use CIRCLES with focus on sensory alternatives: Comprehend → Identify → Report → Cut → List → Evaluate → Summarize',
  'Target users: deaf and hard-of-hearing individuals. Sensory inputs needed: Vibration (wearable or under pillow), Light (gradually brightening room), Scent (release fragrance at wake time). Integration with smart home devices (smart lights, smart speakers). Fail-safe: battery backup, multiple alert methods, test mode. Success metrics: wake-up success rate, user satisfaction, false alarm rate.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified user needs", "Identified constraints"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented users (deaf vs hard-of-hearing)"]}, "Report": {"weight": 0.15, "criteria": ["Identified key challenges"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized sensory channels"]}, "List": {"weight": 0.15, "criteria": ["Listed solutions for each sense"]}, "Evaluate": {"weight": 0.1, "criteria": ["Assessed reliability"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation", "Metrics defined"]}}'
),
(
  'Design a bookshelf product for children.',
  'product_sense', 'beginner', 'Amazon',
  'Use CIRCLES: Comprehend → Identify → Report → Cut → List → Evaluate → Summarize',
  'Users: Kids (independence, excitement about books) + Parents (storage, safety, durability). Features: Front-facing covers (browse by image), adjustable height for growth, integrated reading nook, durable materials, fun colors/themes. Success: usage frequency, books read, parent satisfaction, independence in choosing books.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified dual user needs"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented kids vs parents"]}, "Report": {"weight": 0.15, "criteria": ["Listed pain points"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized features"]}, "List": {"weight": 0.15, "criteria": ["Generated solutions"]}, "Evaluate": {"weight": 0.1, "criteria": ["Discussed trade-offs"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation"]}}'
),
(
  'Design a smart shoe with fitness tracking capabilities.',
  'product_sense', 'beginner', 'Nike',
  'Use CIRCLES: Comprehend → Identify → Report → Cut → List → Evaluate → Summarize',
  'Target: runners and fitness enthusiasts. Features: auto-lacing (adjusts to foot), gait analysis (form correction), GPS tracking, haptic feedback (coaching cues), health metrics (steps, calories, heart rate via foot sensors). Success: adoption rate among runners, health improvement metrics, usage frequency.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified target users"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented by fitness level"]}, "Report": {"weight": 0.15, "criteria": ["Listed needs"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized features"]}, "List": {"weight": 0.15, "criteria": ["Generated solutions"]}, "Evaluate": {"weight": 0.1, "criteria": ["Assessed feasibility"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation"]}}'
),
(
  'How would you design a grocery delivery service for elderly users who are not tech-savvy?',
  'product_sense', 'intermediate', 'DoorDash',
  'Use CIRCLES: Comprehend → Identify → Report → Cut → List → Evaluate → Summarize',
  'Target: elderly users (70+) with limited tech experience. Key needs: simple interface (large buttons, minimal options), voice ordering, phone support, trusted delivery people, substitution handling, easy payment (cash on delivery option). Success: repeat order rate, delivery completion, customer satisfaction.',
  'CIRCLES', 'design_x_for_y',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Clarified accessibility needs"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented by tech comfort"]}, "Report": {"weight": 0.15, "criteria": ["Listed barriers"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized simplicity"]}, "List": {"weight": 0.15, "criteria": ["Generated accessible solutions"]}, "Evaluate": {"weight": 0.1, "criteria": ["Assessed usability"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation"]}}'
);

-- Product Sense - Improve X (5 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'Uber''s rider app shows estimated wait times, but drivers are often 5+ minutes late. How would you improve the wait time estimates?',
  'product_sense', 'intermediate', 'Uber',
  'Diagnose → Root Cause → Solution → Validate',
  'Diagnose: current estimates may not account for driver behavior patterns, real-time traffic, pickup location accuracy. Root cause: static estimates based on averages vs dynamic conditions. Solution: ML model using real-time driver GPS, historical patterns, route data, driver behavior signals. Validate: A/B test new estimates against current, measure pickup time accuracy, rider satisfaction, cancellation rates.',
  'METRICS', 'improve_x',
  '{"Define": {"weight": 0.2, "criteria": ["Clear problem definition"]}, "Measure": {"weight": 0.3, "criteria": ["Identified right metrics", "Segmented data"]}, "Analyze": {"weight": 0.3, "criteria": ["Found root cause", "Used data-driven approach"]}, "Optimize": {"weight": 0.2, "criteria": ["Actionable solution", "Validation plan"]}}'
),
(
  'Spotify''s podcast business is growing but engagement is declining. Users listen to fewer episodes over time. How would you diagnose and fix this?',
  'product_sense', 'advanced', 'Spotify',
  'Cohort Analysis → Funnel Analysis → User Research → Hypothesis → Solution',
  'Diagnose: cohort analysis to see if engagement drops by account age. Funnel: download → start → finish → subscribe. Hypothesis: discovery failure (can''t find content), notification fatigue, content quality issues. Fix: personalized recommendation algorithm improvements, smarter notification timing, exclusive content deals. Measure: DAU/MAU for podcast listeners, episodes per listener per week, subscription conversion.',
  'METRICS', 'improve_x',
  '{"Define": {"weight": 0.2, "criteria": ["Clear problem definition", "Established baseline"]}, "Measure": {"weight": 0.3, "criteria": ["Cohort analysis", "Funnel analysis"]}, "Analyze": {"weight": 0.3, "criteria": ["Root cause hypothesis", "User research approach"]}, "Optimize": {"weight": 0.2, "criteria": ["Actionable recommendations", "Success metrics"]}}'
),
(
  'Google Maps is adding AI-powered conversational search. How would you design the success metrics for this feature launch?',
  'product_sense', 'intermediate', 'Google',
  'Define metrics at multiple levels: Acquisition → Engagement → Quality → Business',
  'Acquisition: feature discovery rate, first-time user rate, activation rate. Engagement: conversation length, tasks completed per conversation, return rate, session frequency. Quality: success rate of queries, relevance of results, error rate, fallback rate. Business: impact on core Maps usage, ads clicked, routes taken via AI suggestions, user retention.',
  'METRICS', 'improve_x',
  '{"Define": {"weight": 0.25, "criteria": ["Clear metric categories"]}, "Measure": {"weight": 0.25, "criteria": ["Quantified each metric"]}, "Analyze": {"weight": 0.25, "criteria": ["Connected metrics to business goals"]}, "Optimize": {"weight": 0.25, "criteria": ["Prioritized metrics", "Set targets"]}}'
),
(
  'You''re launching a new LinkedIn feature that uses AI to write your profile summary. How do you ensure it doesn''t hurt the authenticity of user profiles?',
  'product_sense', 'intermediate', 'LinkedIn',
  'Balance: User choice → Transparency → Quality → Guardrails',
  'User choice: make AI drafts opt-in, not default. Transparency: clearly label AI-assisted content with visible badge. Quality: human-in-the-loop review before posting - user can edit. Guardrails: detect and prevent hallucinations, enforce content policies, prevent misrepresentation. Metrics: adoption rate, post-edit rate, user trust surveys, content authenticity reports.',
  'CIRCLES', 'improve_x',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Identified authenticity concerns"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented users by concern level"]}, "Report": {"weight": 0.15, "criteria": ["Listed risks"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized trust features"]}, "List": {"weight": 0.15, "criteria": ["Generated safeguards"]}, "Evaluate": {"weight": 0.1, "criteria": ["Assessed effectiveness"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation"]}}'
),
(
  'Figma is considering adding AI features that auto-generate design mockups from text descriptions. How do you think about the trade-offs?',
  'product_sense', 'intermediate', 'Figma',
  'Consider: User value → Market timing → Competitive pressure → Ethical concerns → Technical feasibility',
  'User value: high for beginners/non-designers, lower for expert designers who need precision. Market: AI is table stakes - competitors are adding it. Trade-offs: reduces design skill development for juniors, potential copyright issues with generated content, may commoditize junior designer work. Approach: launch with guardrails, position as starting point not final output, clear attribution.',
  'CIRCLES', 'improve_x',
  '{"Comprehend": {"weight": 0.15, "criteria": ["Identified stakeholder needs"]}, "Identify": {"weight": 0.2, "criteria": ["Segmented user impact"]}, "Report": {"weight": 0.15, "criteria": ["Listed trade-offs"]}, "Cut": {"weight": 0.15, "criteria": ["Prioritized user value"]}, "List": {"weight": 0.15, "criteria": ["Generated approaches"]}, "Evaluate": {"weight": 0.1, "criteria": ["Assessed risks"]}, "Summarize": {"weight": 0.1, "criteria": ["Clear recommendation"]}}'
);

-- Execution - Metrics for X (5 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'Amazon is launching same-day grocery delivery in 10 cities. How would you design the A/B test to validate product-market fit?',
  'ab_testing', 'advanced', 'Amazon',
  'Structure: Define success metrics → Choose test design → Calculate sample size → Analyze results → Make decision',
  'Define primary metric: first-time purchaser conversion rate (measures PMF). Secondary: repeat purchase rate, customer lifetime value, order frequency. Use holdout groups for brand awareness impact. Randomize at user level, stratify by order frequency history. Minimum detectable effect: 5%. Run for minimum 4 weeks to capture weekly cycles. Guardrail metrics: customer support tickets, delivery complaints.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.25, "criteria": ["Primary metric selection", "Secondary metrics"]}, "Measure": {"weight": 0.25, "criteria": ["Test design", "Sample size"]}, "Analyze": {"weight": 0.25, "criteria": ["Statistical approach", "Segmentation"]}, "Optimize": {"weight": 0.25, "criteria": ["Decision criteria", "Rollout plan"]}}'
),
(
  'What metrics would you track for Uber Pool?',
  'execution', 'intermediate', 'Uber',
  'North Star → Supporting Metrics → Guardrails',
  'North Star: matches per trip (efficiency of matching). Supporting: discount vs UberX time added (value proposition), driver earnings per hour (supply health), cancellation rate (reliability), pool uptake rate (conversion). Guardrails: average pickup time, passenger rating, driver rating.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.3, "criteria": ["North star metric", "Supporting metrics"]}, "Measure": {"weight": 0.35, "criteria": ["Quantified each metric", "Set targets"]}, "Analyze": {"weight": 0.2, "criteria": ["Segmentation approach"]}, "Optimize": {"weight": 0.15, "criteria": ["Optimization strategy"]}}'
),
(
  'What metrics would you track for a new Instagram Reels feature?',
  'execution', 'intermediate', 'Meta',
  'Engagement → Growth → Revenue → Quality',
  'Engagement: watch time, completion rate, shares, comments, re-watches. Growth: new users trying Reels, creator adoption, reach per creator. Revenue: ad impressions in Reels, CPM rates, brand partnership deals. Quality: content quality scores, flag rate, recommendation relevance.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.25, "criteria": ["Clear metric categories"]}, "Measure": {"weight": 0.25, "criteria": ["Quantified each metric"]}, "Analyze": {"weight": 0.25, "criteria": ["Connected to business goals"]}, "Optimize": {"weight": 0.25, "criteria": ["Prioritization"]}}'
),
(
  'Facebook Events usage is down 10%. Diagnose the issue.',
  'execution', 'advanced', 'Meta',
  'Define → Measure → Analyze → Optimize',
  '1) Rule out tech issues: check for bugs, latency, data pipeline errors. 2) Segment: by region, device type, user age, user tenure. 3) Analyze: compare to baseline, check seasonality, examine UX changes. 4) Hypothesis: UX changes reduced discoverability, competitor growth (Partiful), event creation friction increased. 5) Optimize: fix bugs, revert harmful UX changes, add engagement features.',
  'METRICS', 'investigate_drop',
  '{"Define": {"weight": 0.2, "criteria": ["Clear problem definition"]}, "Measure": {"weight": 0.3, "criteria": ["Proper segmentation", "Right metrics"]}, "Analyze": {"weight": 0.3, "criteria": ["Root cause identified", "Data-driven"]}, "Optimize": {"weight": 0.2, "criteria": ["Actionable recommendations"]}}'
),
(
  'How would you reduce driver cancellations for Uber?',
  'execution', 'intermediate', 'Uber',
  'Funnel Analysis → Root Cause → Solution → Validate',
  'Analyze when cancellations happen: pre-match (high ETA), post-match (long wait times), during ride (route issues). Solutions: improved ETAs with ML, driver incentives for low-wait areas, penalty system for late cancellations, better routing. Validate: A/B test changes, measure cancellation rate by segment.',
  'METRICS', 'investigate_drop',
  '{"Define": {"weight": 0.2, "criteria": ["Clear problem", "Funnel understanding"]}, "Measure": {"weight": 0.3, "criteria": ["Segmentation", "Root cause analysis"]}, "Analyze": {"weight": 0.3, "criteria": ["Data-driven hypotheses"]}, "Optimize": {"weight": 0.2, "criteria": ["Actionable solutions"]}}'
);

-- Strategy Questions (5 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'Should Twitter launch a subscription model?',
  'strategy', 'advanced', 'Twitter',
  'Pros → Cons → Recommendation → Implementation',
  'Pros: diversify revenue beyond advertising, reduce ad dependence, premium features could increase ARPU, better user data. Cons: slower user growth (paid barrier), potential churn, risk of cannibalizing ad revenue, network effects may weaken. Recommendation: Freemium model with Twitter Blue - keeps core free, adds premium features (edit button, folders, no ads) for power users. Maintains network effects while testing willingness to pay.',
  'PROBLEM_STATEMENT', 'strategy',
  '{"User": {"weight": 0.33, "criteria": ["Identified stakeholders", "Understood needs"]}, "Need": {"weight": 0.33, "criteria": ["Business need clear", "Quantified opportunity"]}, "Insight": {"weight": 0.34, "criteria": ["Strategic insight", "Trade-off analysis"]}}'
),
(
  'Should Netflix add live sports?',
  'strategy', 'advanced', 'Netflix',
  'Pros → Cons → Recommendation → Timeline',
  'Pros: retain subscribers, extremely high engagement, differentiate from streaming competitors (Amazon, Apple). Cons: extremely expensive sports rights ($10B+ for NFL), content fragmentation risk, live events are different from on-demand viewing. Recommendation: Start with non-exclusive sports, experiment with lower-tier sports (documentaries, smaller leagues), build capability before bidding for major rights. Timeline: 2-year pilot.',
  'PROBLEM_STATEMENT', 'strategy',
  '{"User": {"weight": 0.25, "criteria": ["Subscriber impact", "Viewer behavior"]}, "Need": {"weight": 0.25, "criteria": ["Business need", "Competitive pressure"]}, "Insight": {"weight": 0.25, "criteria": ["Cost analysis", "Risk assessment"]}, "Recommendation": {"weight": 0.25, "criteria": ["Clear path forward", "Phased approach"]}}'
),
(
  'You''re a PM at DoorDash. The CEO wants to add grocery delivery. How would you approach this product expansion?',
  'strategy', 'advanced', 'DoorDash',
  'Market → Capability fit → Approach → Success → Roadmap',
  'Market: $1.5T US grocery market, only 8% online penetration, high growth trajectory. Capability fit: existing delivery infrastructure, merchant relationships, consumer trust, logistics network. Approach: test with existing grocery partners vs build new vertical. Test in 2-3 markets first. Success: grocery GMV as % of total, unit economics per order (profitability), customer retention. Timeline: 12-month phased rollout.',
  'PROBLEM_STATEMENT', 'strategy',
  '{"User": {"weight": 0.2, "criteria": ["Market size", "Customer demand"]}, "Need": {"weight": 0.2, "criteria": ["Strategic rationale"]}, "Insight": {"weight": 0.2, "criteria": ["Capability assessment", "Competitive position"]}, "Recommendation": {"weight": 0.2, "criteria": ["Clear approach", "Timeline"]}, "Success": {"weight": 0.2, "criteria": ["Metrics defined", "Targets set"]}}'
),
(
  'Should Spotify acquire a podcast platform?',
  'strategy', 'intermediate', 'Spotify',
  'Strategic fit → Valuation → Synergies → Risk → Recommendation',
  'Strategic fit: podcast is strategic priority, ownership ensures control. Valuation: compare to recent deals (Anchor, Gimlet). Synergies: cross-promotion, exclusive content, ad revenue potential. Risks: content costs, competition from Apple/Google, integration challenges. Recommendation: Acquire if price is right, focus on exclusive content that drives subscriptions.',
  'PROBLEM_STATEMENT', 'strategy',
  '{"User": {"weight": 0.2, "criteria": ["User benefit"]}, "Need": {"weight": 0.2, "criteria": ["Strategic rationale"]}, "Insight": {"weight": 0.2, "criteria": ["Synergies", "Risks"]}, "Recommendation": {"weight": 0.2, "criteria": ["Clear decision"]}, "Execution": {"weight": 0.2, "criteria": ["Integration plan"]}}'
),
(
  'Should TikTok launch a subscription tier?',
  'strategy', 'intermediate', 'ByteDance',
  'User value → Revenue impact → Competitive → Recommendation',
  'User value: ad-free experience, exclusive content, advanced editing features. Revenue impact: could diversify from ad revenue, but may reduce engagement/ad views. Competitive: YouTube Premium exists, but TikTok is more ad-supported. Recommendation: Test in select markets first, focus on exclusive creator content as differentiator, monitor engagement impact closely.',
  'PROBLEM_STATEMENT', 'strategy',
  '{"User": {"weight": 0.25, "criteria": ["User segments", "Value proposition"]}, "Need": {"weight": 0.25, "criteria": ["Business rationale"]}, "Insight": {"weight": 0.25, "criteria": ["Competitive analysis", "Risks"]}, "Recommendation": {"weight": 0.25, "criteria": ["Clear path forward"]}}'
);

-- A/B Testing (4 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'You''re launching a new checkout flow for an e-commerce app. How would you design the A/B test?',
  'ab_testing', 'advanced', 'Shopify',
  'Metrics → Design → Sample size → Analysis → Decision',
  'Primary metric: conversion rate (completed purchases). Secondary: cart abandonment rate, time to checkout, error rate. Guardrail: revenue per user, customer support tickets. Randomize at user ID level. Minimum detectable effect: 5%. Run for 2 complete business cycles (2 weeks). Statistical significance: 95% confidence. Segments: device type, new vs returning, cart value.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.25, "criteria": ["Primary metric", "Secondary metrics", "Guardrails"]}, "Measure": {"weight": 0.25, "criteria": ["Test design", "Randomization"]}, "Analyze": {"weight": 0.25, "criteria": ["Sample size", "Segmentation"]}, "Optimize": {"weight": 0.25, "criteria": ["Decision criteria", "Rollout plan"]}}'
),
(
  'Airbnb wants to test a new search ranking algorithm. What metrics would you track?',
  'ab_testing', 'advanced', 'Airbnb',
  'Define metrics at each stage: Discovery → Consideration → Booking → Experience',
  'Discovery: search result click-through rate, time to first click, zero-result searches. Consideration: listing detail page rate, wishlist adds, comparison between listings. Booking: conversion rate, booking value, lead time. Experience: stay completion rate, host rating, review scores. Guardrails: host rejection rate, cancellation rate.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.25, "criteria": ["Full funnel metrics"]}, "Measure": {"weight": 0.25, "criteria": ["Quantified each"]}, "Analyze": {"weight": 0.25, "criteria": ["Connected to user journey"]}, "Optimize": {"weight": 0.25, "criteria": ["Prioritized metrics"]}}'
),
(
  'How would you A/B test a price increase for a SaaS product?',
  'ab_testing', 'advanced', 'Stripe',
  'Design → Metrics → Analysis → Rollout',
  'Primary metric: revenue per user (not just conversion). Test on small segment first (e.g., enterprise, or specific geography). Use holdout groups to measure churn impact. Analyze: segment by user size, usage level, tenure. Guardrails: customer satisfaction, support tickets, Net Revenue Retention. Recommendation: gradual rollout based on segment sensitivity.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.25, "criteria": ["Revenue metrics", "Churn metrics"]}, "Measure": {"weight": 0.25, "criteria": ["Test design", "Segments"]}, "Analyze": {"weight": 0.25, "criteria": ["Statistical approach"]}, "Optimize": {"weight": 0.25, "criteria": ["Rollout strategy"]}}'
),
(
  'Design an A/B test for a new onboarding flow that reduces user drop-off.',
  'ab_testing', 'intermediate', 'Notion',
  'Define → Measure → Test → Analyze → Optimize',
  'Primary metric: completion rate of onboarding flow. Secondary: time to value (first action), 7-day retention, feature adoption rate. Randomize new users at sign-up. Test variations: steps reduced, progress indicator, value demonstration upfront, personalization. Analyze by traffic source, device, user segment. Power calculation: 80% power, 5% MDE.',
  'METRICS', 'metrics_for_x',
  '{"Define": {"weight": 0.25, "criteria": ["Primary", "Secondary metrics"]}, "Measure": {"weight": 0.25, "criteria": ["Test variants"]}, "Analyze": {"weight": 0.25, "criteria": ["Segmentation"]}, "Optimize": {"weight": 0.25, "criteria": ["Decision criteria"]}}'
);

-- Behavioral STAR (5 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'Tell me about a time you had a conflict with an engineer. How did you resolve it?',
  'behavioral', 'intermediate', 'Meta',
  'Use STAR: Situation → Task → Action → Result',
  'STAR: Situation - product launch timeline conflict with engineering. Task - deliver feature on time while maintaining team relationship. Action - 1:1 to understand technical constraints, found unexpected technical debt, negotiated scope with stakeholders, pair programmed evenings. Result - launched on time, feature worked well, created process for technical debt review in planning.',
  'STAR', 'behavioral_star',
  '{"Situation": {"weight": 0.25, "criteria": ["Clear context", "Brief setup"]}, "Task": {"weight": 0.25, "criteria": ["Your responsibility", "Clear goal"]}, "Action": {"weight": 0.25, "criteria": ["Specific steps", "Showed initiative", "Used I not we"]}, "Result": {"weight": 0.25, "criteria": ["Quantified", "Learned something"]}}'
),
(
  'Tell me about a time you failed. What did you learn?',
  'behavioral', 'intermediate', 'Google',
  'Use STAR with reflection: Situation → Task → Action → Result → Learnings',
  'STAR: Situation - launched feature that users hated. Task - as PM, own the product failure. Action - analyzed feedback at scale, identified root cause (launched without testing), created beta program for future launches. Result - rebuilt with beta input, feature relaunched successfully. Learnings - would add user testing upfront, importance of beta programs, failure is part of iteration.',
  'STAR', 'behavioral_star',
  '{"Situation": {"weight": 0.2, "criteria": ["Clear context"]}, "Task": {"weight": 0.2, "criteria": ["Your ownership"]}, "Action": {"weight": 0.2, "criteria": ["Specific actions"]}, "Result": {"weight": 0.2, "criteria": ["Positive outcome despite failure"]}, "Learnings": {"weight": 0.2, "criteria": ["Specific takeaways", "Future application"]}}'
),
(
  'Describe a time you influenced without authority. How did you do it?',
  'behavioral', 'intermediate', 'Amazon',
  'Use STAR: Situation → Task → Action → Result',
  'STAR: Situation - needed UX help from another team, no authority. Task - get design resources for my project. Action - built relationship with design lead, showed data on user impact, aligned incentives with their goals, offered to help their project in return. Result - got dedicated design support, feature launched successfully. Key learning: influence comes from relationships and data, not titles.',
  'STAR', 'behavioral_star',
  '{"Situation": {"weight": 0.25, "criteria": ["Clear context"]}, "Task": {"weight": 0.25, "criteria": ["Challenge defined"]}, "Action": {"weight": 0.25, "criteria": ["Specific influence tactics"]}, "Result": {"weight": 0.25, "criteria": ["Outcome quantified"]}}'
),
(
  'Tell me about a time you had to deliver bad news to a stakeholder. How did you handle it?',
  'behavioral', 'intermediate', 'Microsoft',
  'Use STAR: Situation → Task → Action → Result',
  'STAR: Situation - technical issues would delay launch by 2 months. Task - inform executive stakeholder. Action - prepared data and context, framed as recommendation not just news, provided alternative options, outlined recovery plan. Result - stakeholder appreciated transparency, approved revised timeline, project recovered. Lesson: stakeholders trust transparency.',
  'STAR', 'behavioral_star',
  '{"Situation": {"weight": 0.25, "criteria": ["Context"]}, "Task": {"weight": 0.25, "criteria": ["Challenge"]}, "Action": {"weight": 0.25, "criteria": ["Communication approach"]}, "Result": {"weight": 0.25, "criteria": ["Outcome", "Learning"]}}'
),
(
  'Describe a time you made a data-driven decision that went against conventional wisdom.',
  'behavioral', 'intermediate', 'Netflix',
  'Use STAR with insight: Situation → Task → Action → Result → Insight',
  'STAR: Situation - team wanted to remove a feature based on intuition. Task - use data to make decision. Action - analyzed usage data, spoke to customers, found the feature was critical for power users. Presented data to team. Result - kept feature, improved it for casual users instead. Insight: data beats opinions, but customer research complements data.',
  'STAR', 'behavioral_star',
  '{"Situation": {"weight": 0.2, "criteria": ["Context"]}, "Task": {"weight": 0.2, "criteria": ["Decision needed"]}, "Action": {"weight": 0.2, "criteria": ["Data approach"]}, "Result": {"weight": 0.2, "criteria": ["Outcome"]}, "Insight": {"weight": 0.2, "criteria": ["Broader learning"]}}'
);

-- Estimation (3 questions)
INSERT INTO public.questions (question_text, category, difficulty, company, framework_hint, expert_answer, framework_name, pattern_type, rubric) VALUES
(
  'Estimate the bandwidth used by TikTok in a day.',
  'estimation', 'advanced', 'ByteDance',
  'Top-down or Bottom-up: Assumptions → Calculation → Validation',
  'Assumptions: 1B DAU, average 60 mins/day usage, average video bitrate 1-2 Mbps (varies by quality). Calculation: 1B users × 60 min × 60 sec × 1.5 Mbps average = 90 trillion bits. Convert: 90T bits / 8 = 11.25TB per day. Adjust for compression: ~500PB-1EB/day actual. (Note: TikTok uses aggressive compression, CDN caching.)',
  'PROBLEM_STATEMENT', 'estimation',
  '{"Assumptions": {"weight": 0.33, "criteria": ["Reasonable estimates", "Stated clearly"]}, "Calculation": {"weight": 0.33, "criteria": ["Math correct", "Units right"]}, "Validation": {"weight": 0.34, "criteria": ["Sanity check", "Compared to known"]}}'
),
(
  'Estimate the number of elevators in New York City.',
  'estimation', 'intermediate', 'Google',
  'Segment: Buildings → Elevators per building → Total',
  'NYC population: ~8M people. Buildings: ~1M total buildings. High-rises (6+ floors): ~10% = 100k buildings. Low-rise (2-5 floors): ~30% = 300k. Single family: ~60% = 600k. Elevators per building: high-rise avg 10, low-rise avg 1.5. Calculation: (100k × 10) + (300k × 1.5) = 1M + 450k = ~1.45M. Sanity check: Actual is ~84k (NYC has many walk-ups).',
  'PROBLEM_STATEMENT', 'estimation',
  '{"Assumptions": {"weight": 0.33, "criteria": ["Reasonable segmentation"]}, "Calculation": {"weight": 0.33, "criteria": ["Math correct"]}, "Validation": {"weight": 0.34, "criteria": ["Sanity check", "Acknowledged uncertainty"]}}'
),
(
  'Estimate the market size for dog walking services in San Francisco.',
  'estimation', 'beginner', 'Rover',
  'TAM → SAM → SOM approach',
  'SF households: ~350k. Dog ownership: ~18% = 63k dogs. Need walkers: ~40% of dog owners (busy professionals) = 25k dogs. Walks per week: average 3. Price: $25/walk average. Weekly TAM: 25k × 3 × $25 = $1.875M/week. Annual: ~$97M. SOM (realistic capture): 5% = $5M/year with current market maturity.',
  'PROBLEM_STATEMENT', 'estimation',
  '{"Assumptions": {"weight": 0.33, "criteria": ["Clear assumptions", "Reasonable"]}, "Calculation": {"weight": 0.33, "criteria": ["TAM → SAM → SOM"]}, "Validation": {"weight": 0.34, "criteria": ["Sanity check", "Realistic targets"]}}'
);

COMMIT;

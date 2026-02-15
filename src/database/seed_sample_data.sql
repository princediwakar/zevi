-- Seed sample questions to satisfy foreign key constraints
-- Run this in your Supabase SQL Editor

INSERT INTO public.questions (
  id, 
  question_text, 
  category, 
  difficulty, 
  company, 
  interview_type, 
  framework_hint, 
  expert_answer, 
  evaluation_rubric, 
  acceptance_rate, 
  pattern_type, 
  mcq_version
) VALUES 
(
  'c9225726-1736-4076-963d-4724641cb980',
  'How do you measure success of the Hot Home feature in Redfin?',
  'ab_testing',
  'intermediate',
  'Redfin',
  'in_person',
  'Use the Metrics framework: Define goal → Identify user actions → Choose metrics → Set targets',
  'Start by clarifying the goal of Hot Home feature. Then identify key user actions (views, saves, contacts). Choose metrics like engagement rate, conversion to contact, and time on listing. Set specific targets based on baseline data.',
  '{
    "metrics": ["Defined engagement metrics", "Included conversion metrics", "Mentioned leading vs lagging indicators"], 
    "clarification": ["Asked about Hot Home feature purpose", "Identified target users"], 
    "prioritization": ["Prioritized metrics by importance", "Explained trade-offs"]
  }',
  65,
  'metrics_for_x',
  '{
    "enabled": true,
    "sub_questions": [
      {
        "prompt": "What type of metric is \"number of Hot Home views\"?",
        "options": [
          {"text": "Leading indicator", "correct": true, "explanation": "Views happen before conversions, making it a leading indicator of user interest."},
          {"text": "Lagging indicator", "correct": false, "explanation": "Lagging indicators measure outcomes after the fact."},
          {"text": "Vanity metric", "correct": false, "explanation": "While views alone could be vanity, in context they predict conversion."},
          {"text": "Counter metric", "correct": false, "explanation": "Counter metrics track negative impacts."}
        ],
        "difficulty": "beginner"
      },
      {
        "prompt": "Which metric best measures Hot Home feature success?",
        "options": [
          {"text": "Total page views", "correct": false, "explanation": "Too broad - doesn''t show if Hot Home specifically drives value."},
          {"text": "Conversion rate from Hot Home view to agent contact", "correct": true, "explanation": "Directly measures if the feature drives the desired action."},
          {"text": "Number of Hot Home badges shown", "correct": false, "explanation": "This is an output metric, not a success metric."},
          {"text": "Average time on site", "correct": false, "explanation": "Too general - doesn''t isolate Hot Home impact."}
        ],
        "difficulty": "intermediate"
      }
    ]
  }'
),
(
  'ae288863-7183-4914-946b-4e1b563be81f',
  'How do you improve Slack?',
  'product_sense',
  'intermediate',
  'Dropbox',
  'phone',
  'Use CIRCLES: Comprehend → Identify customer → Report needs → Cut → List solutions → Evaluate → Summarize',
  'First, clarify the goal - are we improving for specific users or overall? Identify target users (e.g., remote teams). Report their needs through user research. Prioritize the most impactful pain points. Brainstorm solutions, evaluate trade-offs, and recommend the top solution with clear success metrics.',
  '{
    "metrics": ["Defined success metrics"], 
    "solutions": ["Generated multiple ideas", "Evaluated trade-offs"], 
    "user_needs": ["Identified specific user segments", "Listed concrete pain points"], 
    "clarification": ["Asked clarifying questions", "Defined scope"]
  }',
  null,
  'improve_x',
  '{
    "enabled": true,
    "sub_questions": [
      {
        "prompt": "What should you do FIRST when asked to improve Slack?",
        "options": [
          {"text": "Brainstorm features", "correct": false, "explanation": "Jumping to solutions without understanding the problem is premature."},
          {"text": "Ask clarifying questions", "correct": true, "explanation": "Always clarify the problem space, target users, and goals first."},
          {"text": "Define success metrics", "correct": false, "explanation": "Metrics come after understanding the problem."},
          {"text": "Analyze competitors", "correct": false, "explanation": "While useful, clarification comes first."}
        ],
        "difficulty": "beginner"
      },
      {
        "prompt": "Which user segment should you focus on for Slack improvements?",
        "options": [
          {"text": "All users equally", "correct": false, "explanation": "Too broad - different segments have different needs."},
          {"text": "The segment with the biggest pain point", "correct": true, "explanation": "Prioritize based on impact and user needs."},
          {"text": "Enterprise users only", "correct": false, "explanation": "May not align with business goals without clarification."},
          {"text": "New users", "correct": false, "explanation": "Depends on the goal - retention vs acquisition."}
        ],
        "difficulty": "intermediate"
      }
    ]
  }'
),
(
  '242b58f8-a15d-4444-9642-1262dca7768e',
  'How did you turn an adversary into a confidant?',
  'behavioral',
  'intermediate',
  'Facebook',
  'in_person',
  'Use STAR: Situation → Task → Action → Result',
  'Describe a specific situation where you had conflict. Explain your task/goal. Detail the actions you took to build trust (active listening, finding common ground, delivering on promises). Share the positive result and what you learned.',
  '{
    "metrics": ["Quantified the result", "Reflected on learnings"], 
    "solutions": ["Described concrete actions", "Showed initiative"], 
    "user_needs": ["Showed empathy", "Understood other person''s perspective"], 
    "clarification": ["Provided specific situation", "Explained context clearly"]
  }',
  null,
  'behavioral_star',
  '{
    "enabled": true,
    "sub_questions": [
      {
        "prompt": "In the STAR framework, what does the \"A\" stand for?",
        "options": [
          {"text": "Analysis", "correct": false, "explanation": "STAR is Situation, Task, Action, Result."},
          {"text": "Action", "correct": true, "explanation": "Action describes what YOU specifically did."},
          {"text": "Achievement", "correct": false, "explanation": "Achievement is part of Result."},
          {"text": "Approach", "correct": false, "explanation": "While similar, the framework uses \"Action\"."}
        ],
        "difficulty": "beginner"
      }
    ]
  }'
),
(
  'b2277028-090c-4394-9844-428612502621',
  'What goals and success metrics would you set for buy & sell groups?',
  'execution',
  'intermediate',
  'Facebook',
  'phone',
  'Define business goal → User goal → Key metrics (engagement, conversion, retention) → Set targets',
  'Business goal: Increase marketplace activity. User goal: Easy buying/selling. Metrics: Active listings, transaction completion rate, repeat sellers, time to sale. Set SMART targets based on current baseline.',
  '{
    "metrics": ["Listed relevant metrics", "Included leading and lagging indicators"], 
    "clarification": ["Defined business and user goals"], 
    "prioritization": ["Prioritized metrics", "Set realistic targets"]
  }',
  null,
  'metrics_for_x',
  '{
    "enabled": true,
    "sub_questions": [
      {
        "prompt": "Which is the most important metric for buy & sell groups?",
        "options": [
          {"text": "Number of group members", "correct": false, "explanation": "Vanity metric - doesn''t show actual value creation."},
          {"text": "Transaction completion rate", "correct": true, "explanation": "Directly measures if the feature achieves its purpose."},
          {"text": "Number of posts", "correct": false, "explanation": "Activity metric but doesn''t show successful transactions."},
          {"text": "Page views", "correct": false, "explanation": "Too broad and doesn''t measure success."}
        ],
        "difficulty": "intermediate"
      }
    ]
  }'
),
(
  '1c33c200-8430-466d-961f-1335cb992383',
  'You are the PM of Facebook Lite, what goals would you set?',
  'execution',
  'intermediate',
  'Facebook',
  'phone',
  'Understand product context → Define user needs → Set goals (SMART) → Choose metrics',
  'Facebook Lite targets emerging markets with limited connectivity. Goals: 1) Increase DAU in target markets, 2) Reduce data usage per session, 3) Improve app performance on low-end devices. Metrics: DAU growth rate, data consumption, app load time, crash rate.',
  '{
    "metrics": ["Set specific, measurable goals", "Aligned with user needs"], 
    "clarification": ["Understood Facebook Lite''s purpose", "Identified target users"], 
    "prioritization": ["Prioritized goals by impact"]
  }',
  null,
  'metrics_for_x',
  '{
    "enabled": true,
    "sub_questions": [
      {
        "prompt": "What is the primary target market for Facebook Lite?",
        "options": [
          {"text": "US power users", "correct": false, "explanation": "Lite is designed for emerging markets."},
          {"text": "Emerging markets with limited connectivity", "correct": true, "explanation": "Lite optimizes for low bandwidth and low-end devices."},
          {"text": "Enterprise customers", "correct": false, "explanation": "Facebook Lite is a consumer product."},
          {"text": "Developers", "correct": false, "explanation": "Lite targets end users, not developers."}
        ],
        "difficulty": "beginner"
      }
    ]
  }'
)
ON CONFLICT (id) DO UPDATE SET 
  question_text = EXCLUDED.question_text,
  mcq_version = EXCLUDED.mcq_version;

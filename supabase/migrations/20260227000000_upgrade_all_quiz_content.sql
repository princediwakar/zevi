-- Upgrade all quiz lessons with better content

-- Introduction Quiz (1e3630fa-9a97-41ce-9a99-8ee93333e69b)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Introduction Quiz",
  "description": "Test your understanding of product sense fundamentals",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is the first step in answering a product design question?",
        "options": ["Brainstorm solutions", "Clarify the problem", "Define metrics", "Present your idea"],
        "correct_answer": 1,
        "explanation": "Always clarify the problem first to ensure you understand what needs to be solved."
      },
      {
        "text": "Which of these is NOT a key component of product sense?",
        "options": ["User understanding", "Technical coding", "Problem identification", "Metric definition"],
        "correct_answer": 1,
        "explanation": "Technical coding is not a component of product sense - its a technical skill."
      },
      {
        "text": "What does product sense help PMs do?",
        "options": ["Write code", "Build products users love", "Manage budgets", "Hire engineers"],
        "correct_answer": 1,
        "explanation": "Product sense helps PMs build products that users will love and find valuable."
      },
      {
        "text": "Why is it important to understand user problems?",
        "options": ["Its not important", "To build the right product", "To write documentation", "To set salaries"],
        "correct_answer": 1,
        "explanation": "Understanding user problems is crucial to build the right product that solves real needs."
      },
      {
        "text": "What is the goal of product discovery?",
        "options": ["Launch faster", "Find product-market fit", "Reduce team size", "Increase prices"],
        "correct_answer": 1,
        "explanation": "Product discovery aims to find product-market fit - the right product for the right customers."
      }
    ]
  }
}'::jsonb
WHERE id = '1e3630fa-9a97-41ce-9a99-8ee93333e69b';

-- CIRCLES Quiz (07e1bc6a-2667-4d33-8ab9-eb6d21e43643)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "CIRCLES Quiz",
  "description": "Test your CIRCLES framework knowledge",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What does the C in CIRCLES stand for?",
        "options": ["Create", "Comprehend", "Consider", "Choose"],
        "correct_answer": 1,
        "explanation": "CIRCLES starts with Comprehend - understanding the problem first."
      },
      {
        "text": "What does the R in CIRCLES stand for?",
        "options": ["Review", "Report", "Research", "Rank"],
        "correct_answer": 1,
        "explanation": "R stands for Report - presenting your findings clearly."
      },
      {
        "text": "In what order should you follow CIRCLES?",
        "options": ["Any order", "Sequential order", "Reverse order", "Random order"],
        "correct_answer": 1,
        "explanation": "CIRCLES should be followed in sequential order for best results."
      },
      {
        "text": "What is the final step in CIRCLES?",
        "options": ["Comprehend", "Summarize", "List", "Cut"],
        "correct_answer": 1,
        "explanation": "Summarize is the final step - wrapping up with recommendations."
      },
      {
        "text": "Why use a framework like CIRCLES?",
        "options": ["To sound smart", "To structure your answer", "To use fewer words", "To avoid thinking"],
        "correct_answer": 1,
        "explanation": "Frameworks help structure your answer and ensure you cover all key aspects."
      }
    ]
  }
}'::jsonb
WHERE id = '07e1bc6a-2667-4d33-8ab9-eb6d21e43643';

-- Metrics Quiz (7701e7d9-7a17-45d1-8d54-8355ad2768d0)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Metrics Quiz",
  "description": "Test your knowledge of product metrics",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What does HEART stand for in metrics?",
        "options": ["Heart, Energy, Action, Results, Time", "Happiness, Engagement, Adoption, Retention, Task Success", "Help, Evaluate, Analyze, Report, Test", "Health, Efficiency, Accuracy, Revenue, Trends"],
        "correct_answer": 1,
        "explanation": "HEART stands for Happiness, Engagement, Adoption, Retention, Task Success."
      },
      {
        "text": "Which metric measures how often users return?",
        "options": ["Adoption", "Retention", "Engagement", "Task Success"],
        "correct_answer": 1,
        "explanation": "Retention measures how often users come back to your product."
      },
      {
        "text": "What is a leading indicator?",
        "options": ["A historical metric", "A predictive metric", "A financial metric", "A competitor metric"],
        "correct_answer": 1,
        "explanation": "Leading indicators predict future outcomes before they happen."
      },
      {
        "text": "What is the difference between vanity metrics and actionable metrics?",
        "options": ["No difference", "Vanity looks good but dont drive action", "Actionable are always higher", "Vanity metrics are cheaper"],
        "correct_answer": 1,
        "explanation": "Vanity metrics look impressive but dont help you make decisions. Actionable metrics drive decisions."
      },
      {
        "text": "What is a good North Star Metric?",
        "options": ["Daily revenue", "A metric that predicts long-term value", "Number of users", "Page views"],
        "correct_answer": 1,
        "explanation": "A North Star Metric predicts long-term value and guides team alignment."
      }
    ]
  }
}'::jsonb
WHERE id = '7701e7d9-7a17-45d1-8d54-8355ad2768d0';

-- Root Cause Quiz (4cd6100c-d42d-4ede-ab29-43ff5ab6af7a)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Root Cause Quiz",
  "description": "Test your root cause analysis skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is the 5 Whys method used for?",
        "options": ["Counting metrics", "Root cause analysis", "Writing reports", "Planning budgets"],
        "correct_answer": 1,
        "explanation": "The 5 Whys is a root cause analysis technique to find the underlying cause of problems."
      },
      {
        "text": "What is the chicken-and-egg problem in marketplaces?",
        "options": ["A breakfast choice", "Need for both buyers and sellers", "A technical bug", "A pricing issue"],
        "correct_answer": 1,
        "explanation": "The chicken-and-egg problem is when you need both sides of a marketplace to exist."
      },
      {
        "text": "What is a symptom vs a root cause?",
        "options": ["They are the same", "Symptom is observable, root cause is underlying", "Root cause is always visible", "Symptom is more important"],
        "correct_answer": 1,
        "explanation": "A symptom is what you observe; the root cause is why it happens."
      },
      {
        "text": "Why is root cause analysis important?",
        "options": ["Its not important", "To solve problems permanently", "To blame others", "To avoid work"],
        "correct_answer": 1,
        "explanation": "Root cause analysis helps solve problems permanently rather than treating symptoms."
      },
      {
        "text": "What is a common pitfall in problem solving?",
        "options": ["Asking why", "Treating symptoms not causes", "Using data", "Being too thorough"],
        "correct_answer": 1,
        "explanation": "Treating symptoms not causes is a common pitfall - the problem keeps coming back."
      }
    ]
  }
}'::jsonb
WHERE id = '4cd6100c-d42d-4ede-ab29-43ff5ab6af7a';

-- Behavioral Quiz (476a88e2-0777-4469-94fe-8e43c79864af)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Behavioral Quiz",
  "description": "Test your behavioral interview skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What does STAR stand for in behavioral interviews?",
        "options": ["Start, Try, Act, Result", "Situation, Task, Action, Result", "Story, Topic, Argument, Review", "Stop, Think, Answer, Respond"],
        "correct_answer": 1,
        "explanation": "STAR stands for Situation, Task, Action, Result."
      },
      {
        "text": "What is the best way to answer behavioral questions?",
        "options": ["Be vague", "Use the STAR method", "Give yes/no answers", "Talk about others only"],
        "correct_answer": 1,
        "explanation": "The STAR method helps structure your answer clearly and comprehensively."
      },
      {
        "text": "When describing a conflict, what should you focus on?",
        "options": ["Blaming others", "How you resolved it", "The other persons flaws", "How right you were"],
        "correct_answer": 1,
        "explanation": "Focus on how you resolved the conflict and what you learned."
      },
      {
        "text": "What type of stories work best for leadership questions?",
        "options": ["Made up stories", "Real examples where you led", "Stories about following", "Funny stories"],
        "correct_answer": 1,
        "explanation": "Real examples where you took initiative or led make the strongest answers."
      },
      {
        "text": "Why is it important to know Amazons Leadership Principles?",
        "options": ["Its not important", "They are asked in interviews", "They are optional", "They are secret"],
        "correct_answer": 1,
        "explanation": "Amazon interviews often test for Leadership Principles - know them well!"
      }
    ]
  }
}'::jsonb
WHERE id = '476a88e2-0777-4469-94fe-8e43c79864af';

-- Strategy Quiz (a884704a-7242-4241-99bb-5505de441d91)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Strategy Quiz",
  "description": "Test your product strategy knowledge",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What does RICE stand for in prioritization?",
        "options": ["Rapid, Important, Critical, Essential", "Reach, Impact, Confidence, Effort", "Revenue, Income, Cost, Expense", "Risk, Innovation, Creativity, Execution"],
        "correct_answer": 1,
        "explanation": "RICE = Reach x Impact x Confidence / Effort."
      },
      {
        "text": "What is the Kano Model?",
        "options": ["A pricing model", "A prioritization model", "A feature classification model", "A hiring model"],
        "correct_answer": 2,
        "explanation": "Kano Model classifies features into Must-be, Performance, and Delighters."
      },
      {
        "text": "What is MoSCoW method used for?",
        "options": ["Budgeting", "Prioritization", "Hiring", "Marketing"],
        "correct_answer": 1,
        "explanation": "MoSCoW (Must, Should, Could, Wont) is a prioritization technique."
      },
      {
        "text": "What does Porter Five Forces analyze?",
        "options": ["Employee satisfaction", "Industry attractiveness", "Product features", "Team performance"],
        "correct_answer": 1,
        "explanation": "Porter Five Forces analyzes industry attractiveness and competition."
      },
      {
        "text": "What is a SWOT analysis?",
        "options": ["A programming language", "Strategic planning framework", "A testing method", "A design tool"],
        "correct_answer": 1,
        "explanation": "SWOT analyzes Strengths, Weaknesses, Opportunities, and Threats."
      }
    ]
  }
}'::jsonb
WHERE id = 'a884704a-7242-4241-99bb-5505de441d91';

-- Design Patterns Quiz (64c8e242-e0ef-48c2-90b3-64d0f9cd4c27)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Design Patterns Quiz",
  "description": "Test your knowledge of product design patterns",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is a design pattern?",
        "options": ["A specific color scheme", "A repeatable solution to common problems", "A type of font", "A code library"],
        "correct_answer": 1,
        "explanation": "Design patterns are repeatable solutions to common product challenges."
      },
      {
        "text": "What is two-sided marketplace pattern?",
        "options": ["A physical store", "Platform connecting two user groups", "A marketing campaign", "A pricing strategy"],
        "correct_answer": 1,
        "explanation": "Two-sided marketplaces connect two distinct groups like buyers and sellers."
      },
      {
        "text": "What is thefreemium model?",
        "options": ["A pricing trick", "Free basic, paid premium", "Always free", "A type of trial"],
        "correct_answer": 1,
        "explanation": "Freemium offers free basic features with premium paid features."
      },
      {
        "text": "What are growth loops?",
        "options": ["Exercise routines", "Self-reinforcing cycles that drive growth", "Bug fixes", "Meeting schedules"],
        "correct_answer": 1,
        "explanation": "Growth loops are self-reinforcing cycles that drive sustainable growth."
      },
      {
        "text": "What is network effect?",
        "options": ["Social media only", "Value increases with more users", "A technical term", "A marketing strategy"],
        "correct_answer": 1,
        "explanation": "Network effects mean the product becomes more valuable as more people use it."
      }
    ]
  }
}'::jsonb
WHERE id = '64c8e242-e0ef-48c2-90b3-64d0f9cd4c27';

-- Prioritization Quiz (0633bfc6-d6f9-4acb-ab0c-19fd93393fd8)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Prioritization Quiz",
  "description": "Test your prioritization skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is opportunity cost?",
        "options": ["The cost of a ticket", "Value of the next best alternative", "A tax term", "A discount"],
        "correct_answer": 1,
        "explanation": "Opportunity cost is the value of what you give up when making a choice."
      },
      {
        "text": "In RICE, what does Effort measure?",
        "options": ["Time only", "Person-weeks required", "Money only", "Number of features"],
        "correct_answer": 1,
        "explanation": "Effort measures the person-weeks or resources required."
      },
      {
        "text": "What is technical debt?",
        "options": ["Money owed", "Future work from quick decisions", "A programming language", "A budget item"],
        "correct_answer": 1,
        "explanation": "Technical debt is the future cost of quick/shortcut decisions."
      },
      {
        "text": "What should you prioritize first?",
        "options": ["Easiest tasks", "Highest impact items", "Longest tasks", "Random selection"],
        "correct_answer": 1,
        "explanation": "Highest impact items should typically be prioritized first."
      },
      {
        "text": "What is ROI in prioritization?",
        "options": ["Return on Investment", "Rate of Implementation", "Range of Impact", "Risk of Inaction"],
        "correct_answer": 0,
        "explanation": "ROI (Return on Investment) helps quantify the value of prioritization decisions."
      }
    ]
  }
}'::jsonb
WHERE id = '0633bfc6-d6f9-4acb-ab0c-19fd93393fd8';

-- Upgrade remaining quiz lessons with better content

-- Pricing Experiments: Pricing Quiz A (4925e020-2b04-4fcb-95a3-3bbdfa49fa1e)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Pricing Knowledge Quiz",
  "description": "Test pricing fundamentals",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is price elasticity?",
        "options": ["How prices change over time", "How demand changes with price", "The difference between cost and price", "Market saturation"],
        "correct_answer": 1,
        "explanation": "Price elasticity measures how demand changes when price changes."
      },
      {
        "text": "What is the difference between value-based and cost-plus pricing?",
        "options": ["No difference", "Value-based uses customer perception, cost-plus uses production cost", "Cost-plus is always higher", "Value-based is only for luxury"],
        "correct_answer": 1,
        "explanation": "Value-based pricing sets prices based on customer perceived value, cost-plus adds margin to costs."
      },
      {
        "text": "What is psychological pricing?",
        "options": ["Pricing based on emotions", "Pricing ending in 9 or 99", "Random pricing", "Premium pricing only"],
        "correct_answer": 1,
        "explanation": "Psychological pricing uses tactics like ending prices in 9 to make them seem lower."
      },
      {
        "text": "What is a freemium model?",
        "options": ["Always free", "Free basic, paid premium features", "Expensive version", "Discount pricing"],
        "correct_answer": 1,
        "explanation": "Freemium offers free basic features with premium paid features."
      },
      {
        "text": "What is dynamic pricing?",
        "options": ["Fixed prices", "Prices that change based on demand", "Wholesale pricing", "Cost-based pricing"],
        "correct_answer": 1,
        "explanation": "Dynamic pricing adjusts prices based on demand, time, or other factors."
      }
    ]
  }
}'::jsonb
WHERE id = '4925e020-2b04-4fcb-95a3-3bbdfa49fa1e';

-- Leadership Quiz (92bc51b2-875d-485f-b5d9-065c7f590a38)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Leadership Quiz",
  "description": "Test your leadership skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is servant leadership?",
        "options": ["Leading by giving orders", "Serving team needs first", "Being the boss", "Avoiding responsibility"],
        "correct_answer": 1,
        "explanation": "Servant leadership prioritizes serving the needs of the team."
      },
      {
        "text": "How should you handle disagreement with your manager?",
        "options": ["Always agree", "Present data respectfully", "Go to HR immediately", "Ignore it"],
        "correct_answer": 1,
        "explanation": "Present data and reasoning respectfully while being open to their perspective."
      },
      {
        "text": "What is psychological safety?",
        "options": ["Being mentally unstable", "Team feels safe to take risks", "Security protocols", "Pay compensation"],
        "correct_answer": 1,
        "explanation": "Psychological safety is when team members feel safe to take risks and be vulnerable."
      },
      {
        "text": "What is the best way to delegate?",
        "options": ["Do everything yourself", "Assign tasks without context", "Match tasks to strengths with clear expectations", "Only delegate boring tasks"],
        "correct_answer": 2,
        "explanation": "Good delegation matches tasks to team members strengths with clear expectations."
      },
      {
        "text": "How do you handle a toxic team member?",
        "options": ["Ignore them", "Address behavior directly and document", "Transfer them immediately", "Complain to everyone"],
        "correct_answer": 1,
        "explanation": "Address the behavior directly, set clear expectations, and document if needed."
      }
    ]
  }
}'::jsonb
WHERE id = '92bc51b2-875d-485f-b5d9-065c7f590a38';

-- Sizing Quiz (01961349-cb19-4f2f-881e-57a99568e0f6)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Sizing Quiz",
  "description": "Test your market sizing skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is TAM?",
        "options": ["Total Active Members", "Total Addressable Market", "Team Average Metric", "Technical Architecture Model"],
        "correct_answer": 1,
        "explanation": "TAM (Total Addressable Market) is the total market demand for a product."
      },
      {
        "text": "What is the top-down approach to market sizing?",
        "options": ["Start from customer", "Start from overall market and segment down", "Ask customers directly", "Use competitors data only"],
        "correct_answer": 1,
        "explanation": "Top-down starts with the overall market and segments down to find your target."
      },
      {
        "text": "What is a bottom-up approach?",
        "options": ["Start from leadership", "Build from customer data and pricing", "Use industry reports", "Guess the number"],
        "correct_answer": 1,
        "explanation": "Bottom-up builds market size from specific customer data and pricing."
      },
      {
        "text": "What are Fermi problems?",
        "options": ["Math problems", "Estimation puzzles", "Coding challenges", "Legal questions"],
        "correct_answer": 1,
        "explanation": "Fermi problems are estimation puzzles that break complex problems into simpler parts."
      },
      {
        "text": "What is SAM?",
        "options": ["Smallest Addressable Market", "Serviceable Available Market", "Sales And Marketing", "Standard Analytical Model"],
        "correct_answer": 1,
        "explanation": "SAM (Serviceable Available Market) is the segment you can target."
      }
    ]
  }
}'::jsonb
WHERE id = '01961349-cb19-4f2f-881e-57a99568e0f6';

-- Report Quiz (1a094551-19c5-4352-afe8-e568d6b6e8c5)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Report Quiz",
  "description": "Test your reporting skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is the best way to present findings?",
        "options": ["Long document", "Clear structure with visuals", "Spreadsheet only", "Email chain"],
        "correct_answer": 1,
        "explanation": "Clear structure with visuals helps stakeholders understand quickly."
      },
      {
        "text": "What should you include in a status report?",
        "options": ["Everything", "Progress, blockers, next steps", "Only problems", "Random updates"],
        "correct_answer": 1,
        "explanation": "Status reports should cover progress, blockers, and next steps."
      },
      {
        "text": "How should you communicate bad news?",
        "options": ["Avoid it", "Early and with context", "Blame others", "Hide details"],
        "correct_answer": 1,
        "explanation": "Communicate bad news early with full context and proposed solutions."
      },
      {
        "text": "What is a RACI matrix?",
        "options": ["A chart type", "Responsible, Accountable, Consulted, Informed", "A pricing model", "A hiring tool"],
        "correct_answer": 1,
        "explanation": "RACI defines who is Responsible, Accountable, Consulted, and Informed."
      },
      {
        "text": "Why is storytelling important in presentations?",
        "options": ["Its not important", "Makes data memorable", "To show off", "To fill time"],
        "correct_answer": 1,
        "explanation": "Stories make data more memorable and engaging for stakeholders."
      }
    ]
  }
}'::jsonb
WHERE id = '1a094551-19c5-4352-afe8-e568d6b6e8c5';

-- STAR Assessment (25ff40d5-4cb3-4669-a17e-795a8d479acd)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "STAR Assessment",
  "description": "Test your behavioral interview skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What does STAR stand for?",
        "options": ["Start Today And Run", "Situation, Task, Action, Result", "Story, Theory, Answer, Review", "Strategy, Tactics, Actions, Results"],
        "correct_answer": 1,
        "explanation": "STAR = Situation, Task, Action, Result."
      },
      {
        "text": "In a STAR answer, what comes first?",
        "options": ["Action", "Situation", "Result", "Task"],
        "correct_answer": 1,
        "explanation": "Start with the Situation - set the context."
      },
      {
        "text": "What should you focus on in the Action step?",
        "options": ["What others did", "What YOU did specifically", "What went wrong", "Random details"],
        "correct_answer": 1,
        "explanation": "Focus on YOUR specific actions and contributions."
      },
      {
        "text": "How should you end a STAR story?",
        "options": ["And then I left", "With the Result and what you learned", "With criticism of others", "Without closure"],
        "correct_answer": 1,
        "explanation": "End with the Result and what you learned or achieved."
      },
      {
        "text": "How long should a STAR answer be?",
        "options": ["As long as possible", "2-3 minutes", "30 seconds", "One sentence"],
        "correct_answer": 1,
        "explanation": "A good STAR answer is typically 2-3 minutes."
      }
    ]
  }
}'::jsonb
WHERE id = '25ff40d5-4cb3-4669-a17e-795a8d479acd';

-- Hypothesis Quiz (9823f257-fd82-411c-b9d5-151b9ea18c06)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Hypothesis Quiz",
  "description": "Test your hypothesis skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is a hypothesis?",
        "options": ["A fact", "An educated guess to test", "A conclusion", "A question only"],
        "correct_answer": 1,
        "explanation": "A hypothesis is an educated guess that can be tested with data."
      },
      {
        "text": "What is the format of a good hypothesis?",
        "options": ["I think", "If X then Y because Z", "Maybe", "Always true"],
        "correct_answer": 1,
        "explanation": "If X then Y because Z format states the expected relationship."
      },
      {
        "text": "What is A/B testing?",
        "options": ["Testing two versions", "Alpha testing", "Only testing A", "Testing after launch"],
        "correct_answer": 0,
        "explanation": "A/B testing compares two versions to see which performs better."
      },
      {
        "text": "What is a null hypothesis?",
        "options": ["The hypothesis you want", "The hypothesis of no effect", "An invalid hypothesis", "The best hypothesis"],
        "correct_answer": 1,
        "explanation": "Null hypothesis states there is no effect - you test to disprove it."
      },
      {
        "text": "What is statistical significance?",
        "options": ["Any difference", "Likely not due to chance", "Small difference", "Large sample only"],
        "correct_answer": 1,
        "explanation": "Statistical significance means the result is likely not due to random chance."
      }
    ]
  }
}'::jsonb
WHERE id = '9823f257-fd82-411c-b9d5-151b9ea18c06';

-- System Design Quiz (260d82d0-c104-4e78-8dba-c2ddf797fcf6)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "System Design Quiz",
  "description": "Test your system design knowledge",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is horizontal scaling?",
        "options": ["Add more power to existing machine", "Add more machines", "Reduce features", "Use bigger database"],
        "correct_answer": 1,
        "explanation": "Horizontal scaling adds more machines to handle load."
      },
      {
        "text": "What is a load balancer?",
        "options": ["Weighing scale", "Distributes traffic across servers", "A database type", "A security tool"],
        "correct_answer": 1,
        "explanation": "Load balancer distributes traffic across multiple servers."
      },
      {
        "text": "What is caching?",
        "options": ["Saving money", "Storing frequently accessed data", "Deleting data", "Backup system"],
        "correct_answer": 1,
        "explanation": "Caching stores frequently accessed data for faster retrieval."
      },
      {
        "text": "What is API?",
        "options": ["A programming language", "Application Programming Interface", "A database", "A testing tool"],
        "correct_answer": 1,
        "explanation": "API (Application Programming Interface) allows applications to communicate."
      },
      {
        "text": "What is microservices architecture?",
        "options": ["One big application", "Small independent services", "A database design", "A testing method"],
        "correct_answer": 1,
        "explanation": "Microservices split an app into small, independent services."
      }
    ]
  }
}'::jsonb
WHERE id = '260d82d0-c104-4e78-8dba-c2ddf797fcf6';

-- Pricing Models: Pricing Quiz B (cf3870c4-88ac-456c-8580-27e516f24e4c)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Pricing Models Quiz",
  "description": "Test your pricing knowledge",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What is penetration pricing?",
        "options": ["Premium pricing", "Low initial price to gain market share", "Cost-plus pricing", "Random pricing"],
        "correct_answer": 1,
        "explanation": "Penetration pricing sets low prices initially to gain market share."
      },
      {
        "text": "What is skimming pricing?",
        "options": ["Low prices", "High initial prices for early adopters", "Cost-based pricing", "Discount pricing"],
        "correct_answer": 1,
        "explanation": "Skimming sets high initial prices targeting early adopters."
      },
      {
        "text": "What is subscription pricing?",
        "options": ["One-time payment", "Recurring payments over time", "Per-use pricing", "Free pricing"],
        "correct_answer": 1,
        "explanation": "Subscription pricing charges recurring fees over time."
      },
      {
        "text": "What is tiered pricing?",
        "options": ["Same price for all", "Different price levels for different features", "Random prices", "Cost-plus only"],
        "correct_answer": 1,
        "explanation": "Tiered pricing offers different price levels with different features."
      },
      {
        "text": "What is lifetime value LTV?",
        "options": ["Value of a customer over time", "One-time purchase", "Cost of acquisition", "Price of product"],
        "correct_answer": 0,
        "explanation": "LTV (Lifetime Value) is the total revenue expected from a customer over time."
      }
    ]
  }
}'::jsonb
WHERE id = 'cf3870c4-88ac-456c-8580-27e516f24e4c';

-- Fermi Quiz (6b263456-bfc4-42c9-b830-e63b696299bb)
UPDATE public.lessons 
SET content = '{
  "type": "quiz",
  "title": "Fermi Quiz",
  "description": "Test your estimation skills",
  "quiz_content": {
    "passing_score": 3,
    "questions": [
      {
        "text": "What are Fermi problems?",
        "options": ["Complex math equations", "Estimation puzzles with rough numbers", "Physics problems", "Programming challenges"],
        "correct_answer": 1,
        "explanation": "Fermi problems are estimation puzzles solved with rough calculations."
      },
      {
        "text": "How should you approach a Fermi problem?",
        "options": ["Look up exact numbers", "Break into smaller estimates", "Guess randomly", "Avoid the question"],
        "correct_answer": 1,
        "explanation": "Break complex problems into smaller, estimable components."
      },
      {
        "text": "What is guesstimation?",
        "options": ["Random guessing", "Educated estimation", "Exact calculation", "Professional estimation only"],
        "correct_answer": 1,
        "explanation": "Guesstimation uses logic and available data to make reasonable estimates."
      },
      {
        "text": "Why is sanity checking important?",
        "options": ["Its not important", "To catch major errors", "To be exact", "To impress others"],
        "correct_answer": 1,
        "explanation": "Sanity checking catches major errors in your estimates."
      },
      {
        "text": "What is bottom-up estimation?",
        "options": ["Start from leadership", "Build from individual components", "Use competitor data", "Guess the total"],
        "correct_answer": 1,
        "explanation": "Bottom-up builds estimates from individual components up to the total."
      }
    ]
  }
}'::jsonb
WHERE id = '6b263456-bfc4-42c9-b830-e63b696299bb';

-- User Segmentation Practice (88ffbc31-1a36-4bf0-982b-37698772db99) - Already upgraded
-- Pattern Practice (a00d1392-d84c-4e92-84bf-d50a18bbcf81) - Already upgraded
-- Clarifying the Problem (fb45df27-39e5-40f0-97a1-e35db5f9437d) - Already upgraded
-- API Design Practice (96cbff1d-f528-49e8-b499-340090592ab7) - Already upgraded

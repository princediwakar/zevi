-- Convert pattern lessons to quiz format with MCQs

-- Update "CIRCLES Framework: User Segmentation Practice" to quiz format
UPDATE public.lessons 
SET type = 'quiz',
    content = '{
  "type": "quiz",
  "title": "User Segmentation Quiz",
  "description": "Test your knowledge of user segmentation",
  "quiz_content": {
    "questions": [
      {
        "question": "What is the first step in user segmentation?",
        "options": ["Collecting payment info", "Identifying target users", "Building the product", "Launching marketing"],
        "correctAnswer": 1,
        "explanation": "The first step is identifying your target users before any other action."
      },
      {
        "question": "Which is NOT a common user segmentation criterion?",
        "options": ["Demographics", "Behavior", "Product color preference", "Psychographics"],
        "correctAnswer": 2,
        "explanation": "Product color preference is not a standard segmentation criterion."
      },
      {
        "question": "What does RFM segmentation stand for?",
        "options": ["Reach, Frequency, Marketing", "Recency, Frequency, Monetary", "Revenue, Fans, Metrics", "Retention, Funnel, Monetization"],
        "correctAnswer": 1,
        "explanation": "RFM stands for Recency, Frequency, Monetary value - a common behavioral segmentation approach."
      },
      {
        "question": "Which segment would be most valuable for a premium subscription service?",
        "options": ["Users who never log in", "High-engagement users willing to pay", "Users who only use free features", "Inactive accounts"],
        "correctAnswer": 1,
        "explanation": "High-engagement users willing to pay are most valuable for premium subscriptions."
      },
      {
        "question": "What is a user persona?",
        "options": ["A real customer", "A fictional representation of a user segment", "The product designer", "A marketing campaign"],
        "correctAnswer": 1,
        "explanation": "A persona is a fictional representation of a typical user in a segment."
      }
    ]
  }
}'::jsonb
WHERE id = '7f1a9906-6e28-4ea2-9936-6f4d2e0f72f2';

-- Update "Clarifying the Problem: Defining Success Metrics A" to quiz format
UPDATE public.lessons 
SET type = 'quiz',
    content = '{
  "type": "quiz",
  "title": "Success Metrics Quiz",
  "description": "Test your knowledge of defining success metrics",
  "quiz_content": {
    "questions": [
      {
        "question": "What does the HEART framework stand for?",
        "options": ["Heart, Energy, Action, Results, Time", "Happiness, Engagement, Adoption, Retention, Task Success", "Help, Evaluate, Analyze, Report, Test", "Health, Efficiency, Accuracy, Revenue, Trends"],
        "correctAnswer": 1,
        "explanation": "HEART stands for Happiness, Engagement, Adoption, Retention, Task Success."
      },
      {
        "question": "Which metric is best for measuring user engagement?",
        "options": ["Total registered users", "Daily active users / Monthly active users", "Number of emails sent", "Server uptime"],
        "correctAnswer": 1,
        "explanation": "DAU/MAU ratio is the standard metric for measuring user engagement."
      },
      {
        "question": "What is a leading indicator?",
        "options": ["A metric that shows results after they happen", "A predictive metric that signals future outcomes", "The final quarterly report", "Historical data only"],
        "correctAnswer": 1,
        "explanation": "Leading indicators predict future outcomes, helping you make proactive decisions."
      },
      {
        "question": "Why is it important to have a baseline metric?",
        "options": ["It looks professional", "To compare against and measure improvement or decline", "It is required by law", "Baseline metrics are not important"],
        "correctAnswer": 1,
        "explanation": "Baselines allow you to measure the impact of changes and track progress over time."
      },
      {
        "question": "What is cohort analysis?",
        "options": ["Analyzing group fitness data", "Comparing behavior across user groups over time", "Marketing to seniors", "A type of survey"],
        "correctAnswer": 1,
        "explanation": "Cohort analysis compares behavior across different user groups segmented by time or characteristics."
      }
    ]
  }
}'::jsonb
WHERE id = 'fb45df27-39e5-40f0-97a1-e35db5f9437d';

-- Update "User Segmentation Practice" to quiz format
UPDATE public.lessons 
SET type = 'quiz',
    content = '{
  "type": "quiz",
  "title": "User Segments Quiz",
  "description": "Test your knowledge of identifying user segments",
  "quiz_content": {
    "questions": [
      {
        "question": "Which is a behavioral segmentation example?",
        "options": ["Age group", "Purchase frequency", "Location", "Gender"],
        "correctAnswer": 1,
        "explanation": "Purchase frequency is a behavioral metric - it tracks user actions."
      },
      {
        "question": "What is the chicken-and-egg problem in marketplaces?",
        "options": ["A breakfast dilemma", "Need for both buyers and sellers to platform to work", "Too many notifications", "Server crashes"],
        "correctAnswer": 1,
        "explanation": "The chicken-and-egg problem is when you need both sides of a marketplace to exist simultaneously."
      },
      {
        "question": "What is the two-sided market?",
        "options": ["A physical marketplace with two floors", "A platform connecting two distinct user groups", "A budget option", "A type of advertisement"],
        "correctAnswer": 1,
        "explanation": "A two-sided market connects two distinct groups - like buyers and sellers."
      },
      {
        "question": "Which comes first in product development?",
        "options": ["Building features", "Understanding user needs", "Hiring developers", "Launching marketing"],
        "correctAnswer": 1,
        "explanation": "Understanding user needs comes first - without this, you cannot build the right product."
      },
      {
        "question": "What is market segmentation?",
        "options": ["Dividing a pizza", "Dividing a market into distinct groups of buyers", "Selecting stock options", "Planning a market day"],
        "correctAnswer": 1,
        "explanation": "Market segmentation divides a market into distinct groups with similar needs or characteristics."
      }
    ]
  }
}'::jsonb
WHERE id = '88ffbc31-1a36-4bf0-982b-37698772db99';

-- Update "API Design Practice" to quiz format
UPDATE public.lessons 
SET type = 'quiz',
    content = '{
  "type": "quiz",
  "title": "API Design Quiz",
  "description": "Test your knowledge of API design patterns",
  "quiz_content": {
    "questions": [
      {
        "question": "Which HTTP method is used to update an existing resource?",
        "options": ["GET", "POST", "PUT", "DELETE"],
        "correctAnswer": 2,
        "explanation": "PUT is used to update existing resources. POST is for creating new ones."
      },
      {
        "question": "What does REST stand for?",
        "options": ["Real Estate State Transfer", "Representational State Transfer", "Resource State Transfer", "Remote Execution Standard Transfer"],
        "correctAnswer": 1,
        "explanation": "REST stands for Representational State Transfer."
      },
      {
        "question": "What is pagination used for in APIs?",
        "options": ["Decorating responses", "Breaking large results into manageable chunks", "Sorting data", "Encrypting data"],
        "correctAnswer": 1,
        "explanation": "Pagination breaks large result sets into pages to improve performance."
      },
      {
        "question": "What status code indicates a successful request?",
        "options": ["404", "500", "200", "301"],
        "correctAnswer": 2,
        "explanation": "200 OK indicates a successful request. 404 is not found, 500 is server error."
      },
      {
        "question": "What is an API endpoint?",
        "options": ["The API developer office", "A specific URL where resources can be accessed", "A type of error", "A database"],
        "correctAnswer": 1,
        "explanation": "An endpoint is a specific URL path where clients can access API resources."
      }
    ]
  }
}'::jsonb
WHERE id = '96cbff1d-f528-49e8-b499-340090592ab7';

-- Update "Pattern Practice" to quiz format
UPDATE public.lessons 
SET type = 'quiz',
    content = '{
  "type": "quiz",
  "title": "Design Patterns Quiz",
  "description": "Test your knowledge of product design patterns",
  "quiz_content": {
    "questions": [
      {
        "question": "What is a design pattern in product management?",
        "options": ["A specific color scheme", "A repeatable solution to common problems", "A type of font", "A marketing strategy"],
        "correctAnswer": 1,
        "explanation": "Design patterns are repeatable solutions to common product challenges."
      },
      {
        "question": "What is the first step in the CIRCLES method?",
        "options": ["Cut", "List", "Comprehend", "Summarize"],
        "correctAnswer": 2,
        "explanation": "CIRCLES starts with Comprehend - understanding the problem first."
      },
      {
        "question": "What does RICE stand for in prioritization?",
        "options": ["Rapid, Important, Critical, Essential", "Reach, Impact, Confidence, Effort", "Revenue, Income, Cost, Expense", "Risk, Innovation, Creativity, Execution"],
        "correctAnswer": 1,
        "explanation": "RICE = Reach × Impact × Confidence ÷ Effort for prioritization scoring."
      },
      {
        "question": "What is a proxy metric?",
        "options": ["A fake metric", "An indirect measure that correlates with a desired outcome", "A metric for proxies only", "An illegal metric"],
        "correctAnswer": 1,
        "explanation": "Proxy metrics indirectly measure something hard to measure directly."
      },
      {
        "question": "What is the difference between LAU and DAU?",
        "options": ["There is no difference", "LAU is daily, DAU is weekly", "LAU is Monthly Active Users, DAU is Daily Active Users", "They measure server load"],
        "correctAnswer": 2,
        "explanation": "DAU = Daily Active Users, MAU = Monthly Active Users."
      }
    ]
  }
}'::jsonb
WHERE id = 'a00d1392-d84c-4e92-84bf-d50a18bbcf81';

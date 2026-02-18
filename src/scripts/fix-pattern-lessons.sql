-- Fix pattern lessons content

-- Update "CIRCLES Framework: User Segmentation Practice"
UPDATE public.lessons 
SET content = '{
  "type": "pattern",
  "title": "User Segmentation Practice",
  "description": "Practice user segmentation in product design",
  "pattern_name": "User Segmentation",
  "template": [
    "Identify target users",
    "Define user personas", 
    "Analyze user needs",
    "Prioritize segments",
    "Map to product opportunities"
  ],
  "questions": [
    {
      "text": "How would you segment users for a food delivery app?",
      "hints": ["Consider demographics", "Think about usage frequency", "Consider ordering preferences"]
    },
    {
      "text": "What are the key user segments for a fitness tracking app?",
      "hints": ["Consider fitness goals", "Think about experience levels", "Consider device usage"]
    }
  ]
}::jsonb'
WHERE id = '7f1a9906-6e28-4ea2-9936-6f4d2e0f72f2';

-- Update "Clarifying the Problem: Defining Success Metrics A"
UPDATE public.lessons 
SET content = '{
  "type": "pattern",
  "title": "Defining Success Metrics",
  "description": "Learn to define meaningful success metrics",
  "pattern_name": "Success Metrics",
  "template": [
    "Define the goal",
    "Identify key outcomes", 
    "Choose measurable metrics",
    "Set baseline",
    "Plan tracking"
  ],
  "questions": [
    {
      "text": "How would you define success metrics for a new feature launch?",
      "hints": ["Consider user engagement", "Think about business goals", "Consider technical metrics"]
    }
  ]
}::jsonb'
WHERE id = 'fb45df27-39e5-40f0-97a1-e35db5f9437d';

-- Update "User Segmentation Practice"
UPDATE public.lessons 
SET content = '{
  "type": "pattern",
  "title": "User Segmentation",
  "description": "Practice identifying user segments",
  "pattern_name": "User Segments",
  "template": [
    "Identify core segments",
    "Define segment characteristics", 
    "Analyze segment needs",
    "Prioritize segments",
    "Map to product opportunities"
  ],
  "questions": [
    {
      "text": "What are the key user segments for a fitness tracking app?",
      "hints": ["Consider fitness goals", "Think about experience levels", "Consider device usage"]
    }
  ]
}::jsonb'
WHERE id = '88ffbc31-1a36-4bf0-982b-37698772db99';

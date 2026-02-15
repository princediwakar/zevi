require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
                    process.env.SUPABASE_SECRET_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase configuration.');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or EXPO_PUBLIC_SUPABASE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// MCQ templates by category
const mcqTemplates = {
  product_sense: {
    enabled: true,
    sub_questions: [
      {
        prompt: 'What is the most important factor when designing for the target user?',
        options: [
          { text: 'Understanding user pain points', correct: true, explanation: 'User pain points drive solution design' },
          { text: 'Technical feasibility', correct: false, explanation: 'Technical comes after understanding the user' },
          { text: 'Competition analysis', correct: false, explanation: 'Competition matters but user first' },
          { text: 'Budget constraints', correct: false, explanation: 'Budget is a constraint, not the starting point' }
        ],
        difficulty: 'beginner'
      }
    ]
  },
  
  execution: {
    enabled: true,
    sub_questions: [
      {
        prompt: 'What is the first step when analyzing a metric drop?',
        options: [
          { text: 'Check for data quality issues', correct: true, explanation: 'Always verify data accuracy first' },
          { text: 'Ask stakeholders for opinions', correct: false, explanation: 'Data first, then opinions' },
          { text: 'Launch a fix immediately', correct: false, explanation: 'Need diagnosis before fixing' },
          { text: 'Check competitor activity', correct: false, explanation: 'Internal analysis comes first' }
        ],
        difficulty: 'beginner'
      }
    ]
  },
  
  strategy: {
    enabled: true,
    sub_questions: [
      {
        prompt: 'What should be analyzed first in a strategy question?',
        options: [
          { text: 'Stakeholder needs and incentives', correct: true, explanation: 'Understanding stakeholders is foundational' },
          { text: 'Competitor products', correct: false, explanation: 'Competitors matter but stakeholders first' },
          { text: 'Technical capabilities', correct: false, explanation: 'Strategy is about business, not tech' },
          { text: 'Market size', correct: false, explanation: 'Market size is important but secondary' }
        ],
        difficulty: 'intermediate'
      }
    ]
  },
  
  estimation: {
    enabled: true,
    sub_questions: [
      {
        prompt: 'What is most important in an estimation question?',
        options: [
          { text: 'Clear assumptions and reasoning', correct: true, explanation: 'Interviewers value the thinking process' },
          { text: 'Exact final number', correct: false, explanation: 'Number is less important than logic' },
          { text: 'Complex math', correct: false, explanation: 'Keep calculations simple and clear' },
          { text: 'Using famous frameworks', correct: false, explanation: 'Frameworks help but are not required' }
        ],
        difficulty: 'beginner'
      }
    ]
  },
  
  behavioral: {
    enabled: true,
    sub_questions: [
      {
        prompt: 'In a STAR answer, what should you focus on most?',
        options: [
          { text: 'Your specific actions', correct: true, explanation: 'Interviewers want to know what YOU did' },
          { text: 'What the team did', correct: false, explanation: 'Focus on your individual contribution' },
          { text: 'The managers decisions', correct: false, explanation: 'This is about your actions' },
          { text: 'What went wrong', correct: false, explanation: 'Focus on positive actions and results' }
        ],
        difficulty: 'beginner'
      }
    ]
  }
};

async function addMCQ() {
  console.log('Adding MCQ sub-questions to all applicable questions...\n');
  
  // Get all questions
  const { data: questions } = await supabase
    .from('questions')
    .select('id, category, mcq_version');
  
  let updated = 0;
  let skipped = 0;
  
  for (const q of questions) {
    // Only add if no existing MCQ
    if (!q.mcq_version || !q.mcq_version.enabled) {
      const template = mcqTemplates[q.category];
      if (template) {
        await supabase
          .from('questions')
          .update({ mcq_version: template })
          .eq('id', q.id);
        updated++;
      } else {
        skipped++;
      }
    }
  }
  
  console.log('Updated:', updated);
  console.log('Skipped:', skipped);
  console.log('Done!');
}

addMCQ().catch(console.error);

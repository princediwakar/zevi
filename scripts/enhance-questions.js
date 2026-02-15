// Script to enhance questions with experience level targeting
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_API_KEY || 'YOUR_SUPABASE_SECRET_API_KEY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// Question strategy by experience level:
// - new_grad/career_switcher (APM track): Beginner + some Intermediate questions
// - current_pm (PM track): Intermediate + some Advanced
// - spm (SPM track): Advanced + complex Intermediate

const questionUpdates = [
  // Product Sense - Beginner (APM track)
  {
    pattern: 'Design a better umbrella',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Design a bookshelf for children',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Improve the experience of visiting a museum',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Design a remote control for Apple TV',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  // Product Sense - Intermediate (PM track)
  {
    pattern: 'Design a product for finding roommates',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Design an alarm clock for deaf',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Critique the Spotify app',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Design a bicycle for the mass market',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Improve Gmail',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  // Product Sense - Advanced (SPM track)
  {
    pattern: 'Design a unified messaging inbox',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  {
    pattern: 'Design a kitchen for the blind',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  // Strategy - Beginner
  {
    pattern: 'Maximize revenue for a movie theater',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  // Strategy - Intermediate (PM track)
  {
    pattern: 'Should Twitter launch a subscription',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  // Strategy - Advanced (SPM track)
  {
    pattern: 'Should Netflix add live sports',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  {
    pattern: 'Should Amazon buy a grocery',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  {
    pattern: 'Should Facebook acquire Discord',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  // Execution - Beginner
  {
    pattern: 'Key metrics for a dating app',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  // Execution - Intermediate (PM track)
  {
    pattern: 'What success metrics would you set for Uber Pool',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'How would you reduce cancellations for Uber',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'How to measure success of reaction buttons',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  // Execution - Advanced (SPM track)
  {
    pattern: 'Facebook events usage is down 10%',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  {
    pattern: 'Decrease churn for a SaaS platform',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  {
    pattern: 'Metric for YouTube Recommendations',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  // Estimation - Beginner (APM track)
  {
    pattern: 'Estimate daily flights from ATL',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Estimate the market size for dog walking',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Estimate revenue of a corner store',
    target_levels: ['new_grad', 'career_switcher', 'apm'],
    difficulty_hint: 'beginner'
  },
  // Estimation - Intermediate (PM track)
  {
    pattern: 'How many elevators are in NYC',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Estimate how many golf balls',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Estimate number of windows in Seattle',
    target_levels: ['pm', 'current_pm'],
    difficulty_hint: 'intermediate'
  },
  // Estimation - Advanced (SPM track)
  {
    pattern: 'Estimate the bandwidth used by TikTok',
    target_levels: ['spm', 'senior_pm'],
    difficulty_hint: 'advanced'
  },
  // Behavioral - All levels
  {
    pattern: 'Tell me about a time you led a team',
    target_levels: ['new_grad', 'career_switcher', 'pm', 'current_pm', 'spm', 'senior_pm', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Tell me about a time you had a conflict',
    target_levels: ['new_grad', 'career_switcher', 'pm', 'current_pm', 'spm', 'senior_pm', 'apm'],
    difficulty_hint: 'beginner'
  },
  {
    pattern: 'Tell me about a mistake you made',
    target_levels: ['pm', 'current_pm', 'spm', 'senior_pm'],
    difficulty_hint: 'intermediate'
  },
  {
    pattern: 'Tell me about a time you failed',
    target_levels: ['pm', 'current_pm', 'spm', 'senior_pm'],
    difficulty_hint: 'intermediate'
  },
];

async function enhanceQuestions() {
  console.log('🎯 Enhancing questions with experience level targeting...\n');

  let updated = 0;
  
  for (const update of questionUpdates) {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, question_text')
      .ilike('question_text', `%${update.pattern}%`);

    if (error) {
      console.error('Error finding:', update.pattern, error);
      continue;
    }

    for (const q of questions) {
      const { error: updateError } = await supabase
        .from('questions')
        .update({ 
          target_levels: update.target_levels,
          difficulty_hint: update.difficulty_hint
        })
        .eq('id', q.id);

      if (!updateError) {
        console.log(`✅ Updated: ${q.question_text.substring(0, 40)}... -> ${update.difficulty_hint}`);
        updated++;
      }
    }
  }

  console.log(`\n🎉 Enhanced ${updated} questions!`);
}

enhanceQuestions();

// Script to add comprehensive questions for ALL 8 interview patterns
// Each pattern needs 15-20 questions for mastery

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// 8 Interview Patterns, each needing 15-20 questions
const allPatternQuestions = [
  // === PATTERN 1: Design X for Y (15 questions) ===
  { pattern: 'design_x_for_y', questions: [
    { q: "Design a mobile banking app for Gen Z.", d: "intermediate" },
    { q: "Design a food delivery app for elderly users.", d: "intermediate" },
    { q: "Design a pet care marketplace.", d: "beginner" },
    { q: "Design a home energy management system.", d: "advanced" },
    { q: "Design a language learning app for kids.", d: "intermediate" },
    { q: "Design a mental health support app.", d: "advanced" },
    { q: "Design a personal finance app for teenagers.", d: "intermediate" },
    { q: "Design a car sharing service for urban areas.", d: "intermediate" },
    { q: "Design a telemedicine platform for rural areas.", d: "advanced" },
    { q: "Design a wedding planning app.", d: "beginner" },
    { q: "Design a fitness app for seniors.", d: "intermediate" },
    { q: "Design a local marketplace for artisans.", d: "beginner" },
    { q: "Design a job matching platform for remote work.", d: "intermediate" },
    { q: "Design a personal concierge service.", d: "advanced" },
    { q: "Design a car maintenance reminder app.", d: "beginner" },
  ]},
  
  // === PATTERN 2: Improve X (15 questions) ===
  { pattern: 'improve_x', questions: [
    { q: "How would you improve Amazon's checkout flow?", d: "intermediate" },
    { q: "Improve Instagram's Reels feature.", d: "intermediate" },
    { q: "How would you improve LinkedIn's job search?", d: "advanced" },
    { q: "Improve Airbnb's host experience.", d: "intermediate" },
    { q: "Enhance Spotify's podcast discovery.", d: "advanced" },
    { q: "Improve Google Calendar's scheduling.", d: "intermediate" },
    { q: "Enhance iPhone's Photos app.", d: "beginner" },
    { q: "Improve DoorDash's restaurant dashboard.", d: "intermediate" },
    { q: "Enhance Netflix's recommendation engine.", d: "advanced" },
    { q: "Improve Slack's search functionality.", d: "advanced" },
    { q: "Enhance YouTube's monetization for creators.", d: "advanced" },
    { q: "Improve Tinder's matching algorithm.", d: "intermediate" },
    { q: "Enhance Notion's team collaboration.", d: "intermediate" },
    { q: "Improve Zoom's mobile experience.", d: "beginner" },
    { q: "Enhance Apple's Maps app.", d: "intermediate" },
  ]},
  
  // === PATTERN 3: Metric Dropped / Investigate (15 questions) ===
  { pattern: 'investigate_drop', questions: [
    { q: "LinkedIn's connection requests dropped 20%. Diagnose.", d: "advanced" },
    { q: "Spotify's premium conversion rate is down 15%. Why?", d: "advanced" },
    { q: "Airbnb bookings from mobile dropped. Investigate.", d: "advanced" },
    { q: "Instagram Stories views declined 10%. Why?", d: "advanced" },
    { q: "Uber Eats average order value dropped. Diagnose.", d: "intermediate" },
    { q: "Netflix watch time is declining. Investigate.", d: "advanced" },
    { q: "Slack's daily active teams dropped. Why?", d: "advanced" },
    { q: "DoorDash's new driver signups slowed. Diagnose.", d: "intermediate" },
    { q: "Google Maps usage is down. Investigate.", d: "intermediate" },
    { q: "Apple's App Store reviews are down. Why?", d: "advanced" },
    { q: "Facebook Marketplace engagement dropped. Diagnose.", d: "advanced" },
    { q: "Zoom's enterprise customer retention declined.", d: "advanced" },
    { q: "Dropbox's team collaboration usage is down.", d: "intermediate" },
    { q: "Grubhub's repeat customer rate dropped.", d: "intermediate" },
    { q: "Pinterest's user session time declined.", d: "advanced" },
  ]},
  
  // === PATTERN 4: Metrics for X (15 questions) ===
  { pattern: 'metrics_for_x', questions: [
    { q: "What metrics would you track for a new dating feature?", d: "intermediate" },
    { q: "Define success metrics for a gaming feature.", d: "intermediate" },
    { q: "What metrics matter for a social news feature?", d: "advanced" },
    { q: "Key metrics for a subscription box product.", d: "intermediate" },
    { q: "Success metrics for a B2B marketplace.", d: "advanced" },
    { q: "What would you track for a new search feature?", d: "beginner" },
    { q: "Metrics for a freemium product.", d: "advanced" },
    { q: "Key metrics for a marketplace escrow feature.", d: "intermediate" },
    { q: "Success metrics for an AI recommendation feature.", d: "advanced" },
    { q: "What to track for a new checkout experience?", d: "intermediate" },
    { q: "Metrics for a community features rollout.", d: "advanced" },
    { q: "Success metrics for an API product.", d: "advanced" },
    { q: "Key metrics for an enterprise SSO feature.", d: "advanced" },
    { q: "What metrics for a notifications redesign?", d: "beginner" },
    { q: "Metrics for a new onboarding flow.", d: "intermediate" },
  ]},
  
  // === PATTERN 5: Strategy / Should X (15 questions) ===
  { pattern: 'strategy', questions: [
    { q: "Should Slack add video calling?", d: "intermediate" },
    { q: "Should Amazon launch a music streaming service?", d: "advanced" },
    { q: "Should Uber add restaurant reservations?", d: "intermediate" },
    { q: "Should Meta launch a LinkedIn competitor?", d: "advanced" },
    { q: "Should Spotify add video content?", d: "intermediate" },
    { q: "Should Apple launch a social network?", d: "advanced" },
    { q: "Should Google charge for YouTube?", d: "advanced" },
    { q: "Should Airbnb add flights?", d: "intermediate" },
    { q: "Should Netflix add gaming?", d: "advanced" },
    { q: "Should WhatsApp add Stories?", d: "intermediate" },
    { q: "Should Salesforce acquire Slack?", d: "advanced" },
    { q: "Should Uber become a logistics platform?", d: "advanced" },
    { q: "Should Shopify add fulfillment?", d: "advanced" },
    { q: "Should DoorDash add grocery delivery?", d: "intermediate" },
    { q: "Should Spotify acquire a podcast network?", d: "advanced" },
  ]},
  
  // === PATTERN 6: Behavioral STAR (already have some, add more) ===
  { pattern: 'behavioral_star', questions: [
    { q: "Tell me about a time you influenced without authority.", d: "intermediate" },
    { q: "Describe a time you dealt with ambiguity.", d: "intermediate" },
    { q: "Tell me about a time you failed and what you learned.", d: "intermediate" },
    { q: "Describe a time you had a conflict with your manager.", d: "intermediate" },
    { q: "Tell me about a time you exceeded expectations.", d: "beginner" },
    { q: "Describe a time you had to deliver bad news.", d: "intermediate" },
    { q: "Tell me about a time you changed someone's mind.", d: "intermediate" },
    { q: "Describe a time you took a risk.", d: "intermediate" },
    { q: "Tell me about a time you mentored someone.", d: "beginner" },
    { q: "Describe a time you handled a crisis.", d: "advanced" },
    { q: "Tell me about a time you disagreed with data.", d: "intermediate" },
    { q: "Describe a time you built something from scratch.", d: "intermediate" },
    { q: "Tell me about a time you prioritized customer over company.", d: "advanced" },
    { q: "Describe a time you made a decision with incomplete info.", d: "intermediate" },
    { q: "Tell me about a time you went above and beyond.", d: "beginner" },
  ]},
  
  // === PATTERN 7: Estimation (add more) ===
  { pattern: 'estimation', questions: [
    { q: "Estimate the market for electric vehicle charging stations in the US.", d: "intermediate" },
    { q: "How many婚礼 weddings happen in India annually?", d: "intermediate" },
    { q: "Estimate the revenue of a popular coffee shop chain.", d: "beginner" },
    { q: "How many Uber rides happen in NYC daily?", d: "intermediate" },
    { q: "Estimate the TAM for meditation apps.", d: "intermediate" },
    { q: "How many Airbnb listings in Paris?", d: "intermediate" },
    { q: "Estimate daily active users of TikTok in the US.", d: "intermediate" },
    { q: "How many dental offices are in the US?", d: "beginner" },
    { q: "Estimate the market for pet insurance.", d: "intermediate" },
    { q: "How many apps does the average person have?", d: "beginner" },
    { q: "Estimate the addressable market for meal kits.", d: "intermediate" },
    { q: "How many parking spots in Manhattan?", d: "intermediate" },
    { q: "Estimate LinkedIn's annual revenue.", d: "advanced" },
    { q: "How many Uber Eats deliveries daily worldwide?", d: "intermediate" },
    { q: "Estimate the market for sleep tracking apps.", d: "intermediate" },
  ]},
  
  // === PATTERN 8: Prioritization ===
  { pattern: 'prioritize', questions: [
    { q: "Prioritize: new feature, tech debt, or bug fixes with limited resources.", d: "intermediate" },
    { q: "You have 3 equally important projects. How do you sequence?", d: "intermediate" },
    { q: "Engineering says 6 months, sales needs it in 2. Prioritize?", d: "advanced" },
    { q: "Data shows 3 potential improvements. Which first?", d: "intermediate" },
    { q: "Stakeholders want 10 features. You can ship 3. Prioritize?", d: "intermediate" },
    { q: "Mobile app vs web. Limited resources. Which first?", d: "beginner" },
    { q: "Customer request vs internal tool. Prioritize?", d: "intermediate" },
    { q: "Security fix vs new feature vs tech debt. Sequence?", d: "advanced" },
    { q: "Performance improvement vs new UI. What first?", d: "intermediate" },
    { q: "Three CEO priorities conflict. How to decide?", d: "advanced" },
    { q: "Short-term wins vs long-term investment. Prioritize?", d: "advanced" },
    { q: "Mobile-first vs desktop-first for startup. Decision?", d: "intermediate" },
    { q: "Refactor vs new features vs documentation. Prioritize?", d: "intermediate" },
    { q: "User research vs metrics-driven vs stakeholder input. What first?", d: "advanced" },
    { q: "Retention focus vs acquisition. Where to invest?", d: "advanced" },
  ]},
];

async function addAllPatternQuestions() {
  console.log('➕ Adding comprehensive questions for all 8 patterns...\n');
  
  let totalAdded = 0;
  
  for (const patternGroup of allPatternQuestions) {
    const questions = patternGroup.questions.map(item => ({
      question_text: item.q,
      category: getCategoryForPattern(patternGroup.pattern),
      difficulty: item.d,
      company: "General",
      interview_type: "video",
      pattern_type: patternGroup.pattern,
      expert_answer: getExpertAnswerHint(patternGroup.pattern),
    }));
    
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();
    
    if (error) {
      console.error(`Error adding ${patternGroup.pattern}:`, error.message);
    } else {
      console.log(`✅ Added ${data.length} questions for ${patternGroup.pattern}`);
      totalAdded += data.length;
    }
  }
  
  console.log(`\n🎉 Total added: ${totalAdded} questions!`);
}

function getCategoryForPattern(pattern) {
  const mapping = {
    'design_x_for_y': 'product_sense',
    'improve_x': 'product_sense',
    'investigate_drop': 'execution',
    'metrics_for_x': 'execution',
    'strategy': 'strategy',
    'behavioral_star': 'behavioral',
    'estimation': 'estimation',
    'prioritize': 'execution',
  };
  return mapping[pattern] || 'product_sense';
}

function getExpertAnswerHint(pattern) {
  const hints = {
    'design_x_for_y': 'Use CIRCLES framework: Clarify, Identify users, Report needs, Cut through, List solutions, Evaluate, Summarize',
    'improve_x': 'Start with problem identification, then propose solutions with metrics',
    'investigate_drop': 'Segment, analyze, hypothesize, iterate',
    'metrics_for_x': 'Define north star, supporting metrics, leading indicators',
    'strategy': 'Pros/Cons analysis with clear recommendation',
    'behavioral_star': 'STAR method: Situation, Task, Action, Result',
    'estimation': 'Top-down or bottom-up approach with clear assumptions',
    'prioritize': 'RICE scoring or impact/effort matrix',
  };
  return hints[pattern] || 'Use structured framework';
}

addAllPatternQuestions();

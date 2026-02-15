// Script to add GPM/VP level questions
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const gpmQuestions = [
  // GPM/VP Level - Strategy & Leadership
  {
    question_text: "How do you prioritize across multiple product lines with limited resources?",
    category: "execution",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "prioritize",
    expert_answer: "1) Align with company OKRs 2) Assess market opportunity 3) Evaluate dependencies 4) Consider team capacity 5) Balance short-term vs long-term"
  },
  {
    question_text: "Your CEO asks you to cut 30% of your product roadmap. How do you respond?",
    category: "strategy",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "1) Understand the why - financial constraints? strategic shift? 2) Present data on impact of cuts 3) Propose phased approach 4) Identify minimum viable set 5) Plan for recovery"
  },
  {
    question_text: "How do you decide whether to build vs buy vs partner for a capability?",
    category: "strategy",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "Build: core differentiator, long-term advantage. Buy: speed to market, non-core. Partner: ecosystem play, mutual benefit. Consider: cost, time, talent, strategic control."
  },
  {
    question_text: "How would you restructure a product organization for better innovation?",
    category: "execution",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "1) Assess current pain points 2) Consider product architecture 3) Balance autonomy vs coordination 4) Define clear ownership 5) Measure innovation output"
  },
  {
    question_text: "Your flagship product is losing market share. What's your action plan?",
    category: "execution",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "investigate_drop",
    expert_answer: "1) Deep-dive analytics - who is leaving? 2) Competitive analysis 3) User research 4) Product audit 5) Quick wins vs long-term fixes 6) Organizational alignment"
  },
  {
    question_text: "How do you drive alignment across multiple PM teams on conflicting priorities?",
    category: "behavioral",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - 3 teams fighting for same resources. Task - align on priorities. Action - created shared OKRs, facilitated working sessions, established decision framework. Result - unified roadmap, teams collaborated."
  },
  {
    question_text: "Tell me about a time you had to advocate for a long-term investment over short-term gains.",
    category: "behavioral",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - pressure for quick wins. Task - secure platform investment. Action - built business case, showed technical debt cost, proposed phased approach. Result - approved, platform became differentiator."
  },
  {
    question_text: "How do you mentor and develop a team of Product Managers?",
    category: "behavioral",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "1) Regular 1:1s with growth focus 2) Skill assessments 3) Stretch assignments 4) Peer learning sessions 5) Career framework 6) Lead by example"
  },
  {
    question_text: "Design a strategy for entering the Indian market for a B2B SaaS product.",
    category: "strategy",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "1) Market sizing - TAM/SAM/SOM 2) Regulatory considerations 3) Competitive landscape 4) Localization needs 5) Pricing strategy 6) GTM approach 7) Build vs partner"
  },
  {
    question_text: "How would you evaluate whether to pivot your product strategy?",
    category: "strategy",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "1) Signal analysis - market, user, competitive 2) Financial viability 3) Team capability fit 4) Stakeholder alignment 5) Exit strategy 6) Phased approach to test"
  },
];

async function addGPMQuestions() {
  console.log('➕ Adding GPM/VP level questions...\n');

  const { data, error } = await supabase
    .from('questions')
    .insert(gpmQuestions)
    .select();

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`✅ Added ${data.length} GPM-level questions!`);
}

addGPMQuestions();

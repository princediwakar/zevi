// Script to add more questions to fill gaps
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const newQuestions = [
  // Behavioral Questions - Critical for PM interviews
  {
    question_text: "Tell me about a time you had to influence stakeholders without authority.",
    category: "behavioral",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - needed design help from another team. Task - get UX resources. Action - built relationship, showed data, aligned incentives. Result - got support, launched successfully."
  },
  {
    question_text: "Describe a time you navigated ambiguity in a project.",
    category: "behavioral",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - unclear requirements. Task - deliver on time. Action - gathered requirements from multiple sources, made assumptions explicit, iterated. Result - launched successfully with stakeholder buy-in."
  },
  {
    question_text: "Tell me about a time you dealt with a difficult customer.",
    category: "behavioral",
    difficulty: "beginner",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - angry customer complaining about feature. Task - resolve issue. Action - listened actively, empathized, found solution. Result - customer became advocate."
  },
  {
    question_text: "Describe a time you had to say no to a stakeholder request.",
    category: "behavioral",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - sales wanted a feature. Task - balance requests. Action - data-driven analysis, explained trade-offs, proposed alternative. Result - stakeholder understood, feature deferred."
  },
  {
    question_text: "Tell me about a time you improved a process.",
    category: "behavioral",
    difficulty: "beginner",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - slow sprint planning. Task - improve efficiency. Action - analyzed bottlenecks, implemented stand-up changes. Result - 30% faster planning."
  },
  {
    question_text: "Describe a time you launched a product in a tight deadline.",
    category: "behavioral",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - competitor launched first. Task - catch up. Action - prioritized ruthlessly, cut scope, daily check-ins. Result - launched on time, got initial traction."
  },
  {
    question_text: "Tell me about a time you had to work with limited data.",
    category: "behavioral",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "behavioral_star",
    expert_answer: "STAR: Situation - needed to decide without metrics. Task - make decision. Action - qualitative research, proxy metrics, assumed a/b test. Result - launched, validated with data."
  },
  // More Execution Questions
  {
    question_text: "How would you improve the onboarding conversion rate?",
    category: "execution",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "metrics_for_x",
    expert_answer: "1) Define conversion funnel 2) Segment by traffic source 3) Identify drop-off points 4) A/B test improvements 5) Measure impact"
  },
  {
    question_text: "Your DAU dropped 5% this week. How do you diagnose it?",
    category: "execution",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "investigate_drop",
    expert_answer: "1) Check data quality 2) Segment by platform/region 3) Check for releases/changes 4) Analyze cohort behavior 5) Compare to seasonality"
  },
  {
    question_text: "How do you prioritize technical debt vs new features?",
    category: "execution",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "prioritize",
    expert_answer: "Use RICE: Reach, Impact, Confidence, Effort. Technical debt often has high reach but unclear impact. Quantify opportunity cost of delayed features."
  },
  // More Strategy Questions  
  {
    question_text: "Should a weather app add social features?",
    category: "strategy",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "Pros: engagement, network effects. Cons: complexity, privacy concerns. Recommendation: test with small group first, measure engagement lift vs complexity."
  },
  {
    question_text: "How would you decide to enter a new market?",
    category: "strategy",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "strategy",
    expert_answer: "1) TAM/SAM/SOM analysis 2) Competitive landscape 3) Regulatory considerations 4) Resource requirements 5) Strategic fit"
  },
  // More Product Sense
  {
    question_text: "Design a grocery delivery experience for elderly users.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    pattern_type: "design_x_for_y",
    expert_answer: "Focus: simplicity, accessibility. Large text, voice input, easy checkout. Trust features (freshness guarantee). Delivery time windows."
  },
  {
    question_text: "How would you add AI features to a note-taking app?",
    category: "product_sense",
    difficulty: "advanced",
    company: "General",
    interview_type: "video",
    pattern_type: "improve_x",
    expert_answer: "1) Auto-summarization 2) Smart search 3) AI writing assistant 4) Cross-note connections. Measure: engagement, time saved, retention."
  },
];

async function addQuestions() {
  console.log('➕ Adding more questions...\n');

  const { data, error } = await supabase
    .from('questions')
    .insert(newQuestions)
    .select();

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`✅ Added ${data.length} new questions!`);
  
  // Show breakdown
  const byDifficulty = {};
  const byCategory = {};
  data.forEach(q => {
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
    byCategory[q.category] = (byCategory[q.category] || 0) + 1;
  });
  console.log('By difficulty:', byDifficulty);
  console.log('By category:', byCategory);
}

addQuestions();

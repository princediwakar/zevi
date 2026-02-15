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

// Rubric templates by category
const rubrics = {
  // Product Sense - CIRCLES Framework
  product_sense: {
    'Comprehend': { weight: 0.15, criteria: ['Asked about target users', 'Clarified constraints', 'Understood scope'], description: 'Understand the problem' },
    'Identify': { weight: 0.20, criteria: ['Identified key user segments', 'Understood distinct needs', 'Prioritized by impact'], description: 'Identify target customers' },
    'Report': { weight: 0.15, criteria: ['Clear problem statement', 'Quantified pain points', 'Referenced alternatives'], description: 'Report key findings' },
    'Cut': { weight: 0.15, criteria: ['Prioritized effectively', 'Used clear criteria', 'Justified focus'], description: 'Prioritize the problem' },
    'List': { weight: 0.20, criteria: ['Generated multiple solutions', 'Covered core features', 'Considered approaches'], description: 'List solutions' },
    'Evaluate': { weight: 0.10, criteria: ['Discussed trade-offs', 'Mentioned challenges', 'Considered concerns'], description: 'Evaluate options' },
    'Summarize': { weight: 0.05, criteria: ['Clear recommendation', 'Defined success metrics', 'Outlined next steps'], description: 'Summarize recommendation' }
  },
  
  // Execution - METRICS Framework
  execution: {
    'Define': { weight: 0.20, criteria: ['Clear problem definition', 'Identified success metrics', 'Understood context'], description: 'Define the problem' },
    'Measure': { weight: 0.25, criteria: ['Segmented properly', 'Identified funnel stages', 'Chose relevant metrics'], description: 'Measure the right things' },
    'Analyze': { weight: 0.25, criteria: ['Data-driven hypotheses', 'Prioritized by impact', 'Considered factors'], description: 'Analyze systematically' },
    'Optimize': { weight: 0.30, criteria: ['Actionable solutions', 'Prioritized by ROI', 'Considered trade-offs'], description: 'Recommend solutions' }
  },
  
  // Strategy - PROBLEM_STATEMENT Framework
  strategy: {
    'User': { weight: 0.33, criteria: ['Identified key stakeholders', 'Understood user needs'], description: 'Identify users' },
    'Need': { weight: 0.33, criteria: ['Understood business needs', 'Identified opportunities'], description: 'Understand needs' },
    'Insight': { weight: 0.34, criteria: ['Provided strategic insight', 'Data-driven recommendation'], description: 'Provide insight' }
  },
  
  // Estimation - Problem Solving Framework
  estimation: {
    'Assumptions': { weight: 0.25, criteria: ['Stated clear assumptions', 'Justified estimates'], description: 'State assumptions' },
    'Calculation': { weight: 0.35, criteria: ['Showed step-by-step', 'Logical reasoning', 'Correct math'], description: 'Show calculation' },
    'Validation': { weight: 0.25, criteria: ['Compared to real data', 'Discussed range'], description: 'Validate estimate' },
    'Sensitivity': { weight: 0.15, criteria: ['Discussed what changes estimate', 'Addressed uncertainties'], description: 'Discuss sensitivities' }
  },
  
  // Behavioral - STAR Framework
  behavioral: {
    'Situation': { weight: 0.25, criteria: ['Clear context', 'Brief setup'], description: 'Set the context' },
    'Task': { weight: 0.25, criteria: ['Your specific responsibility', 'Clear goal'], description: 'Explain your task' },
    'Action': { weight: 0.25, criteria: ['Used I not we', 'Specific steps', 'Showed initiative'], description: 'Describe your actions' },
    'Result': { weight: 0.25, criteria: ['Quantified where possible', 'Learned something'], description: 'Share the outcome' }
  }
};

async function addRubrics() {
  console.log('Adding rubrics to all applicable questions...\n');
  
  // Get all questions
  const { data: questions } = await supabase
    .from('questions')
    .select('id, category');
  
  let updated = 0;
  let skipped = 0;
  
  for (const q of questions) {
    const rubric = rubrics[q.category];
    if (rubric) {
      await supabase
        .from('questions')
        .update({ rubric: rubric })
        .eq('id', q.id);
      updated++;
    } else {
      skipped++;
    }
  }
  
  console.log('Updated:', updated);
  console.log('Skipped (no rubric template):', skipped);
  console.log('Done!');
}

addRubrics().catch(console.error);

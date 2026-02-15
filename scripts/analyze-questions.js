const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase configuration.');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or EXPO_PUBLIC_SUPABASE_KEY) environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeQuestions() {
  console.log('=== COMPREHENSIVE QUESTION ANALYSIS ===\n');
  
  // Get total count
  const { count: total } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`TOTAL QUESTIONS: ${total}\n`);
  
  // Get count by category
  const { data: byCategory } = await supabase
    .from('questions')
    .select('category')
    .then(({ data }) => {
      const counts = {};
      data.forEach(q => {
        counts[q.category] = (counts[q.category] || 0) + 1;
      });
      return { data: Object.entries(counts).map(([k, v]) => ({ category: k, count: v })) };
    });
  
  console.log('--- BY CATEGORY ---');
  byCategory.sort((a, b) => b.count - a.count).forEach(c => {
    const pct = ((c.count / total) * 100).toFixed(1);
    console.log(`  ${c.category}: ${c.count} (${pct}%)`);
  });
  
  // Get count by difficulty
  const { data: byDifficulty } = await supabase
    .from('questions')
    .select('difficulty')
    .then(({ data }) => {
      const counts = {};
      data.forEach(q => {
        counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
      });
      return { data: Object.entries(counts).map(([k, v]) => ({ difficulty: k, count: v })) };
    });
  
  console.log('\n--- BY DIFFICULTY ---');
  byDifficulty.forEach(d => {
    const pct = ((d.count / total) * 100).toFixed(1);
    console.log(`  ${d.difficulty}: ${d.count} (${pct}%)`);
  });
  
  // Get count by category AND difficulty
  console.log('\n--- BY CATEGORY + DIFFICULTY MATRIX ---');
  const { data: rawData } = await supabase
    .from('questions')
    .select('category, difficulty');
  
  const matrix = {};
  rawData.forEach(q => {
    if (!matrix[q.category]) matrix[q.category] = {};
    matrix[q.category][q.difficulty] = (matrix[q.category][q.difficulty] || 0) + 1;
  });
  
  console.log('\nCategory'.padEnd(20) + 'Beginner'.padEnd(12) + 'Intermediate'.padEnd(14) + 'Advanced'.padEnd(12) + 'Total');
  console.log('-'.repeat(68));
  Object.entries(matrix).forEach(([cat, diffs]) => {
    const beginner = diffs.beginner || 0;
    const intermediate = diffs.intermediate || 0;
    const advanced = diffs.advanced || 0;
    const rowTotal = beginner + intermediate + advanced;
    console.log(
      (cat || 'unknown').padEnd(20) + 
      String(beginner).padEnd(12) + 
      String(intermediate).padEnd(14) + 
      String(advanced).padEnd(12) + 
      rowTotal
    );
  });
  
  // Check MCQ availability
  const { data: withMCQ } = await supabase
    .from('questions')
    .select('mcq_version')
    .not('mcq_version', 'is', null);
  
  console.log(`\n--- MCQ VERSIONS ---`);
  console.log(`  Questions with MCQ: ${withMCQ?.length || 0} (${((withMCQ?.length || 0) / total * 100).toFixed(1)}%)`);
  
  // Check expert answers
  const { data: withAnswers } = await supabase
    .from('questions')
    .select('expert_answer')
    .not('expert_answer', 'is', null);
  
  console.log(`\n--- EXPERT ANSWERS ---`);
  console.log(`  Questions with Expert Answer: ${withAnswers?.length || 0} (${((withAnswers?.length || 0) / total * 100).toFixed(1)}%)`);
  
  // Check companies
  const { data: companies } = await supabase
    .from('questions')
    .select('company')
    .then(({ data }) => {
      const counts = {};
      data.forEach(q => {
        const c = q.company || 'No Company';
        counts[c] = (counts[c] || 0) + 1;
      });
      return { data: Object.entries(counts).sort((a, b) => b[1] - a[1]) };
    });
  
  console.log('\n--- TOP 15 COMPANIES ---');
  companies.slice(0, 15).forEach(([company, count]) => {
    console.log(`  ${company}: ${count}`);
  });
  
  // Sample questions per category
  console.log('\n--- SAMPLE QUESTIONS BY CATEGORY ---');
  const categories = ['product_sense', 'execution', 'strategy', 'estimation', 'behavioral'];
  
  for (const cat of categories) {
    const { data: samples } = await supabase
      .from('questions')
      .select('question_text, difficulty, company')
      .eq('category', cat)
      .limit(2);
    
    console.log(`\n[${cat.toUpperCase()}]`);
    samples?.forEach((s, i) => {
      const text = s.question_text?.substring(0, 60) + '...';
      console.log(`  ${i+1}. [${s.difficulty}] ${s.company || 'General'}: ${text}`);
    });
  }
}

analyzeQuestions().catch(console.error);

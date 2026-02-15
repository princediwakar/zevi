const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeQuality() {
  console.log('=== QUALITY ANALYSIS BY CATEGORY ===\n');
  
  const categories = ['product_sense', 'execution', 'strategy', 'estimation', 'behavioral'];
  
  for (const cat of categories) {
    console.log(`\n=== ${cat.toUpperCase()} ===`);
    
    // Get all questions in this category
    const { data: questions } = await supabase
      .from('questions')
      .select('id, question_text, difficulty, company, expert_answer, rubric, mcq_version')
      .eq('category', cat);
    
    const total = questions?.length || 0;
    let withRubric = 0;
    let withMCQ = 0;
    let avgAnswerLength = 0;
    let detailedAnswers = 0;
    
    questions?.forEach(q => {
      if (q.rubric) withRubric++;
      if (q.mcq_version && q.mcq_version.enabled) withMCQ++;
      
      const answerLen = q.expert_answer?.length || 0;
      avgAnswerLength += answerLen;
      if (answerLen > 100) detailedAnswers++;
    });
    
    avgAnswerLength = total > 0 ? Math.round(avgAnswerLength / total) : 0;
    
    console.log(`  Total Questions: ${total}`);
    console.log(`  With Rubric: ${withRubric} (${((withRubric/total)*100).toFixed(1)}%)`);
    console.log(`  With MCQ: ${withMCQ} (${((withMCQ/total)*100).toFixed(1)}%)`);
    console.log(`  Avg Answer Length: ${avgAnswerLength} chars`);
    console.log(`  Detailed Answers (>100 chars): ${detailedAnswers} (${((detailedAnswers/total)*100).toFixed(1)}%)`);
    
    // Show sample questions with low answer quality
    console.log(`\n  Sample Questions:`);
    questions?.slice(0, 3).forEach(q => {
      const answerLen = q.expert_answer?.length || 0;
      const hasRubric = q.rubric ? '✓' : '✗';
      const hasMCQ = (q.mcq_version && q.mcq_version.enabled) ? '✓' : '✗';
      console.log(`    - [${q.difficulty}] ${q.question_text.substring(0, 50)}... (Ans:${answerLen} chars, Rubric:${hasRubric}, MCQ:${hasMCQ})`);
    });
  }
  
  // Overall quality metrics
  console.log('\n\n=== OVERALL QUALITY ASSESSMENT ===\n');
  
  const { data: allQuestions } = await supabase
    .from('questions')
    .select('expert_answer, rubric, mcq_version, category');
  
  const total = allQuestions?.length || 0;
  const withRubric = allQuestions?.filter(q => q.rubric).length || 0;
  const withMCQ = allQuestions?.filter(q => q.mcq_version && q.mcq_version.enabled).length || 0;
  
  console.log(`Total Questions: ${total}`);
  console.log(`Complete Rubrics: ${withRubric} (${((withRubric/total)*100).toFixed(1)}%)`);
  console.log(`MCQ Versions: ${withMCQ} (${((withMCQ/total)*100).toFixed(1)}%)`);
}

analyzeQuality().catch(console.error);

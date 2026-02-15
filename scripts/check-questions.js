const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuestions() {
  console.log('Checking questions table...\n');
  
  // Get count
  const { count, error: countError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('Error getting count:', countError);
    return;
  }
  
  console.log('Total questions in database:', count);
  
  // Get first 5 questions to see structure
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text, category, difficulty, company')
    .limit(5);
  
  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }
  
  console.log('\n--- Sample Questions ---');
  questions.forEach((q, i) => {
    console.log(`\n${i + 1}. [${q.category}] [${q.difficulty}] ${q.company || 'No company'}`);
    console.log(`   Text: ${q.question_text ? q.question_text.substring(0, 80) + '...' : 'EMPTY'}`);
  });
  
  // Check if any have empty question_text
  const { data: emptyText, error: emptyError } = await supabase
    .from('questions')
    .select('id, question_text')
    .is('question_text', null)
    .limit(5);
    
  console.log('\n--- Questions with NULL text ---');
  console.log('Count:', emptyText?.length || 0);
  
  // Check sample questions from the code
  const { data: sampleData, error: sampleError } = await supabase
    .from('questions')
    .select('id, question_text, category, difficulty, company')
    .ilike('question_text', '%Instagram%')
    .limit(3);
    
  console.log('\n--- Questions about Instagram ---');
  console.log(sampleData);
}

checkQuestions();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mgpcdgeptcjvplrjptur.supabase.co',
  'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd'
);

async function checkAllTables() {
  ;
  
  const tables = ['questions', 'learning_paths', 'units', 'lessons', 'user_profiles', 'practice_sessions', 'user_progress'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      ;
    } else {
      ;
    }
  }
  
  ;
  
  // Try to insert a test question to see the schema
  const testQuestion = {
    question_text: 'Test question - what is 2+2?',
    category: 'math',
    difficulty: 'beginner'
  };
  
  const { data, error } = await supabase
    .from('questions')
    .insert(testQuestion)
    .select()
    .single();
  
  if (error) {
    ;
  } else {
    ;
    ;
    
    // Delete the test record
    if (data?.id) {
      await supabase.from('questions').delete().eq('id', data.id);
      ;
    }
  }
  
  ;
  const { data: paths } = await supabase.from('learning_paths').select('*').limit(3);
  ;
}


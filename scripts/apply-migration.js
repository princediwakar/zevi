const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('Starting migration...');
  
  try {
    // Check if is_correct column exists by trying to select it
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('is_correct')
      .limit(1);
    
    console.log('Column check result:', { error });
    
    if (error && error.message.includes('is_correct')) {
      console.log('Column does not exist, need to add it');
      // We can't directly add columns via the JS client
      // Let's try a workaround
    } else if (!error) {
      console.log('Column already exists!');
      return;
    }
    
    // Try to use the anon key with different approach
    // Let's check what we can do
    console.log('Attempting alternative approach...');
    
    // Try using POST to insert a row - this will fail if column doesn't exist
    // but might give us a better error message
    const { data: insertTest, error: insertError } = await supabase
      .from('practice_sessions')
      .insert({
        id: '00000000-0000-0000-0000-000000000000', // dummy UUID
        user_id: '00000000-0000-0000-0000-000000000000',
        question_id: '00000000-0000-0000-0000-000000000000',
        session_type: 'test',
        is_correct: true
      })
      .select();
    
    console.log('Insert test result:', { insertError });
    
    if (insertError) {
      console.log('Error message indicates column missing:', insertError.message);
    }
    
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

applyMigration();

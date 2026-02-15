// Script to add target_levels column to questions
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function addColumns() {
  console.log('➕ Adding columns to questions table...');
  
  // Try to add columns - may fail if they exist, that's OK
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS target_levels TEXT[];`
    });
    console.log('Added target_levels column (or already exists)');
  } catch (e) {
    console.log('Note:', e.message);
  }
  
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS difficulty_hint TEXT;`
    });
    console.log('Added difficulty_hint column (or already exists)');
  } catch (e) {
    console.log('Note:', e.message);
  }
}

addColumns();

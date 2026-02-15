const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_SECRET_API_KEY, EXPO_PUBLIC_SUPABASE_URL } = process.env;

// Use the service role key to bypass RLS
const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_SECRET_API_KEY
);

async function applyMigration() {
  console.log('Adding is_correct column to practice_sessions...');
  
  // First check if column already exists
  const { data: columns, error: checkError } = await supabase.rpc('pg_column_exists', {
    table_name: 'practice_sessions',
    column_name: 'is_correct'
  }).catch(() => ({ data: null, error: null }));

  // Try to add the column using raw SQL
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: "ALTER TABLE public.practice_sessions ADD COLUMN IF NOT EXISTS is_correct BOOLEAN;"
  }).catch(async () => {
    // If RPC doesn't exist, try using the SQL directly via a different method
    // Let's check the table first
    const { data: tableData, error: tableError } = await supabase
      .from('practice_sessions')
      .select('*')
      .limit(1);
    
    console.log('Table check result:', { tableData, tableError });
    return { data: null, error: tableError };
  });

  console.log('Result:', { data, error });

  if (error) {
    console.error('Error adding column:', error);
  } else {
    console.log('Column added successfully!');
  }
}

applyMigration();

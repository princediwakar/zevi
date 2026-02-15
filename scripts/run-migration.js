const { Client } = require("pg");

// URL decode the password: CaptainJackSparrow12!@ 
const connectionString =
  "postgresql://postgres:CaptainJackSparrow12%21%40@db.mgpcdgeptcjvplrjptur.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

async function runMigration() {
  try {
    await client.connect();
    console.log("Connected to database.");

    // First, check if is_correct column already exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'practice_sessions' 
        AND column_name = 'is_correct';
    `);

    if (checkResult.rows.length > 0) {
      console.log("Column 'is_correct' already exists in practice_sessions table.");
    } else {
      console.log("Adding 'is_correct' column to practice_sessions table...");
      
      // Add the column
      await client.query(`
        ALTER TABLE public.practice_sessions 
        ADD COLUMN is_correct BOOLEAN;
      `);
      
      console.log("Column 'is_correct' added successfully!");
    }

    // Create indexes
    console.log("Creating indexes (if not exists)...");
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_practice_sessions_is_correct 
      ON public.practice_sessions(is_correct);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_is_correct 
      ON public.practice_sessions(user_id, is_correct);
    `);
    
    console.log("Indexes created successfully!");
    
    // Verify the column exists now
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'practice_sessions' 
        AND column_name = 'is_correct';
    `);
    
    console.log("\nVerification - is_correct column:");
    console.table(verifyResult.rows);
    
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

runMigration();

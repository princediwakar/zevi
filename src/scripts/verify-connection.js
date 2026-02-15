const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  try {
    console.log("Verifying Supabase connection...");

    // Check questions table
    const { count, error } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error(
        'Connection failed or table "questions" does not exist:',
        error.message,
      );
      return;
    }

    console.log(
      `Connection successful! found ${count} questions in the database.`,
    );

    if (count === 0) {
      console.warn(
        "Warning: Database is connected but empty. Please run the seed SQL.",
      );
    } else {
      console.log("Database verification passed.");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

verifyConnection();

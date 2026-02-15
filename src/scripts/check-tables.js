const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function getEnv() {
  try {
    const envPath = path.resolve(__dirname, "../../.env");
    const envFile = fs.readFileSync(envPath, "utf8");
    const env = {};
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    });
    return env;
  } catch (e) {
    console.error("Error reading .env file:", e);
    return {};
  }
}

const env = getEnv();
const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SECRET_API_KEY || env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ["users", "questions", "practice_sessions", "user_progress"];
  console.log("Checking tables...");

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select("count", { count: "exact", head: true });
    if (error) {
      console.error(`Error checking table ${table}:`, error.message);
    } else {
      console.log(`Table ${table} exists.`);
    }
  }
}

checkTables();

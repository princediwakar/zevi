require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase configuration.');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or EXPO_PUBLIC_SUPABASE_KEY)');
  process.exit(1);
}

async function verifyRPCs() {
  // Use service role key if available, otherwise use anon key
  const key = serviceRoleKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE' ? serviceRoleKey : supabaseKey;
  const supabase = createClient(supabaseUrl, key);

  console.log("Verifying RPCs...");

  // Try to call the RPC with dummy data to see if it exists (might fail validation but error code tells us existence)
  const { error: rpcError } = await supabase.rpc("update_user_streak", {
    p_user_id: "00000000-0000-0000-0000-000000000000",
  });

  if (rpcError) {
    if (rpcError.message.includes("Could not find the function")) {
      console.log("❌ RPC 'update_user_streak' DOES NOT EXIST.");
    } else {
      console.log(
        "✅ RPC 'update_user_streak' EXISTS (but failed execution as expected: " +
          rpcError.message +
          ")",
      );
    }
  } else {
    console.log("✅ RPC 'update_user_streak' EXISTS and executed.");
  }
}

verifyRPCs();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mgpcdgeptcjvplrjptur.supabase.co";
const supabaseKey = "sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd";
const serviceRoleKey = "YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE";

async function verifyRPCs() {
  const supabase = createClient(supabaseUrl, supabaseKey); // Anon is enough if RPC is public, otherwise SR

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

const https = require("https");

const projectRef = "mgpcdgeptcjvplrjptur";
const accessToken =
  process.env.SUPABASE_ACCESS_TOKEN ||
  "sbp_3bc61b86ce94da8ee244843187686f068195b73e";

const query = `
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM 
    information_schema.tables t
JOIN 
    information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE 
    t.table_schema = 'public'
ORDER BY 
    t.table_name, c.ordinal_position;
`;

const data = JSON.stringify({
  query: query,
});

const options = {
  hostname: "api.supabase.com",
  path: `/v1/projects/${projectRef}/database/query`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Content-Length": data.length,
  },
};

const req = https.request(options, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const result = JSON.parse(body);
        console.log("--- Database Schema ---");

        // Group by table
        const schema = {};
        if (Array.isArray(result)) {
          result.forEach((row) => {
            if (!schema[row.table_name]) {
              schema[row.table_name] = [];
            }
            schema[row.table_name].push({
              column: row.column_name,
              type: row.data_type,
              nullable: row.is_nullable,
              default: row.column_default,
            });
          });

          for (const [table, columns] of Object.entries(schema)) {
            console.log(`\nTable: ${table}`);
            console.table(columns);
          }
        } else {
          console.log(result);
        }
      } catch (e) {
        console.error("Error parsing response:", e);
        console.log("Raw body:", body);
      }
    } else {
      console.error(`Request failed with status code ${res.statusCode}`);
      console.log("Response body:", body);
    }
  });
});

req.on("error", (error) => {
  console.error("Request error:", error);
});

req.write(data);
req.end();

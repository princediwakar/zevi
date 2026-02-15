const { Client } = require("pg");

const connectionString =
  "postgresql://postgres:CaptainJackSparrow12%21%40@db.mgpcdgeptcjvplrjptur.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

async function inspect() {
  try {
    await client.connect();
    console.log("Connected to database.");

    // List tables
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = resTables.rows.map((r) => r.table_name);
    console.log("\nTables found:", tables);

    for (const table of tables) {
      console.log(`\n--- Schema for table: ${table} ---`);
      const resColumns = await client.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `,
        [table],
      );

      console.table(resColumns.rows);

      // Get constraints (PK, FK)
      const resConstraints = await client.query(
        `
        SELECT
            kcu.column_name,
            tco.constraint_name,
            tco.constraint_type,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM
            information_schema.table_constraints AS tco
        JOIN
            information_schema.key_column_usage AS kcu
            ON tco.constraint_name = kcu.constraint_name
            AND tco.table_schema = kcu.table_schema
        LEFT JOIN
            information_schema.constraint_column_usage AS ccu
            ON tco.constraint_name = ccu.constraint_name
            AND tco.table_schema = ccu.table_schema
        WHERE
            tco.table_schema = 'public' AND tco.table_name = $1
        ORDER BY
            kcu.column_name;
      `,
        [table],
      );

      if (resConstraints.rows.length > 0) {
        console.log(`Constraints for ${table}:`);
        console.table(resConstraints.rows);
      }
    }
  } catch (err) {
    console.error("Error executing query", err);
  } finally {
    await client.end();
  }
}

inspect();

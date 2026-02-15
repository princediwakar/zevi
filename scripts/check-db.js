const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:CaptainJackSparrow12%21%40@db.mgpcdgeptcjvplrjptur.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkTables() {
  try {
    // Check learning_paths
    const pathsResult = await pool.query('SELECT COUNT(*) as count FROM learning_paths');
    console.log('Learning Paths:', pathsResult.rows[0].count);

    // Check units
    const unitsResult = await pool.query('SELECT COUNT(*) as count FROM units');
    console.log('Units:', unitsResult.rows[0].count);

    // Check lessons
    const lessonsResult = await pool.query('SELECT COUNT(*) as count FROM lessons');
    console.log('Lessons:', lessonsResult.rows[0].count);

    // Check if lessons have content
    const lessonsWithContent = await pool.query(
      "SELECT COUNT(*) as count FROM lessons WHERE content != '{}'::jsonb AND content IS NOT NULL"
    );
    console.log('Lessons with content:', lessonsWithContent.rows[0].count);

    // Get first few lessons to see their structure
    const sampleLessons = await pool.query('SELECT id, name, type, content, estimated_minutes, xp_reward FROM lessons LIMIT 5');
    console.log('\nSample lessons:');
    console.log(JSON.stringify(sampleLessons.rows, null, 2));

    // Get all learning paths with their units
    const paths = await pool.query('SELECT id, name, category FROM learning_paths ORDER BY order_index');
    console.log('\nLearning Paths:');
    for (const path of paths.rows) {
      const units = await pool.query('SELECT id, name FROM units WHERE learning_path_id = $1 ORDER BY order_index', [path.id]);
      console.log(`- ${path.name} (${path.category}): ${units.rows.length} units`);
      for (const unit of units.rows) {
        const lessons = await pool.query('SELECT name, type FROM lessons WHERE unit_id = $1 ORDER BY order_index', [unit.id]);
        console.log(`  - ${unit.name}: ${lessons.rows.length} lessons`);
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkTables();

// Script to check existing database content
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('📊 Checking database content...\n');

    // Check learning_paths
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*');
    
    if (pathsError) throw pathsError;
    console.log(`📚 Learning Paths: ${paths?.length || 0}`);
    if (paths && paths.length > 0) {
      paths.forEach(p => console.log(`   - ${p.name} (${p.category})`));
    }

    // Check units
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*');
    
    if (unitsError) throw unitsError;
    console.log(`\n📖 Units: ${units?.length || 0}`);
    if (units && units.length > 0) {
      units.forEach(u => console.log(`   - ${u.name}`));
    }

    // Check lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*');
    
    if (lessonsError) throw lessonsError;
    console.log(`\n📝 Lessons: ${lessons?.length || 0}`);
    if (lessons && lessons.length > 0) {
      lessons.forEach(l => console.log(`   - ${l.name} (${l.type})`));
    }

    // Check questions - without framework_name column
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, question_text, category, pattern_type')
      .limit(20);
    
    if (questionsError) throw questionsError;
    console.log(`\n❓ Questions: ${questions?.length || 0}`);
    if (questions && questions.length > 0) {
      questions.forEach(q => console.log(`   - ${q.question_text?.substring(0, 40)}... [${q.category}]`));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();

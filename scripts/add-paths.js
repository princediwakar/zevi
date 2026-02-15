// Script to add additional learning paths
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function addPaths() {
  try {
    console.log('➕ Adding additional learning paths...\n');

    // Check existing paths
    const { data: existingPaths } = await supabase
      .from('learning_paths')
      .select('name');

    const existingNames = existingPaths?.map(p => p.name) || [];
    console.log('Existing paths:', existingNames);

    // Add Behavioral Mastery
    if (!existingNames.includes('Behavioral Mastery')) {
      const { data: path3, error: path3Error } = await supabase
        .from('learning_paths')
        .insert({
          name: 'Behavioral Mastery',
          description: 'Tell compelling stories about your experience.',
          category: 'behavioral',
          difficulty_level: 1,
          estimated_hours: 4,
          order_index: 3,
          is_premium: false,
          icon_name: 'message-circle',
          color: '#7C3AED'
        })
        .select()
        .single();

      if (path3Error) throw path3Error;
      console.log('✅ Added:', path3.name);

      // Add STAR unit
      const { data: starUnit } = await supabase
        .from('units')
        .insert({
          learning_path_id: path3.id,
          name: 'The STAR Framework',
          description: 'Structure your behavioral answers effectively.',
          order_index: 1,
          estimated_minutes: 30,
          xp_reward: 15
        })
        .select()
        .single();

      // Add lessons for STAR
      await supabase.from('lessons').insert([
        { unit_id: starUnit.id, name: 'STAR Introduction', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: starUnit.id, name: 'STAR Practice', type: 'practice', order_index: 2, estimated_minutes: 15, xp_reward: 20 },
        { unit_id: starUnit.id, name: 'STAR Quiz', type: 'quiz', order_index: 3, estimated_minutes: 10, xp_reward: 15 },
      ]);
      console.log('✅ Added STAR unit with 3 lessons');
    }

    // Add Strategy & Prioritization
    if (!existingNames.includes('Strategy & Prioritization')) {
      const { data: path4, error: path4Error } = await supabase
        .from('learning_paths')
        .insert({
          name: 'Strategy & Prioritization',
          description: 'Demonstrate strategic thinking and prioritization skills.',
          category: 'strategy',
          difficulty_level: 3,
          estimated_hours: 5,
          order_index: 4,
          is_premium: false,
          icon_name: 'target',
          color: '#059669'
        })
        .select()
        .single();

      if (path4Error) throw path4Error;
      console.log('✅ Added:', path4.name);

      // Add prioritization unit
      const { data: prioUnit } = await supabase
        .from('units')
        .insert({
          learning_path_id: path4.id,
          name: 'Prioritization Frameworks',
          description: 'Learn to prioritize features and projects.',
          order_index: 1,
          estimated_minutes: 40,
          xp_reward: 15
        })
        .select()
        .single();

      // Add lessons for prioritization
      await supabase.from('lessons').insert([
        { unit_id: prioUnit.id, name: 'RICE Framework', type: 'learn', order_index: 1, estimated_minutes: 15, xp_reward: 10 },
        { unit_id: prioUnit.id, name: 'Kano Model', type: 'learn', order_index: 2, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: prioUnit.id, name: 'Prioritization Practice', type: 'full_practice', order_index: 3, estimated_minutes: 15, xp_reward: 20 },
      ]);
      console.log('✅ Added Prioritization unit with 3 lessons');
    }

    // Add Estimation Skills - use 'execution' category since 'estimation' is not allowed
    if (!existingNames.includes('Estimation Skills')) {
      const { data: path5, error: path5Error } = await supabase
        .from('learning_paths')
        .insert({
          name: 'Estimation Skills',
          description: 'Master guesstimates and market sizing.',
          category: 'execution',
          difficulty_level: 2,
          estimated_hours: 3,
          order_index: 5,
          is_premium: false,
          icon_name: 'calculator',
          color: '#EA580C'
        })
        .select()
        .single();

      if (path5Error) throw path5Error;
      console.log('✅ Added:', path5.name);

      // Add market sizing unit
      const { data: marketUnit } = await supabase
        .from('units')
        .insert({
          learning_path_id: path5.id,
          name: 'Market Sizing',
          description: 'Learn to estimate market size quickly.',
          order_index: 1,
          estimated_minutes: 30,
          xp_reward: 15
        })
        .select()
        .single();

      // Add lessons for market sizing
      await supabase.from('lessons').insert([
        { unit_id: marketUnit.id, name: 'Top-Down vs Bottom-Up', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: marketUnit.id, name: 'Estimation Practice', type: 'practice', order_index: 2, estimated_minutes: 15, xp_reward: 20 },
      ]);
      console.log('✅ Added Market Sizing unit with 2 lessons');
    }

    console.log('\n🎉 Additional learning paths added!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPaths();

// Script to run seed data using Supabase client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  try {
    // Check if learning_paths already has data
    const { data: existingPaths, error: checkError } = await supabase
      .from('learning_paths')
      .select('id')
      .limit(1);

    if (checkError) throw checkError;

    if (existingPaths && existingPaths.length > 0) {
      console.log('⚠️  Learning paths already exist. Skipping...');
    } else {
      console.log('📚 Seeding learning paths...');
      
      // Seed Product Sense Fundamentals
      const { data: path1, error: path1Error } = await supabase
        .from('learning_paths')
        .insert({
          name: 'Product Sense Fundamentals',
          description: 'Master the art of breaking down ambiguous product design problems using structured frameworks.',
          category: 'product_sense',
          difficulty_level: 1,
          estimated_hours: 8,
          order_index: 1,
          is_premium: false,
          icon_name: 'lightbulb',
          color: '#FFD700'
        })
        .select()
        .single();

      if (path1Error) throw path1Error;
      console.log('✅ Created:', path1.name);

      // Seed Execution Mastery
      const { data: path2, error: path2Error } = await supabase
        .from('learning_paths')
        .insert({
          name: 'Execution Mastery',
          description: 'Demonstrate your ability to ship products and drive metrics.',
          category: 'execution',
          difficulty_level: 2,
          estimated_hours: 6,
          order_index: 2,
          is_premium: false,
          icon_name: 'rocket',
          color: '#FF6347'
        })
        .select()
        .single();

      if (path2Error) throw path2Error;
      console.log('✅ Created:', path2.name);

      // Seed Behavioral Mastery
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
      console.log('✅ Created:', path3.name);

      // Seed Strategy & Prioritization
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
      console.log('✅ Created:', path4.name);

      // Seed Estimation Skills
      const { data: path5, error: path5Error } = await supabase
        .from('learning_paths')
        .insert({
          name: 'Estimation Skills',
          description: 'Master guesstimates and market sizing.',
          category: 'estimation',
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
      console.log('✅ Created:', path5.name);

      // Seed Units for Path 1 (Product Sense)
      const units = [
        { path_id: path1.id, name: 'Introduction to PM Interviews', description: 'Understand what interviewers are looking for in product sense questions.', framework_name: null, order_index: 1, estimated_minutes: 30 },
        { path_id: path1.id, name: 'The CIRCLES Framework', description: 'A structured approach to product design questions.', framework_name: 'CIRCLES', order_index: 2, estimated_minutes: 60 },
        { path_id: path1.id, name: 'User Research & Segmentation', description: 'Learn to identify and prioritize user segments.', framework_name: null, order_index: 3, estimated_minutes: 45 },
        { path_id: path2.id, name: 'Product Metrics', description: 'Master the art of defining and selecting metrics.', framework_name: 'METRICS', order_index: 1, estimated_minutes: 50 },
        { path_id: path2.id, name: 'Root Cause Analysis', description: 'Debug product issues systematically.', framework_name: null, order_index: 2, estimated_minutes: 45 },
        { path_id: path3.id, name: 'The STAR Framework', description: 'Structure your behavioral answers effectively.', framework_name: 'STAR', order_index: 1, estimated_minutes: 30 },
        { path_id: path4.id, name: 'Prioritization Frameworks', description: 'Learn to prioritize features and projects.', framework_name: 'PRIORITIZATION', order_index: 1, estimated_minutes: 40 },
        { path_id: path5.id, name: 'Market Sizing', description: 'Learn to estimate market size quickly.', framework_name: null, order_index: 1, estimated_minutes: 30 },
      ];

      const { data: createdUnits, error: unitsError } = await supabase
        .from('units')
        .insert(units)
        .select();

      if (unitsError) throw unitsError;
      console.log(`✅ Created ${createdUnits.length} units`);

      // Seed Lessons
      const lessons = [
        // Path 1 - Unit 1 (Intro to PM)
        { unit_id: createdUnits[0].id, name: 'What is Product Sense?', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: createdUnits[0].id, name: 'The PM Mindset', type: 'learn', order_index: 2, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: createdUnits[0].id, name: 'Introduction Quiz', type: 'quiz', order_index: 3, estimated_minutes: 10, xp_reward: 20 },
        // Path 1 - Unit 2 (CIRCLES)
        { unit_id: createdUnits[1].id, name: 'Intro to CIRCLES', type: 'learn', order_index: 1, estimated_minutes: 15, xp_reward: 10 },
        { unit_id: createdUnits[1].id, name: 'Comprehend Step Drill', type: 'drill', order_index: 2, estimated_minutes: 10, xp_reward: 15 },
        { unit_id: createdUnits[1].id, name: 'Identify Step Practice', type: 'pattern', order_index: 3, estimated_minutes: 15, xp_reward: 20 },
        { unit_id: createdUnits[1].id, name: 'CIRCLES Quiz', type: 'quiz', order_index: 4, estimated_minutes: 10, xp_reward: 25 },
        // Path 1 - Unit 3 (User Research)
        { unit_id: createdUnits[2].id, name: 'User Segmentation Basics', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: createdUnits[2].id, name: 'Segment Practice', type: 'practice', order_index: 2, estimated_minutes: 15, xp_reward: 15 },
        // Path 2 - Unit 1 (Metrics)
        { unit_id: createdUnits[3].id, name: 'Types of Metrics', type: 'learn', order_index: 1, estimated_minutes: 15, xp_reward: 10 },
        { unit_id: createdUnits[3].id, name: 'Metric Selection Drill', type: 'drill', order_index: 2, estimated_minutes: 10, xp_reward: 15 },
        { unit_id: createdUnits[3].id, name: 'Define Metrics Practice', type: 'full_practice', order_index: 3, estimated_minutes: 15, xp_reward: 25 },
        // Path 2 - Unit 2 (Root Cause)
        { unit_id: createdUnits[4].id, name: 'The 5 Whys Method', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: createdUnits[4].id, name: 'Root Cause Practice', type: 'full_practice', order_index: 2, estimated_minutes: 15, xp_reward: 20 },
        // Path 3 - Unit 1 (STAR)
        { unit_id: createdUnits[5].id, name: 'STAR Introduction', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: createdUnits[5].id, name: 'STAR Practice', type: 'practice', order_index: 2, estimated_minutes: 15, xp_reward: 20 },
        // Path 4 - Unit 1 (Prioritization)
        { unit_id: createdUnits[6].id, name: 'RICE Framework', type: 'learn', order_index: 1, estimated_minutes: 15, xp_reward: 10 },
        { unit_id: createdUnits[6].id, name: 'Kano Model', type: 'learn', order_index: 2, estimated_minutes: 10, xp_reward: 10 },
        // Path 5 - Unit 1 (Market Sizing)
        { unit_id: createdUnits[7].id, name: 'Top-Down vs Bottom-Up', type: 'learn', order_index: 1, estimated_minutes: 10, xp_reward: 10 },
        { unit_id: createdUnits[7].id, name: 'Estimation Practice', type: 'practice', order_index: 2, estimated_minutes: 15, xp_reward: 20 },
      ];

      const { data: createdLessons, error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessons)
        .select();

      if (lessonsError) throw lessonsError;
      console.log(`✅ Created ${createdLessons.length} lessons`);

      console.log('\n🎉 Learning content seeded successfully!');
    }

    // Now seed questions
    console.log('\n📝 Checking questions...');
    
    const { data: existingQuestions, error: questionsCheckError } = await supabase
      .from('questions')
      .select('id')
      .limit(1);

    if (questionsCheckError) throw questionsCheckError;

    if (existingQuestions && existingQuestions.length > 0) {
      console.log('⚠️  Questions already exist. Skipping...');
    } else {
      console.log('📝 Seeding questions...');

      const questions = [
        {
          question_text: 'Design a product for finding roommates in a new city.',
          category: 'product_sense',
          difficulty: 'intermediate',
          company: 'Facebook',
          interview_type: 'video',
          pattern_type: 'design_x_for_y',
          framework_name: 'CIRCLES',
          expert_answer: 'Target users: young professionals moving to new cities. Pain points: trust, compatibility, timing. Solution: Roommate Match with verified profiles, lifestyle quizzes, video intros.',
        },
        {
          question_text: 'Design an alarm clock for deaf people.',
          category: 'product_sense',
          difficulty: 'intermediate',
          company: 'Google',
          interview_type: 'video',
          pattern_type: 'design_x_for_y',
          framework_name: 'CIRCLES',
          expert_answer: 'Sensory inputs: Vibration (wearable or under pillow), Light (gradually brightening room), Scent (release fragrance). Integration with smart home devices.',
        },
        {
          question_text: 'How would you improve the Google Maps app?',
          category: 'product_sense',
          difficulty: 'beginner',
          company: 'Google',
          interview_type: 'video',
          pattern_type: 'improve_x',
          framework_name: 'CIRCLES',
          expert_answer: 'Problems: information overload, unreliable real-time data, poor indoor navigation. Solutions: AI-powered recommendations, AR walking directions, improved ETA predictions.',
        },
        {
          question_text: 'Design a unified messaging inbox for all your messaging apps.',
          category: 'product_sense',
          difficulty: 'intermediate',
          company: 'Slack',
          interview_type: 'video',
          pattern_type: 'design_x_for_y',
          framework_name: 'CIRCLES',
          expert_answer: 'Aggregate: WhatsApp, iMessage, Slack, Discord. Features: unified inbox, smart replies, cross-app search, notification management.',
        },
        {
          question_text: 'Should Twitter launch a subscription model?',
          category: 'strategy',
          difficulty: 'advanced',
          company: 'Twitter',
          interview_type: 'video',
          pattern_type: 'strategy',
          framework_name: 'PROBLEM_STATEMENT',
          expert_answer: 'Pros: diversify revenue, reduce ad dependence. Cons: slower growth. Recommendation: Freemium with Twitter Blue.',
        },
        {
          question_text: 'Should Netflix add live sports?',
          category: 'strategy',
          difficulty: 'advanced',
          company: 'Netflix',
          interview_type: 'video',
          pattern_type: 'strategy',
          framework_name: 'PROBLEM_STATEMENT',
          expert_answer: 'Pros: retain subscribers, high engagement. Cons: extremely expensive rights. Recommendation: Start with non-exclusive sports.',
        },
        {
          question_text: 'Facebook Events usage is down 10%. Diagnose the issue.',
          category: 'execution',
          difficulty: 'advanced',
          company: 'Meta',
          interview_type: 'video',
          pattern_type: 'investigate_drop',
          framework_name: 'METRICS',
          expert_answer: '1) Rule out tech issues 2) Segment by region/device 3) Analyze seasonality 4) Check competition (Partiful)',
        },
        {
          question_text: 'What metrics would you track for Uber Pool?',
          category: 'execution',
          difficulty: 'intermediate',
          company: 'Uber',
          interview_type: 'video',
          pattern_type: 'metrics_for_x',
          framework_name: 'METRICS',
          expert_answer: 'North Star: matches per trip. Supporting: discount vs UberX time added, driver earnings per hour, cancellation rate.',
        },
        {
          question_text: 'Estimate the bandwidth used by TikTok in a day.',
          category: 'estimation',
          difficulty: 'advanced',
          company: 'ByteDance',
          interview_type: 'phone',
          pattern_type: 'estimation',
          framework_name: null,
          expert_answer: 'Assumptions: 1B DAU, avg 60 mins/day, video bitrate 1-2 Mbps. ~500-1000 PB/day.',
        },
        {
          question_text: 'Estimate the number of elevators in NYC.',
          category: 'estimation',
          difficulty: 'intermediate',
          company: 'Google',
          interview_type: 'phone',
          pattern_type: 'estimation',
          framework_name: null,
          expert_answer: 'NYC pop: 8M. Buildings: ~1M. High-rises: ~10% = 100k. Total: ~200k-300k.',
        },
        {
          question_text: 'Tell me about a time you had a conflict with an engineer.',
          category: 'behavioral',
          difficulty: 'intermediate',
          company: 'General',
          interview_type: 'video',
          pattern_type: 'behavioral_star',
          framework_name: 'STAR',
          expert_answer: 'STAR: Situation - launch timeline conflict. Action - 1:1 to understand constraints, negotiated scope. Result - launched on time.',
        },
        {
          question_text: 'Tell me about a time you failed.',
          category: 'behavioral',
          difficulty: 'intermediate',
          company: 'General',
          interview_type: 'video',
          pattern_type: 'behavioral_star',
          framework_name: 'STAR',
          expert_answer: 'STAR: Situation - launched feature that users hated. Action - analyzed feedback, created beta program. Result - rebuilt successfully.',
        },
        {
          question_text: 'Describe a time you influenced without authority.',
          category: 'behavioral',
          difficulty: 'intermediate',
          company: 'General',
          interview_type: 'video',
          pattern_type: 'behavioral_star',
          framework_name: 'STAR',
          expert_answer: 'STAR: Situation - needed design help from another team. Action - built relationship, showed data. Result - got support.',
        },
        {
          question_text: 'Design a bookshelf for children.',
          category: 'product_sense',
          difficulty: 'beginner',
          company: 'Amazon',
          interview_type: 'video',
          pattern_type: 'design_x_for_y',
          framework_name: 'CIRCLES',
          expert_answer: 'Users: Kids (independence) + Parents (storage). Features: Front-facing covers, adjustable height, durable materials.',
        },
        {
          question_text: 'Improve the experience of visiting a museum.',
          category: 'product_sense',
          difficulty: 'beginner',
          company: 'Google',
          interview_type: 'video',
          pattern_type: 'improve_x',
          framework_name: 'CIRCLES',
          expert_answer: 'Pain points: crowds, lack of context, getting lost. Solutions: AR guides, personalized routes, crowd-avoidance.',
        },
        {
          question_text: 'Design a smart shoe.',
          category: 'product_sense',
          difficulty: 'beginner',
          company: 'Nike',
          interview_type: 'video',
          pattern_type: 'design_x_for_y',
          framework_name: 'CIRCLES',
          expert_answer: 'Target: runners. Features: auto-lacing, gait analysis, GPS tracking, haptic feedback.',
        },
        {
          question_text: 'Critique the Spotify app.',
          category: 'product_sense',
          difficulty: 'intermediate',
          company: 'Spotify',
          interview_type: 'phone',
          pattern_type: 'improve_x',
          framework_name: 'CIRCLES',
          expert_answer: 'Good: Discover Weekly, dark mode. Bad: podcast integration cluttered. Improve: separate podcast app.',
        },
        {
          question_text: 'How would you reduce cancellations for Uber?',
          category: 'execution',
          difficulty: 'intermediate',
          company: 'Uber',
          interview_type: 'video',
          pattern_type: 'investigate_drop',
          framework_name: 'METRICS',
          expert_answer: 'Analyze when cancellations happen: pre-match (ETA), post-match (wait time). Solutions: better ETAs, driver incentives.',
        },
        {
          question_text: 'Decrease churn for a SaaS platform.',
          category: 'execution',
          difficulty: 'advanced',
          company: 'Salesforce',
          interview_type: 'video',
          pattern_type: 'investigate_drop',
          framework_name: 'METRICS',
          expert_answer: 'Cohort analysis to find when users churn. Solutions: better onboarding, engagement campaigns, customer success.',
        },
        {
          question_text: 'How would you monetize WhatsApp?',
          category: 'strategy',
          difficulty: 'advanced',
          company: 'Meta',
          interview_type: 'video',
          pattern_type: 'strategy',
          framework_name: 'PROBLEM_STATEMENT',
          expert_answer: 'Avoid user fees. Monetize B2C: WhatsApp Business API, transactions, payments integration.',
        },
      ];

      const { data: createdQuestions, error: questionsError } = await supabase
        .from('questions')
        .insert(questions)
        .select();

      if (questionsError) throw questionsError;
      console.log(`✅ Created ${createdQuestions.length} questions`);

      console.log('\n🎉 All data seeded successfully!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) console.error('Details:', error.details);
    process.exit(1);
  }
}

runSeed();

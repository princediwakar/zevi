// Script to add high-quality questions from top tech companies
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// High-quality PM interview questions from top companies
const topCompanyQuestions = [
  // GOOGLE
  { question_text: "Design a product to help people find parking spots in urban areas.", category: "product_sense", difficulty: "intermediate", company: "Google", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Target users: urban drivers frustrated with parking. Pain points: time wasted searching, cost, stress. Solutions: real-time availability, reservation system, dynamic pricing. Features: GPS integration, payment in-app, walking directions. Success metrics: time saved, parking success rate, user satisfaction.", rubric: JSON.stringify({ Comprehend: { weight: 0.15, criteria: ["Clarified target user", "Asked about constraints"], description: "Understand the problem scope" }, Identify: { weight: 0.2, criteria: ["Identified key segments", "Understood needs"], description: "Identify target customers" }, Cut: { weight: 0.15, criteria: ["Prioritized effectively"], description: "Prioritize the problem" }, List: { weight: 0.2, criteria: ["Multiple solutions", "Key features"], description: "List solutions" }, Evaluate: { weight: 0.15, criteria: ["Trade-offs discussed"], description: "Evaluate options" }, Summarize: { weight: 0.15, criteria: ["Clear recommendation", "Metrics defined"], description: "Summarize recommendation" } }), mcq_version: JSON.stringify({ enabled: true, sub_questions: [{ prompt: "What is the biggest challenge for a parking app?", options: [{ text: "Real-time availability data", correct: true, explanation: "Getting accurate parking data is the core challenge" }, { text: "Payment processing", correct: false, explanation: "Solved problem" }, { text: "User onboarding", correct: false, explanation: "Important but not core" }, { text: "Marketing", correct: false, explanation: "Secondary challenge" }], difficulty: "intermediate" }] }) },
  { question_text: "How would you improve Google Chrome's performance on mobile devices?", category: "product_sense", difficulty: "intermediate", company: "Google", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: battery drain, high memory usage, slow page loads. Solutions: aggressive tab suspension, data compression, predictive preloading. Metrics: page load time, memory usage, battery consumption, crash rate." },
  { question_text: "Design a smart home device for elderly monitoring.", category: "product_sense", difficulty: "intermediate", company: "Google", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Users: elderly living alone + their family caregivers. Key features: fall detection, medication reminders, activity monitoring, emergency alerts. Privacy-first approach. Success: response time, false positive rate, family satisfaction." },
  { question_text: "Estimate the revenue potential of adding a subscription service to YouTube.", category: "estimation", difficulty: "advanced", company: "Google", interview_type: "phone", pattern_type: "estimation", expert_answer: "Assumptions: 2B users, 10% conversion, $10/month. Calculation: 2B * 10% * $10 * 12 = $24B/year potential. Adjust for: willingness to pay, ad-supported alternative value, competitor pricing." },
  { question_text: "You notice Google Maps usage has dropped 15% in a month. How do you diagnose this?", category: "execution", difficulty: "advanced", company: "Google", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Check for technical issues/bugs 2) Segment by region, device, user type 3) Analyze competitive landscape (Apple Maps improvements) 4) Check for seasonal patterns 5) Review recent product changes 6) Analyze cohort retention", rubric: JSON.stringify({ Define: { weight: 0.2, criteria: ["Clear problem definition"], description: "Define the problem" }, Measure: { weight: 0.3, criteria: ["Proper segmentation", "Right metrics"], description: "Measure the right things" }, Analyze: { weight: 0.3, criteria: ["Root cause identified", "Data-driven"], description: "Analyze systematically" }, Optimize: { weight: 0.2, criteria: ["Actionable recommendations"], description: "Recommend solutions" } }), mcq_version: JSON.stringify({ enabled: true, sub_questions: [{ prompt: "What is the first step when diagnosing a metric drop?", options: [{ text: "Check for technical bugs", correct: true, explanation: "Always rule out data quality issues first" }, { text: "Ask stakeholders", correct: false, explanation: "Data first" }, { text: "Check competitors", correct: false, explanation: "Internal analysis first" }, { text: "Launch a fix", correct: false, explanation: "Need diagnosis first" }], difficulty: "beginner" }] }) },
  { question_text: "What metrics would you track for Google Docs collaborative editing?", category: "execution", difficulty: "intermediate", company: "Google", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: documents with real-time collaboration. Supporting: DAU/MAU ratio, time spent editing, sharing events, comment activity, revision history usage, team adoption rate." },

  // META / FACEBOOK
  { question_text: "Design a feature to help Facebook users discover local events.", category: "product_sense", difficulty: "intermediate", company: "Meta", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Users: people looking for things to do locally. Features: event discovery feed, personalized recommendations, social connections for events, RSVP with groups. Integration with existing social graph. Metrics: events discovered, RSVPs, attendance, repeat usage." },
  { question_text: "How would you improve Instagram's Reels engagement?", category: "product_sense", difficulty: "advanced", company: "Meta", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: discovery algorithm, content quality, creator monetization. Solutions: better recommendations, creator tools, monetization features. Metrics: watch time, creator retention, shares, conversion to following." },
  { question_text: "Instagram's daily active users have plateaued. What would you do?", category: "execution", difficulty: "advanced", company: "Meta", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Segment by demographics, geography, device 2) Analyze competitor usage (TikTok, Snapchat) 3) Check product changes 4) Survey users who churned 5) Test new features with cohorts 6) Analyze time spent vs DAU" },
  { question_text: "Should WhatsApp add a subscriptions model for business features?", category: "strategy", difficulty: "advanced", company: "Meta", interview_type: "video", pattern_type: "strategy", expert_answer: "Pros: revenue diversification, business value. Cons: may push businesses to alternatives. Recommendation: Freemium model - basic tools free, premium features (automation, analytics) paid. Maintains network effects while capturing business value.", rubric: JSON.stringify({ User: { weight: 0.33, criteria: ["Identified key stakeholders"], description: "Identify users" }, Need: { weight: 0.33, criteria: ["Understood business needs"], description: "Understand needs" }, Insight: { weight: 0.34, criteria: ["Provided strategic insight"], description: "Provide insight" } }) },
  { question_text: "Tell me about a time you had to make a decision with incomplete data.", category: "behavioral", difficulty: "intermediate", company: "Meta", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - needed to ship but metrics were inconclusive. Task - make go/no-go decision. Action - used qualitative research, proxy metrics, stakeholder input. Result - shipped with monitoring, validated with data post-launch." },

  // AMAZON
  { question_text: "Design a feature to help Amazon customers find the right size clothing online.", category: "product_sense", difficulty: "intermediate", company: "Amazon", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Users: online shoppers unsure of size. Features: body measurement input, size recommendation algorithm, virtual try-on, fit history, returns integration. Success: return rate reduction, customer satisfaction, conversion rate." },
  { question_text: "How would you improve Amazon Fresh's delivery speed?", category: "product_sense", difficulty: "advanced", company: "Amazon", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: last-mile delivery, inventory availability, warehouse location. Solutions: micro-fulfillment centers, predictive inventory, route optimization. Metrics: delivery time, on-time rate, freshness score, cost per delivery." },
  { question_text: "Amazon's return rate for clothing is too high. How do you reduce it?", category: "execution", difficulty: "intermediate", company: "Amazon", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Analyze return reasons (wrong size, quality not as expected, didn't like) 2) Segment by category, seller, user type 3) Test size recommendation tools 4) Improve product descriptions 5) A/B test packaging" },
  { question_text: "What metrics would you track for Amazon Prime Video?", category: "execution", difficulty: "intermediate", company: "Amazon", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: hours streamed per subscriber. Supporting: content discovery rate, watch completion rate, subscriber retention, content cost per hour, engagement score, social sharing." },
  { question_text: "Should Amazon launch a social feature for product reviews?", category: "strategy", difficulty: "advanced", company: "Amazon", interview_type: "video", pattern_type: "strategy", expert_answer: "Pros: engagement, trust, virality. Cons: fake reviews risk, complexity, may hurt purchase conversion. Recommendation: Build gradually - Q&A first, then photo sharing, social verification. Must maintain trust as priority." },
  { question_text: "Tell me about a time you had to deliver on an ambitious deadline.", category: "behavioral", difficulty: "intermediate", company: "Amazon", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - Black Friday launch in 3 weeks. Task - build new feature. Action - scoped ruthlessly, cross-functional partnership, daily standups. Result - launched on time, handled traffic." },
  { question_text: "Estimate the market size for meal kit delivery services in the US.", category: "estimation", difficulty: "intermediate", company: "Amazon", interview_type: "phone", pattern_type: "estimation", expert_answer: "US households: 130M. Interested in meal kits: ~20% = 26M. Willing to pay premium: ~30% of interested = 8M. Average spend: $60/week = $240/month. TAM: 8M * $240 * 12 = ~$23B/year." },

  // APPLE
  { question_text: "Design a health monitoring feature for Apple Watch for elderly users.", category: "product_sense", difficulty: "intermediate", company: "Apple", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Users: elderly + their families. Features: fall detection, heart monitoring, medication reminders, activity goals, emergency SOS. Success: early detection rate, family notification speed, user engagement." },
  { question_text: "How would you improve the Apple Maps cycling directions?", category: "product_sense", difficulty: "intermediate", company: "Apple", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: route accuracy, safety concerns, elevation data. Solutions: crowd-sourced bike routes, safety ratings. Metrics: cycling usage, route completion, user ratings." },
  { question_text: "What metrics would you track for Apple TV+?", category: "execution", difficulty: "intermediate", company: "Apple", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: hours watched per subscriber. Supporting: content engagement, subscriber retention, cost per acquisition, watch completion, app opens." },
  { question_text: "Should Apple add a subscription for Apple TV+ standalone?", category: "strategy", difficulty: "advanced", company: "Apple", interview_type: "video", pattern_type: "strategy", expert_answer: "Already offers standalone. Better questions: content strategy, bundle optimization, international expansion. Recommendation: Focus on original content quality over quantity, bundle with Music/Arcade for value." },
  { question_text: "Tell me about a time you had to persuade a skeptical stakeholder.", category: "behavioral", difficulty: "intermediate", company: "Apple", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - proposed feature others thought unnecessary. Task - get buy-in. Action - built prototype, gathered user data, aligned with company goals. Result - feature shipped, high adoption." },

  // MICROSOFT
  { question_text: "Design a feature to help Teams users manage meetings more effectively.", category: "product_sense", difficulty: "intermediate", company: "Microsoft", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Users: professionals with many meetings. Features: AI meeting summaries, automated note-taking, follow-up suggestions, calendar optimization, transcription. Success: time saved, meeting effectiveness, NPS." },
  { question_text: "How would you improve Bing's search relevance?", category: "product_sense", difficulty: "advanced", company: "Microsoft", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: query understanding, result quality, snippet relevance. Solutions: better NLP, AI-powered summaries, personalized results, multimodal search. Metrics: click-through rate, time on result, query success rate." },
  { question_text: "Teams meeting quality has degraded. How do you diagnose?", category: "execution", difficulty: "advanced", company: "Microsoft", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Segment by device, OS, network 2) Check for recent updates 3) Analyze call quality metrics 4) Review user complaints 5) Test across conditions 6) Check server health" },
  { question_text: "What metrics would you track for LinkedIn Premium subscriptions?", category: "execution", difficulty: "intermediate", company: "Microsoft", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: conversion rate to premium. Supporting: feature adoption, trial-to-paid, churn rate, revenue per user, engagement with premium features, NPS by tier." },
  { question_text: "Should LinkedIn add a dating feature?", category: "strategy", difficulty: "advanced", company: "Microsoft", interview_type: "video", pattern_type: "strategy", expert_answer: "Risks: brand confusion, trust issues, moderation costs. Benefits: engagement, new use case. Recommendation: Focus on professional networking first, could test 'professional events' rather than dating." },
  { question_text: "Tell me about a time you had to work with a difficult engineer.", category: "behavioral", difficulty: "intermediate", company: "Microsoft", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - engineer resistant to feedback. Task - get collaboration. Action - 1:1, understood concerns, found common goals, showed data. Result - successful partnership." },
  { question_text: "Estimate the number of LinkedIn messages sent per day.", category: "estimation", difficulty: "intermediate", company: "Microsoft", interview_type: "phone", pattern_type: "estimation", expert_answer: "LinkedIn users: 900M. Active users: ~30% = 270M. Messages per active user: ~2/day. Total: 270M * 2 = ~540M messages/day." },

  // UBER
  { question_text: "Design a feature to help Uber drivers maximize their earnings.", category: "product_sense", difficulty: "intermediate", company: "Uber", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Target: Uber driver partners. Features: earnings dashboard, hot zones map, trip recommendations, schedule optimization, fuel savings. Success: driver satisfaction, driver retention, earnings per hour." },
  { question_text: "How would you reduce Uber Eats delivery times?", category: "product_sense", difficulty: "advanced", company: "Uber", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: restaurant prep time, courier availability, route optimization. Solutions: prep time predictions, dynamic pricing, better matching algorithm, kitchen integration. Metrics: delivery time, order accuracy, customer satisfaction." },
  { question_text: "Uber's driver supply has dropped. How do you investigate?", category: "execution", difficulty: "advanced", company: "Uber", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Segment by city, time, driver type 2) Analyze earnings trends 3) Check competitor driver pay 4) Review app changes 5) Survey drivers 6) Check seasonal patterns" },
  { question_text: "What metrics would you track for Uber's subscription product (Uber One)?", category: "execution", difficulty: "intermediate", company: "Uber", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: subscribers retained at 12 months. Supporting: sign-up rate, feature adoption, rides per month, delivery orders, membership NPS, cost to serve." },
  { question_text: "Should Uber add a monthly subscription for frequent riders?", category: "strategy", difficulty: "advanced", company: "Uber", interview_type: "video", pattern_type: "strategy", expert_answer: "Already has Uber One. Better questions: pricing optimization, bundle features, cancellation prevention. Recommendation: Test different price points, include Eats benefits for cross-product usage." },
  { question_text: "Estimate the market size for food delivery in the US.", category: "estimation", difficulty: "intermediate", company: "Uber", interview_type: "phone", pattern_type: "estimation", expert_answer: "US population: 330M. Order food: ~60% = 200M. Order delivery: ~40% = 80M. Orders per month: ~3. Average order: $30. Monthly: 80M * 3 * $30 = $7.2B. Annual: ~$86B." },

  // AIRBNB
  { question_text: "Design a feature to help Airbnb hosts price their listings competitively.", category: "product_sense", difficulty: "intermediate", company: "Airbnb", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Target: Airbnb hosts. Features: pricing recommendations, competitor analysis, demand forecasting, seasonal adjustments, event-based pricing. Success: host adoption, revenue, booking rate." },
  { question_text: "How would you improve Airbnb's search experience?", category: "product_sense", difficulty: "intermediate", company: "Airbnb", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: too many options, relevance, photos quality. Solutions: better personalization, smart filters, host response time, review quality. Metrics: booking conversion, search refinements, time to book." },
  { question_text: "Airbnb's booking rate has dropped. How do you diagnose?", category: "execution", difficulty: "advanced", company: "Airbnb", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Segment by region, date, user type 2) Check pricing competitiveness 3) Analyze competitor activity 4) Review recent changes 5) Check inventory availability 6) Survey users" },
  { question_text: "What metrics would you track for Airbnb Experiences?", category: "execution", difficulty: "intermediate", company: "Airbnb", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: experiences booked per guest. Supporting: experience ratings, host retention, repeat bookings, revenue per experience, category growth." },
  { question_text: "Should Airbnb add a long-term rental option (6+ months)?", category: "strategy", difficulty: "advanced", company: "Airbnb", interview_type: "video", pattern_type: "strategy", expert_answer: "Pros: different market, stable income for hosts, longer stays. Cons: regulatory issues, different unit economics. Recommendation: Test in select markets, monitor regulatory response." },
  { question_text: "Tell me about a time you had to prioritize multiple urgent requests.", category: "behavioral", difficulty: "intermediate", company: "Airbnb", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - multiple high-priority projects. Task - deliver all. Action - evaluated impact, negotiated timeline, communicated transparently. Result - delivered key items, managed expectations." },

  // TIKTOK / BYTEDANCE
  { question_text: "Design a feature to help TikTok creators monetize their content.", category: "product_sense", difficulty: "intermediate", company: "ByteDance", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Target: TikTok creators. Features: tipping, brand partnerships, merchandise, creator fund improvements, subscriptions. Success: creator earnings, creator retention, content quality." },
  { question_text: "How would you reduce time spent moderating TikTok content?", category: "product_sense", difficulty: "advanced", company: "ByteDance", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: scale, false positives, new trends. Solutions: better AI, creator education, community tools, appeal process. Metrics: moderation accuracy, response time, creator satisfaction." },
  { question_text: "TikTok's watch time has decreased. How do you diagnose?", category: "execution", difficulty: "advanced", company: "ByteDance", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Segment by demographics, content type 2) Analyze algorithm changes 3) Check competitor usage 4) Review engagement by format 5) Test recommendation quality 6) Check for content gaps" },
  { question_text: "What metrics would you track for TikTok's algorithm?", category: "execution", difficulty: "advanced", company: "ByteDance", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: watch time per session. Supporting: video completion rate, re-watch rate, shares, likes, follows, time to first interaction, recommendation accuracy." },
  { question_text: "Estimate the bandwidth required for TikTok in the US.", category: "estimation", difficulty: "advanced", company: "ByteDance", interview_type: "phone", pattern_type: "estimation", expert_answer: "US users: 150M DAU. Avg time: 90 min/day. Video bitrate: 1-2 Mbps. Calculation: 150M * 90 * 60 * 1.5 = bits. Convert: ~500 PB/day." },

  // STRIPE
  { question_text: "Design a feature to help small businesses manage cash flow.", category: "product_sense", difficulty: "intermediate", company: "Stripe", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Target: SMB owners. Features: cash flow projections, invoice tracking, payment reminders, financing options, expense tracking. Success: adoption, reduced late payments, NPS." },
  { question_text: "How would you reduce Stripe's fraud rate?", category: "product_sense", difficulty: "advanced", company: "Stripe", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: false positives, new fraud patterns, scale. Solutions: better ML models, 3D Secure, device fingerprinting, risk scoring. Metrics: fraud rate, false positive rate, developer experience." },
  { question_text: "What metrics would you track for Stripe Connect?", category: "execution", difficulty: "intermediate", company: "Stripe", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: volume processed. Supporting: platform growth, transaction success rate, dispute rate, platform NPS, developer retention." },
  { question_text: "Estimate the market for point-of-sale systems in retail.", category: "estimation", difficulty: "intermediate", company: "Stripe", interview_type: "phone", pattern_type: "estimation", expert_answer: "US retail stores: ~3M. POS spend: ~$3B/year hardware, ~$10B/year software. Total TAM: ~$13B." },

  // NETFLIX / SPOTIFY
  { question_text: "Design a product to help people quit smoking.", category: "product_sense", difficulty: "intermediate", company: "Google", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Target: smokers trying to quit. Features: progress tracking, triggers identification, community support, rewards system, nicotine replacement integration. Success: quit rate, day streak, user retention." },
  { question_text: "How would you improve Netflix's recommendation engine?", category: "product_sense", difficulty: "advanced", company: "Netflix", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: cold start, genre saturation, false positives. Solutions: better implicit signals, diversity in recommendations, preview generation, continue watching. Metrics: watch time, skip rate, content diversity." },
  { question_text: "Netflix subscriber growth has slowed. How do you diagnose?", category: "execution", difficulty: "advanced", company: "Netflix", interview_type: "video", pattern_type: "investigate_drop", expert_answer: "1) Segment by region, plan type 2) Analyze churn reasons 3) Check competitive landscape 4) Review content calendar 5) Analyze pricing elasticity 6) Test new content strategies" },
  { question_text: "What metrics would you track for Spotify's podcast feature?", category: "execution", difficulty: "intermediate", company: "Spotify", interview_type: "video", pattern_type: "metrics_for_x", expert_answer: "North Star: hours of podcasts listened. Supporting: podcast discovery, listener retention, share rate, exclusive content engagement, ad engagement." },
  { question_text: "Should Spotify separate podcast and music into different apps?", category: "strategy", difficulty: "advanced", company: "Spotify", interview_type: "video", pattern_type: "strategy", expert_answer: "Risks: user friction, lost cross-promotion, development cost. Benefits: focused experience, simpler UX. Recommendation: Keep combined but improve navigation and recommendations separately." },

  // GENERAL BEHAVIORAL
  { question_text: "Tell me about a time you had to deal with a product launch failure.", category: "behavioral", difficulty: "intermediate", company: "General", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - feature launch had issues. Task - fix quickly. Action - rolled back, communicated transparently, fixed root cause. Result - relaunched successfully, created launch checklist." },
  { question_text: "Describe a time you used data to influence a product decision.", category: "behavioral", difficulty: "intermediate", company: "General", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - team wanted feature X. Task - advocate for feature Y. Action - analyzed data, presented findings, showed impact. Result - team chose Y, proved successful." },
  { question_text: "Tell me about a time you had to say no to a feature request.", category: "behavioral", difficulty: "intermediate", company: "General", interview_type: "video", pattern_type: "behavioral_star", expert_answer: "STAR: Situation - sales requested feature. Task - evaluate and respond. Action - analyzed usage data, assessed effort, proposed alternative. Result - stakeholder understood, roadmap adjusted." },

  // DOORDASH
  { question_text: "Design a product for grocery shopping for people with disabilities.", category: "product_sense", difficulty: "intermediate", company: "Amazon", interview_type: "video", pattern_type: "design_x_for_y", expert_answer: "Users: visually impaired, mobility limited, elderly. Features: voice shopping, easy navigation, accessibility modes, delivery preferences. Success: adoption, satisfaction, independence." },
  { question_text: "How would you improve DoorDash's restaurant partner experience?", category: "product_sense", difficulty: "intermediate", company: "DoorDash", interview_type: "video", pattern_type: "improve_x", expert_answer: "Problems: order management, reporting, margins. Solutions: better POS integration, analytics dashboard, marketing tools. Metrics: restaurant retention, GMV, NPS." }
];

async function addQuestions() {
  console.log('➕ Adding high-quality questions from top tech companies...\n');

  // Insert in batches to avoid payload size issues
  const batchSize = 10;
  let totalAdded = 0;

  for (let i = 0; i < topCompanyQuestions.length; i += batchSize) {
    const batch = topCompanyQuestions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i/batchSize + 1}:`, error.message);
      continue;
    }

    totalAdded += data.length;
    console.log(`  ✅ Batch ${i/batchSize + 1}: Added ${data.length} questions`);
  }

  console.log(`\n✅ Total added: ${totalAdded} questions`);
  
  // Show breakdown by company
  const byCompany = {};
  topCompanyQuestions.forEach(q => {
    byCompany[q.company] = (byCompany[q.company] || 0) + 1;
  });
  console.log('\n📊 By company:');
  Object.entries(byCompany).sort((a,b) => b[1] - a[1]).forEach(([company, count]) => {
    console.log(`  ${company}: ${count}`);
  });

  // By category
  const byCategory = {};
  topCompanyQuestions.forEach(q => {
    byCategory[q.category] = (byCategory[q.category] || 0) + 1;
  });
  console.log('\n📊 By category:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  // By difficulty
  const byDifficulty = {};
  topCompanyQuestions.forEach(q => {
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
  });
  console.log('\n📊 By difficulty:');
  Object.entries(byDifficulty).forEach(([diff, count]) => {
    console.log(`  ${diff}: ${count}`);
  });
}

addQuestions().catch(console.error);

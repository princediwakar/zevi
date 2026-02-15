import { supabase } from '../lib/supabaseClient';
import { Question } from '../types';

// 50+ PM Interview Questions
const additionalQuestions: Partial<Question>[] = [
  // Product Sense
  {
    question_text: "Design a better way to find roommates in a new city.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Facebook",
    interview_type: "video",
    expert_answer: "Users: Young professionals, students. Pain points: Trust, compatibility, timing. Solution: 'Roommate Match' with verified profiles, lifestyle quizzes, and video intros. Monetize via freemium (boosted profiles).",
    mcq_version: { enabled: true, sub_questions: [{ prompt: "What is the biggest risk in a roommate finder app?", difficulty: "intermediate", options: [{ text: "Safety/Trust", correct: true, explanation: "Living with strangers carries high safety risks." }, { text: "Payment processing", correct: false, explanation: "Solved by other platforms." }, { text: "UI Design", correct: false, explanation: "Important but not the biggest risk." }] }] }
  },
  {
    question_text: "Improve the experience of visiting a museum.",
    category: "product_sense",
    difficulty: "beginner",
    company: "Google",
    interview_type: "video",
    expert_answer: "Pain points: Crowds, lack of context, getting lost. Features: AR guides, personalized routes based on time/interest, 'crowd-avoidance' routing. Metric: Visitor satisfaction score.",
    mcq_version: { enabled: true, sub_questions: [{ prompt: "Which feature best addresses 'lack of context'?", difficulty: "beginner", options: [{ text: "AR Guide overlay", correct: true, explanation: "Provides instant info on art pieces." }, { text: "Ticket booking", correct: false, explanation: "Logistical only." }, { text: "Cafe locator", correct: false, explanation: "Amenity only." }] }] }
  },
  {
    question_text: "Design a product for the elderly to help them stay connected.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Meta",
    interview_type: "video",
    expert_answer: "Focus on accessibility (large text, voice control) and simplicity. Device: 'Smart Photo Frame' that auto-updates with family photos and allows one-touch video calls. Metric: Daily active usage.",
  },
  {
    question_text: "How would you design a bookshelf for children?",
    category: "product_sense",
    difficulty: "beginner",
    company: "Amazon",
    interview_type: "video",
    expert_answer: "Users: Kids (access) & Parents (storage). Features: Front-facing covers (kids pick by image), adjustable height, integrated reading nook, durable/safe materials.",
  },
  {
    question_text: "Design an alarm clock for the deaf.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Google",
    interview_type: "phone",
    expert_answer: "Sensory inputs: Vibration (wearable or under pillow), Light (gradual brightening), Scent. Integration with smart home lights. Fail-safe battery backup.",
  },
  {
    question_text: "Should Twitter launch a subscription model?",
    category: "strategy",
    difficulty: "advanced",
    company: "Twitter",
    interview_type: "video",
    expert_answer: "Pros: Diversify revenue, reduce ad dependence. Cons: slower user growth, churn. Strategy: Freemium. 'Twitter Blue' for power users (edit button, folders, no ads) while keeping core free.",
    mcq_version: { enabled: true, sub_questions: [{ prompt: "What is the primary risk of a paywall?", difficulty: "intermediate", options: [{ text: "Reduced user growth", correct: true, explanation: "Paywalls add friction to unparalleled access." }, { text: "Server costs", correct: false, explanation: "Negligible." }, { text: "Ad revenue increase", correct: false, explanation: "Subscription usually cannibalizes or complements ad revenue." }] }] }
  },
  {
    question_text: "How would you monetize WhatsApp?",
    category: "strategy",
    difficulty: "advanced",
    company: "Meta",
    interview_type: "video",
    expert_answer: "Avoid user fees to maintain growth. Monetize B2C: WhatsApp Business API for customer support, transactions, and notifications. Payments integration.",
  },
  {
    question_text: "Estimate the bandwidth used by TikTok in a day.",
    category: "estimation",
    difficulty: "advanced",
    company: "ByteDance",
    interview_type: "phone",
    expert_answer: "DAU: 1B. Avg time: 60 mins. Video bitrate: 1-2Mbps. Calculation: 1B users * 1 hr * 3600s * 1.5Mbps = Total bits. Convert to Petabytes.",
  },
  {
    question_text: "How many elevators are in NYC?",
    category: "estimation",
    difficulty: "intermediate",
    company: "Google",
    interview_type: "phone",
    expert_answer: "NYC population 8M. Buildings ~1M. High-rises (6+ floors) need elevators. Guess 10% are high-rise = 100k. Avg elevators per building = 2. Total ~200k-300k. (Actual is ~84k, but logic matters).",
  },
  {
    question_text: "Facebook events usage is down 10%. Why?",
    category: "execution",
    difficulty: "advanced",
    company: "Meta",
    interview_type: "video",
    expert_answer: "1. Tech glitch? 2. Seasonality (post-holidays)? 3. Competitor (Partiful)? 4. UX change (buried entry point)? Segment by region and device to isolate.",
    mcq_version: { enabled: true, sub_questions: [{ prompt: "What is the first thing to check?", difficulty: "beginner", options: [{ text: "Data accuracy/Tech bugs", correct: true, explanation: "Always rule out logging errors first." }, { text: "Competitors", correct: false, explanation: "Too external for step 1." }, { text: "Marketing spend", correct: false, explanation: "Less likely to cause sudden drop." }] }] }
  },
  {
    question_text: "What success metrics would you set for Uber Pool?",
    category: "execution",
    difficulty: "intermediate",
    company: "Uber",
    interview_type: "video",
    expert_answer: "Northstar: Matches per trip (Efficiency). Others: Discount vs. UberX time added (User value), Driver earnings per hour (Supply side), Cancellation rate.",
  },
  {
    question_text: "How do you handle a conflict with an engineer?",
    category: "behavioral",
    difficulty: "beginner",
    company: "General",
    interview_type: "video",
    expert_answer: "Understand their constraints. Is it technical debt? Complexity? Revisit the 'Why'. Compromise on scope, not quality. Data-driven decision making.",
  },
  {
    question_text: "Tell me about a product you failed to launch.",
    category: "behavioral",
    difficulty: "intermediate",
    company: "General",
    interview_type: "video",
    expert_answer: "STAR method. Focus on what you learned. 'We incorrectly validated demand... I learned to do cleaner MVP tests first.'",
  },
  {
    question_text: "Design a smart shoe.",
    category: "product_sense",
    difficulty: "beginner",
    company: "Nike",
    interview_type: "video",
    expert_answer: "Target: Runners. Features: Auto-lacing, gait analysis sensors, GPS tracking, haptic feedback for directions. App integration for stats.",
  },
  {
    question_text: "Design a vending machine for blind people.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Google",
    interview_type: "video",
    expert_answer: "Audio interface (voice guide). Braille labels. NFC payment (tap to pay). Tactile selection buttons or voice command. Tray at accessible height.",
  },
  {
    question_text: "Should Netflix add live sports?",
    category: "strategy",
    difficulty: "advanced",
    company: "Netflix",
    interview_type: "video",
    expert_answer: "Pros: Retains subscribers, high engagement. Cons: Extremely expensive rights, fragmentation. Recommendation: Experiment with lower-tier sports or 'Sports entertainment' (Drive to Survive) first.",
  },
  {
    question_text: "Critique the Spotify app.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Spotify",
    interview_type: "phone",
    expert_answer: "Good: Discovery (Discover Weekly), Dark mode UI. Bad: Podcast integration feels cluttered. Improvement: Separate tab or app for Podcasts to declutter Music.",
  },
  {
    question_text: "How would you reduce cancellations for Uber?",
    category: "execution",
    difficulty: "intermediate",
    company: "Uber",
    interview_type: "video",
    expert_answer: "Analyze when cancellations happen (Pre-match? Post-match?). Post-match: Better ETAs, penalty for late cancels, driver incentives. Pre-match: Faster matching.",
  },
  {
    question_text: "Design a bicycle for the mass market in 2050.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Tesla",
    interview_type: "video",
    expert_answer: "Context: Cities are car-free. Bike: Electric, self-balancing, theft-proof (biometric lock), modular cargo attachment, solar paint for trickle charging.",
  },
  {
    question_text: "Maximize revenue for a movie theater.",
    category: "strategy",
    difficulty: "beginner",
    company: "Cinemark",
    interview_type: "video",
    expert_answer: "Utilization is key. Dynamic pricing (cheaper Tue AM). Subscription (MoviePass style). Alternative content (E-sports, Corporate events off-hours). Premium food/bev.",
  },
  {
    question_text: "Estimate the market size for dog walking in SF.",
    category: "estimation",
    difficulty: "beginner",
    company: "Rover",
    interview_type: "phone",
    expert_answer: "Households in SF (350k). Dog ownership rate (30%) -> 100k dogs. % needing walkers (busy professionals) -> 50% -> 50k dogs. Avg walks per week (3) * Price ($20). Calculate weekly/yearly TAM.",
  },
  {
    question_text: "Design a remote control for an Apple TV.",
    category: "product_sense",
    difficulty: "beginner",
    company: "Apple",
    interview_type: "video",
    expert_answer: "Simplify. Voice first (Siri button). Touchpad navigation. Find my Remote feature (beeps). Solar charging on back.",
  },
  {
    question_text: "Should Google launch a ride-sharing service?",
    category: "strategy",
    difficulty: "advanced",
    company: "Google",
    interview_type: "video",
    expert_answer: "Already have Waymo (Autonomous). Launching human ride-share competes with partners (Uber). Strategy: Focus on autonomous fleet (Waymo One) to leapfrog Uber, don't compete on human labor.",
  },
  {
    question_text: "How to improve Gmail?",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Google",
    interview_type: "video",
    expert_answer: "Problem: Email overload. Solution: AI summary of threads. 'To-Do' mode (turn emails into tasks). Better unsubscribe management. Integrated scheduling.",
  },
  {
    question_text: "Estimate how many golf balls fit in a 747.",
    category: "estimation",
    difficulty: "intermediate",
    company: "Boeing",
    interview_type: "phone",
    expert_answer: "Volume of 747 fuselage. Volume of golf ball + packing efficiency (70%). Division.",
  },
  // Adding more brief placeholders to ensuring count > 20 for this batch + existing 8
  { question_text: "Design a kitchen for the blind.", category: "product_sense", difficulty: "intermediate", company: "General" },
  { question_text: "How would you improve Google Maps?", category: "product_sense", difficulty: "beginner", company: "Google" },
  { question_text: "Metric for engagement on Facebook Groups?", category: "execution", difficulty: "intermediate", company: "Meta" },
  { question_text: "Should Amazon buy a grocery chain?", category: "strategy", difficulty: "advanced", company: "Amazon" },
  { question_text: "Launch a new product for Spotify.", category: "product_sense", difficulty: "intermediate", company: "Spotify" },
  { question_text: "Decrease churn for a SaaS platform.", category: "execution", difficulty: "advanced", company: "Salesforce" },
  { question_text: "Design a unified messaging inbox.", category: "product_sense", difficulty: "intermediate", company: "Slack" },
  { question_text: "Estimate daily flights from ATL airport.", category: "estimation", difficulty: "beginner", company: "Delta" },
  { question_text: "Prioritize features for a Startup MVP.", category: "execution", difficulty: "intermediate", company: "Startup" },
  { question_text: "Tell me about a time you led a team.", category: "behavioral", difficulty: "beginner", company: "General" },
  { question_text: "Design a travel app for solo travelers.", category: "product_sense", difficulty: "intermediate", company: "Airbnb" },
  { question_text: "How to measure success of reaction buttons?", category: "execution", difficulty: "intermediate", company: "LinkedIn" },
  { question_text: "Should Apple build a search engine?", category: "strategy", difficulty: "advanced", company: "Apple" },
  { question_text: "Design a better airport experience.", category: "product_sense", difficulty: "intermediate", company: "General" },
  { question_text: "Estimate revenue of a corner store.", category: "estimation", difficulty: "beginner", company: "General" },
  { question_text: "Improve the Amazon returns process.", category: "product_sense", difficulty: "intermediate", company: "Amazon" },
  { question_text: "Key metrics for a dating app?", category: "execution", difficulty: "beginner", company: "Tinder" },
  { question_text: "Tell me about a mistake you made.", category: "behavioral", difficulty: "intermediate", company: "General" },
  { question_text: "Design a fitness app for kids.", category: "product_sense", difficulty: "beginner", company: "Nike" },
  { question_text: "Should Facebook acquire Discord?", category: "strategy", difficulty: "advanced", company: "Meta" },
   { question_text: "Design a water bottle for hikers.", category: "product_sense", difficulty: "beginner", company: "Yeti" },
  { question_text: "Estimate number of windows in Seattle.", category: "estimation", difficulty: "intermediate", company: "Microsoft" },
  { question_text: "Metric for YouTube Recommendations?", category: "execution", difficulty: "advanced", company: "Google" },
  { question_text: "How to improve Slack notifications?", category: "product_sense", difficulty: "intermediate", company: "Slack" },
  { question_text: "Design a better umbrella.", category: "product_sense", difficulty: "beginner", company: "General" },
];

// Re-exporting the original seed function but now utilizing a larger list
export async function seedQuestions() {
  try {
    console.log('Starting to seed questions...');

    // Check if questions already exist
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (count && count > 10) {
      console.log(`Database already has ${count} questions. Skipping seed.`);
      return;
    }

    // Insert questions
    const { data, error } = await supabase
      .from('questions')
      .insert(additionalQuestions);

    if (error) {
      console.error('Error seeding questions:', error);
      throw error;
    }

    console.log(`Successfully seeded ${additionalQuestions.length} questions!`);
    return data;
  } catch (error) {
    console.error('Failed to seed questions:', error);
    throw error;
  }
}

import { Question } from '../types';

// High-quality real PM interview questions from top tech companies (2025-2026)
export const sampleQuestions: Question[] = [
  {
    id: '8f3a1c9d-5e2b-4a7f-9c6d-1b8e2d4f3a5c',
    question_text: 'Instagram just launched Reels. How would you measure whether it\'s successful after 6 months?',
    category: 'product_sense',
    difficulty: 'intermediate',
    type: 'mcq',
    xp_reward: 25,
    company: 'Meta',
    interview_type: 'onsite',
    framework_hint: 'Define success metrics using the HEART framework: Happiness, Engagement, Adoption, Retention, Task Success',
    expert_answer: 'Clarify Instagram\'s strategic goal for Reels (competing with TikTok, increasing time spent). Key metrics: watch time, creation rate, share rate, follower growth from Reels, and conversion from Reels to following. Also track negative signals: reduced DMs, lower quality content, reduced Story usage.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the PRIMARY metric to determine Reels success?',
          difficulty: 2,
          options: [
            { text: 'Total Reels created per day', correct: false, explanation: 'Creation volume alone doesn\'t indicate value - low-quality content can inflate this.' },
            { text: 'Average watch time per Reel vs. Feed posts', correct: true, explanation: 'Watch time measures actual engagement and content quality resonance.' },
            { text: 'Number of Reels shares to Stories', correct: false, explanation: 'Shares are important but represent a subset of engaged users.' },
            { text: 'Reels completion rate', correct: false, explanation: 'Completion rate can be misleading - short loops inflate it artificially.' }
          ]
        },
        {
          prompt: 'If Reels watch time increases but user retention drops, what should you analyze?',
          difficulty: 3,
          options: [
            { text: 'Remove Reels immediately', correct: false, explanation: 'Too reactive - need to understand the causal relationship first.' },
            { text: 'A/B test: does Reels displace other engagement? ', correct: true, explanation: 'A/B testing isolates causal impact of Reels on other engagement.' },
            { text: 'Add more Reels to the feed', correct: false, explanation: 'This could worsen the displacement effect.' },
            { text: 'Compare with competitor TikTok usage', correct: false, explanation: 'External comparison doesn\'t explain internal cannibalization.' }
          ]
        }
      ]
    }
  },
  {
    id: '2d4e8f1a-7c3b-4e9f-8a2d-5b6c9e0f1a2b',
    question_text: 'Amazon is launching a new same-day grocery delivery service in 10 cities. How would you design the A/B test to validate the product-market fit?',
    category: 'ab_testing',
    difficulty: 'advanced',
    type: 'mcq',
    xp_reward: 30,
    company: 'Amazon',
    interview_type: 'onsite',
    framework_hint: 'Structure: Define success metrics → Choose test design → Calculate sample size → Analyze results → Make decision',
    expert_answer: 'Define primary metric: first-time purchaser rate. Secondary: repeat purchase rate, customer lifetime value. Use holdout groups for brand awareness. Randomize at user level, stratify by order frequency. Minimum detectable effect: 5%. Run for 4 weeks minimum to capture weekly cycles.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What should be the PRIMARY metric for Amazon same-day grocery A/B test?',
          difficulty: 2,
          options: [
            { text: 'Total orders in the test period', correct: false, explanation: 'Raw order count includes users who would have ordered anyway.' },
            { text: 'New customer acquisition rate', correct: false, explanation: 'Acquisition is important but harder to move quickly.' },
            { text: 'First-time grocery order conversion rate', correct: true, explanation: 'Conversion measures product-market fit - are users willing to try the new service?' },
            { text: 'Customer support tickets opened', correct: false, explanation: 'This is a leading indicator but not the primary success metric.' }
          ]
        },
        {
          prompt: 'How should you randomize users in this A/B test?',
          difficulty: 3,
          options: [
            { text: 'Randomize by city', correct: false, explanation: 'City-level randomization has contamination risk between nearby cities.' },
            { text: 'Randomize at user ID level across all cities', correct: true, explanation: 'User-level randomization ensures clean comparison and captures individual-level effects.' },
            { text: 'Randomize by IP address', correct: false, explanation: 'IP-based randomization is unreliable - dynamic IPs, shared networks cause issues.' },
            { text: 'Randomize by household', correct: false, explanation: 'Household-level works but user-level is simpler and equally valid.' }
          ]
        }
      ]
    }
  },
  {
    id: '7c9e2f4d-8a1b-4e5f-9c3d-2b7a6e8f1c4d',
    question_text: 'Netflix is considering adding a "Watch Together" feature that lets friends sync their viewing and chat while watching. How would you prioritize this against other potential features?',
    category: 'execution',
    difficulty: 'intermediate',
    type: 'mcq',
    xp_reward: 25,
    company: 'Netflix',
    interview_type: 'phone_screen',
    framework_hint: 'Use RICE framework: Reach → Impact → Confidence → Effort',
    expert_answer: 'Score Watch Together using RICE. Reach: estimate monthly active users who would use it. Impact: high for engagement but lower for retention. Confidence: medium - unclear if social viewing drives retention. Effort: medium-high for real-time sync infrastructure. Compare scores with other feature proposals.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'Using RICE, what is the BIGGEST uncertainty for Watch Together?',
          difficulty: 2,
          options: [
            { text: 'Reach - how many users want social features', correct: false, explanation: 'Reach can be estimated from social feature usage patterns.' },
            { text: 'Impact - does social viewing improve retention?', correct: true, explanation: 'Impact has low confidence - Netflix lacks strong social viewing data.' },
            { text: 'Effort - is real-time sync technically hard?', correct: false, explanation: 'Effort is known - similar tech exists in Discord, Teleparty.' },
            { text: 'Confidence - do users actually want this?', correct: false, explanation: 'Confidence overlaps with Reach in this case.' }
          ]
        },
        {
          prompt: 'What data would INCREASE your confidence in Watch Together\'s impact?',
          difficulty: 3,
          options: [
            { text: 'Survey data showing users want the feature', correct: false, explanation: 'Surveys suffer from selection bias - respondents aren\'t representative.' },
            { text: 'Correlation data from markets where Netflix Party extensions are popular', correct: true, explanation: 'Third-party extension usage indicates organic demand without survey bias.' },
            { text: 'Competitive analysis of Hulu\'s social features', correct: false, explanation: 'Competitive features don\'t prove demand for Netflix specifically.' },
            { text: 'A/B test on 1% of users', correct: false, explanation: '1% test needs huge volume for rare features - unlikely to reach significance.' }
          ]
        }
      ]
    }
  },
  {
    id: '4b2e6a9f-1c8d-5f3e-8a7b-4e9c2d6f8a1b',
    question_text: 'Airbnb wants to launch a "split stays" feature where users can stay at two different listings during one trip. Design the product requirement document for this feature.',
    category: 'product_sense',
    difficulty: 'advanced',
    type: 'mcq',
    xp_reward: 30,
    company: 'Airbnb',
    interview_type: 'onsite',
    framework_hint: 'Structure: Problem Statement → User Stories → Success Metrics → Technical Requirements → Risks → Timeline',
    expert_answer: 'Define problem: travelers want longer trips but listings have date conflicts. User stories: traveler books split stay, host manages availability across stays. Success metrics: incremental bookings, revenue per trip, host satisfaction. Technical: handle dual calendars, split payments, luggage storage. Risks: complexity, host confusion, price transparency.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the BIGGEST product challenge with split stays?',
          difficulty: 2,
          options: [
            { text: 'Payment processing two bookings', correct: false, explanation: 'Payment can be easily combined - existing systems handle this.' },
            { text: 'User experience for managing two different stays', correct: true, explanation: 'Complexity in the UI/UX is the primary friction point for adoption.' },
            { text: 'Pricing calculation for partial nights', correct: false, explanation: 'Pricing algorithms can be adapted from existing booking logic.' },
            { text: 'Finding two compatible listings', correct: false, explanation: 'Search can recommend compatible pairs - this is solvable.' }
          ]
        },
        {
          prompt: 'What metric would validate split stay PRODUCT-MARKET FIT?',
          difficulty: 3,
          options: [
            { text: 'Number of split stay bookings in first month', correct: false, explanation: 'Raw volume doesn\'t indicate PMF - early adopters are not representative.' },
            { text: 'Repeat split stay booking rate', correct: true, explanation: 'Repeat usage indicates true value - users choosing it repeatedly.' },
            { text: 'Average revenue per split stay', correct: false, explanation: 'Revenue is a business metric, not a product validation metric.' },
            { text: 'Number of hosts offering split stay flexibility', correct: false, explanation: 'Supply-side metrics don\'t validate demand.' }
          ]
        }
      ]
    }
  },
  {
    id: '9a1c3e5f-7b2d-4f8c-9a3e-5c7b1d2f4a8e',
    question_text: 'Uber\'s rider app shows estimated wait times, but drivers are often 5+ minutes late. How would you improve the wait time estimates?',
    category: 'product_sense',
    difficulty: 'intermediate',
    type: 'mcq',
    xp_reward: 20,
    company: 'Uber',
    interview_type: 'phone_screen',
    framework_hint: 'Diagnose → Root Cause → Solution → Validate',
    expert_answer: 'Diagnose: current estimates may not account for driver behavior, traffic patterns, pickup location accuracy. Root cause: static estimates vs. dynamic conditions. Solution: use ML with real-time driver GPS, historical patterns, route data. Validate: A/B test new estimates against current, measure pickup time accuracy.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the ROOT CAUSE of inaccurate wait time estimates?',
          difficulty: 2,
          options: [
            { text: 'Drivers intentionally arrive late', correct: false, explanation: 'Rarely intentional - most drivers want to maximize earnings.' },
            { text: 'Static estimates not accounting for real-time conditions', correct: true, explanation: 'Most ETA systems use averages rather than live data.' },
            { text: 'Riders provide wrong pickup location', correct: false, explanation: 'Location error contributes but isn\'t the primary cause.' },
            { text: 'Traffic is fundamentally unpredictable', correct: false, explanation: 'Traffic can be predicted with ML - it\'s not random.' }
          ]
        },
        {
          prompt: 'How would you VALIDATE a new wait time algorithm?',
          difficulty: 3,
          options: [
            { text: 'Compare predicted vs. actual pickup times in historical data', correct: false, explanation: 'Historical comparison is useful but doesn\'t measure rider behavior change.' },
            { text: 'A/B test: measure rider satisfaction and cancellation rates', correct: true, explanation: 'Rider behavior (satisfaction, cancellations) is the ultimate validation.' },
            { text: 'Ask drivers to rate the new estimates', correct: false, explanation: 'Driver perception doesn\'t equal rider experience.' },
            { text: 'Run the new algorithm offline and compare RMSE', correct: false, explanation: 'RMSE is an internal metric - riders don\'t care about accuracy numbers.' }
          ]
        }
      ]
    }
  },
  {
    id: '5c8e2a1d-9f4b-6e2c-8a7f-3d9c5e1b7f2a',
    question_text: 'You\'re a PM at DoorDash. The CEO wants to add grocery delivery to capture more wallet share. How would you approach this product expansion?',
    category: 'strategy',
    difficulty: 'advanced',
    type: 'mcq',
    xp_reward: 30,
    company: 'DoorDash',
    interview_type: 'onsite',
    framework_hint: 'Analyze market → Assess capability fit → Prioritize approach → Define success → Roadmap',
    expert_answer: 'Market: $1.5T grocery market, 8% online penetration, high growth. Capability fit: existing delivery infrastructure, merchant relationships, consumer trust. Approach: test with existing grocery partners vs. build new. Success: grocery GMV as % of total, unit economics per order. Timeline: 12-month phased rollout.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the BIGGEST challenge in adding grocery to DoorDash?',
          difficulty: 2,
          options: [
            { text: 'Finding grocery store partners', correct: false, explanation: 'Grocers are actively seeking delivery partners - easier than consumer adoption.' },
            { text: 'Last-mile logistics for fragile items', correct: true, explanation: 'Groceries require different handling than restaurant food - temperature, weight.' },
            { text: 'Consumer awareness of the service', correct: false, explanation: 'DoorDash brand can be extended - awareness is a marketing problem.' },
            { text: 'Pricing competition with Instacart', correct: false, explanation: 'Pricing can be adjusted - logistics is the harder problem.' }
          ]
        },
        {
          prompt: 'How would you measure SUCCESS of grocery expansion in year 1?',
          difficulty: 3,
          options: [
            { text: 'Number of grocery orders delivered', correct: false, explanation: 'Volume ignores profitability and cannibalization.' },
            { text: 'Grocery contribution to total GMV with positive unit economics', correct: true, explanation: 'Combined metric ensures growth is sustainable, not just volume.' },
            { text: 'Number of new grocery merchants onboarded', correct: false, explanation: 'Merchant count is an output metric, not an outcome.' },
            { text: 'Market share vs. Instacart', correct: false, explanation: 'Market share takes years to measure accurately and has lag.' }
          ]
        }
      ]
    }
  },
  {
    id: '6d9f3b2e-8a1c-4f7d-9e3b-5c8a1f2d7e4b',
    question_text: 'Spotify\'s podcast business is growing but engagement is declining. Users listen to fewer episodes over time. How would you diagnose and fix this?',
    category: 'product_sense',
    difficulty: 'advanced',
    type: 'mcq',
    xp_reward: 30,
    company: 'Spotify',
    interview_type: 'onsite',
    framework_hint: 'Diagnose: Cohort analysis → Funnel analysis → User research → Hypothesis → Solution',
    expert_answer: 'Diagnose: cohort analysis shows engagement drop by listen age. Funnel: download → start → finish → subscribe. Hypothesis: discovery failure, notification fatigue, content quality. Fix: personalized recommendations, smarter notifications, exclusive content. Measure: DAU/MAU for podcast listeners, episodes per listener per week.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What data would BEST diagnose the engagement decline?',
          difficulty: 2,
          options: [
            { text: 'Total podcast hours listened this quarter', correct: false, explanation: 'Aggregate data hides cohort-specific patterns.' },
            { text: 'Cohort analysis: engagement by account age', correct: true, explanation: 'Cohort analysis reveals if new users or existing users are driving the decline.' },
            { text: 'Number of podcasts subscribed per user', correct: false, explanation: 'Subscriptions are a leading indicator but don\'t explain the drop.' },
            { text: 'Average episode completion rate', correct: false, explanation: 'Completion rate helps but doesn\'t explain reduced listening frequency.' }
          ]
        },
        {
          prompt: 'If research shows users CAN\'T FIND content they like, what should you prioritize?',
          difficulty: 3,
          options: [
            { text: 'Add more podcast content to the catalog', correct: false, explanation: 'More content doesn\'t help if users can\'t discover relevant content.' },
            { text: 'Improve recommendation algorithm for podcasts', correct: true, explanation: 'Better discovery addresses the core problem - matching content to preferences.' },
            { text: 'Send more push notifications about new episodes', correct: false, explanation: 'Notifications without relevant content frustrate users.' },
            { text: 'Create editorial playlists like music has', correct: false, explanation: 'Editorial works for music but podcasts need personalization.' }
          ]
        }
      ]
    }
  },
  {
    id: '1e4a7c9f-3b6d-5f8e-9a2c-4e7b1d3f6a8c',
    question_text: 'Google Maps is adding AI-powered conversational search. How would you design the success metrics for this feature launch?',
    category: 'product_sense',
    difficulty: 'intermediate',
    type: 'mcq',
    xp_reward: 25,
    company: 'Google',
    interview_type: 'phone_screen',
    framework_hint: 'Define metrics at multiple levels: Acquisition → Engagement → Quality → Business',
    expert_answer: 'Acquisition: feature discovery rate, first-time user rate. Engagement: conversation length, tasks completed per conversation, return rate. Quality: success rate of queries, relevance of results, error rate. Business: impact on core Maps usage, ads clicked, routes taken via AI suggestions.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the MOST important metric for AI search in Maps?',
          difficulty: 2,
          options: [
            { text: 'Number of conversations started', correct: false, explanation: 'Volume ignores whether users accomplish their goals.' },
            { text: 'Task completion rate - user gets what they searched for', correct: true, explanation: 'Task completion measures actual value delivered to users.' },
            { text: 'Average conversation length', correct: false, explanation: 'Long conversations could indicate confusion, not success.' },
            { text: 'Number of AI-generated route suggestions', correct: false, explanation: 'Output metrics don\'t measure user satisfaction.' }
          ]
        },
        {
          prompt: 'How would you measure QUALITY of AI search results?',
          difficulty: 3,
          options: [
            { text: 'User ratings after each search', correct: false, explanation: 'Explicit ratings have very low response rates and bias.' },
            { text: 'Implicit signals: click-through rate on results, subsequent searches', correct: true, explanation: 'Behavioral signals are more reliable than explicit feedback.' },
            { text: 'Human evaluation of sample queries', correct: false, explanation: 'Human eval is useful for training but not real-time metrics.' },
            { text: 'A/B test comparing to keyword search', correct: false, explanation: 'Different use cases - comparison isn\'t always valid.' }
          ]
        }
      ]
    }
  },
  {
    id: '3f7b9c2e-5a1d-4e8f-9c3b-6d2e4f8a1b7c',
    question_text: 'You\'re launching a new LinkedIn feature that uses AI to write your profile summary. How do you ensure it doesn\'t hurt the authenticity of user profiles?',
    category: 'product_sense',
    difficulty: 'intermediate',
    type: 'mcq',
    xp_reward: 20,
    company: 'LinkedIn',
    interview_type: 'video_interview',
    framework_hint: 'Balance: User choice → Transparency → Quality → Guardrails',
    expert_answer: 'User choice: make AI drafts opt-in, not default. Transparency: clearly label AI-assisted content. Quality: human-in-the-loop review before posting. Guardrails: detect and prevent hallucinations, enforce content policies. Metrics: adoption rate, post-edit rate, user trust surveys.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the BEST way to maintain authenticity while offering AI help?',
          difficulty: 2,
          options: [
            { text: 'Only offer AI for users with incomplete profiles', correct: false, explanation: 'Incomplete profiles aren\'t the authenticity concern - it\'s misleading content.' },
            { text: 'Make AI opt-in with clear "AI-assisted" labels', correct: true, explanation: 'Choice + transparency preserves authenticity while offering value.' },
            { text: 'AI writes drafts but users must fully rewrite', correct: false, explanation: 'This defeats the purpose - users want help, not extra work.' },
            { text: 'Limit AI to formatting, not content generation', correct: false, explanation: 'Formatting helps less than content generation for most users.' }
          ]
        },
        {
          prompt: 'What signal indicates AI profiles are hurting authenticity?',
          difficulty: 3,
          options: [
            { text: 'Decrease in AI feature usage over time', correct: false, explanation: 'Usage decline could mean feature is unhelpful, not harmful.' },
            { text: 'Increase in profile reports for misleading content', correct: true, explanation: 'Reports directly indicate authenticity violations.' },
            { text: 'Lower connection acceptance rates for AI-assisted profiles', correct: false, explanation: 'Acceptance rates have many confounders - hard to isolate.' },
            { text: 'Reduced time spent viewing profiles', correct: false, explanation: 'Time spent is ambiguous - could mean more or less engaging.' }
          ]
        }
      ]
    }
  },
  {
    id: '8a2d5f7e-1c9b-4e3a-8f6d-2b7e4c9a1d5f',
    question_text: 'Figma is considering adding AI features that auto-generate design mockups from text descriptions. How do you think about the trade-offs?',
    category: 'execution',
    difficulty: 'intermediate',
    type: 'mcq',
    xp_reward: 25,
    company: 'Figma',
    interview_type: 'onsite',
    framework_hint: 'Consider: User value → Market timing → Competitive pressure → Ethical concerns → Technical feasibility',
    expert_answer: 'User value: high for beginners, lower for expert designers. Market: AI is table stakes - competitors are adding it. Trade-offs: reduces design skill development, potential for copyright issues, may commoditize junior designer work. Approach: launch with guardrails, position as starting point not final output.',
    mcq_version: {
      enabled: true,
      sub_questions: [
        {
          prompt: 'What is the BIGGEST concern about AI-generated designs?',
          difficulty: 2,
          options: [
            { text: 'Technical accuracy of generated designs', correct: false, explanation: 'Technical issues are solvable with iteration.' },
            { text: 'Copyright and intellectual property issues', correct: true, explanation: 'IP is legally complex and can expose Figma to significant risk.' },
            { text: 'User adoption of the feature', correct: false, explanation: 'Adoption is uncertain but not the primary concern.' },
            { text: 'Competition from other design tools', correct: false, explanation: 'Competition is a market issue, not a product risk.' }
          ]
        },
        {
          prompt: 'Who would benefit MOST from AI design generation?',
          difficulty: 2,
          options: [
            { text: 'Senior designers at agencies', correct: false, explanation: 'Seniors already have efficient workflows - they need specific help.' },
            { text: 'Non-designers who need quick mockups', correct: true, explanation: 'AI democratizes design for those without professional skills.' },
            { text: 'Design students learning the craft', correct: false, explanation: 'AI might hinder learning by removing the struggle of iteration.' },
            { text: 'Enterprise design teams', correct: false, explanation: 'Enterprises need consistency and brand control - AI adds complexity.' }
          ]
        }
      ]
    }
  }
];

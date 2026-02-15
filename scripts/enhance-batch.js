require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mgpcdgeptcjvplrjptur.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
                    process.env.SUPABASE_SECRET_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase configuration.');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or EXPO_PUBLIC_SUPABASE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced answer templates based on quality seed data
const enhancedAnswers = {
  // Product Sense Template
  product_sense: (question, segments, painPoints, solutions, metrics) => `
USER SEGMENTS:
${segments}

KEY PAIN POINTS:
${painPoints}

PROPOSED SOLUTIONS:
${solutions}

TRADE-OFFS TO CONSIDER:
- User experience vs implementation complexity
- Short-term vs long-term impact
- Resources required vs expected ROI
- User privacy vs personalization

SUCCESS METRICS:
${metrics}

FOLLOW-UP CONSIDERATIONS:
- How would you prioritize these features in an MVP?
- What technical dependencies exist?
- How do you measure success over time?
`,

  // Execution/Metrics Template
  execution: (question, problem, analysis, solutions, metrics) => `
PROBLEM DEFINITION:
${problem}

DIAGNOSIS FRAMEWORK:
${analysis}

KEY HYPOTHESES TO TEST:
- H1: Primary cause hypothesis
- H2: Secondary cause hypothesis  
- H3: External factor hypothesis

SOLUTIONS (ranked by impact):
${solutions}

SUCCESS METRICS:
${metrics}

COMPETITIVE ANALYSIS:
- What are competitors doing?
- What best practices can be adopted?
- Differentiation opportunities?
`,

  // Strategy Template
  strategy: (question, stakeholders, prosCons, recommendation, risks) => `
STAKEHOLDER ANALYSIS:
${stakeholders}

PROS AND CONS:
${prosCons}

STRATEGIC RECOMMENDATION:
${recommendation}

RISKS AND MITIGATIONS:
${risks}

IMPLEMENTATION ROADMAP:
- Phase 1: Quick wins
- Phase 2: Core features
- Phase 3: Scale and optimize
`
};

// Questions to enhance (ids and their enhancement data)
const questionsToEnhance = [
  {
    id: '9db3b624-42d8-4415-a4a9-4c313363be4e',
    category: 'execution',
    enhanced: `PROBLEM DEFINITION:
Feature vs product distinction is fundamental to PM work. A feature adds functionality to an existing product; a product is a standalone solution to a user problem.

DIAGNOSIS FRAMEWORK:
1. Value Creation: Does it solve a core user problem standalone?
2. Revenue Model: Can it be sold independently?
3. User Relationship: Do users identify with it as a destination?
4. Lifecycle: Does it have its own growth/decline trajectory?

ANALYSIS:
Key Questions to Ask:
- Can users accomplish their core task without this?
- Is this the primary reason users come to us?
- Could this exist as a standalone business?
- Does it have distinct users from the main product?

EXAMPLES:
- Gmail was a product (standalone email), now feature of Google Workspace
- Stories was a product (Snapchat), now feature across Instagram/Facebook
- Google Maps was product, now embedded feature in search

SUCCESS METRICS:
Primary: Engagement relative to rest of product
Secondary: Usage frequency, user retention, revenue attribution
`
  },
  {
    id: '98f73e77-2f1e-44e1-b54e-9679a7312d45',
    category: 'product_sense',
    enhanced: `USER PERSONAS DEFINITION:
A user persona is a fictional representation of your target user based on research and data about your actual users.

WHY CREATE PERSONAS:
1. Empathy Building: Put faces to user data
2. Decision Framework: Guide product decisions
3. Communication: Align team on user understanding
4. Prioritization: Help prioritize features by user value

HOW TO CREATE EFFECTIVE PERSONAS:
1. Research: User interviews, surveys, analytics
2. Segment: Group by behaviors, needs, goals
3. Detail: Name, demographics, goals, frustrations
4. Validate: Test against real user data

PERSONA COMPONENTS:
- Demographics: Age, job, location
- Goals: What they want to accomplish
- Pain Points: Challenges they face
- Behaviors: How they use similar products
- Motivations: Why they care

EXAMPLE PERSONA:
"Marketing Mary"
- 28-35, Marketing Manager at tech startup
- Goals: Track campaign performance, optimize ROI
- Pain: Data scattered across tools, manual reporting
- Behaviors: Lives in dashboards, mobile on-the-go
`
  },
  {
    id: '0ee6182e-4e0a-4386-a3c6-4bee32690f73',
    category: 'execution',
    enhanced: `NORTH STAR METRIC DEFINITION:
The North Star Metric (NSM) is the single metric that best captures the value you deliver to customers.

WHY IT MATTERS:
1. Aligns entire company around customer value
2. Focuses product development on outcomes, not outputs
3. Creates clear success criteria for teams

CHARACTERISTICS OF A GOOD NSM:
- Measures customer value created
- Is leading (predicts future success)
- Is measurable and actionable
- Is understood by everyone

EXAMPLES:
- Airbnb: Booking leads
- Facebook: Daily active users
- Slack: Sending messages
- Spotify: Time spent listening
- Uber: Trips completed

HOW TO FIND YOUR NSM:
1. Map customer journey
2. Identify the key value moment
3. Find the metric that predicts growth
4. Test and iterate

COMMON MISTAKES:
- Choosing vanity metrics (downloads, signups)
- Picking lagging metrics (revenue, profit)
- Having multiple "north stars"
`
  },
  {
    id: '2f621ca6-35bc-4c55-9fdc-234db473ddb5',
    category: 'execution',
    enhanced: `AARRR PIRATE METRICS (ACQUISITION → ACTIVATION → RETENTION → REFERRAL → REVENUE):

ACQUISITION (How users find you):
- Channels: Organic, paid, referral, social
- Metrics: CAC, traffic sources, conversion by channel
- Questions: Which channels drive quality users?

ACTIVATION (First value moment):
- Definition: User completes key action showing value
- Metrics: Activation rate, time to value
- Questions: What's the "aha moment" for your product?

RETENTION (Users come back):
- Metrics: Retention rate, churn, LTV
- Cohorts: Compare behavior over time
- Questions: Why do users leave? Why do they stay?

REFERRAL (Users tell others):
- Metrics: K-factor, NPS, viral coefficient
- Drivers: Product delight, incentives
- Questions: What makes users recommend?

REVENUE (Business model):
- Metrics: MRR, ARPU, margin
- Optimization: Pricing, upgrades, expansion
- Questions: How much is user worth over time?

HOW TO USE:
1. Identify leak in funnel
2. Focus resources on worstperforming metric
3. Test hypotheses for improvement
4. Measure impact
`
  },
  {
    id: '5b02cc30-7d28-48cc-9c46-23178d761f9a',
    category: 'product_sense',
    enhanced: `RECOMMENDATION SYSTEM DESIGN:

USER SEGMENTS:
1. New Users: No history, cold start problem
2. Casual Users: Limited history, need exploration
3. Power Users: Rich history, precise preferences

KEY PAIN POINTS:
- Cold start: New users have no data
- Filter bubbles: Don't show anything new
- Privacy concerns: Data usage transparency
- Scalability: Real-time recommendations

SOLUTION COMPONENTS:
1. Content-Based Filtering:
   - Recommend similar items to what user liked
   - Works with no user data
   - Limited discovery

2. Collaborative Filtering:
   - Similar users like similar things
   - Requires user community
   - Better discovery

3. Hybrid Approach:
   - Combine both methods
   - Weight by data availability
   - Context awareness

ALGORITHM CONSIDERATIONS:
- Real-time vs batch processing
- Diversity vs accuracy tradeoff
- Explainability for users
- Feedback loop integration

SUCCESS METRICS:
- Click-through rate (CTR)
- Conversion rate
- Time spent
- User satisfaction
- Diversity of recommendations
`
  }
];

async function enhanceBatch() {
  console.log('Enhancing batch of questions...\n');
  
  let enhanced = 0;
  let failed = 0;
  
  for (const q of questionsToEnhance) {
    const { error } = await supabase
      .from('questions')
      .update({ expert_answer: q.enhanced })
      .eq('id', q.id);
    
    if (error) {
      console.log(`Failed: ${q.id} - ${error.message}`);
      failed++;
    } else {
      console.log(`Enhanced: ${q.id} (${q.enhanced.length} chars)`);
      enhanced++;
    }
  }
  
  console.log(`\nDone! Enhanced: ${enhanced}, Failed: ${failed}`);
}

enhanceBatch().catch(console.error);

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mgpcdgeptcjvplrjptur.supabase.co', 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd');

const enhanceList = [
  // STRATEGY
  { 
    id: 'c18e4f00-71f7-47de-8c74-0adb9df6ed87', 
    ans: `STAKEHOLDER ANALYSIS:
Twitter has multiple stakeholders with competing interests:
- Advertisers: Want broad reach, brand safety
- Power Users: Want features, less ads
- Casual Users: Want content, simplicity
- Shareholders: Want growth, revenue

PROS OF SUBSCRIPTION:
1. Revenue Diversification: Reduce ad dependence (40% of revenue)
2. Premium Features: Edit button, folders, bookmark collections
3. Power User Pay: Those who want more will pay
4. Reduced Ads: Better experience for subscribers

CONS OF SUBSCRIPTION:
1. Network Effect Dilution: Less users = less value
2. Cannibalization: Pay for features free users want
3. Growth Slows: Friction to signup
4. Content Gaps: Less content from free users

RECOMMENDATION: Freemium Model (Twitter Blue)
- Keep core product free (timeline, notifications)
- Premium: $8/month for edit, undo, no ads, folders
- Goal: Convert 5-10% of DAU to paid

IMPLEMENTATION:
Phase 1: Launch Blue with basic features
Phase 2: A/B test pricing
Phase 3: Add more premium features
Phase 4: Consider API access for developers`
  },
  { 
    id: '6a4f056f-3a5c-475a-98d1-a7a0fb7f4fb5', 
    ans: `MONETIZATION STRATEGY FOR WHATSAPP:

STAKEHOLDER CONSIDERATIONS:
- 2B+ Users: Don't want to pay (ads would destroy trust)
- Businesses: Will pay for tools
- Meta: Wants ROI from $19B acquisition

RECOMMENDED APPROACH: Business Monetization

B2B REVENUE STREAMS:
1. WhatsApp Business API:
   - Customer support chatbots
   - Transaction notifications
   - Marketing messages (opt-in)
   
2. WhatsApp Business App:
   - Catalog features
   - Label organization
   - Quick replies

3. Payments (Where Allowed):
   - P2P transfers (India, Brazil)
   - Merchant transactions

WHY NOT USER ADS:
- E2E encryption makes targeting difficult
- User trust is WhatsApp's value
- Would accelerate competitor migration

SUCCESS METRICS:
- Business revenue per user
- API adoption rate
- Message volume (business)`
  },
  { 
    id: '41ea60bb-a150-44f5-8ac1-3dea5771c5b7', 
    ans: `NETFLIX LIVE SPORTS STRATEGY:

STAKEHOLDER ANALYSIS:
- Subscribers: Want variety, not sports necessarily
- Sports Fans: Might join/leave for live sports
- Competitors: Amazon (Prime), Apple (MLS)

PROS OF ADDING SPORTS:
1. Subscriber Retention: Live events drive engagement
2. Acquisition: Sports fans might switch
3. Differentiation: Stand out from streaming wars

CONS OF ADDING SPORTS:
1. Extremely Expensive: NFL rights = $2B+/year
2. Fragmentation: Can't get all major sports
3. Not Core: Movie/TV is Netflix DNA

RECOMMENDATION: Gradual Approach

PHASE 1 - Low-Risk:
- Sports documentaries (Drive to Survive format)
- Non-exclusive events (tennis, golf)
- Niche sports (pickleball, surfing)

PHASE 2 - Selective:
- Lower-tier leagues
- Regional sports rights
- College sports

PHASE 3 - Major Sports:
- Only if competitive necessity
- Partner for shared rights`
  },
  
  // ESTIMATION
  { 
    id: 'f97b676e-5f6e-4f12-8569-f5c6624aec3d', 
    ans: `TIKTOK BANDWIDTH ESTIMATION:

ASSUMPTIONS:
- DAU: 1 billion users
- Average time: 60 minutes/day
- Video bitrate: 1-2 Mbps (averaging 1.5 Mbps)
- Not all DAU active at once (30% concurrent)

CALCULATION:
1. Active users at any moment: 1B × 30% = 300M users
2. Bandwidth per user: 1.5 Mbps = 0.1875 MB/s
3. Total bandwidth: 300M × 0.1875 = 56.25 million MB/s = 56.25 TB/s
4. Daily traffic: 56.25 TB/s × 86,400 seconds = 4.86 million TB/day
5. Convert: ~4.86 Exabytes/day or ~4,860 Petabytes/day

VALIDATION:
- Netflix uses ~15GB/hour per stream
- TikTok is shorter videos, more efficient
- Real estimate: 1-5 Exabytes/day

ANSWER FRAMEWORK:
1. State assumptions clearly
2. Show calculation steps
3. Validate with real-world comparisons
4. Discuss what would change estimate`
  },
  { 
    id: 'eefbdd9d-c29b-4db0-b535-fd79f8730d26', 
    ans: `NYC ELEVATORS ESTIMATION - BOTTOM-UP:

STEP 1: NYC Building Types
- Total buildings: ~1 million
- 1-2 family homes: ~70% = 700k (no elevators)
- 3-5 unit buildings: ~15% = 150k (rarely have elevators)
- 6+ floors (high-rises): ~10% = 100k buildings

STEP 2: Elevators per High-Rise
- Low-rise (6-10 floors): 1-2 elevators avg
- Mid-rise (11-20 floors): 2-4 elevators avg  
- High-rise (20+ floors): 4-8 elevators avg

STEP 3: Calculate
- Assume distribution: 60% low, 30% mid, 10% high
- Low: 60k × 1.5 = 90k
- Mid: 30k × 3 = 90k
- High: 10k × 6 = 60k
- TOTAL: ~240,000 elevators

VALIDATION:
- Actual count: ~84,000 (varies by source)
- Most NYC buildings are small - adjust to ~80,000-100,000

KEY INSIGHT: Reasoning matters more than exact number!

FRAMEWORK:
1. Break into categories
2. Estimate per-category
3. Sum and validate
4. Show sensitivity analysis`
  },
  { 
    id: '5c83588b-e1fa-49ad-a55c-5456fc98c717', 
    ans: `DOG WALKING MARKET SIZE - SAN FRANCISCO:

STEP 1: Base Population
- San Francisco households: ~350,000
- Population: ~800,000

STEP 2: Dog Ownership
- Dog ownership rate: ~30% nationally
- SF might be higher: 35%
- Households with dogs: 350k × 35% = ~122,500

STEP 3: Addressable Market
- Target: Working professionals
- Assume 50% have jobs requiring commuting
- Dogs needing walkers: 122,500 × 50% = 61,250 dogs

STEP 4: Service Frequency
- Dogs walked: 3-5 times/week average
- Weekly walks needed: 61,250 × 4 = 245,000 walks/week

STEP 5: Pricing
- Average walk: $20-25 per walk
- Use $22 average
- Weekly revenue: 245,000 × $22 = $5.39M/week
- Annual revenue: $5.39M × 52 = $280M

VALIDATION:
- Rover data: ~$300M estimated market
- Reasonable range: $200-400M

TAM vs SAM vs SOM:
- TAM: $280M
- SOM (single app, ~10%): $28M`
  },

  // BEHAVIORAL
  { 
    id: '7fcd43a7-1475-410c-922a-2dca070ff0e4', 
    ans: `CONFLICT WITH ENGINEER - STAR RESPONSE:

SITUATION:
At my previous company, I was leading a consumer app launch with a 2-week deadline. Our lead engineer said a core feature was "impossible" to build in time.

TASK:
Deliver the feature on schedule without compromising quality or team relationships.

ACTION (What I did specifically):
1. 1:1 Conversation:
   - Asked open questions to understand constraints
   - Discovered technical debt from previous project
   
2. Problem-Solving Together:
   - Met with tech lead to review code
   - Found workarounds for 60% of the complexity
   - Identified true "must-haves" vs "nice-to-haves"

3. Scope Negotiation:
   - Prepared trade-off options for stakeholders
   - Proposed phased rollout (MVP + future)
   - Got buy-in on reduced scope for launch

4. Partnership:
   - Offered to help with documentation
   - Arranged pair programming sessions

RESULT:
- Launched on time with 80% of original scope
- Feature worked flawlessly at launch
- Created "technical review" process for future projects

LESSON LEARNED:
Never assume "impossible" without understanding the root cause. PMs should be translators, not order-givers.`
  },
  { 
    id: '84adc89e-61df-4dd2-84d5-d6cd6e3e09c3', 
    ans: `PRODUCT LAUNCH FAILURE - STAR RESPONSE:

SITUATION:
Launched a B2B feature that users hated. Adoption was <5% of expected after 3 months.

TASK:
As the PM, I owned this failure and needed to fix it.

ACTION:
1. Diagnosis:
   - Launched without beta testing
   - Assumed enterprise users wanted what consumers wanted
   - Poor onboarding flow
   
2. User Research:
   - Interviewed 20 non-adopters
   - Key insight: Too complex for their workflow
   - 80% didn't understand the value prop

3. Fix Implementation:
   - Created beta program
   - Simplified UX (3 clicks → 1 click)
   - Added in-app guidance
   
4. Relationship Repair:
   - Was transparent about issues
   - Offered free extension to affected customers

RESULT:
- After 3 months of fixes, adoption reached 40% of target
- Customer satisfaction improved from 2.1 → 4.2 stars
- Created "beta-first" product process

REFLECTION:
- Should have validated with 5 customers before launch
- Need more diverse testing (not just power users)`
  },
  { 
    id: 'bb8346d1-675a-45d3-9271-8e3ff2fea195', 
    ans: `INFLUENCE WITHOUT AUTHORITY - STAR RESPONSE:

SITUATION:
Needed design help from another team's UX lead for my project. No formal authority - different reporting line.

TASK:
Get UX resources allocated to my priority project.

ACTION:
1. Built Relationship First:
   - Met for coffee, understood their priorities
   - Found common ground (user-centered design)
   - Became a resource for them (shared user research)

2. Data-Driven Ask:
   - Built business case with user research
   - Showed impact on company OKRs
   - Quantified cost of delay

3. Aligned Incentives:
   - Their team's goals: Increase design system adoption
   - My project: Perfect case study for design system
   - Proposed they lead "design system for X"

4. Reciprocity:
   - Offered to help with their backlog
   - Shared my team's engineering resources
   - Created ongoing "design partnership"

RESULT:
- Got 2 designers for 2 sprints
- Feature launched successfully
- Created template for cross-team collaboration

KEY TECHNIQUE:
"What's in it for them?" - Always frame requests around other team's priorities.`
  }
];

async function update() {
  console.log('Enhancing strategy, estimation, and behavioral questions...\n');
  
  for (const q of enhanceList) {
    const { error } = await supabase
      .from('questions')
      .update({ expert_answer: q.ans })
      .eq('id', q.id);
    
    if (error) console.log('Error:', q.id, error.message);
    else console.log('Enhanced:', q.id.substring(0, 8));
  }
  console.log('\nDone!');
}

update().catch(console.error);

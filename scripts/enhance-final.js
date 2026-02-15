const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mgpcdgeptcjvplrjptur.supabase.co', 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd');

const moreEnhancements = [
  { id: '14230624-1a1a-4e21-ad04-8779fa89bf84', ans: `TWITTER SUBSCRIPTION MODEL STRATEGY:

STAKEHOLDER ANALYSIS:
- Advertisers: 40% of revenue, want broad reach
- Free Users: 99%+ of user base
- Power Users: Willing to pay for features

PROS:
1. Revenue Diversity: Reduce ad dependence
2. Premium Features: Edit button, folders, no ads
3. Power Users Pay: Willing to pay $8/month
4. Better Experience: Fewer ads for subscribers

CONS:
1. Network Effects: Fewer users = less value
2. Cannibalization: Pay for features free users want
3. Growth Impact: Friction to signup increases

RECOMMENDATION: Freemium (Twitter Blue)
- Keep core free
- Premium: $8/month (edit, undo, no ads)
- Target: 5-10% conversion

RISKS:
- User backlash potential
- Competitor migration` },
  { id: '68a7b61c-6ebd-41c2-8b81-f1714db305a9', ans: `WHATSAPP MONETIZATION STRATEGY:

STAKEHOLDERS:
- 2B+ Users: Don't want to pay directly
- Businesses: Will pay for tools
- Meta: Needs ROI from $19B

RECOMMENDED: Business Monetization

B2B REVENUE STREAMS:
1. WhatsApp Business API:
   - Customer support chatbots
   - Transaction notifications
   
2. WhatsApp Business App:
   - Catalog features
   - Quick replies

3. Payments:
   - P2P (India, Brazil)
   - Merchant transactions

WHY NOT ADS:
- E2E encryption limits targeting
- Trust is WhatsApp's value` },
  { id: '55031a6c-3958-43c2-9c17-a7c201e25dc5', ans: `TIKTOK BANDWIDTH ESTIMATION:

ASSUMPTIONS:
- DAU: 1B users
- Avg time: 60 min/day
- Bitrate: 1.5 Mbps average
- 30% concurrent usage

CALCULATION:
1. Active users: 1B x 30% = 300M
2. Bandwidth: 300M x 1.5 Mbps = 56.25 TB/s
3. Daily: 56.25 x 86,400 = 4.86M TB/day
4. = ~4,860 Petabytes/day

VALIDATION:
- Netflix: ~15GB/hour per stream
- TikTok: More efficient
- Real estimate: 1-5 Exabytes/day

FRAMEWORK:
1. State assumptions
2. Show calculations
3. Validate with comparisons` },
  { id: 'cbedba0d-b988-4e60-8a29-08d0417b3681', ans: `CONFLICT WITH ENGINEER - STAR:

SITUATION:
2-week deadline, engineer said feature "impossible."

TASK:
Deliver without compromising quality or relationships.

ACTION:
1. 1:1 Conversation:
   - Asked questions to understand constraints
   
2. Problem-Solving:
   - Met with tech lead to review code
   - Found workarounds for 60% of complexity

3. Scope Negotiation:
   - Prepared trade-off options
   - Proposed phased rollout

4. Partnership:
   - Offered documentation help

RESULT:
- Launched with 80% of scope on time
- Created technical review process

LESSON:
PMs should be translators, not order-givers.` },
  { id: 'a2223882-e287-429f-b275-6d6154996c41', ans: `PRODUCT LAUNCH FAILURE - STAR:

SITUATION:
B2B feature launch failed. <5% adoption after 3 months.

TASK:
Own the failure and fix it.

ACTION:
1. Diagnosis:
   - No beta testing
   - Assumed enterprise = consumer needs
   
2. User Research:
   - Interviewed 20 non-adopters
   - Too complex for workflow

3. Fix:
   - Created beta program
   - Simplified UX (3 clicks -> 1)
   - Added in-app guidance

4. Repair:
   - Transparent about issues

RESULT:
- 40% of target after 3 months
- Satisfaction: 2.1 -> 4.2 stars
- Created beta-first process` }
];

async function update() {
  console.log('Enhancing more questions...\n');
  for (const q of moreEnhancements) {
    const { error } = await supabase.from('questions').update({ expert_answer: q.ans }).eq('id', q.id);
    if (error) console.log('Error:', error.message);
    else console.log('Enhanced:', q.id.substring(0, 8));
  }
  console.log('Done!');
}

update().catch(console.error);

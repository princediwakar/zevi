const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mgpcdgeptcjvplrjptur.supabase.co', 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd');

const enhancements = [
  { 
    id: '6999eba4-d87b-4cdc-93ad-6c6c8a14b370', 
    ans: `NETFLIX LIVE SPORTS STRATEGY:

STAKEHOLDER ANALYSIS:
- Subscribers: Want variety, not necessarily sports
- Sports Fans: Might join/leave for live sports
- Competitors: Amazon (Prime), Apple (MLS), Disney+
- Content Owners: Very expensive, long-term deals

PROS OF ADDING SPORTS:
1. Subscriber Retention: Live events drive engagement
2. Acquisition: Sports fans might switch streaming services
3. Differentiation: Stand out in streaming wars
4. Appointment TV: Drives viewership at specific times

CONS OF ADDING SPORTS:
1. Extremely Expensive: NFL rights = $2B+/year
2. Fragmentation: Cannot get all major sports
3. Not Core: Netflix is movie/TV DNA
4. Cannibalization: Sports fans may not watch other content

RECOMMENDATION: Gradual Approach

PHASE 1 - Low-Risk:
- Sports documentaries (Drive to Survive success)
- Non-exclusive events (tennis, golf)
- Niche sports (pickleball, surfing)

PHASE 2 - Selective:
- Lower-tier leagues
- Regional sports rights
- College sports

PHASE 3 - Major Sports:
- Only if competitive necessity
- Partner with others for shared rights
- Focus on unique content` 
  },
  { 
    id: '0d99e570-b2a5-43e3-a13d-de788ea33e54', 
    ans: `MOVIE THEATER REVENUE OPTIMIZATION:

STAKEHOLDER ANALYSIS:
- Theater Owners: Maximize utilization
- Movie Studios: Want screen time
- Customers: Want experience + value
- Investors: Want profit growth

KEY REVENUE STREAMS:
1. Ticket Sales (60% of revenue)
2. Concessions (25% of revenue)
3. Premium Experiences (10%)
4. Advertising (5%)

STRATEGIES:

1. Dynamic Pricing:
   - Peak vs off-peak pricing
   - Premium for new releases
   - Weekday discounts
   - Matinee deals

2. Subscription Model:
   - MoviePass-style unlimited
   - Family plans
   - Concession included

3. Alternative Content:
   - E-sports tournaments
   - Concerts
   - Corporate events

4. Premium Experiences:
   - IMAX, 4DX, Dolby
   - VIP seating
   - Private screenings

5. F&B Innovation:
   - Restaurant-quality food
   - Alcohol service
   - In-seat dining

SUCCESS METRICS:
- Utilization rate (target: 70%)
- Revenue per screen
- Concession per customer
- Membership conversion` 
  },
  { 
    id: 'd874bcd8-858e-4e44-a4de-8529ad2ffc95', 
    ans: `INFLUENCE WITHOUT AUTHORITY - STAR:

SITUATION:
Needed UX help from another teams design lead. No formal authority - different reporting line.

TASK:
Get UX resources allocated to my project.

ACTION:
1. Built Relationship First:
   - Met for coffee, understood their priorities
   - Found common ground (user-centered design)
   - Became a resource for them (shared research)

2. Data-Driven Ask:
   - Built business case with user research
   - Showed impact on company OKRs
   - Quantified cost of delay

3. Aligned Incentives:
   - Their team goals: Design system adoption
   - My project: Perfect case study
   - Proposed they lead the design

4. Reciprocity:
   - Offered to help with their backlog
   - Shared engineering resources
   - Created ongoing partnership

RESULT:
- Got 2 designers for 2 sprints
- Feature launched successfully
- Template for cross-team collaboration

KEY TECHNIQUE:
Whats in it for them? Always frame requests around other teams priorities.` 
  },
  { 
    id: '137d1fe2-061e-4dbd-aea3-cfb33e837912', 
    ans: `NAVIGATE AMBIGUITY - STAR:

SITUATION:
Joined company with unclear product direction. Multiple stakeholders had conflicting visions.

TASK:
Figure out what to build and get alignment.

ACTION:
1. Discovery Phase:
   - Interviewed 20+ customers
   - Analyzed usage data
   - Studied competitor products

2. Stakeholder Mapping:
   - Identified all decision makers
   - Understood each ones priorities
   - Found common ground

3. Proposed Framework:
   - Created decision criteria
   - Built MVP proposal
   - Planned phased approach

4. Got Buy-In:
   - Presented data to leadership
   - Addressed concerns
   - Created shared vision

RESULT:
- Product launched 6 months later
- Hit 100K users milestone
- Stakeholders aligned on roadmap

LESSON:
In ambiguous situations, be the facilitator. Gather data, create structure, drive to decision.` 
  }
];

async function update() {
  console.log('Enhancing more questions...\n');
  for (const q of enhancements) {
    const { error } = await supabase.from('questions').update({ expert_answer: q.ans }).eq('id', q.id);
    if (error) console.log('Error:', q.id);
    else console.log('Enhanced:', q.id.substring(0, 8));
  }
  console.log('Done!');
}

update().catch(console.error);

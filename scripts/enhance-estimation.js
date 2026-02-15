const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mgpcdgeptcjvplrjptur.supabase.co', 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd');

// Get estimation questions and enhance them
async function enhanceEstimation() {
  // Get estimation questions
  const { data: questions } = await supabase
    .from('questions')
    .select('id, question_text')
    .eq('category', 'estimation');
  
  console.log('Found', questions.length, 'estimation questions');
  
  const estimates = [
    {
      text: 'bandwidth used by TikTok',
      ans: `TIKTOK BANDWIDTH ESTIMATION:

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
3. Validate with comparisons`
    },
    {
      text: 'elevators are in NYC',
      ans: `NYC ELEVATORS ESTIMATION:

STEP 1: NYC Building Types
- Total buildings: ~1 million
- 1-2 family homes: ~70% (no elevators)
- High-rises (6+ floors): ~10% = 100k

STEP 2: Elevators per Building
- Low-rise (6-10): 1-2 elevators
- Mid-rise (11-20): 2-4 elevators
- High-rise (20+): 4-8 elevators

STEP 3: Calculate
- Distribution: 60% low, 30% mid, 10% high
- Low: 60k x 1.5 = 90k
- Mid: 30k x 3 = 90k
- High: 10k x 6 = 60k
- Total: ~240k

VALIDATION:
- Actual: ~84,000
- Key: Reasoning matters more than exact number!`
    },
    {
      text: 'market size for dog walking',
      ans: `DOG WALKING MARKET SIZE - SF:

STEP 1: Base Population
- SF households: ~350,000
- Population: ~800,000

STEP 2: Dog Ownership
- Dog ownership: 35% in dog-friendly SF
- Dogs: 350k x 35% = 122,500

STEP 3: Addressable Market
- Working professionals: 50% need walkers
- Dogs needing walkers: 61,250

STEP 4: Service Frequency
- Walks per week: 4 average
- Weekly walks: 61,250 x 4 = 245,000

STEP 5: Pricing
- Average walk: $22
- Weekly revenue: $5.39M
- Annual: $280M

VALIDATION:
- Rover data: ~$300M market`
    },
    {
      text: 'golf balls fit in a 747',
      ans: `GOLF BALLS IN 747 ESTIMATION:

STEP 1: 747 Fuselage Volume
- Length: 70m, diameter: 6m
- Volume: pi x r^2 x L = ~2,000 cubic meters

STEP 2: Golf Ball Volume
- Diameter: 4.3 cm
- Volume: ~42 cubic cm = 0.000042 cubic meters

STEP 3: Packing Efficiency
- Random packing: ~60%
- Best possible: ~74%
- Use 65% for estimate

STEP 4: Calculate
- Balls per cubic meter: 0.65 / 0.000042 = ~15,500
- Total balls: 2,000 x 15,500 = ~31 million

VALIDATION:
- Reasonable range: 20-40 million`
    },
    {
      text: 'daily flights from ATL',
      ans: `ATL AIRPORT FLIGHTS ESTIMATION:

STEP 1: ATL Basics
- World's busiest airport
- ~200 gates
- 24/7 operation

STEP 2: Average Departures per Hour
- Peak hours (6am-9pm): ~40 flights/hour
- Off-peak: ~15 flights/hour
- Average: ~25 flights/hour

STEP 3: Calculate
- 24 hours x 25 flights = ~600 departures/day
- Same for arrivals
- Total: ~1,200 flights/day

VALIDATION:
- Actual ATL: ~2,700 flights/day (much higher!)
- My estimate was conservative

KEY INSIGHT:
- Major hubs operate more flights than estimated`
    }
  ];
  
  // Match and update
  for (const q of questions) {
    for (const e of estimates) {
      if (q.question_text.toLowerCase().includes(e.text)) {
        await supabase
          .from('questions')
          .update({ expert_answer: e.ans })
          .eq('id', q.id);
        console.log('Enhanced:', q.question_text.substring(0, 40));
        break;
      }
    }
  }
  
  console.log('\nDone!');
}

enhanceEstimation().catch(console.error);

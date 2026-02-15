const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mgpcdgeptcjvplrjptur.supabase.co', 'sb_publishable_G14cyU4IOWN12RgYQFVbIg_D_0vKWfd');

// India-based product questions
const indiaQuestions = [
  // SWIGGY (Food Delivery)
  {
    question_text: "Swiggy's delivery times have increased by 20%. How would you diagnose and fix this?",
    category: "execution",
    difficulty: "intermediate",
    company: "Swiggy",
    interview_type: "video",
    expert_answer: `DIAGNOSIS FRAMEWORK:

SEGMENTATION ANALYSIS:
1. By City: Tier 1 vs Tier 2 vs Tier 3
2. By Time: Peak hours vs off-peak
3. By Order Type: Restaurant vs Instamart vs Genie
4. By Partner: Full-time vs Part-time delivery partners

FUNNEL ANALYSIS:
1. Order Placed → Restaurant Accepts: Is restaurant latency up?
2. Restaurant → Pickup: Is partner finding delayed?
3. Pickup → Delivery: Is transit time up?

KEY HYPOTHESES:
H1: Not enough delivery partners (supply)
H2: Restaurant prep time increased
H3: Traffic/congestion in cities
H4: Partner preference for high-value orders
H5: Restaurant partner app issues

SOLUTIONS:
1. Supply Side:
   - Surge pricing for partners
   - Partner incentives during peak
   - Better routing algorithms

2. Restaurant Side:
   - Kitchen display system integration
   - Prep time estimates
   - Quality incentives

3. Technology:
   - Real-time route optimization
   - Predictive demand mapping
   - Partner matching algorithm improvement

SUCCESS METRICS:
- Average delivery time (target: <30 min)
- On-time delivery rate (>90%)
- Partner utilization (>75%)
- Customer satisfaction score`
  },
  {
    question_text: "Design a feature for Swiggy to reduce food wastage for restaurants.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Swiggy",
    interview_type: "video",
    expert_answer: `USER SEGMENTS:
1. Restaurants (large, medium, small)
2. Delivery Partners
3. End Consumers
4. Swiggy (business)

KEY PAIN POINTS:
- Restaurants: Unsold food at end of day goes to waste
- Consumers: Can't get discounted food close to closing
- Environment: Food waste is a major issue

PROPOSED SOLUTIONS:
1. "Closing Time" Feature:
   - Restaurants mark items for discount (last 1-2 hours)
   - Users see "Best Value" section for closing soon orders
   - Automatic push notifications

2. Surplus Food Marketplace:
   - Restaurants list surplus at discount
   - First-come-first-served
   - Gamification for eco-conscious users

3. Smart Inventory:
   - AI prediction of daily demand
   - Integration with restaurant POS
   - Automated discount timing

TRADE-OFFS:
- Quality concerns for discounted food
- Restaurant margin vs wastage cost
- User expectations for freshness

SUCCESS METRICS:
- Food wastage reduction (target: 30%)
- Revenue from surplus marketplace
- Restaurant partner satisfaction
- User engagement with feature`
  },
  
  // FLIPKART (E-commerce)
  {
    question_text: "Flipkart's return rate is 25%, much higher than industry average. How would you reduce it?",
    category: "execution",
    difficulty: "advanced",
    company: "Flipkart",
    interview_type: "video",
    expert_answer: `PROBLEM DEFINITION:
High return rate hurts economics (shipping costs, refurbishing, lost sales).

ROOT CAUSE ANALYSIS:
1. Product Expectation Gap: Photos don't match actual product
2. Size/Fit Issues: Especially clothing, shoes
3. Quality Not as Described: Material, color differences
4. Damaged in Transit
5. Bought Multiple to Compare

SEGMENTATION:
- By Category: Electronics vs Clothing vs Home
- By User Type: New vs Repeat
- By Price Point: Premium vs Budget
- By Seller: Fulfilled by Flipkart vs Seller

SOLUTIONS:
1. Better Product Information:
   - 360-degree product videos
   - Detailed size guides with measurements
   - User-generated photos section
   - AI product description accuracy

2. Size Recommendation Engine:
   - Body measurements integration
   - Fit score based on user history
   - Size exchange made easy

3. Quality Assurance:
   - Fulfillment center quality checks
   - Better packaging
   - Seller rating system

4. Post-Purchase Engagement:
   - Care instructions
   - Realistic delivery expectations
   - Easy return process if needed

SUCCESS METRICS:
- Return rate (target: <15%)
- Return reason distribution
- Customer satisfaction post-return
- Net revenue retention`
  },
  {
    question_text: "Design a loyalty program for Flipkart that competes with Amazon Prime.",
    category: "product_sense",
    difficulty: "intermediate",
    company: "Flipkart",
    interview_type: "video",
    expert_answer: `USER SEGMENTS:
1. Price-Sensitive: Want discounts
2. Convenience Seekers: Want fast delivery
3. Premium Users: Want exclusive benefits
4. Frequent Buyers: High LTV customers

KEY PAIN POINTS:
- No free delivery threshold
- Late delivery issues
- Lack of exclusive deals
- No streaming//entertainment

PROPOSED SOLUTIONS (Flipkart Plus):
1. Free Delivery:
   - Unlimited free delivery above threshold
   - Priority delivery for Plus members
   - Same-day/next-day delivery options

2. Early Access:
   - Big Billion Days early access
   - Exclusive deals for members
   - Flash sale alerts

3. Entertainment:
   - Free SonyLIV subscription
   - PhonePe benefits
   - BookMyShow offers

4. Rewards:
   - SuperCoins (earn on purchases)
   - Redeem for discounts
   - Partner offers (Myntra, etc.)

MONETIZATION:
- Free tier with limited benefits
- Paid tier (~₹499/year)
- Co-branded credit card

SUCCESS METRICS:
- Member acquisition rate
- Retention rate
- Spend per member vs non-member
- NPS score`
  },

  // AMAZON INDIA
  {
    question_text: "How would you improve Amazon India's delivery to Tier 3 cities?",
    category: "execution",
    difficulty: "advanced",
    company: "Amazon",
    interview_type: "video",
    expert_answer: `CONTEXT:
Tier 3 cities have infrastructure challenges, lower internet penetration, and different shopping patterns.

KEY CHALLENGES:
1. Last-mile delivery infrastructure
2. Cash on delivery high (payment issues)
3. Return logistics difficult
4. Limited address standardization

DIAGNOSIS:
- Current delivery coverage in Tier 3
- Cost per delivery
- Delivery time
- Customer satisfaction by tier

SOLUTIONS:
1. Hub & Spoke Model:
   - Micro-fulfillment centers in towns
   - Partner with local shops for pickup
   - Automated locker installation

2. Payment Innovation:
   - EMI options
   - UPI integration
   - Cashless incentive programs

3. Community Model:
   - Amazon Partnered Stores
   - Neighborhood pickup points
   - Village-level entrepreneurs

4. Technology:
   - Voice-based ordering (multiple languages)
   - Lite app for low-bandwidth
   - Address standardization AI

SUCCESS METRICS:
- Delivery coverage (% of PIN codes)
- Delivery time
- Cost per delivery
- Customer satisfaction
- Repeat purchase rate`
  },

  // ZOMATO
  {
    question_text: "Zomato wants to add a subscription model. What should it include?",
    category: "strategy",
    difficulty: "advanced",
    company: "Zomato",
    interview_type: "video",
    expert_answer: `STAKEHOLDER ANALYSIS:
- Restaurants: Want more orders
- Delivery Partners: Want stable income
- Users: Want discounts and convenience
- Investors: Want revenue growth

PROS OF SUBSCRIPTION:
1. Recurring revenue
2. Customer loyalty/retention
3. Predictable demand for restaurants
4. Higher order frequency

CONS OF SUBSCRIPTION:
1. Margin compression
2. Free-rider problem
3. Delivery cost management

PROPOSED MODEL (Zomato Gold Pro):

TIER 1 - Zomato Gold Lite (₹99/month):
- Free delivery on orders above ₹199
- 5% discount on all orders
- Priority customer support

TIER 2 - Zomato Gold (₹299/month):
- Free delivery
- 15% discount on orders
- Exclusive restaurant deals
- Free plate at partner restaurants monthly

TIER 3 - Zomato Black (₹599/month):
- Everything in Gold
- Free delivery above any amount
- 25% discount
- Free Zomato Gold for family
- Early access to new features

SUCCESS METRICS:
- Subscription conversion rate
- Revenue per subscriber
- Churn rate
- Order frequency change
- Restaurant partner satisfaction`
  },

  // PHARMACEUTICAL / MEDICINE DELIVERY (Apollo/Pharmeasy)
  {
    question_text: "Design a medicine reminder feature for a pharmacy delivery app.",
    category: "product_sense",
    difficulty: "beginner",
    company: "Pharmeasy",
    interview_type: "video",
    expert_answer: `USER SEGMENTS:
1. Chronic Patients: Need regular medicines
2. Elderly: Multiple medications
3. Caregivers: Managing family medicines
4. Occasional Users: For acute conditions

KEY PAIN POINTS:
- Forgetting to take medicines
- Running out of medicines
- Refill reminders
- Dosage confusion

PROPOSED FEATURES:
1. Smart Reminders:
   - Personalized reminder times
   - Push notifications
   - SMS backup for feature phones

2. Auto-Refill:
   - One-click refill request
   - Subscription model for chronic meds
   - Delivery schedule

3. Doctor Integration:
   - Upload prescriptions
   - Doctor can set reminders
   - Medicine interaction alerts

4. Family Management:
   - Manage family member accounts
   - Caregiver alerts
   - Elderly monitoring

SUCCESS METRICS:
- Medication adherence rate
- Refill completion rate
- User retention
- NPS score`
  },

  // PAYTM / DIGITAL PAYMENTS
  {
    question_text: "How would you increase Paytm's merchant adoption in small towns?",
    category: "execution",
    difficulty: "intermediate",
    company: "Paytm",
    interview_type: "video",
    expert_answer: `PROBLEM:
Limited merchant adoption in Tier 2/3 cities despite high consumer app usage.

ROOT CAUSE ANALYSIS:
1. Awareness: Merchants don't know benefits
2. Trust: Fear of fraud or failed transactions
3. Tech: Feature phone compatibility issues
4. Economics: Transaction fees concern
5. Support: No local help available

SEGMENTATION:
- Kirana stores
- Small restaurants
- Street vendors
- Service providers (plumbers, electricians)

SOLUTIONS:
1. Awareness:
   - Local language marketing
   - Demo videos in regional languages
   - Success stories from nearby merchants

2. Trust Building:
   - Zero-risk first transaction
   - Settlement within hours
   - QR code physical cards

3. Tech Solutions:
   - Offline transaction support
   - Feature phone compatible app
   - Sound-based payments (audio QR)

4. Economics:
   - Free transactions for first 3 months
   - Low MDR for small merchants
   - Revenue share for high-volume

5. Support:
   - Local field teams
   - WhatsApp support
   - Video tutorials

SUCCESS METRICS:
- Merchant onboarding rate
- Active merchant rate
- Transaction volume
- Average transaction value`
  },

  // UBER INDIA / OLA
  {
    question_text: "Design a feature for Uber Auto in Indian cities.",
    category: "product_sense",
    difficulty: "beginner",
    company: "Uber",
    interview_type: "video",
    expert_answer: `USER SEGMENTS:
1. Daily Commuters: Office, regular routes
2. Occasional Users: For emergencies/special occasions
3. Tourists: Visiting cities
4. Elderly/Mobility Issues: Need convenience

KEY CONSIDERATIONS FOR INDIA:
- Auto rickshaw culture and pricing
- Traffic conditions
- Safety concerns
- Cash vs digital payment
- Multiple passengers

PROPOSED FEATURES:
1. Auto Share:
   - Share ride with other going-same-way users
   - Split fare option
   - Route optimization

2. Route-Based Booking:
   - Pre-set common routes (Home-Office)
   - One-tap booking
   - Schedule in advance

3. Safety Features:
   - Driver verification
   - Real-time tracking share
   - SOS button
   - In-trip check-ins

4. Payment:
   - UPI integration
   - Cash option
   - Auto recharge wallet

5. Pricing:
   - Transparent pricing
   - Estimate before booking
   - Peak pricing warning

SUCCESS METRICS:
- Daily auto rides
- User satisfaction
- Driver partner earnings
- Safety incident rate`
  },

  // MEESHO / SOCIAL COMMERCE
  {
    question_text: "How would you improve trust on Meesho for first-time buyers?",
    category: "execution",
    difficulty: "intermediate",
    company: "Meesho",
    interview_type: "video",
    expert_answer: `PROBLEM:
Social commerce has trust issues - products may not match photos, delivery delays, no easy returns.

USER SEGMENTS:
1. Resellers (primary users)
2. First-time online buyers
3. Price-sensitive consumers

TRUST BARRIERS:
- Can't touch/feel products
- Unknown sellers
- Delivery concerns
- Payment security

SOLUTIONS:
1. Verification:
   - Seller verification badges
   - Rating system (seller and product)
   - Verification certificates

2. Product Discovery:
   - User reviews with photos
   - Video reviews
   - Detailed product specifications
   - Comparison feature

3. Protection:
   - Money-back guarantee
   - Easy returns
   - Escrow payments (hold until delivery)

4. Communication:
   - Chat with seller
   - Order tracking updates
   - Proactive delivery notifications

5. Social Proof:
   - Reseller recommendations
   - Community groups
   - Success stories

SUCCESS METRICS:
- First purchase conversion rate
- Repeat purchase rate
- Return rate
- Customer satisfaction
- Seller rating average`
  }
];

async function addIndiaQuestions() {
  console.log('Adding India-based product questions...\n');
  
  const { data, error } = await supabase
    .from('questions')
    .insert(indiaQuestions);
  
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Successfully added', indiaQuestions.length, 'India-based questions!');
  }
}

addIndiaQuestions().catch(console.error);

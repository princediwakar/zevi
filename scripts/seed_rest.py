import json
import os
import urllib.request
import urllib.error

# Load .env manually
env = {}
try:
    with open('.env', 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'): continue
            parts = line.split('=', 1)
            if len(parts) == 2:
                key, val = parts[0].strip(), parts[1].strip()
                # Remove quotes if present
                if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                    val = val[1:-1]
                env[key] = val
except Exception as e:
    print(f"Warning: Could not read .env: {e}")

# Get configuration
SUPABASE_URL = env.get('EXPO_PUBLIC_SUPABASE_URL')
# Try all possible names for the service key
SERVICE_KEY = env.get('SECRET_API_KEY') or env.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_KEY:
    print("Error: Missing EXPO_PUBLIC_SUPABASE_URL or SECRET_API_KEY/SUPABASE_SERVICE_ROLE_KEY in .env")
    exit(1)

print(f"Using Supabase URL: {SUPABASE_URL}")
print("Seeding data via REST API...")

sample_questions = [
  {
    "id": "c9225726-1736-4076-963d-4724641cb980",
    "question_text": "How do you measure success of the Hot Home feature in Redfin?",
    "category": "ab_testing",
    "difficulty": "intermediate",
    "company": "Redfin",
    "interview_type": "in_person",
    "expert_answer": "Start by clarifying the goal of Hot Home feature. Then identify key user actions (views, saves, contacts). Choose metrics like engagement rate, conversion to contact, and time on listing. Set specific targets based on baseline data.",
    "rubric": {
      "metrics": ["Defined engagement metrics", "Included conversion metrics", "Mentioned leading vs lagging indicators"], 
      "clarification": ["Asked about Hot Home feature purpose", "Identified target users"], 
      "prioritization": ["Prioritized metrics by importance", "Explained trade-offs"]
    },
    "acceptance_rate": 65,
    "pattern_type": "metrics_for_x",
    "mcq_version": {
      "enabled": True,
      "sub_questions": [
        {
          "prompt": "What type of metric is \"number of Hot Home views\"?",
          "options": [
            {"text": "Leading indicator", "correct": True, "explanation": "Views happen before conversions, making it a leading indicator of user interest."},
            {"text": "Lagging indicator", "correct": False, "explanation": "Lagging indicators measure outcomes after the fact."},
            {"text": "Vanity metric", "correct": False, "explanation": "While views alone could be vanity, in context they predict conversion."},
            {"text": "Counter metric", "correct": False, "explanation": "Counter metrics track negative impacts."}
          ],
          "difficulty": "beginner"
        },
        {
          "prompt": "Which metric best measures Hot Home feature success?",
          "options": [
            {"text": "Total page views", "correct": False, "explanation": "Too broad - doesn't show if Hot Home specifically drives value."},
            {"text": "Conversion rate from Hot Home view to agent contact", "correct": True, "explanation": "Directly measures if the feature drives the desired action."},
            {"text": "Number of Hot Home badges shown", "correct": False, "explanation": "This is an output metric, not a success metric."},
            {"text": "Average time on site", "correct": False, "explanation": "Too general - doesn't isolate Hot Home impact."}
          ],
          "difficulty": "intermediate"
        }
      ]
    }
  },
  {
    "id": "ae288863-7183-4914-946b-4e1b563be81f",
    "question_text": "How do you improve Slack?",
    "category": "product_sense",
    "difficulty": "intermediate",
    "company": "Dropbox",
    "interview_type": "phone",
    "expert_answer": "First, clarify the goal - are we improving for specific users or overall? Identify target users (e.g., remote teams). Report their needs through user research. Prioritize the most impactful pain points. Brainstorm solutions, evaluate trade-offs, and recommend the top solution with clear success metrics.",
    "rubric": {
      "metrics": ["Defined success metrics"], 
      "solutions": ["Generated multiple ideas", "Evaluated trade-offs"], 
      "user_needs": ["Identified specific user segments", "Listed concrete pain points"], 
      "clarification": ["Asked clarifying questions", "Defined scope"]
    },
    "pattern_type": "improve_x",
    "mcq_version": {
      "enabled": True,
      "sub_questions": [
        {
          "prompt": "What should you do FIRST when asked to improve Slack?",
          "options": [
            {"text": "Brainstorm features", "correct": False, "explanation": "Jumping to solutions without understanding the problem is premature."},
            {"text": "Ask clarifying questions", "correct": True, "explanation": "Always clarify the problem space, target users, and goals first."},
            {"text": "Define success metrics", "correct": False, "explanation": "Metrics come after understanding the problem."},
            {"text": "Analyze competitors", "correct": False, "explanation": "While useful, clarification comes first."}
          ],
          "difficulty": "beginner"
        },
        {
          "prompt": "Which user segment should you focus on for Slack improvements?",
          "options": [
            {"text": "All users equally", "correct": False, "explanation": "Too broad - different segments have different needs."},
            {"text": "The segment with the biggest pain point", "correct": True, "explanation": "Prioritize based on impact and user needs."},
            {"text": "Enterprise users only", "correct": False, "explanation": "May not align with business goals without clarification."},
            {"text": "New users", "correct": False, "explanation": "Depends on the goal - retention vs acquisition."}
          ],
          "difficulty": "intermediate"
        }
      ]
    }
  },
  {
    "id": "242b58f8-a15d-4444-9642-1262dca7768e",
    "question_text": "How did you turn an adversary into a confidant?",
    "category": "behavioral",
    "difficulty": "intermediate",
    "company": "Facebook",
    "interview_type": "in_person",
    "expert_answer": "Describe a specific situation where you had conflict. Explain your task/goal. Detail the actions you took to build trust (active listening, finding common ground, delivering on promises). Share the positive result and what you learned.",
    "rubric": {
      "metrics": ["Quantified the result", "Reflected on learnings"], 
      "solutions": ["Described concrete actions", "Showed initiative"], 
      "user_needs": ["Showed empathy", "Understood other person's perspective"], 
      "clarification": ["Provided specific situation", "Explained context clearly"]
    },
    "pattern_type": "behavioral_star",
    "mcq_version": {
      "enabled": True,
      "sub_questions": [
        {
          "prompt": "In the STAR framework, what does the \"A\" stand for?",
          "options": [
            {"text": "Analysis", "correct": False, "explanation": "STAR is Situation, Task, Action, Result."},
            {"text": "Action", "correct": True, "explanation": "Action describes what YOU specifically did."},
            {"text": "Achievement", "correct": False, "explanation": "Achievement is part of Result."},
            {"text": "Approach", "correct": False, "explanation": "While similar, the framework uses \"Action\"."}
          ],
          "difficulty": "beginner"
        }
      ]
    }
  },
  {
    "id": "b2277028-090c-4394-9844-428612502621",
    "question_text": "What goals and success metrics would you set for buy & sell groups?",
    "category": "execution",
    "difficulty": "intermediate",
    "company": "Facebook",
    "interview_type": "phone",
    "expert_answer": "Business goal: Increase marketplace activity. User goal: Easy buying/selling. Metrics: Active listings, transaction completion rate, repeat sellers, time to sale. Set SMART targets based on current baseline.",
    "rubric": {
      "metrics": ["Listed relevant metrics", "Included leading and lagging indicators"], 
      "clarification": ["Defined business and user goals"], 
      "prioritization": ["Prioritized metrics", "Set realistic targets"]
    },
    "pattern_type": "metrics_for_x",
    "mcq_version": {
      "enabled": True,
      "sub_questions": [
        {
          "prompt": "Which is the most important metric for buy & sell groups?",
          "options": [
            {"text": "Number of group members", "correct": False, "explanation": "Vanity metric - doesn't show actual value creation."},
            {"text": "Transaction completion rate", "correct": True, "explanation": "Directly measures if the feature achieves its purpose."},
            {"text": "Number of posts", "correct": False, "explanation": "Activity metric but doesn't show successful transactions."},
            {"text": "Page views", "correct": False, "explanation": "Too broad and doesn't measure success."}
          ],
          "difficulty": "intermediate"
        }
      ]
    }
  },
  {
    "id": "1c33c200-8430-466d-961f-1335cb992383",
    "question_text": "You are the PM of Facebook Lite, what goals would you set?",
    "category": "execution",
    "difficulty": "intermediate",
    "company": "Facebook",
    "interview_type": "phone",
    "expert_answer": "Facebook Lite targets emerging markets with limited connectivity. Goals: 1) Increase DAU in target markets, 2) Reduce data usage per session, 3) Improve app performance on low-end devices. Metrics: DAU growth rate, data consumption, app load time, crash rate.",
    "rubric": {
      "metrics": ["Set specific, measurable goals", "Aligned with user needs"], 
      "clarification": ["Understood Facebook Lite's purpose", "Identified target users"], 
      "prioritization": ["Prioritized goals by impact"]
    },
    "pattern_type": "metrics_for_x",
    "mcq_version": {
      "enabled": True,
      "sub_questions": [
        {
          "prompt": "What is the primary target market for Facebook Lite?",
          "options": [
            {"text": "US power users", "correct": False, "explanation": "Lite is designed for emerging markets."},
            {"text": "Emerging markets with limited connectivity", "correct": True, "explanation": "Lite optimizes for low bandwidth and low-end devices."},
            {"text": "Enterprise customers", "correct": False, "explanation": "Facebook Lite is a consumer product."},
            {"text": "Developers", "correct": False, "explanation": "Lite targets end users, not developers."}
          ],
          "difficulty": "beginner"
        }
      ]
    }
  }
]

url = f"{SUPABASE_URL}/rest/v1/questions"
headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

for q in sample_questions:
    data = json.dumps(q).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
             print(f"Upserted question {q['id']}")
    except urllib.error.HTTPError as e:
        print(f"Error upserting question {q['id']}: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))

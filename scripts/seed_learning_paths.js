require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Try Service Role Key first, then Access Token, then fallback to anon key (though anon might not have write permissions)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_API_KEY ||
  process.env.SUPABASE_ACCESS_TOKEN ||
  process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_URL and authentication key (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ACCESS_TOKEN)",
  );
  process.exit(1);
}

// If using an access token that is NOT a JWT/API key but a PAT, this might fail, but let's try.
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const learningPaths = [
  {
    name: "Product Sense Fundamentals",
    description: "Master the art of breaking down ambiguous problems.",
    category: "product_sense",
    difficulty_level: 1,
    estimated_hours: 6,
    order_index: 1,
    is_premium: false,
    icon_name: "lightbulb",
    color: "#FFD700",
    units: [
      {
        name: "Introduction to PM Interviews",
        description: "Understand what interviewers are looking for.",
        order_index: 1,
        estimated_minutes: 30,
        lessons: [
          { 
            name: "What is Product Sense?", 
            type: "learn", 
            order_index: 1,
            content: {
              learn_content: {
                cards: [
                  { title: "What is Product Sense?", content: "Product sense is the ability to understand what makes a product great. It involves understanding user needs, market dynamics, and technical feasibility." },
                  { title: "Why Does It Matter?", content: "Product sense helps you prioritize features, identify opportunities, and make better product decisions." },
                  { title: "Developing Product Sense", content: "Practice by analyzing products you use daily. Ask: What problem does it solve? Who is the target user? How could it be improved?" }
                ]
              }
            }
          },
          { 
            name: "The PM Mindset", 
            type: "learn", 
            order_index: 2,
            content: {
              learn_content: {
                cards: [
                  { title: "User-Centric Thinking", content: "Always start with the user. Understand their pain points, goals, and behaviors." },
                  { title: "Data-Driven Decisions", content: "Use data to validate assumptions and measure success. But don't let data override intuition." },
                  { title: "Balancing Stakeholders", content: "Consider users, business goals, and technical constraints. Find win-win solutions." }
                ]
              }
            }
          },
          { 
            name: "Common Pitfalls", 
            type: "quiz", 
            order_index: 3,
            content: {
              quiz_content: {
                questions: [
                  { text: "What is the most important trait of a great PM?", options: ["Technical skills", "Communication", "Product sense", "Marketing"], correct_answer: 2 },
                  { text: "When should you launch a product?", options: ["When it's perfect", "When it solves the core problem", "Immediately", "Never"], correct_answer: 1 }
                ],
                passing_score: 1
              }
            }
          },
        ],
      },
      {
        name: "The CIRCLES Framework",
        description: "A structured approach to design questions.",
        order_index: 2,
        estimated_minutes: 45,
        lessons: [
          { 
            name: "Intro to CIRCLES", 
            type: "learn", 
            order_index: 1,
            content: {
              learn_content: {
                cards: [
                  { title: "What is CIRCLES?", content: "CIRCLES is a framework for answering product design questions: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize." },
                  { title: "When to Use", content: "Use CIRCLES for 'Design a product...' or 'How would you improve...' questions." },
                  { title: "Why It Works", content: "It provides structure to your answer, showing interviewers you can think systematically about product decisions." }
                ]
              }
            }
          },
          {
            name: "Comprehend the Situation",
            type: "drill",
            order_index: 2,
            content: {
              drill_content: {
                focus_step: "Comprehend the Situation",
                questions: [
                  { text: "What questions would you ask when designing a coffee shop app?", correct_options: ["Who are the users?", "What's their budget?", "What features do they want?"], incorrect_options: ["How much should coffee cost?", "What color should the app be?"], feedback: { correct: "Great! Always start by understanding users and their needs.", incorrect: "Think about the problem from the user's perspective first." } }
                ]
              }
            }
          },
          { 
            name: "Identify the Customer", 
            type: "drill", 
            order_index: 3,
            content: {
              drill_content: {
                focus_step: "Identify the Customer",
                questions: [
                  { text: "Who would be the primary user for a grocery delivery app?", correct_options: ["Busy professionals", "Elderly people", "Families with kids"], incorrect_options: ["Only teenagers", "Only seniors living alone"], feedback: { correct: "Multiple user segments can benefit!", incorrect: "Consider who has the most need for convenience." } }
                ]
              }
            }
          },
          { 
            name: "Report Needs", 
            type: "drill", 
            order_index: 4,
            content: {
              drill_content: {
                focus_step: "Report Needs",
                questions: [
                  { text: "What user needs does Spotify address?", correct_options: ["Discover new music", "Access music anywhere", "Share with friends"], incorrect_options: ["Buy concert tickets", "Create playlists only"], feedback: { correct: "Exactly! Spotify addresses multiple user needs.", incorrect: "Think about the core value proposition." } }
                ]
              }
            }
          },
          { 
            name: "Cut Through Prioritization", 
            type: "quiz", 
            order_index: 5,
            content: {
              quiz_content: {
                questions: [
                  { text: "What does the 'C' in CIRCLES stand for?", options: ["Create", "Comprehend", "Customers", "Code"], correct_answer: 1 },
                  { text: "In what order should you prioritize features?", options: ["User impact first", "Technical complexity first", "Cost first", "Timeline first"], correct_answer: 0 }
                ],
                passing_score: 1
              }
            }
          },
        ],
      },
      {
        name: "Clarifying the Problem",
        description: "Asking the right questions upfront.",
        order_index: 3,
        estimated_minutes: 40,
        lessons: [
          { 
            name: "Why Clarify?", 
            type: "learn", 
            order_index: 1,
            content: {
              learn_content: {
                cards: [
                  { title: "The Cost of Assumptions", content: "Making assumptions without clarifying can lead to solving the wrong problem. Always ask questions first." },
                  { title: "What to Clarify", content: "Ask about: constraints, users, success metrics, timeline, and resources available." },
                  { title: "Good vs Bad Questions", content: "Good: 'Who are the target users?' Bad: 'How much should it cost?'" }
                ]
              }
            }
          },
          {
            name: "Practice: Ambiguous Prompts",
            type: "drill",
            order_index: 2,
            content: {
              drill_content: {
                focus_step: "Clarifying Questions",
                questions: [
                  { text: "For 'Design a smart thermostat', what's the first clarifying question?", correct_options: ["Who will use it?", "What's the budget?", "Where is it installed?"], incorrect_options: ["What color?", "What temperature?"], feedback: { correct: "User identification is always first!", incorrect: "Start with understanding WHO before WHAT." } }
                ]
              }
            }
          },
          { 
            name: "Defining Success", 
            type: "drill", 
            order_index: 3,
            content: {
              drill_content: {
                focus_step: "Success Metrics",
                questions: [
                  { text: "How would you define success for a fitness app?", correct_options: ["Daily active users", "Users reaching goals", "Revenue"], incorrect_options: ["Total downloads", "App store rating"], feedback: { correct: "Focus on user outcomes!", incorrect: "Revenue is secondary to user value." } }
                ]
              }
            }
          },
        ],
      },
    ],
  },
  {
    name: "Execution Mastery",
    description: "Demonstrate your ability to get things done.",
    category: "execution",
    difficulty_level: 2,
    estimated_hours: 5,
    order_index: 2,
    is_premium: false,
    icon_name: "rocket",
    color: "#FF6347",
    units: [
      {
        name: "Understanding Metrics",
        description: "Key metrics for product success.",
        order_index: 1,
        estimated_minutes: 40,
        lessons: [
          { 
            name: "Metric Types", 
            type: "learn", 
            order_index: 1,
            content: {
              learn_content: {
                cards: [
                  { title: "Vanity Metrics", content: "Metrics that look good but don't drive decisions. Examples: Total users, Page views, Downloads." },
                  { title: "Actionable Metrics", content: "Metrics that help you make decisions. Examples: Daily active users, Conversion rate, Retention." },
                  { title: "Choosing the Right Metrics", content: "Focus on metrics that measure user value and business health." }
                ]
              }
            }
          },
          {
            name: "Practice: Selecting Metrics",
            type: "drill",
            order_index: 2,
            content: {
              drill_content: {
                focus_step: "Metric Selection",
                questions: [
                  { text: "For a social media app, which metric matters most?", correct_options: ["Daily active users", "Total signups", "Page views"], incorrect_options: ["Total likes"], feedback: { correct: "DAU shows real engagement!", incorrect: "Vanity metrics don't show real value." } }
                ]
              }
            }
          },
          { 
            name: "North Star Metric", 
            type: "quiz", 
            order_index: 3,
            content: {
              quiz_content: {
                questions: [
                  { text: "What is a North Star Metric?", options: ["Revenue", "The key metric that drives growth", "Total users", "Page views"], correct_answer: 1 }
                ],
                passing_score: 1
              }
            }
          },
        ],
      },
      {
        name: "Root Cause Analysis",
        description: "Debugging product issues systematically.",
        order_index: 2,
        estimated_minutes: 50,
        lessons: [
          { 
            name: "The 5 Whys", 
            type: "learn", 
            order_index: 1,
            content: {
              learn_content: {
                cards: [
                  { title: "What is 5 Whys?", content: "A technique to find the root cause by asking 'Why?' five times." },
                  { title: "How to Use", content: "When you identify a problem, ask 'Why?' repeatedly until you find the underlying cause." },
                  { title: "Example", content: "Users are leaving → Why? → Not finding value → Why? → No onboarding → Why? → Unclear value prop." }
                ]
              }
            }
          },
          { 
            name: "Investigating Drops", 
            type: "drill", 
            order_index: 2,
            content: {
              drill_content: {
                focus_step: "Root Cause",
                questions: [
                  { text: "Conversion rate dropped 20%. What's the first thing to check?", correct_options: ["User analytics", "Code changes", "Marketing campaigns"], incorrect_options: ["Revenue numbers"], feedback: { correct: "Always check user behavior first!", incorrect: "Don't assume - check the data." } }
                ]
              }
            }
          },
          {
            name: "Internal vs External Factors",
            type: "quiz",
            order_index: 3,
            content: {
              quiz_content: {
                questions: [
                  { text: "Which is an internal factor affecting metrics?", options: ["Market trends", "Competitor launch", "Server outage", "Economic downturn"], correct_answer: 2 },
                  { text: "What should you do when metrics drop?", options: ["Panic immediately", "Investigate root cause", "Ignore it", "Change everything"], correct_answer: 1 }
                ],
                passing_score: 1
              }
            }
          },
        ],
      },
    ],
  },
  // Add more paths as needed
];

async function seed() {
  console.log("Seeding learning paths...");

  for (const pathData of learningPaths) {
    const { units, ...path } = pathData;

    // Check if path exists
    const { data: existingPath } = await supabase
      .from("learning_paths")
      .select("id")
      .eq("name", path.name)
      .single();

    let pathId = existingPath?.id;

    if (!pathId) {
      const { data, error } = await supabase
        .from("learning_paths")
        .insert(path)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting path ${path.name}:`, error);
        continue;
      }
      pathId = data.id;
      console.log(`Created Path: ${path.name}`);
    } else {
      console.log(`Path exists: ${path.name}`);
    }

    for (const unitData of units) {
      const { lessons, ...unit } = unitData;

      const { data: existingUnit } = await supabase
        .from("units")
        .select("id")
        .eq("name", unit.name)
        .eq("learning_path_id", pathId)
        .single();

      let unitId = existingUnit?.id;

      if (!unitId) {
        const { data, error } = await supabase
          .from("units")
          .insert({ ...unit, learning_path_id: pathId })
          .select()
          .single();

        if (error) {
          console.error(`Error inserting unit ${unit.name}:`, error);
          continue;
        }
        unitId = data.id;
        console.log(`  Created Unit: ${unit.name}`);
      } else {
        console.log(`  Unit exists: ${unit.name}`);
      }

      for (const lesson of lessons) {
        const { data: existingLesson } = await supabase
          .from("lessons")
          .select("id")
          .eq("name", lesson.name)
          .eq("unit_id", unitId)
          .single();

        if (!existingLesson) {
          const { error } = await supabase
            .from("lessons")
            .insert({ ...lesson, unit_id: unitId });

          if (error) {
            console.error(`Error inserting lesson ${lesson.name}:`, error);
          } else {
            console.log(`    Created Lesson: ${lesson.name}`);
          }
        } else {
          // Update existing lesson with content if provided
          if (lesson.content) {
            const { error: updateError } = await supabase
              .from("lessons")
              .update({ content: lesson.content })
              .eq("id", existingLesson.id);
            
            if (updateError) {
              console.error(`Error updating lesson ${lesson.name}:`, updateError);
            } else {
              console.log(`    Updated Lesson: ${lesson.name} with content`);
            }
          } else {
            console.log(`    Lesson exists: ${lesson.name}`);
          }
        }
      }
    }
  }

  console.log("Seeding complete!");
}

seed();

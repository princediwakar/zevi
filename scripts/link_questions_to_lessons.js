const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function linkQuestionsToLessons() {
  try {
    console.log("Linking questions to lessons...");

    // 1. Fetch all Lessons
    const { data: lessons, error: lessonError } = await supabase
      .from("lessons")
      .select("id, name, type");

    if (lessonError) throw lessonError;
    console.log(`Found ${lessons.length} lessons.`);

    // 2. Fetch all Questions (that don't have a lesson_id yet?)
    // Actually, let's just fetch all and redistribute to be safe, or just NULL ones.
    const { data: questions, error: questionError } = await supabase
      .from("questions")
      .select("id, category")
      .is("lesson_id", null);

    if (questionError) throw questionError;
    console.log(`Found ${questions.length} unlinked questions.`);

    if (questions.length === 0) {
      console.log("No unlinked questions found.");
      return;
    }

    // 3. Distribute
    // We'll assign ~3-5 questions per 'practice' or 'quiz' lesson.
    const practiceLessons = lessons.filter(
      (l) => l.type === "practice" || l.type === "quiz",
    );

    if (practiceLessons.length === 0) {
      console.log("No practice/quiz lessons found to link to.");
      return;
    }

    console.log(
      `Distributing questions across ${practiceLessons.length} practice lessons...`,
    );

    let qIndex = 0;
    for (const lesson of practiceLessons) {
      // Assign 3 questions to this lesson
      const questionsForLesson = [];
      for (let i = 0; i < 3; i++) {
        if (qIndex < questions.length) {
          questionsForLesson.push(questions[qIndex]);
          qIndex++;
        }
      }

      if (questionsForLesson.length > 0) {
        const qIds = questionsForLesson.map((q) => q.id);
        const { error: updateError } = await supabase
          .from("questions")
          .update({ lesson_id: lesson.id })
          .in("id", qIds);

        if (updateError) {
          console.error(
            `Failed to link questions to lesson ${lesson.name}:`,
            updateError,
          );
        } else {
          console.log(
            `Linked ${questionsForLesson.length} questions to '${lesson.name}'`,
          );
        }
      }
    }

    console.log("Linking complete!");
  } catch (error) {
    console.error("Link script failed:", error);
    process.exit(1);
  }
}

linkQuestionsToLessons();

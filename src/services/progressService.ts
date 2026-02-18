import { supabase } from '../lib/supabaseClient';
import { UserProgress, PracticeMode, QuestionCategory, SessionWithQuestion, FrameworkName, MCQAnswer, Lesson } from '../types';
import { getUserSessions } from './practiceService';
import { logger } from '../utils/logger';

// Type for initial progress to replace any
interface InitialProgressInput {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_questions_completed: number;
  total_mcq_completed: number;
  total_text_completed: number;
  category_progress: Record<string, number>;
  framework_mastery: Record<string, number>;
  pattern_mastery: Record<string, number>;
  readiness_score: number;
  readiness_by_category: Record<string, number>;
  weekly_questions_used: number;
  week_reset_date: string;
  created_at?: string;
  updated_at?: string;
}

// Weekly limit for free tier (text questions with AI feedback)
const FREE_WEEKLY_LIMIT = 3;

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No progress record exists, create one
        return await initializeUserProgress(userId);
      }
      throw error;
    }

    return {
      ...data,
      framework_mastery: data.framework_mastery || {},
      pattern_mastery: data.pattern_mastery || {},
      readiness_score: data.readiness_score || 0,
      readiness_by_category: data.readiness_by_category || {},
    } as UserProgress;
  } catch (error) {
    logger.error('Error fetching user progress:', error);
    throw error;
  }
}


export async function initializeUserProgress(userId: string): Promise<UserProgress> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        total_questions_completed: 0,
        total_mcq_completed: 0,
        total_text_completed: 0,
        category_progress: {},
        framework_mastery: {},
        pattern_mastery: {},
        readiness_score: 0,
        readiness_by_category: {},
        weekly_questions_used: 0,
        week_reset_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserProgress;
  } catch (error) {
    logger.error('Error initializing user progress:', error);
    throw error;
  }
}


export async function updateProgressAfterCompletion(
  userId: string,
  sessionType: PracticeMode,
  category: QuestionCategory
): Promise<void> {
  try {
    // Call the combined transactional function to increment completion count and update streak
    const { error } = await supabase.rpc('complete_practice_session', {
      p_user_id: userId,
      p_session_type: sessionType,
      p_category: category,
    });

    if (error) throw error;
  } catch (error) {
    logger.error('Error updating progress:', error);
    throw error;
  }
}

export async function updateStreak(userId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('update_user_streak', {
      p_user_id: userId,
    });

    if (error) throw error;
  } catch (error) {
    logger.error('Error updating streak:', error);
    throw error;
  }
}

export async function getCategoryProgress(userId: string): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('category_progress')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return (data?.category_progress as Record<string, number>) || {};
  } catch (error) {
    logger.error('Error fetching category progress:', error);
    throw error;
  }
}

export async function calculateStreak(userId: string): Promise<{ current: number; longest: number }> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      current: data?.current_streak || 0,
      longest: data?.longest_streak || 0,
    };
  } catch (error) {
    logger.error('Error calculating streak:', error);
    throw error;
  }
}

export async function getRecentActivity(userId: string, days: number = 7): Promise<SessionWithQuestion[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('practice_sessions')
      .select(`
        *,
        questions (
          id,
          question_text,
          category,
          difficulty,
          company
        )
      `)
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching recent activity:', error);
    throw error;
  }
}

export async function getPracticeActivity(userId: string): Promise<string[]> {
  try {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // Last year

    const { data, error } = await supabase
      .from('practice_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    return data.map((s: any) => s.created_at);
  } catch (error) {
    logger.error('Error fetching practice activity:', error);
    return [];
  }
}

// Check if user is within weekly free tier limit
export async function checkWeeklyLimit(userId: string): Promise<{ used: number; limit: number; remaining: number; canPractice: boolean }> {
  try {
    // Check via RPC function
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId,
    });

    if (error) {
      // Fallback to manual check
      const progress = await getUserProgress(userId);
      const used = progress?.weekly_questions_used || 0;
      const remaining = FREE_WEEKLY_LIMIT - used;
      return {
        used,
        limit: FREE_WEEKLY_LIMIT,
        remaining: Math.max(0, remaining),
        canPractice: remaining > 0,
      };
    }

    return {
      used: data.remaining ? FREE_WEEKLY_LIMIT - data.remaining : 0,
      limit: FREE_WEEKLY_LIMIT,
      remaining: data.remaining || 0,
      canPractice: data.allowed || false,
    };
  } catch (error) {
    logger.error('Error checking weekly limit:', error);
    // Default to allowing practice on error
    return {
      used: 0,
      limit: FREE_WEEKLY_LIMIT,
      remaining: FREE_WEEKLY_LIMIT,
      canPractice: true,
    };
  }
}

// Update framework mastery after a practice session
export async function updateFrameworkMastery(
  userId: string,
  frameworkName: string,
  score: number
): Promise<void> {
  try {
    // Use database function
    const { error } = await supabase.rpc('update_framework_mastery', {
      p_user_id: userId,
      p_framework_name: frameworkName,
      p_score: score,
    });

    if (error) throw error;

    // Recalculate readiness
    await supabase.rpc('calculate_readiness_score', { p_user_id: userId });
  } catch (error) {
    logger.error('Error updating framework mastery:', error);
    throw error;
  }
}

// Update pattern mastery after a practice session
export async function updatePatternMastery(
  userId: string,
  patternName: string,
  score: number
): Promise<void> {
  try {
    // Use database function
    const { error } = await supabase.rpc('update_pattern_mastery', {
      p_user_id: userId,
      p_pattern_name: patternName,
      p_score: score,
    });

    if (error) throw error;

    // Recalculate readiness
    await supabase.rpc('calculate_readiness_score', { p_user_id: userId });
  } catch (error) {
    logger.error('Error updating pattern mastery:', error);
    throw error;
  }
}

// Calculate and update readiness score based on NEW_PLAN spec
// weights: framework_mastery: 0.4, pattern_mastery: 0.3, category_completion: 0.2, practice_volume: 0.1
export async function calculateAndUpdateReadiness(userId: string): Promise<number> {
  try {
    const progress = await getUserProgress(userId);
    if (!progress) return 0;

    // Calculate framework average
    const frameworkKeys = Object.keys(progress.framework_mastery || {});
    const frameworkAvg = frameworkKeys.length > 0
      ? frameworkKeys.reduce((sum, key) => sum + ((progress.framework_mastery?.[key] || 0)), 0) / frameworkKeys.length
      : 0;

    // Calculate pattern average
    const patternKeys = Object.keys(progress.pattern_mastery || {});
    const patternAvg = patternKeys.length > 0
      ? patternKeys.reduce((sum, key) => sum + ((progress.pattern_mastery?.[key] || 0)), 0) / patternKeys.length
      : 0;

    // Calculate category completion average (normalize: each question count / 10 * 100)
    const categoryKeys = Object.keys(progress.category_progress || {});
    const categoryAvg = categoryKeys.length > 0
      ? categoryKeys.reduce((sum, key) => sum + Math.min(((progress.category_progress?.[key] || 0) / 10) * 100, 100), 0) / categoryKeys.length
      : 0;

    // Calculate volume score (max at 50 questions = 100%)
    const volumeScore = Math.min(((progress.total_questions_completed || 0) / 50) * 100, 100);

    // Calculate overall readiness using weights from NEW_PLAN
    const readiness = Math.round(
      frameworkAvg * 0.4 +
      patternAvg * 0.3 +
      categoryAvg * 0.2 +
      volumeScore * 0.1
    );

    const { error } = await supabase
      .from('user_progress')
      .update({ readiness_score: readiness, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;

    return readiness;
  } catch (error) {
    logger.error('Error calculating readiness:', error);
    return 0;
  }
}

// Get framework mastery scores
export async function getFrameworkMastery(userId: string): Promise<Record<string, number>> {
  try {
    const progress = await getUserProgress(userId);
    return progress?.framework_mastery || {};
  } catch (error) {
    logger.error('Error fetching framework mastery:', error);
    return {};
  }
}

// Get pattern mastery scores
export async function getPatternMastery(userId: string): Promise<Record<string, number>> {
  try {
    const progress = await getUserProgress(userId);
    return progress?.pattern_mastery || {};
  } catch (error) {
    logger.error('Error fetching pattern mastery:', error);
    return {};
  }
}

// Get readiness score
export async function getReadinessScore(userId: string): Promise<number> {
  try {
    const progress = await getUserProgress(userId);
    return progress?.readiness_score || 0;
  } catch (error) {
    logger.error('Error fetching readiness score:', error);
    return 0;
  }
}

// Compute weak areas based on user's incorrect answers
// Returns categories where user has < 70% success rate with at least 3 attempts
export async function getWeakAreas(userId: string): Promise<{ category: string; successRate: number; totalAttempts: number }[]> {
  try {
    const sessions = await getUserSessions(userId, 100);
    
    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Group by category and calculate success rate
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    
    for (const session of sessions) {
      // Only count sessions that have been completed with a known result
      if (!session.completed) continue;
      
      // Get the question's category from the joined data
      const category = (session as any).questions?.category;
      if (!category) continue;

      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 };
      }

      categoryStats[category].total += 1;
      
      // For MCQ sessions, check if all sub-answers are correct
      if (session.mcq_answers && session.mcq_answers.length > 0) {
        const allCorrect = session.mcq_answers.every((a: MCQAnswer) => a.correct);
        if (allCorrect) {
          categoryStats[category].correct += 1;
        }
      } else if (session.is_correct === true) {
        // For text/other sessions, use is_correct field
        categoryStats[category].correct += 1;
      }
    }

    // Calculate weak areas (success rate < 70% with at least 3 attempts)
    const weakAreas: { category: string; successRate: number; totalAttempts: number }[] = [];
    
    for (const [category, stats] of Object.entries(categoryStats)) {
      if (stats.total >= 3) { // Minimum 3 attempts to consider as weak area
        const successRate = (stats.correct / stats.total) * 100;
        if (successRate < 70) {
          weakAreas.push({
            category,
            successRate: Math.round(successRate),
            totalAttempts: stats.total
          });
        }
      }
    }

    // Sort by success rate (lowest first) to show most problematic areas first
    weakAreas.sort((a, b) => a.successRate - b.successRate);

    return weakAreas;
  } catch (error) {
    logger.error('Error computing weak areas:', error);
    return [];
  }
}

// Get questions user got wrong (for mistakes review)
export async function getIncorrectQuestions(
  userId: string,
  limit: number = 20
): Promise<SessionWithQuestion[]> {
  try {
    const sessions = await getUserSessions(userId, 100);
    
    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Filter to get only incorrect answers
    const incorrectSessions = sessions.filter(session => {
      if (!session.completed) return false;
      
      // Check MCQ answers
      if (session.mcq_answers && session.mcq_answers.length > 0) {
        return !session.mcq_answers.every((a: MCQAnswer) => a.correct);
      }
      
      // Check is_correct field
      return session.is_correct === false;
    });

    return incorrectSessions.slice(0, limit);
  } catch (error) {
    logger.error('Error fetching incorrect questions:', error);
    return [];
  }
}

// ============================================
// CURRENT LESSON FUNCTIONS
// ============================================

// Get current lesson details for a user
export async function getCurrentLesson(userId: string): Promise<Lesson | null> {
  try {
    // First get the current_lesson_id from progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('current_lesson_id')
      .eq('user_id', userId)
      .single();

    if (progressError || !progress?.current_lesson_id) {
      // No current lesson set - return null
      return null;
    }

    // Get the lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', progress.current_lesson_id)
      .single();

    if (lessonError || !lesson) {
      return null;
    }

    return lesson as Lesson;
  } catch (error) {
    logger.error('Error fetching current lesson:', error);
    return null;
  }
}

// Set current lesson for a user
export async function setCurrentLesson(userId: string, lessonId: string): Promise<void> {
  try {
    // First check if user_progress exists
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('user_progress')
        .update({ current_lesson_id: lessonId, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Insert new record with all required fields
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          current_lesson_id: lessonId,
          completed_lessons: [],
          current_streak: 0,
          longest_streak: 0,
          total_questions_completed: 0,
          total_mcq_completed: 0,
          total_text_completed: 0,
          category_progress: {},
          framework_mastery: {},
          pattern_mastery: {},
          readiness_score: 0,
          readiness_by_category: {},
          weekly_questions_used: 0,
          week_reset_date: new Date().toISOString(),
        });

      if (error) throw error;
    }
  } catch (error) {
    logger.error('Error setting current lesson:', error);
    throw error;
  }
}

// Get the first lesson in the entire course (for initialization)
// Optionally filter by category (defaults to product_sense)
export async function getFirstLesson(category: string = 'product_sense'): Promise<Lesson | null> {
  try {
    // First try to get the first unit from the specified category's learning path
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('id')
      .eq('category', category)
      .order('order_index', { ascending: true })
      .limit(1);

    if (!pathsError && paths && paths.length > 0) {
      // Get the first unit from this learning path
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id')
        .eq('learning_path_id', paths[0].id)
        .order('order_index', { ascending: true })
        .limit(1);

      if (!unitsError && units && units.length > 0) {
        // Get the first lesson in that unit
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('unit_id', units[0].id)
          .order('order_index', { ascending: true })
          .limit(1);

        if (!lessonsError && lessons && lessons.length > 0) {
          return lessons[0] as Lesson;
        }
      }
    }

    // Fallback: get the first unit (lowest order_index) from any learning path
    const { data: fallbackUnits, error: fallbackUnitsError } = await supabase
      .from('units')
      .select('id')
      .order('order_index', { ascending: true })
      .limit(1);

    if (fallbackUnitsError || !fallbackUnits || fallbackUnits.length === 0) {
      return null;
    }

    // Get the first lesson in that unit
    const { data: fallbackLessons, error: fallbackLessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('unit_id', fallbackUnits[0].id)
      .order('order_index', { ascending: true })
      .limit(1);

    if (fallbackLessonsError || !fallbackLessons || fallbackLessons.length === 0) {
      return null;
    }

    return fallbackLessons[0] as Lesson;
  } catch (error) {
    logger.error('Error fetching first lesson:', error);
    return null;
  }
}

// Initialize current lesson for a user (should be called when user starts learning)
export async function initializeCurrentLesson(userId: string): Promise<Lesson | null> {
  try {
    // Check if user already has a current lesson
    const { data: progress } = await supabase
      .from('user_progress')
      .select('current_lesson_id')
      .eq('user_id', userId)
      .single();

    if (progress?.current_lesson_id) {
      // Already has a current lesson
      return await getCurrentLesson(userId);
    }

    // Get first lesson and set it
    const firstLesson = await getFirstLesson();
    if (firstLesson) {
      await setCurrentLesson(userId, firstLesson.id);
      return firstLesson;
    }

    return null;
  } catch (error) {
    logger.error('Error initializing current lesson:', error);
    return null;
  }
}

// Advance to next lesson after completing current lesson
export async function advanceToNextLesson(userId: string, completedLessonId: string): Promise<Lesson | null> {
  try {
    // Call the database function to get and set next lesson
    const { error } = await supabase.rpc('advance_to_next_lesson', {
      p_user_id: userId,
      p_completed_lesson_id: completedLessonId,
    });

    if (error) {
      // Fallback: manual calculation if RPC fails
      logger.warn('RPC advance_to_next_lesson failed, using fallback');
      
      // Get the completed lesson's unit and order
      const { data: completedLesson } = await supabase
        .from('lessons')
        .select('unit_id, order_index')
        .eq('id', completedLessonId)
        .single();

      if (!completedLesson) return null;

      // Try to find next lesson in same unit
      const { data: nextInUnit } = await supabase
        .from('lessons')
        .select('id')
        .eq('unit_id', completedLesson.unit_id)
        .gt('order_index', completedLesson.order_index)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (nextInUnit) {
        await setCurrentLesson(userId, nextInUnit.id);
        return nextInUnit as Lesson;
      }

      // Try next unit
      const { data: currentUnit } = await supabase
        .from('units')
        .select('learning_path_id, order_index')
        .eq('id', completedLesson.unit_id)
        .single();

      if (!currentUnit) return null;

      const { data: nextUnit } = await supabase
        .from('units')
        .select('id')
        .eq('learning_path_id', currentUnit.learning_path_id)
        .gt('order_index', currentUnit.order_index)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (!nextUnit) {
        // No more lessons - course complete!
        return null;
      }

      // Get first lesson of next unit
      const { data: firstOfNextUnit } = await supabase
        .from('lessons')
        .select('*')
        .eq('unit_id', nextUnit.id)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (firstOfNextUnit) {
        await setCurrentLesson(userId, firstOfNextUnit.id);
        return firstOfNextUnit as Lesson;
      }

      return null;
    }

    // Fetch and return the new current lesson
    return await getCurrentLesson(userId);
  } catch (error) {
    logger.error('Error advancing to next lesson:', error);
    return null;
  }
}

// Mark a lesson as completed and add to completed_lessons
export async function markLessonCompleted(userId: string, lessonId: string): Promise<void> {
  try {
    // First check if user_progress exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id, completed_lessons')
      .eq('user_id', userId)
      .single();

    let completedLessons: string[] = [];
    
    if (existingProgress) {
      // Update existing record
      completedLessons = existingProgress.completed_lessons || [];
      
      // Add lesson if not already in the array
      if (!completedLessons.includes(lessonId)) {
        completedLessons = [...completedLessons, lessonId];
        
        const { error } = await supabase
          .from('user_progress')
          .update({ 
            completed_lessons: completedLessons,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      }
    } else {
      // Create new progress record with the completed lesson
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          completed_lessons: [lessonId],
          current_streak: 0,
          longest_streak: 0,
          total_questions_completed: 0,
          total_mcq_completed: 0,
          total_text_completed: 0,
          category_progress: {},
          framework_mastery: {},
          pattern_mastery: {},
          readiness_score: 0,
          readiness_by_category: {},
          weekly_questions_used: 0,
          week_reset_date: new Date().toISOString(),
        });

      if (error) throw error;
    }
  } catch (error) {
    logger.error('Error marking lesson completed:', error);
    throw error;
  }
}

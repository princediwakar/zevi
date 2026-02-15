import { supabase } from '../lib/supabaseClient';
import { UserProgress, PracticeMode, QuestionCategory, SessionWithQuestion, FrameworkName, MCQAnswer } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Type for guest session
interface GuestSessionFilter {
  user_id: string;
  created_at: Date;
}

const GUEST_PROGRESS_KEY = 'guest_progress';
const GUEST_SESSIONS_KEY = 'guest_sessions';

// Weekly limit for free tier (text questions with AI feedback)
const FREE_WEEKLY_LIMIT = 3;

export async function getUserProgress(userId: string, isGuest: boolean = false): Promise<UserProgress | null> {
  try {
    if (isGuest) {
      const stored = await AsyncStorage.getItem(GUEST_PROGRESS_KEY);
      if (!stored) {
        return await initializeUserProgress(userId, true);
      }
      const parsed = JSON.parse(stored);
      // Ensure new fields have defaults
      return {
        ...parsed,
        framework_mastery: parsed.framework_mastery || {},
        pattern_mastery: parsed.pattern_mastery || {},
        readiness_score: parsed.readiness_score || 0,
        readiness_by_category: parsed.readiness_by_category || {},
      };
    }

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


export async function initializeUserProgress(userId: string, isGuest: boolean = false): Promise<UserProgress> {
  try {
    const initialProgress: InitialProgressInput = {
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      weekly_questions_used: 0,
      week_reset_date: new Date().toISOString(),
    };

    if (isGuest) {
      await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(initialProgress));
      return initialProgress as UserProgress;
    }

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
  category: QuestionCategory,
  isGuest: boolean = false
): Promise<void> {
  try {
    if (isGuest) {
      let progress = await getUserProgress(userId, true);
      if (!progress) progress = await initializeUserProgress(userId, true);

      // Increment counts
      progress.total_questions_completed = (progress.total_questions_completed || 0) + 1;
      if (sessionType === 'mcq') progress.total_mcq_completed = (progress.total_mcq_completed || 0) + 1;
      if (sessionType === 'text') progress.total_text_completed = (progress.total_text_completed || 0) + 1;

      // Update category progress
      const currentCategoryCount = progress.category_progress?.[category] || 0;
      progress.category_progress = {
        ...progress.category_progress,
        [category]: currentCategoryCount + 1
      };

      // Update weekly usage for text questions
      if (sessionType === 'text') {
        progress.weekly_questions_used = (progress.weekly_questions_used || 0) + 1;
      }

      progress.updated_at = new Date().toISOString();
      // (streak update handles saving, but we save here to be safe if streak logic fails or changes)
      await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));

      // Update streak
      await updateStreak(userId, true);
      return;
    }

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

export async function updateStreak(userId: string, isGuest: boolean = false): Promise<void> {
  try {
    if (isGuest) {
       let progress = await getUserProgress(userId, true);
       if (!progress) return;

       const today = new Date();
       today.setHours(0, 0, 0, 0); // normalize to midnight
       
       const lastPractice = progress.last_practice_date ? new Date(progress.last_practice_date) : null;
       if (lastPractice) lastPractice.setHours(0, 0, 0, 0);

       if (!lastPractice) {
           progress.current_streak = 1;
       } else if (lastPractice.getTime() === today.getTime()) {
           // Already practiced today
       } else if (lastPractice.getTime() === today.getTime() - 86400000) {
           // Practiced yesterday
           progress.current_streak = (progress.current_streak || 0) + 1;
       } else {
           // Streak broken
           progress.current_streak = 1;
       }

       if ((progress.current_streak || 0) > (progress.longest_streak || 0)) {
           progress.longest_streak = progress.current_streak;
       }
       
       progress.last_practice_date = new Date().toISOString(); // set to now
       await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
       return;
    }

    const { error } = await supabase.rpc('update_user_streak', {
      p_user_id: userId,
    });

    if (error) throw error;
  } catch (error) {
    logger.error('Error updating streak:', error);
    throw error;
  }
}

export async function getCategoryProgress(userId: string, isGuest: boolean = false): Promise<Record<string, number>> {
  try {
    if (isGuest) {
        const progress = await getUserProgress(userId, true);
        return (progress?.category_progress as Record<string, number>) || {};
    }

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

export async function calculateStreak(userId: string, isGuest: boolean = false): Promise<{ current: number; longest: number }> {
  try {
    if (isGuest) {
        const progress = await getUserProgress(userId, true);
        return {
            current: progress?.current_streak || 0,
            longest: progress?.longest_streak || 0
        };
    }

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

export async function getRecentActivity(userId: string, days: number = 7, isGuest: boolean = false): Promise<SessionWithQuestion[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (isGuest) {
        const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
        if (!stored) return [];
        const sessions = JSON.parse(stored).filter((s: any) => 
            s.user_id === userId && 
            new Date(s.created_at) >= startDate
        );
        return sessions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

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
export async function getPracticeActivity(userId: string, isGuest: boolean = false): Promise<string[]> {
  try {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // Last year

    if (isGuest) {
        const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
        if (!stored) return [];
        const sessions = JSON.parse(stored).filter((s: any) =>
            s.user_id === userId &&
            new Date(s.created_at) >= startDate
        );
        return sessions.map((s: any) => s.created_at);
    }

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
export async function checkWeeklyLimit(userId: string, isGuest: boolean = false): Promise<{ used: number; limit: number; remaining: number; canPractice: boolean }> {
  try {
    if (isGuest) {
      const progress = await getUserProgress(userId, true);
      const used = progress?.weekly_questions_used || 0;
      const remaining = FREE_WEEKLY_LIMIT - used;
      return {
        used,
        limit: FREE_WEEKLY_LIMIT,
        remaining: Math.max(0, remaining),
        canPractice: remaining > 0,
      };
    }

    // Check via RPC function
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId,
    });

    if (error) {
      // Fallback to manual check
      const progress = await getUserProgress(userId, false);
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
  score: number,
  isGuest: boolean = false
): Promise<void> {
  try {
    if (isGuest) {
      let progress = await getUserProgress(userId, true);
      if (!progress) progress = await initializeUserProgress(userId, true);

      const currentMastery = progress.framework_mastery?.[frameworkName] || 0;
      // Calculate moving average: 80% old, 20% new
      const newMastery = Math.round(currentMastery * 0.8 + score * 0.2);

      progress.framework_mastery = {
        ...progress.framework_mastery,
        [frameworkName]: newMastery
      };
      progress.updated_at = new Date().toISOString();

      await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));

      // Recalculate readiness
      await calculateAndUpdateReadiness(userId, true);
      return;
    }

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
  score: number,
  isGuest: boolean = false
): Promise<void> {
  try {
    if (isGuest) {
      let progress = await getUserProgress(userId, true);
      if (!progress) progress = await initializeUserProgress(userId, true);

      const currentMastery = progress.pattern_mastery?.[patternName] || 0;
      // Calculate moving average: 80% old, 20% new
      const newMastery = Math.round(currentMastery * 0.8 + score * 0.2);

      progress.pattern_mastery = {
        ...progress.pattern_mastery,
        [patternName]: newMastery
      };
      progress.updated_at = new Date().toISOString();

      await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));

      // Recalculate readiness
      await calculateAndUpdateReadiness(userId, true);
      return;
    }

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
export async function calculateAndUpdateReadiness(
  userId: string,
  isGuest: boolean = false
): Promise<number> {
  try {
    const progress = await getUserProgress(userId, isGuest);
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

    if (isGuest) {
      progress.readiness_score = readiness;
      progress.updated_at = new Date().toISOString();
      await AsyncStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
    } else {
      const { error } = await supabase
        .from('user_progress')
        .update({ readiness_score: readiness, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
    }

    return readiness;
  } catch (error) {
    logger.error('Error calculating readiness:', error);
    return 0;
  }
}

// Get framework mastery scores
export async function getFrameworkMastery(
  userId: string,
  isGuest: boolean = false
): Promise<Record<string, number>> {
  try {
    const progress = await getUserProgress(userId, isGuest);
    return progress?.framework_mastery || {};
  } catch (error) {
    logger.error('Error fetching framework mastery:', error);
    return {};
  }
}

// Get pattern mastery scores
export async function getPatternMastery(
  userId: string,
  isGuest: boolean = false
): Promise<Record<string, number>> {
  try {
    const progress = await getUserProgress(userId, isGuest);
    return progress?.pattern_mastery || {};
  } catch (error) {
    logger.error('Error fetching pattern mastery:', error);
    return {};
  }
}

// Get readiness score
export async function getReadinessScore(
  userId: string,
  isGuest: boolean = false
): Promise<number> {
  try {
    const progress = await getUserProgress(userId, isGuest);
    return progress?.readiness_score || 0;
  } catch (error) {
    logger.error('Error fetching readiness score:', error);
    return 0;
  }
}

// Compute weak areas based on user's incorrect answers
// Returns categories where user has < 70% success rate with at least 3 attempts
export async function getWeakAreas(
  userId: string,
  isGuest: boolean = false
): Promise<{ category: string; successRate: number; totalAttempts: number }[]> {
  try {
    const sessions = await getUserSessions(userId, 100, isGuest);
    
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
  isGuest: boolean = false,
  limit: number = 20
): Promise<SessionWithQuestion[]> {
  try {
    const sessions = await getUserSessions(userId, 100, isGuest);
    
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

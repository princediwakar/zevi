import { supabase } from '../lib/supabaseClient';
import { Question, QuestionCategory, Difficulty, QUESTION_CATEGORIES } from '../types';
import * as progressService from './progressService';
import { sampleQuestions } from '../data/sampleQuestions';
import { logger } from '../utils/logger';

export interface QuestionFilters {
  category?: QuestionCategory;
  difficulty?: Difficulty;
  company?: string;
  searchQuery?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

const QUESTIONS_PER_PAGE = 20;

export async function fetchQuestions(
  filters: QuestionFilters = {},
  page: number = 0
): Promise<PaginatedResponse<Question>> {
  try {
    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters.company) {
      query = query.ilike('company', `%${filters.company}%`);
    }

    if (filters.searchQuery) {
      query = query.or(`question_text.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%`);
    }

    // Apply pagination
    const from = page * QUESTIONS_PER_PAGE;
    const to = from + QUESTIONS_PER_PAGE - 1;
    query = query.range(from, to);

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      hasMore: count ? (page + 1) * QUESTIONS_PER_PAGE < count : false,
    };
  } catch (error) {
    logger.error('Error fetching questions:', error);
    throw error;
  }
}

export async function searchQuestions(query: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .or(`question_text.ilike.%${query}%,company.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error searching questions:', error);
    throw error;
  }
}

export async function getQuestionById(id: string): Promise<Question | null> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching question:', error);
    throw error;
  }
}

export async function getRelatedQuestions(questionId: string, category: QuestionCategory): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category)
      .neq('id', questionId)
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching related questions:', error);
    throw error;
  }
}

export async function getQuestionsByCategory(category: QuestionCategory): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category)
      .order('difficulty', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching questions by category:', error);
    throw error;
  }
}

export async function getCategoryStats(): Promise<Record<string, number>> {
  // First try to get from database
  try {
    const promises = QUESTION_CATEGORIES.map(async (category) => {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);
      
      if (error) {
        logger.error(`Error counting category ${category}:`, error);
        return { category, count: 0 };
      }
      return { category, count: count || 0 };
    });

    const results = await Promise.all(promises);
    
    const stats: Record<string, number> = {};
    let totalFromDB = 0;
    results.forEach(r => {
      stats[r.category] = r.count;
      totalFromDB += r.count;
    });

    // If database is empty, fall back to sampleQuestions
    if (totalFromDB === 0) {
      logger.log('Database empty, using sampleQuestions for stats');
      return getSampleQuestionsStats();
    }

    return stats;
  } catch (error) {
    logger.error('Error fetching category stats from DB, using sampleQuestions:', error);
    return getSampleQuestionsStats();
  }
}

// Helper: Map sampleQuestion categories to valid categories
function mapCategory(cat: string): QuestionCategory {
  const mapping: Record<string, QuestionCategory> = {
    'metrics': 'product_sense',
    'prioritization': 'execution',
    'product_improvement': 'product_sense',
  };
  return mapping[cat] as QuestionCategory || cat as QuestionCategory;
}

// Helper: Get stats from sampleQuestions
function getSampleQuestionsStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  
  // Initialize all categories to 0
  QUESTION_CATEGORIES.forEach(cat => {
    stats[cat] = 0;
  });
  
  // Count from sampleQuestions
  sampleQuestions.forEach(q => {
    const cat = mapCategory(q.category);
    if (cat && cat in stats) {
      stats[cat]++;
    }
  });
  
  return stats;
}

export async function getQuestionsByLessonId(lessonId: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('lesson_id', lessonId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching questions by lesson:', error);
    throw error;
  }
}

// ============================================
// PERSONALIZED QUESTION SELECTION
// ============================================

/**
 * Get questions the user hasn't practiced yet (or practiced least recently)
 * This is the key function for personalized practice!
 */
export async function getUnpracticedQuestions(
  userId: string,
  limit: number = 10,
  isGuest: boolean = false
): Promise<Question[]> {
  try {
    // Get all question IDs the user has practiced
    const { data: sessions, error: sessionError } = await supabase
      .from('practice_sessions')
      .select('question_id, created_at')
      .eq('user_id', userId);

    if (sessionError) {
      logger.error('Error fetching user sessions:', sessionError);
      // Fallback to random questions if we can't get user history
      return getRandomQuestions(limit);
    }

    // Get all available questions
    const { data: allQuestions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .not('mcq_version', 'is', null); // Only questions with MCQ version

    if (questionsError) {
      logger.error('Error fetching questions:', questionsError);
      return getRandomQuestions(limit);
    }

    if (!allQuestions || allQuestions.length === 0) {
      return [];
    }

    // Create a map of question_id -> last practiced date
    const practicedMap = new Map<string, Date>();
    sessions?.forEach(session => {
      const existing = practicedMap.get(session.question_id);
      const sessionDate = new Date(session.created_at);
      if (!existing || sessionDate > existing) {
        practicedMap.set(session.question_id, sessionDate);
      }
    });

    // Separate into practiced and unpracticed
    const unpracticed: Question[] = [];
    const practiced: { question: Question; lastPracticed: Date }[] = [];

    allQuestions.forEach(q => {
      const lastPracticed = practicedMap.get(q.id);
      if (!lastPracticed) {
        unpracticed.push(q);
      } else {
        practiced.push({ question: q, lastPracticed });
      }
    });

    // Sort practiced by oldest first (spaced repetition - practice oldest first)
    practiced.sort((a, b) => a.lastPracticed.getTime() - b.lastPracticed.getTime());

    // Combine: unpracticed first (shuffled), then practiced oldest first
    const shuffled = [...unpracticed].sort(() => Math.random() - 0.5);
    
    // Take unpracticed questions first, then fill with oldest practiced
    const result: Question[] = [];
    const unpracticedToTake = Math.min(shuffled.length, limit);
    result.push(...shuffled.slice(0, unpracticedToTake));

    if (result.length < limit) {
      const remaining = limit - result.length;
      const practicedToTake = Math.min(practiced.length, remaining);
      result.push(...practiced.slice(0, practicedToTake).map(p => p.question));
    }

    return result;
  } catch (error) {
    logger.error('Error in getUnpracticedQuestions:', error);
    return getRandomQuestions(limit);
  }
}

/**
 * Get questions from user's weakest categories based on category_progress
 */
export async function getWeakCategoryQuestions(
  userId: string,
  limit: number = 5,
  isGuest: boolean = false
): Promise<Question[]> {
  try {
    // Get user's category progress
    const categoryProgress = await progressService.getCategoryProgress(userId, isGuest);
    
    // Get all categories
    const { data: allQuestions, error } = await supabase
      .from('questions')
      .select('*, practice_sessions!inner(id)')
      .not('mcq_version', 'is', null);

    if (error || !allQuestions) {
      logger.error('Error fetching questions:', error);
      return getRandomQuestions(limit);
    }

    // Group by category and count
    const categoryCounts = new Map<string, number>();
    allQuestions.forEach(q => {
      const count = categoryCounts.get(q.category) || 0;
      categoryCounts.set(q.category, count + 1);
    });

    // Calculate completion rate for each category
    const completionRates: { category: string; rate: number }[] = [];
    categoryCounts.forEach((totalQuestions, category) => {
      const completed = categoryProgress[category] || 0;
      const rate = totalQuestions > 0 ? completed / totalQuestions : 1;
      completionRates.push({ category, rate });
    });

    // Sort by lowest completion rate (weakest first)
    completionRates.sort((a, b) => a.rate - b.rate);

    // Get questions from weakest categories
    const result: Question[] = [];
    for (const { category } of completionRates) {
      if (result.length >= limit) break;
      
      const { data: categoryQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .not('mcq_version', 'is', null)
        .limit(limit - result.length);

      if (categoryQuestions) {
        result.push(...categoryQuestions);
      }
    }

    // Shuffle the result for variety
    return result.sort(() => Math.random() - 0.5);
  } catch (error) {
    logger.error('Error in getWeakCategoryQuestions:', error);
    return getRandomQuestions(limit);
  }
}

/**
 * Get a single personalized question based on user's history
 * Prioritizes: unpracticed > weakest category > random
 */
export async function getPersonalizedQuestion(
  userId: string,
  isGuest: boolean = false
): Promise<Question | null> {
  try {
    // First, try to get an unpracticed question
    const unpracticed = await getUnpracticedQuestions(userId, 1, isGuest);
    if (unpracticed.length > 0) {
      return unpracticed[0];
    }

    // If all questions practiced, get from weakest category
    const weakQuestions = await getWeakCategoryQuestions(userId, 1, isGuest);
    if (weakQuestions.length > 0) {
      return weakQuestions[0];
    }

    // Ultimate fallback: random question
    return getRandomQuestion() || null;
  } catch (error) {
    logger.error('Error in getPersonalizedQuestion:', error);
    return getRandomQuestion() || null;
  }
}

/**
 * Get multiple personalized questions for a quiz
 * Mix of: 50% unpracticed, 30% weak categories, 20% random review
 */
export async function getPersonalizedQuizQuestions(
  userId: string,
  totalQuestions: number = 5,
  isGuest: boolean = false
): Promise<Question[]> {
  try {
    const result: Question[] = [];

    // 50% unpracticed
    const unpracticedCount = Math.ceil(totalQuestions * 0.5);
    const unpracticed = await getUnpracticedQuestions(userId, unpracticedCount, isGuest);
    result.push(...unpracticed);

    // 30% from weak categories (if we need more)
    if (result.length < totalQuestions) {
      const weakCount = Math.ceil(totalQuestions * 0.3);
      const weak = await getWeakCategoryQuestions(userId, weakCount, isGuest);
      
      // Add only unique questions
      const existingIds = new Set(result.map(q => q.id));
      weak.forEach(q => {
        if (result.length < totalQuestions && !existingIds.has(q.id)) {
          result.push(q);
        }
      });
    }

    // 20% random for review (questions user HAS practiced but should review)
    if (result.length < totalQuestions) {
      const reviewCount = totalQuestions - result.length;
      const { data: reviewQuestions } = await supabase
        .from('questions')
        .select('*')
        .not('mcq_version', 'is', null)
        .limit(reviewCount * 2); // Get extra to filter duplicates
      
      if (reviewQuestions) {
        const existingIds = new Set(result.map(q => q.id));
        const shuffled = reviewQuestions.sort(() => Math.random() - 0.5);
        
        for (const q of shuffled) {
          if (result.length < totalQuestions && !existingIds.has(q.id)) {
            result.push(q);
          }
        }
      }
    }

    // Final shuffle for variety
    return result.sort(() => Math.random() - 0.5);
  } catch (error) {
    logger.error('Error in getPersonalizedQuizQuestions:', error);
    // Fallback to random
    const fallback: Question[] = [];
    for (let i = 0; i < totalQuestions; i++) {
      const q = getRandomQuestion();
      if (q) fallback.push(q);
    }
    return fallback;
  }
}

// Helper: Get random questions from database
async function getRandomQuestions(limit: number): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .not('mcq_version', 'is', null)
      .limit(limit * 2); // Get extra to filter

    if (error || !data) return [];
    
    // Shuffle and return requested amount
    return data.sort(() => Math.random() - 0.5).slice(0, limit);
  } catch (error) {
    logger.error('Error getting random questions:', error);
    return [];
  }
}

// Helper: Get single random question (for store fallback)
function getRandomQuestion(): Question | undefined {
  // Use sample questions as fallback when database is unavailable
  const mcqQuestions = sampleQuestions.filter(q => q.mcq_version?.enabled);
  if (mcqQuestions.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * mcqQuestions.length);
  return mcqQuestions[randomIndex];
}

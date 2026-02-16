import { create } from 'zustand';
import { Question, QuestionCategory, Difficulty, QUESTION_CATEGORIES } from '../types';
import { sampleQuestions } from '../data/sampleQuestions';
import * as questionService from '../services/questionService';
import { logger } from '../utils/logger';

// Helper to calculate category stats from sample questions
function getInitialCategoryStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  QUESTION_CATEGORIES.forEach(cat => {
    stats[cat] = 0;
  });
  
  // Map sample question categories to valid categories
  const categoryMapping: Record<string, string> = {
    'metrics': 'product_sense',
    'prioritization': 'execution',
    'product_improvement': 'product_sense',
  };
  
  sampleQuestions.forEach(q => {
    const mappedCategory = categoryMapping[q.category] || q.category;
    if (mappedCategory in stats) {
      stats[mappedCategory]++;
    }
  });
  
  return stats;
}

interface QuestionsState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalCount: number;
  categoryStats: Record<string, number>;
  lastPersonalizedFetch: number; // timestamp for caching
  
  // Actions
  fetchQuestions: (filters?: questionService.QuestionFilters, page?: number) => Promise<void>;
  searchQuestions: (query: string) => Promise<void>;
  getQuestionById: (id: string) => Promise<Question | null>;
  getRelatedQuestions: (questionId: string, category: QuestionCategory) => Promise<Question[]>;
  getRecommendedQuestions: (userId: string, limit?: number) => Promise<Question[]>;
  getRandomMCQQuestion: (userId?: string) => Promise<Question | undefined>;
  filterByCategory: (category: QuestionCategory) => Question[];
  loadMore: (filters?: questionService.QuestionFilters) => Promise<void>;
  getQuestionsByLessonId: (lessonId: string) => Promise<Question[]>;
  fetchCategoryStats: () => Promise<void>;
  reset: () => void;
}

// Helper to deduplicate questions by ID
function deduplicateQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>();
  return questions.filter(q => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questions: [], // Start empty - will be populated from Supabase
  loading: false,
  error: null,
  currentPage: 0,
  hasMore: true,
  totalCount: 0,
  categoryStats: getInitialCategoryStats(),
  lastPersonalizedFetch: 0,

  fetchQuestions: async (filters = {}, page = 0) => {
    set({ loading: true, error: null });
    try {
      const response = await questionService.fetchQuestions(filters, page);
      
      // Always deduplicate to be safe
      const dedupedData = deduplicateQuestions(response.data);
      
      // If page is 0, replace all questions; otherwise append new ones
      if (page === 0) {
        set({
          questions: dedupedData,
          currentPage: page,
          hasMore: response.hasMore,
          totalCount: response.count,
          loading: false,
        });
      } else {
        // Deduplicate when loading more
        const existingIds = new Set(get().questions.map(q => q.id));
        const newQuestions = dedupedData.filter(q => !existingIds.has(q.id));
        set({
          questions: [...get().questions, ...newQuestions],
          currentPage: page,
          hasMore: response.hasMore,
          totalCount: response.count,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Set empty on failure - don't use sample questions
      set({
        questions: [],
        loading: false,
        error: 'Failed to load questions from database.',
        hasMore: false,
        totalCount: 0,
      });
    }
  },

  searchQuestions: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const results = await questionService.searchQuestions(query);
      // Deduplicate search results
      const dedupedResults = deduplicateQuestions(results);
      set({
        questions: dedupedResults,
        loading: false,
        hasMore: false,
        currentPage: 0,
      });
    } catch (error) {
      console.error('Error searching questions:', error);
      set({
        loading: false,
        error: 'Failed to search questions',
      });
    }
  },

  getQuestionById: async (id: string) => {
    try {
      const question = await questionService.getQuestionById(id);
      return question;
    } catch (error) {
      console.error('Error fetching question:', error);
      // Fallback to local search
      return get().questions.find(q => q.id === id) || null;
    }
  },

  getRelatedQuestions: async (questionId: string, category: QuestionCategory) => {
    try {
      return await questionService.getRelatedQuestions(questionId, category);
    } catch (error) {
      console.error('Error fetching related questions:', error);
      return [];
    }
  },

  getRandomMCQQuestion: async (userId?: string) => {
    // If we have a userId, try to use personalized selection first
    if (userId) {
      try {
        const personalized = await questionService.getPersonalizedQuestion(userId);
        if (personalized) {
          // Cache this personalized fetch
          set({ lastPersonalizedFetch: Date.now() });
          return personalized;
        }
      } catch (error) {
        console.error('Error getting personalized question:', error);
        // Fall through to fallback
      }
    }
    
    // Fallback to local random question
    const mcqQuestions = get().questions.filter(q => q.mcq_version?.enabled);
    if (mcqQuestions.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * mcqQuestions.length);
    return mcqQuestions[randomIndex];
  },

  getRecommendedQuestions: async (userId: string, limit: number = 5) => {
    // Use personalized question selection based on user's practice history
    try {
      const personalized = await questionService.getPersonalizedQuizQuestions(userId, limit);
      if (personalized && personalized.length > 0) {
        // Cache this personalized fetch
        set({ lastPersonalizedFetch: Date.now() });
        return personalized;
      }
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      // Fall through to fallback
    }
    
    // Fallback to local questions
    const allQuestions = get().questions.filter(q => q.mcq_version?.enabled);
    
    // In production, avoid heavy random sort on large arrays
    if (__DEV__) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } else {
        // Simple slice for performance until better algo
        return allQuestions.slice(0, limit);
    }
  },

  filterByCategory: (category: QuestionCategory) => {
    return get().questions.filter(q => q.category === category);
  },

  loadMore: async (filters = {}) => {
    const { currentPage, hasMore, loading } = get();
    if (!hasMore || loading) return;
    
    await get().fetchQuestions(filters, currentPage + 1);
  },

  fetchCategoryStats: async () => {
    try {
      const stats = await questionService.getCategoryStats();
      
      // Merge with sample questions stats (in case DB is empty or has lower counts)
      const sampleStats = getInitialCategoryStats();
      const mergedStats: Record<string, number> = {};
      
      QUESTION_CATEGORIES.forEach(cat => {
        // Use the higher of DB stats or sample stats
        mergedStats[cat] = Math.max(stats[cat] || 0, sampleStats[cat] || 0);
      });
      
      set({ categoryStats: mergedStats });
    } catch (error) {
      console.error('Error fetching category stats:', error);
      // Fall back to sample questions stats
      set({ categoryStats: getInitialCategoryStats() });
    }
  },

  getQuestionsByLessonId: async (lessonId: string) => {
    try {
      return await questionService.getQuestionsByLessonId(lessonId);
    } catch (error) {
      console.error('Error fetching questions by lesson:', error);
      return [];
    }
  },

  reset: () => {
    set({
      questions: [],
      currentPage: 0,
      hasMore: true,
      error: null,
    });
  },
}));

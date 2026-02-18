import { create } from 'zustand';
import { UserProgress, PracticeMode, QuestionCategory, SessionWithQuestion, Lesson } from '../types';
import * as progressService from '../services/progressService';

interface WeakArea {
  category: string;
  successRate: number;
  totalAttempts: number;
}

interface ProgressState {
  progress: UserProgress | null;
  currentLesson: Lesson | null; // The user's current lesson in the course
  loading: boolean;
  error: string | null;
  history: SessionWithQuestion[];
  activityData: string[]; // Dates of practice
  frameworkMastery: Record<string, number>;
  patternMastery: Record<string, number>;
  readinessScore: number;
  weakAreas: WeakArea[];
  incorrectQuestions: SessionWithQuestion[];
  
  // Actions
  fetchProgress: (userId: string) => Promise<void>;
  fetchCurrentLesson: (userId: string) => Promise<void>;
  initializeCurrentLesson: (userId: string) => Promise<void>;
  completeCurrentLesson: (userId: string, lessonId: string) => Promise<void>;
  fetchHistory: (userId: string) => Promise<void>;
  fetchActivity: (userId: string) => Promise<void>;
  fetchMastery: (userId: string) => Promise<void>;
  fetchWeakAreas: (userId: string) => Promise<void>;
  updateAfterCompletion: (userId: string, mode: PracticeMode, category: QuestionCategory) => Promise<void>;
  updateFrameworkMastery: (userId: string, frameworkName: string, score: number) => Promise<void>;
  updatePatternMastery: (userId: string, patternName: string, score: number) => Promise<void>;
  calculateReadiness: (userId: string) => Promise<void>;
  updateStreak: (userId: string) => Promise<void>;
  getCategoryProgress: (userId: string) => Promise<Record<string, number>>;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,
  currentLesson: null,
  loading: false,
  error: null,
  history: [],
  activityData: [],
  frameworkMastery: {},
  patternMastery: {},
  readinessScore: 0,
  weakAreas: [],
  incorrectQuestions: [],

  fetchCurrentLesson: async (userId: string) => {
    try {
      const lesson = await progressService.getCurrentLesson(userId);
      set({ currentLesson: lesson });
    } catch (error) {
      console.error('Error fetching current lesson:', error);
    }
  },

  initializeCurrentLesson: async (userId: string) => {
    try {
      const lesson = await progressService.initializeCurrentLesson(userId);
      set({ currentLesson: lesson });
    } catch (error) {
      console.error('Error initializing current lesson:', error);
    }
  },

  completeCurrentLesson: async (userId: string, lessonId: string) => {
    try {
      // Mark lesson as completed
      await progressService.markLessonCompleted(userId, lessonId);
      // Advance to next lesson
      const nextLesson = await progressService.advanceToNextLesson(userId, lessonId);
      set({ currentLesson: nextLesson });
      // Also refresh progress to update completed_lessons
      await get().fetchProgress(userId);
    } catch (error) {
      console.error('Error completing current lesson:', error);
    }
  },

  fetchProgress: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const progress = await progressService.getUserProgress(userId);
      set({ 
        progress, 
        loading: false,
        frameworkMastery: progress?.framework_mastery || {},
        patternMastery: progress?.pattern_mastery || {},
        readinessScore: progress?.readiness_score || 0,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchActivity: async (userId: string) => {
    try {
      const dates = await progressService.getPracticeActivity(userId);
      set({ activityData: dates });
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  },

  fetchHistory: async (userId: string) => {
    try {
      const { getUserSessions } = await import('../services/practiceService');
      const history = await getUserSessions(userId, 10);
      set({ history });
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  },

  fetchMastery: async (userId: string) => {
    try {
      const [frameworkMastery, patternMastery, readinessScore] = await Promise.all([
        progressService.getFrameworkMastery(userId),
        progressService.getPatternMastery(userId),
        progressService.getReadinessScore(userId),
      ]);
      set({ frameworkMastery, patternMastery, readinessScore });
    } catch (error) {
      console.error('Failed to fetch mastery:', error);
    }
  },

  fetchWeakAreas: async (userId: string) => {
    try {
      const weakAreas = await progressService.getWeakAreas(userId);
      const incorrectQuestions = await progressService.getIncorrectQuestions(userId);
      set({ weakAreas, incorrectQuestions });
    } catch (error) {
      console.error('Failed to fetch weak areas:', error);
    }
  },

  updateAfterCompletion: async (userId: string, mode: PracticeMode, category: QuestionCategory) => {
    try {
      await progressService.updateProgressAfterCompletion(userId, mode, category);
      await get().fetchProgress(userId);
    } catch (error) {
      console.error('Error updating progress:', error);
      set({ error: 'Failed to update progress' });
    }
  },

  updateFrameworkMastery: async (userId: string, frameworkName: string, score: number) => {
    try {
      await progressService.updateFrameworkMastery(userId, frameworkName, score);
      await get().fetchMastery(userId);
    } catch (error) {
      console.error('Error updating framework mastery:', error);
    }
  },

  updatePatternMastery: async (userId: string, patternName: string, score: number) => {
    try {
      await progressService.updatePatternMastery(userId, patternName, score);
      await get().fetchMastery(userId);
    } catch (error) {
      console.error('Error updating pattern mastery:', error);
    }
  },

  calculateReadiness: async (userId: string) => {
    try {
      const readinessScore = await progressService.calculateAndUpdateReadiness(userId);
      set({ readinessScore });
    } catch (error) {
      console.error('Error calculating readiness:', error);
    }
  },

  updateStreak: async (userId: string) => {
    try {
      await get().fetchProgress(userId);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  },

  getCategoryProgress: async (userId: string) => {
    try {
      return await progressService.getCategoryProgress(userId);
    } catch (error) {
      console.error('Error getting category progress:', error);
      return {};
    }
  },

  resetProgress: () => {
    set({
      progress: null,
      currentLesson: null,
      loading: false,
      error: null,
      history: [],
      activityData: [],
      frameworkMastery: {},
      patternMastery: {},
      readinessScore: 0,
      weakAreas: [],
      incorrectQuestions: [],
    });
  },
}));

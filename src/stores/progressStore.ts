import { create } from 'zustand';
import { UserProgress, PracticeMode, QuestionCategory, SessionWithQuestion } from '../types';
import * as progressService from '../services/progressService';

interface WeakArea {
  category: string;
  successRate: number;
  totalAttempts: number;
}

interface ProgressState {
  progress: UserProgress | null;
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
  fetchProgress: (userId: string, isGuest?: boolean) => Promise<void>;
  fetchHistory: (userId: string, isGuest?: boolean) => Promise<void>;
  fetchActivity: (userId: string, isGuest?: boolean) => Promise<void>;
  fetchMastery: (userId: string, isGuest?: boolean) => Promise<void>;
  fetchWeakAreas: (userId: string, isGuest?: boolean) => Promise<void>;
  updateAfterCompletion: (userId: string, mode: PracticeMode, category: QuestionCategory, isGuest?: boolean) => Promise<void>;
  updateFrameworkMastery: (userId: string, frameworkName: string, score: number, isGuest?: boolean) => Promise<void>;
  updatePatternMastery: (userId: string, patternName: string, score: number, isGuest?: boolean) => Promise<void>;
  calculateReadiness: (userId: string, isGuest?: boolean) => Promise<void>;
  updateStreak: (userId: string, isGuest?: boolean) => Promise<void>;
  getCategoryProgress: (userId: string, isGuest?: boolean) => Promise<Record<string, number>>;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,
  loading: false,
  error: null,
  history: [],
  activityData: [],
  frameworkMastery: {},
  patternMastery: {},
  readinessScore: 0,
  weakAreas: [],
  incorrectQuestions: [],

  fetchProgress: async (userId: string, isGuest: boolean = false) => {
    set({ loading: true, error: null });
    try {
      const progress = await progressService.getUserProgress(userId, isGuest);
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

  fetchActivity: async (userId: string, isGuest: boolean = false) => {
    try {
      const dates = await progressService.getPracticeActivity(userId, isGuest);
      set({ activityData: dates });
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  },

  fetchHistory: async (userId: string, isGuest: boolean = false) => {
    try {
      const { getUserSessions } = await import('../services/practiceService');
      const history = await getUserSessions(userId, 10, isGuest);
      set({ history });
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  },

  fetchMastery: async (userId: string, isGuest: boolean = false) => {
    try {
      const [frameworkMastery, patternMastery, readinessScore] = await Promise.all([
        progressService.getFrameworkMastery(userId, isGuest),
        progressService.getPatternMastery(userId, isGuest),
        progressService.getReadinessScore(userId, isGuest),
      ]);
      set({ frameworkMastery, patternMastery, readinessScore });
    } catch (error) {
      console.error('Failed to fetch mastery:', error);
    }
  },

  fetchWeakAreas: async (userId: string, isGuest: boolean = false) => {
    try {
      const weakAreas = await progressService.getWeakAreas(userId, isGuest);
      const incorrectQuestions = await progressService.getIncorrectQuestions(userId, isGuest);
      set({ weakAreas, incorrectQuestions });
    } catch (error) {
      console.error('Failed to fetch weak areas:', error);
    }
  },

  updateAfterCompletion: async (userId: string, mode: PracticeMode, category: QuestionCategory, isGuest: boolean = false) => {
    try {
      await progressService.updateProgressAfterCompletion(userId, mode, category, isGuest);
      await get().fetchProgress(userId, isGuest);
    } catch (error) {
      console.error('Error updating progress:', error);
      set({ error: 'Failed to update progress' });
    }
  },

  updateFrameworkMastery: async (userId: string, frameworkName: string, score: number, isGuest: boolean = false) => {
    try {
      await progressService.updateFrameworkMastery(userId, frameworkName, score, isGuest);
      await get().fetchMastery(userId, isGuest);
    } catch (error) {
      console.error('Error updating framework mastery:', error);
    }
  },

  updatePatternMastery: async (userId: string, patternName: string, score: number, isGuest: boolean = false) => {
    try {
      await progressService.updatePatternMastery(userId, patternName, score, isGuest);
      await get().fetchMastery(userId, isGuest);
    } catch (error) {
      console.error('Error updating pattern mastery:', error);
    }
  },

  calculateReadiness: async (userId: string, isGuest: boolean = false) => {
    try {
      const readinessScore = await progressService.calculateAndUpdateReadiness(userId, isGuest);
      set({ readinessScore });
    } catch (error) {
      console.error('Error calculating readiness:', error);
    }
  },

  updateStreak: async (userId: string, isGuest: boolean = false) => {
    try {
      await get().fetchProgress(userId, isGuest);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  },

  getCategoryProgress: async (userId: string, isGuest: boolean = false) => {
    try {
      return await progressService.getCategoryProgress(userId, isGuest);
    } catch (error) {
      console.error('Error getting category progress:', error);
      return {};
    }
  },

  resetProgress: () => {
    set({ progress: null, error: null, frameworkMastery: {}, patternMastery: {}, readinessScore: 0 });
  },
}));


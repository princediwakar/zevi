import { supabase } from '../lib/supabaseClient';
import { PracticeSession, PracticeMode, Draft, Question, SessionWithQuestion, DraftWithQuestion, MCQAnswer, UserOutline } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUUID } from '../utils/uuid';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';

const GUEST_SESSIONS_KEY = 'guest_sessions';
const GUEST_DRAFTS_KEY = 'guest_drafts';
const GUEST_PROGRESS_KEY = 'guest_progress';

// Helper functions for outline serialization
const serializeAnswer = (answer: string | UserOutline): string => {
  if (typeof answer === 'string') return answer;
  return JSON.stringify(answer);
};

const deserializeAnswer = (text: string): string | UserOutline => {
  try {
    const parsed = JSON.parse(text);
    // Validate it's a UserOutline structure
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      // Check if values are arrays of strings
      const values = Object.values(parsed);
      if (values.every(val => Array.isArray(val) && val.every(item => typeof item === 'string'))) {
        return parsed as UserOutline;
      }
    }
  } catch {
    // Not valid JSON, return as plain text
  }
  return text;
};

// Process a session object to deserialize user_answer
const processSession = (session: any): any => {
  if (session && session.user_answer && typeof session.user_answer === 'string') {
    return {
      ...session,
      user_answer: deserializeAnswer(session.user_answer),
    };
  }
  return session;
};

interface GuestSession {
  id: string;
  user_id: string;
  question_id: string;
  session_type: PracticeMode;
  completed: boolean;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
  user_answer?: string;
  mcq_answers?: MCQAnswer[];
}

export interface CreateSessionParams {
  userId: string;
  questionId: string;
  mode: PracticeMode;
  isGuest?: boolean;
}

export interface SaveDraftParams {
  userId: string;
  questionId: string;
  draftText: string;
  isGuest?: boolean;
}

export interface SubmitAnswerParams {
  sessionId: string;
  userAnswer: string | UserOutline;
  timeSpentSeconds: number;
  mcqAnswers?: MCQAnswer[];
  aiFeedback?: any;
  isCorrect?: boolean; // Track if the answer was correct
  isGuest?: boolean;
}

export async function createPracticeSession(params: CreateSessionParams): Promise<string> {
  try {
    // Validate question exists in database before creating session (for non-guest users)
    if (!params.isGuest) {
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .select('id')
        .eq('id', params.questionId)
        .single();
      
      if (questionError || !question) {
        logger.error('Question not found in database:', params.questionId);
        throw new Error('Question not found in database. Please refresh and try again.');
      }
    }

    if (params.isGuest) {
      const newSession = {
        id: generateUUID(),
        user_id: params.userId,
        question_id: params.questionId,
        session_type: params.mode,
        completed: false,
        time_spent_seconds: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
      const sessions = stored ? JSON.parse(stored) : [];
      sessions.push(newSession);
      await AsyncStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions));
      
      return newSession.id;
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .insert({
        user_id: params.userId,
        question_id: params.questionId,
        session_type: params.mode,
        completed: false,
        time_spent_seconds: 0,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    logger.error('Error creating practice session:', error);
    throw error;
  }
}

export async function saveDraft(params: SaveDraftParams): Promise<void> {
  try {
    if (params.isGuest) {
      const stored = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
      let drafts = stored ? JSON.parse(stored) : [];
      
      const existingIndex = drafts.findIndex((d: any) => 
        d.user_id === params.userId && d.question_id === params.questionId
      );

      const draftData = {
        user_id: params.userId,
        question_id: params.questionId,
        draft_text: params.draftText,
        updated_at: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        drafts[existingIndex] = { ...drafts[existingIndex], ...draftData };
      } else {
        drafts.push({ ...draftData, id: generateUUID(), created_at: new Date().toISOString() });
      }

      await AsyncStorage.setItem(GUEST_DRAFTS_KEY, JSON.stringify(drafts));
      return;
    }

    const { error } = await supabase
      .from('drafts')
      .upsert({
        user_id: params.userId,
        question_id: params.questionId,
        draft_text: params.draftText,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    logger.error('Error saving draft:', error);
    throw error;
  }
}

export async function getDraft(userId: string, questionId: string, isGuest: boolean = false): Promise<string | null> {
  try {
    if (isGuest) {
      const stored = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
      if (!stored) return null;
      const drafts = JSON.parse(stored);
      const draft = drafts.find((d: any) => d.user_id === userId && d.question_id === questionId);
      return draft ? draft.draft_text : null;
    }

    const { data, error } = await supabase
      .from('drafts')
      .select('draft_text')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No draft found
      throw error;
    }

    return data?.draft_text || null;
  } catch (error) {
    logger.error('Error fetching draft:', error);
    throw error;
  }
}

export async function getUserDrafts(userId: string, isGuest: boolean = false): Promise<DraftWithQuestion[]> {
  try {
    if (isGuest) {
       const stored = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
       if (!stored) return [];
       const drafts = JSON.parse(stored).filter((d: any) => d.user_id === userId);
       return drafts; 
    }

    const { data, error } = await supabase
      .from('drafts')
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
      .order('updated_at', { ascending: false });

    if (error) throw error;
    // Process each session to deserialize user_answer
    return (data || []).map(processSession);
  } catch (error) {
    logger.error('Error fetching user drafts:', error);
    throw error;
  }
}

export async function submitAnswer(params: SubmitAnswerParams): Promise<void> {
  try {
    if (params.isGuest) {
      const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
      if (!stored) throw new Error("Session not found");
      
      let sessions = JSON.parse(stored);
      const index = sessions.findIndex((s: any) => s.id === params.sessionId);
      
      if (index === -1) throw new Error("Session not found locally");
      
      sessions[index] = {
        ...sessions[index],
        user_answer: serializeAnswer(params.userAnswer),
        time_spent_seconds: params.timeSpentSeconds,
        completed: true,
        updated_at: new Date().toISOString(),
        mcq_answers: params.mcqAnswers || sessions[index].mcq_answers,
        is_correct: params.isCorrect !== undefined ? params.isCorrect : null
      };
      
      await AsyncStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions));
      return;
    }

    const updateData: any = {
      user_answer: serializeAnswer(params.userAnswer),
      time_spent_seconds: params.timeSpentSeconds,
      completed: true,
      updated_at: new Date().toISOString(),
    };

    if (params.mcqAnswers) {
      updateData.mcq_answers = params.mcqAnswers;
    }

    if (params.aiFeedback) {
      updateData.ai_feedback = params.aiFeedback;
    }

    if (params.isCorrect !== undefined) {
      updateData.is_correct = params.isCorrect;
    }

    const { error } = await supabase
      .from('practice_sessions')
      .update(updateData)
      .eq('id', params.sessionId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error submitting answer:', error);
    throw error;
  }
}

export async function getUserSessions(userId: string, limit: number = 20, isGuest: boolean = false): Promise<SessionWithQuestion[]> {
  try {
     if (isGuest) {
        const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
        if (!stored) return [];
        const sessions = JSON.parse(stored).filter((s: any) => s.user_id === userId);
        // Sort
        sessions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        // Process each session to deserialize user_answer
        return sessions.slice(0, limit).map(processSession);
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
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    // Process each session to deserialize user_answer
    return (data || []).map(processSession);
  } catch (error) {
    logger.error('Error fetching user sessions:', error);
    throw error;
  }
}

export async function getQuestionSessions(userId: string, questionId: string, isGuest: boolean = false): Promise<PracticeSession[]> {
  try {
    if (isGuest) {
        const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
        if (!stored) return [];
        const sessions = JSON.parse(stored).filter((s: any) => s.user_id === userId && s.question_id === questionId);
        const sorted = sessions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        // Process each session to deserialize user_answer
        return sorted.map(processSession);
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Process each session to deserialize user_answer
    return (data || []).map(processSession);
  } catch (error) {
    logger.error('Error fetching question sessions:', error);
    throw error;
  }
}

export async function deleteDraft(userId: string, questionId: string, isGuest: boolean = false): Promise<void> {
  try {
    if (isGuest) {
       const stored = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
       if (!stored) return;
       let drafts = JSON.parse(stored);
       drafts = drafts.filter((d: any) => !(d.user_id === userId && d.question_id === questionId));
       await AsyncStorage.setItem(GUEST_DRAFTS_KEY, JSON.stringify(drafts));
       return;
    }

    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('user_id', userId)
      .eq('question_id', questionId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting draft:', error);
    throw error;
  }
}

export async function migrateGuestData(guestId: string, newUserId: string): Promise<void> {
    try {
        // 1. Retrieve guest data from AsyncStorage
        const storedSessions = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
        const storedDrafts = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
        const storedProgress = await AsyncStorage.getItem(GUEST_PROGRESS_KEY);

        let sessionsJsonb = null;
        let draftsJsonb = null;
        let progressJsonb = null;

        // Prepare sessions JSONB
        if (storedSessions) {
            const sessions: GuestSession[] = JSON.parse(storedSessions);
            const guestSessions = sessions.filter((s) => s.user_id === guestId);
            if (guestSessions.length > 0) {
                sessionsJsonb = JSON.stringify(guestSessions.map(s => ({
                    question_id: s.question_id,
                    session_type: s.session_type,
                    completed: s.completed,
                    time_spent_seconds: s.time_spent_seconds,
                    user_answer: s.user_answer,
                    mcq_answers: s.mcq_answers,
                    created_at: s.created_at,
                    updated_at: s.updated_at
                })));
            }
        }

        // Prepare drafts JSONB
        if (storedDrafts) {
            const drafts = JSON.parse(storedDrafts);
            const guestDrafts = drafts.filter((d: { user_id: string }) => d.user_id === guestId);
            if (guestDrafts.length > 0) {
                draftsJsonb = JSON.stringify(guestDrafts.map((d: any) => ({
                    question_id: d.question_id,
                    draft_text: d.draft_text,
                    created_at: d.created_at,
                    updated_at: d.updated_at
                })));
            }
        }

        // Prepare progress JSONB
        if (storedProgress) {
            const allProgress = JSON.parse(storedProgress);
            // Find guest progress (guestId is the user_id in guest progress)
            if (allProgress.user_id === guestId) {
                progressJsonb = JSON.stringify({
                    total_questions_completed: allProgress.total_questions_completed || 0,
                    total_mcq_completed: allProgress.total_mcq_completed || 0,
                    total_text_completed: allProgress.total_text_completed || 0,
                    current_streak: allProgress.current_streak || 0,
                    longest_streak: allProgress.longest_streak || 0,
                    last_practice_date: allProgress.last_practice_date,
                    category_progress: allProgress.category_progress || {}
                });
            }
        }

        // 2. Call transactional RPC to migrate sessions and drafts atomically
        const { error: migrationError } = await supabase.rpc('migrate_guest_data_transactional', {
            p_new_user_id: newUserId,
            p_sessions: sessionsJsonb,
            p_drafts: draftsJsonb
        });

        if (migrationError) {
            logger.error('Error migrating guest data transactionally:', migrationError);
            throw migrationError;
        }

        // 3. Merge guest progress with existing user progress
        if (progressJsonb) {
            const { error: progressError } = await supabase.rpc('merge_guest_progress', {
                p_new_user_id: newUserId,
                p_guest_progress: progressJsonb
            });

            if (progressError) {
                logger.error('Error merging guest progress:', progressError);
                // Don't throw - we still consider migration successful as sessions/drafts migrated
                // Progress can be recalculated from sessions
            }
        }

        // 4. Clear guest data only after successful migration
        await AsyncStorage.removeItem(GUEST_SESSIONS_KEY);
        await AsyncStorage.removeItem(GUEST_DRAFTS_KEY);
        await AsyncStorage.removeItem(GUEST_PROGRESS_KEY);

    } catch (error) {
        logger.error('Error migrating guest data:', error);
        throw error;
    }
}

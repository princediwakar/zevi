import { supabase } from '../lib/supabaseClient';
import { PracticeSession, PracticeMode, Draft, Question, SessionWithQuestion, DraftWithQuestion, MCQAnswer, UserOutline } from '../types';
import { logger } from '../utils/logger';

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

export interface CreateSessionParams {
  userId: string;
  questionId: string;
  mode: PracticeMode;
}

export interface SaveDraftParams {
  userId: string;
  questionId: string;
  draftText: string;
}

export interface SubmitAnswerParams {
  sessionId: string;
  userAnswer: string | UserOutline;
  timeSpentSeconds: number;
  mcqAnswers?: MCQAnswer[];
  aiFeedback?: any;
  isCorrect?: boolean; // Track if the answer was correct
}

export async function createPracticeSession(params: CreateSessionParams): Promise<string> {
  try {
    // Validate question exists in database before creating session
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', params.questionId)
      .single();
    
    if (questionError || !question) {
      logger.error('Question not found in database:', params.questionId);
      throw new Error('Question not found in database. Please refresh and try again.');
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

export async function getDraft(userId: string, questionId: string): Promise<string | null> {
  try {
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

export async function getUserDrafts(userId: string): Promise<DraftWithQuestion[]> {
  try {
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

export async function getUserSessions(userId: string, limit: number = 20): Promise<SessionWithQuestion[]> {
  try {
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

export async function getQuestionSessions(userId: string, questionId: string): Promise<PracticeSession[]> {
  try {
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

export async function deleteDraft(userId: string, questionId: string): Promise<void> {
  try {
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

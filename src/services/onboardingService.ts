import { supabase } from '../lib/supabaseClient';
import { OnboardingData } from '../screens/onboarding/types';
import { logger } from '../utils/logger';

export const saveUserProfile = async (userId: string, data: OnboardingData) => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        target_role: data.targetRole,
        target_companies: data.targetCompanies,
        experience_level: data.experienceLevel,
        interview_date: data.interviewDate,
        weekly_goal: data.weeklyGoal,
        preferred_practice_time: data.preferredPracticeTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error('Error saving user profile:', error);
    return { error };
  }
};

export const initializeLearningPath = async (userId: string, data: OnboardingData) => {
  // Learning path initialization - logs the onboarding data for future path generation
  // The actual personalization logic will be implemented when building the Learning Path engine
  if (__DEV__) {
    logger.log('Initializing learning path for:', userId, data);
  }
  
  // Future implementation:
  // 1. Select specific paths based on Role (e.g. APM vs SPM)
  // 2. Insert into user_progress
  
  return Promise.resolve();
};

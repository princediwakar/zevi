import { PracticeMode, QuestionCategory, FrameworkName, PatternType } from '../types';
import * as progressService from '../services/progressService';

interface PracticeCompletionResult {
  success: boolean;
  previousReadiness: number;
  newReadiness: number;
  xpEarned: number;
}

/**
 * Complete a practice session and update all related progress
 */
export async function completePracticeSession(
  userId: string,
  questionId: string,
  mode: PracticeMode,
  category: QuestionCategory,
  frameworkName?: FrameworkName,
  patternType?: PatternType,
  aiScore?: number
): Promise<PracticeCompletionResult> {
  try {
    // Get previous readiness
    const previousProgress = await progressService.getUserProgress(userId);
    const previousReadiness = previousProgress?.readiness_score || 0;

    // Calculate XP earned based on mode
    const xpEarned = calculateXP(mode);

    // Update basic progress
    await progressService.updateProgressAfterCompletion(userId, mode, category);

    // Update framework mastery if framework is provided and we have a score
    if (frameworkName && aiScore !== undefined) {
      // Convert AI score (1-10) to mastery (0-100)
      const masteryScore = aiScore * 10;
      await progressService.updateFrameworkMastery(userId, frameworkName, masteryScore);
    }

    // Update pattern mastery if pattern is provided
    if (patternType && aiScore !== undefined) {
      const masteryScore = aiScore * 10;
      await progressService.updatePatternMastery(userId, patternType, masteryScore);
    }

    // Recalculate readiness
    const newReadiness = await progressService.calculateAndUpdateReadiness(userId);

    // Check for readiness milestones
    const readinessMilestones = [50, 80, 100];
    const reachedMilestone = readinessMilestones.find(
      m => newReadiness >= m && previousReadiness < m
    );

    return {
      success: true,
      previousReadiness,
      newReadiness,
      xpEarned,
    };
  } catch (error) {
    console.error('Error completing practice session:', error);
    return {
      success: false,
      previousReadiness: 0,
      newReadiness: 0,
      xpEarned: 0,
    };
  }
}

/**
 * Calculate XP earned based on practice mode
 */
export function calculateXP(mode: PracticeMode): number {
  switch (mode) {
    case 'mcq':
      return 2;
    case 'text':
      return 20;
    case 'guided':
      return 10;
    case 'mock':
      return 50;
    default:
      return 5;
  }
}

/**
 * Get XP required for a specific level
 */
export function getXPForLevel(level: number): number {
  // Level up every 100 XP
  return level * 100;
}

/**
 * Calculate current level from total XP
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

/**
 * Get progress to next level (0-100)
 */
export function getLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = getXPForLevel(currentLevel - 1);
  const xpForNextLevel = getXPForLevel(currentLevel);
  const xpIntoCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  
  return Math.round((xpIntoCurrentLevel / xpNeeded) * 100);
}

/**
 * Map question category to pattern type
 */
export function getPatternTypeFromCategory(category: QuestionCategory): PatternType | null {
  switch (category) {
    case 'product_sense':
      return 'design_x_for_y';
    case 'execution':
      return 'improve_x';
    case 'strategy':
      return 'strategy';
    case 'behavioral':
      return 'behavioral_star';
    case 'estimation':
      return 'metrics_for_x';
    default:
      return null;
  }
}

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useQuestionsStore } from '../stores/questionsStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { Lesson, LessonType } from '../types';
import { theme } from '../theme';
type LessonScreenRouteProp = RouteProp<{ LessonScreen: { lessonId: string } }, 'LessonScreen'>;
import { LearnLesson } from './lessons/LearnLesson';
import { DrillLesson } from './lessons/DrillLesson';
import { PatternLesson } from './lessons/PatternLesson';
import { FullPracticeLesson } from './lessons/FullPracticeLesson';
import QuizLesson from './lessons/QuizLesson';

// Lesson type labels for display - Swiss Style with letter codes
const LESSON_TYPE_LABELS: Record<LessonType, { label: string; code: string }> = {
  learn: { label: 'LEARN', code: 'LRN' },
  drill: { label: 'DRILL', code: 'DRL' },
  pattern: { label: 'PATTERN', code: 'PAT' },
  full_practice: { label: 'PRACTICE', code: 'PRX' },
  quiz: { label: 'QUIZ', code: 'QZ' },
  practice: { label: 'PRACTICE', code: 'PRX' },
};

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// ============================================

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<LessonScreenRouteProp>();
  const lessonId = route.params?.lessonId as string | undefined;
  const navigation = useNavigation();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const { units, getNextLessonInPath } = useLearningPathStore();
  const { progress, readinessScore } = useProgressStore();
  const userId = user?.id;

  // Find the unit and path for a lesson
  const findLessonPath = (targetLessonId: string) => {
    if (!units || units.length === 0) return null;

    for (const unit of units) {
      const lessons = unit.lessons || [];
      if (lessons.some((l: any) => l.id === targetLessonId)) {
        return unit.learning_path_id;
      }
    }
    return null;
  };

  useEffect(() => {
    if (lessonId && units && units.length > 0) {
      // Find lesson within its unit to preserve unit context
      let foundLesson: Lesson | null = null;
      for (const unit of units) {
        const lessons = unit.lessons || [];
        const lessonData = lessons.find((l: any) => l.id === lessonId);
        if (lessonData) {
          foundLesson = lessonData;
          break;
        }
      }
      setLesson(foundLesson);
      setLoading(false);
    } else if (lessonId) {
      // Units not loaded yet - keep loading
      setLoading(true);
    }
  }, [lessonId, units]);

  // Find next lesson in the SAME learning path
  const getNextLesson = () => {
    if (!lesson) return null;

    // Find which learning path this lesson belongs to
    const pathId = findLessonPath(lesson.id);
    if (!pathId) return null;

    // Use the store helper to get the next lesson within this path
    return getNextLessonInPath(lesson.id, pathId);
  };

  const handleLessonComplete = async (xpEarned: number, scorePercent?: number) => {
    setEarnedXp(xpEarned);
    
    if (lesson && userId) {
      try {
        // Mark the lesson as completed and advance to next lesson
        await useProgressStore.getState().completeCurrentLesson(userId, lesson.id);

        // ── Mastery updates ──────────────────────────────────────────────────
        // Read current mastery scores from the store (already populated by fetchProgress)
        const { frameworkMastery, patternMastery, updateFrameworkMastery, updatePatternMastery } =
          useProgressStore.getState();

        const type = lesson.type;
        const frameworkName: string | undefined = lesson.content?.framework_name;
        const patternName: string | undefined =
          lesson.content?.pattern_content?.pattern_name;

        if (type === 'drill' || type === 'learn') {
          if (frameworkName) {
            const current = frameworkMastery[frameworkName] ?? 0;
            const increment = type === 'drill' ? 25 : 10;
            await updateFrameworkMastery(userId, frameworkName, Math.min(current + increment, 100));
          }
        } else if (type === 'pattern') {
          if (patternName) {
            const current = patternMastery[patternName] ?? 0;
            await updatePatternMastery(userId, patternName, Math.min(current + 25, 100));
          }
        } else if (type === 'full_practice') {
          const fpFramework = lesson.content?.full_practice_content?.framework_name ?? frameworkName;
          if (fpFramework) {
            const current = frameworkMastery[fpFramework] ?? 0;
            // Use AI-scored value if provided, otherwise +20
            const newScore = scorePercent !== undefined
              ? Math.round(scorePercent)
              : Math.min(current + 20, 100);
            await updateFrameworkMastery(userId, fpFramework, Math.max(newScore, current));
          }
        } else if (type === 'quiz') {
          if (frameworkName && scorePercent !== undefined) {
            const current = frameworkMastery[frameworkName] ?? 0;
            const quizScore = Math.round(scorePercent);
            // Take the better of current score or quiz result
            await updateFrameworkMastery(userId, frameworkName, Math.max(quizScore, current));
          }
          if (patternName && scorePercent !== undefined) {
            const current = patternMastery[patternName] ?? 0;
            const quizScore = Math.round(scorePercent);
            await updatePatternMastery(userId, patternName, Math.max(quizScore, current));
          }
        }
        // ────────────────────────────────────────────────────────────────────
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
    
    // Show completion modal after completion is processed
    setShowCompletionModal(true);
  };

  const handleContinueToNext = () => {
    setShowCompletionModal(false);
    const nextLesson = getNextLesson();
    if (nextLesson) {
      navigation.navigate('LessonScreen' as never, { lessonId: nextLesson.id } as never);
    } else {
      navigation.navigate('LearnScreen' as never);
    }
  };

  const handleGoBack = () => {
    setShowCompletionModal(false);
    navigation.goBack();
  };

  const handleLessonError = (error: string) => {
    console.error('Lesson Error:', error);
    alert('Something went wrong. Please try again.');
  };

  // Loading skeleton - Swiss style
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← BACK</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentSkeleton}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLineShort} />
        </View>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← BACK</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>NOT FOUND</Text>
          <Text style={styles.errorDescription}>
            This lesson may have been removed.
          </Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const lessonTypeInfo = LESSON_TYPE_LABELS[lesson.type] || { label: 'LESSON', code: 'LSN' };

  // Check if lesson is already completed
  const isAlreadyCompleted = progress?.completed_lessons?.includes(lesson.id) || false;

  // Render fallback content for missing lesson content - Swiss style
  const renderFallbackContent = () => {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackTitle}>COMING SOON</Text>
        <Text style={styles.fallbackDescription}>
          This content is being prepared.
        </Text>
        <View style={styles.fallbackPreview}>
          <Text style={styles.fallbackPreviewTitle}>IN THE MEANTIME</Text>
          <Text style={styles.fallbackPreviewText}>
            • Practice MCQ questions{'\n'}
            • Explore categories{'\n'}
            • Review Progress
          </Text>
        </View>
      </View>
    );
  };

  // Check if content exists for the lesson type
  // Also handles both nested (pattern_content) and flat content structures
  const hasContent = () => {
    const patternContent = lesson.content.pattern_content || lesson.content;
    if (lesson.type === 'learn' && !lesson.content.learn_content) return false;
    if (lesson.type === 'drill' && !lesson.content.drill_content) return false;
    if (lesson.type === 'pattern' && !patternContent.questions && !lesson.content.questions) return false;
    if (lesson.type === 'full_practice' && !lesson.content.full_practice_content) return false;
    if (lesson.type === 'quiz' && !lesson.content.quiz_content) return false;
    return true;
  };

  // Handle simple mark complete
  const handleMarkComplete = async () => {
    if (!lesson) return;
    
    if (isAlreadyCompleted) {
      navigation.goBack();
      return;
    }
    
    setEarnedXp(lesson.xp_reward || 10);
    
    if (lesson && userId) {
      try {
        // Mark the lesson as completed and advance to next lesson
        await useProgressStore.getState().completeCurrentLesson(userId, lesson.id);
      } catch (error) {
        console.error('Error marking complete:', error);
      }
    }
    
    // Show completion modal after completion is processed
    setShowCompletionModal(true);
  };

  // Render lesson based on type
  const renderLesson = () => {
    const renderMarkCompleteButton = () => (
      <View style={styles.markCompleteContainer}>
        <TouchableOpacity
          style={[styles.markCompleteButton, isAlreadyCompleted && styles.markCompleteButtonCompleted]}
          onPress={handleMarkComplete}
          activeOpacity={0.8}
        >
          <Text style={[styles.markCompleteText, isAlreadyCompleted && styles.markCompleteTextCompleted]}>
            {isAlreadyCompleted ? '✓ DONE' : 'MARK COMPLETE'}
          </Text>
        </TouchableOpacity>
      </View>
    );

    if (!hasContent()) {
      return (
        <View style={styles.fallbackWrapper}>
          {renderFallbackContent()}
          {renderMarkCompleteButton()}
        </View>
      );
    }

    switch (lesson.type) {
      case 'learn':
        return (
          <LearnLesson
            content={lesson.content.learn_content!}
            onComplete={() => handleLessonComplete(lesson.xp_reward)}
            onError={handleLessonError}
          />
        );
      case 'drill':
        return (
          <DrillLesson
            content={lesson.content.drill_content!}
            onComplete={() => handleLessonComplete(lesson.xp_reward)}
            onError={handleLessonError}
          />
        );
      case 'pattern':
        // Handle both nested (pattern_content) and flat content structures
        const patternContent = lesson.content.pattern_content || lesson.content;
        return (
          <PatternLesson
            content={patternContent}
            onComplete={() => handleLessonComplete(lesson.xp_reward)}
            onError={handleLessonError}
          />
        );
      case 'full_practice':
        return (
          <FullPracticeLesson
            content={lesson.content.full_practice_content!}
            onComplete={(xp, answerData) => {
              const aiScore: number | undefined = answerData?.aiFeedback?.score;
              const scorePercent = aiScore !== undefined ? (aiScore / 10) * 100 : undefined;
              handleLessonComplete(xp, scorePercent);
            }}
            onError={handleLessonError}
          />
        );
      case 'quiz':
        return (
          <QuizLesson
            lesson={lesson}
            onComplete={(score, xp) => {
              const totalQ = lesson.content.quiz_content?.questions?.length || 1;
              handleLessonComplete(xp, Math.round((score / totalQ) * 100));
            }}
            onError={handleLessonError}
          />
        );
      case 'practice':
        if (lesson.content.full_practice_content) {
          return (
            <FullPracticeLesson
              content={lesson.content.full_practice_content!}
              onComplete={(xp, answerData) => {
                const aiScore: number | undefined = answerData?.aiFeedback?.score;
                const scorePercent = aiScore !== undefined ? (aiScore / 10) * 100 : undefined;
                handleLessonComplete(xp, scorePercent);
              }}
              onError={handleLessonError}
            />
          );
        }
        return renderFallbackContent();
      default:
        return renderFallbackContent();
    }
  };

  // Get lesson category for practice prompt
  const lessonCategory = (lesson as any)?.category || 'product_sense';

  // Handle practice now button
  const handlePracticeNow = () => {
    setShowCompletionModal(false);
    navigation.navigate('QuestionList' as never, { category: lessonCategory } as never);
  };

  // Completion Modal - Swiss Style
  if (showCompletionModal) {
    const nextLesson = getNextLesson();
    const currentReadiness = readinessScore || progress?.readiness_score || 0;
    
    return (
      <View style={styles.completionContainer}>
        <View style={styles.completionContent}>
          {/* Heavy separator */}
          
          <Text style={styles.completionCode}>DONE</Text>
          
          <Text style={styles.completionTitle}>LESSON COMPLETE</Text>
          
          {/* XP Card - bordered */}
          <View style={styles.xpCard}>
            <Text style={styles.xpLabel}>XP EARNED</Text>
            <Text style={styles.xpValue}>+{earnedXp}</Text>
          </View>

          {/* Readiness stat */}
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{currentReadiness}%</Text>
            <Text style={styles.statLabel}>INTERVIEW READY</Text>
          </View>

          {/* Heavy separator */}
          <View style={styles.separator} />


          {/* Continue Button */}
          {nextLesson ? (
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinueToNext}
            >
              <Text style={styles.continueButtonText}>CONTINUE →</Text>
              <Text style={styles.nextLessonName}>{nextLesson.name}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedAllCard}>
              <Text style={styles.completedAllText}>PATH COMPLETE</Text>
            </View>
          )}

          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButtonOutline}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonOutlineText}>BACK TO LEARN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main render - Swiss Style header
  return (
    <View style={styles.container}>
      {/* Swiss Header - compact bar */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.name}</Text>
      </View>

      {/* Lesson Content */}
      {renderLesson()}
    </View>
  );
}

// ============================================
// SWISS STYLE: Sharp edges, bold typography, no gradients
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header - compact bar
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.elementGap,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.normal,
    color: theme.colors.text.primary,
  },
  headerContent: {
    alignItems: 'center',
  },
  codeBox: {
    width: 48,
    height: 48,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  codeText: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'left',
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  metaBox: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  metaText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
  
  // Content skeleton
  contentSkeleton: {
    padding: theme.swiss.layout.screenPadding,
    gap: theme.spacing[4],
  },
  skeletonLine: {
    height: 80,
    backgroundColor: theme.colors.neutral[200],
  },
  skeletonLineShort: {
    height: 40,
    width: '60%',
    backgroundColor: theme.colors.neutral[200],
  },
  
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.swiss.layout.screenPadding,
  },
  errorTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  errorDescription: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.swiss.layout.sectionGap,
  },
  errorButton: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  errorButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Fallback content
  fallbackWrapper: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.swiss.layout.screenPadding,
  },
  fallbackTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  fallbackDescription: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.swiss.layout.sectionGap,
  },
  fallbackPreview: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.sectionGap,
    width: '100%',
  },
  fallbackPreviewTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  fallbackPreviewText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  
  // Mark Complete Button - Swiss bordered
  markCompleteContainer: {
    padding: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.sectionGap + theme.spacing[8],
  },
  markCompleteButton: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
  },
  markCompleteButtonCompleted: {
    backgroundColor: theme.colors.semantic.success,
    borderColor: theme.colors.semantic.success,
  },
  markCompleteText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  markCompleteTextCompleted: {
    color: theme.colors.text.inverse,
  },
  
  // Completion Modal - Swiss stark
  completionContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  completionContent: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.swiss.layout.screenPadding,
  },
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.swiss.layout.sectionGap,
  },
  completionCode: {
    fontSize: theme.swiss.fontSize.display,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.xwide4,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  completionTitle: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.swiss.layout.sectionGap,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // XP Card - bordered
  xpCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.sectionGap,
    alignItems: 'center',
    marginBottom: theme.swiss.layout.elementGap,
  },
  xpLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[2],
  },
  xpValue: {
    fontSize: theme.swiss.fontSize.display,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
  },
  
  // Stats Row
  statRow: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    marginBottom: theme.swiss.layout.sectionGap,
  },
  statValue: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginTop: theme.spacing[2],
  },
  
  // Action Button - bordered, filled
  actionButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
    marginBottom: theme.swiss.layout.elementGap,
  },
  actionButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  actionButtonSubtext: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.inverse,
    opacity: 0.8,
    marginTop: theme.spacing[1],
  },
  
  // Continue Button - bordered, outline
  continueButton: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
    marginBottom: theme.swiss.layout.elementGap,
  },
  continueButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  nextLessonName: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  
  // Completed All Card
  completedAllCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.semantic.success,
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
    marginBottom: theme.swiss.layout.elementGap,
  },
  completedAllText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.semantic.success,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Back Button Outline
  backButtonOutline: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.secondary,
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  backButtonOutlineText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
});

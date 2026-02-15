import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useQuestionsStore } from '../stores/questionsStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { Lesson, LessonType, LessonContent } from '../types';
type LessonScreenRouteProp = RouteProp<{ LessonScreen: { lessonId: string } }, 'LessonScreen'>;
import { LearnLesson } from './lessons/LearnLesson';
import { DrillLesson } from './lessons/DrillLesson';
import { PatternLesson } from './lessons/PatternLesson';
import { FullPracticeLesson } from './lessons/FullPracticeLesson';
import QuizLesson from './lessons/QuizLesson';

// Lesson type labels for display
const LESSON_TYPE_LABELS: Record<LessonType, { label: string; emoji: string; description: string }> = {
  learn: { label: 'Learn', emoji: '📖', description: 'Learn the framework concepts' },
  drill: { label: 'Drill', emoji: '🎯', description: 'Practice specific skills' },
  pattern: { label: 'Pattern', emoji: '📝', description: 'Practice with outlines' },
  full_practice: { label: 'Full Practice', emoji: '🚀', description: 'Complete interview practice' },
  quiz: { label: 'Quiz', emoji: '✅', description: 'Test your knowledge' },
};

export default function LessonScreen() {
  const route = useRoute<LessonScreenRouteProp>();
  const lessonId = route.params?.lessonId as string | undefined;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user, isGuest, guestId } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const { units } = useLearningPathStore();
  const { updateAfterCompletion, progress, readinessScore } = useProgressStore();
  const userId = user?.id || guestId;

  useEffect(() => {
    if (lessonId) {
      const allLessons = units.flatMap((u: any) => u.lessons);
      const lessonData = allLessons.find((l: any) => l.id === lessonId);
      setLesson(lessonData || null);
      setLoading(false);
    }
  }, [lessonId, units]);

  // Find next lesson in the path
  const getNextLesson = () => {
    if (!lesson || units.length === 0) return null;
    
    const allLessons = units.flatMap((u: any) => u.lessons);
    const currentIndex = allLessons.findIndex((l: any) => l.id === lesson.id);
    
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const handleLessonComplete = async (xpEarned: number) => {
    setEarnedXp(xpEarned);
    setShowCompletionModal(true);
    
    // Update progress in database if user is logged in
    if (lesson && userId) {
      try {
        // Determine category from lesson or use default
        const category = (lesson as any).category || 'product_sense';
        
        // Determine mode based on lesson type
        let mode: 'mcq' | 'text' | 'guided' | 'mock' = 'mcq';
        if (lesson.type === 'full_practice' || lesson.type === 'pattern') {
          mode = 'text';
        } else if (lesson.type === 'learn') {
          mode = 'guided';
        }
        
        // Update progress after completion
        await updateAfterCompletion(userId, mode, category, isGuest);
        
        // Refresh progress data
        await useProgressStore.getState().fetchProgress(userId, isGuest);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleContinueToNext = () => {
    setShowCompletionModal(false);
    const nextLesson = getNextLesson();
    if (nextLesson) {
      // Use the full path from RootStackParamList
      // @ts-expect-error - navigation typing issue with dynamic params
      navigation.navigate('LessonScreen', { lessonId: nextLesson.id });
    } else {
      // Go back to learn screen
      // @ts-expect-error - navigation typing issue
      navigation.navigate('LearnScreen');
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

  // Loading skeleton
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary[500] }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerSkeleton}>
            <View style={[styles.skeletonTitle, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={[styles.skeletonSubtitle, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
          </View>
        </View>
        <View style={styles.contentSkeleton}>
          <View style={[styles.skeletonLine, { backgroundColor: theme.colors.border.light }]} />
          <View style={[styles.skeletonLine, { backgroundColor: theme.colors.border.light }]} />
          <View style={[styles.skeletonLineShort, { backgroundColor: theme.colors.border.light }]} />
        </View>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary[500] }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📚</Text>
          <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>
            Lesson Not Found
          </Text>
          <Text style={[styles.errorDescription, { color: theme.colors.text.secondary }]}>
            This lesson may have been removed or is not available yet.
          </Text>
          <TouchableOpacity 
            style={[styles.errorButton, { backgroundColor: theme.colors.primary[500] }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back to Learn</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const lessonTypeInfo = LESSON_TYPE_LABELS[lesson.type] || { label: 'Lesson', emoji: '📚', description: '' };

  // Render fallback content for missing lesson content
  const renderFallbackContent = () => {
    const fallbacks: Record<LessonType, React.ReactNode> = {
      learn: (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackEmoji}>📖</Text>
          <Text style={[styles.fallbackTitle, { color: theme.colors.text.primary }]}>
            Coming Soon
          </Text>
          <Text style={[styles.fallbackDescription, { color: theme.colors.text.secondary }]}>
            This learn module is being prepared. Check back soon for structured content about this framework.
          </Text>
          <View style={[styles.fallbackPreview, { backgroundColor: theme.colors.surface.secondary }]}>
            <Text style={[styles.fallbackPreviewTitle, { color: theme.colors.text.primary }]}>
              In the meantime...
            </Text>
            <Text style={[styles.fallbackPreviewText, { color: theme.colors.text.secondary }]}>
              • Practice with the framework's MCQ questions{'\n'}
              • Explore other categories{'\n'}
              • Review your weak areas in Progress
            </Text>
          </View>
        </View>
      ),
      drill: (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackEmoji}>🎯</Text>
          <Text style={[styles.fallbackTitle, { color: theme.colors.text.primary }]}>
            Drill Not Available
          </Text>
          <Text style={[styles.fallbackDescription, { color: theme.colors.text.secondary }]}>
            Practice exercises for this skill are coming soon.
          </Text>
        </View>
      ),
      pattern: (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackEmoji}>📝</Text>
          <Text style={[styles.fallbackTitle, { color: theme.colors.text.primary }]}>
            Pattern Practice Coming Soon
          </Text>
          <Text style={[styles.fallbackDescription, { color: theme.colors.text.secondary }]}>
            Pattern-based practice exercises are being prepared.
          </Text>
        </View>
      ),
      full_practice: (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackEmoji}>🚀</Text>
          <Text style={[styles.fallbackTitle, { color: theme.colors.text.primary }]}>
            Full Practice In Development
          </Text>
          <Text style={[styles.fallbackDescription, { color: theme.colors.text.secondary }]}>
            Complete practice sessions will be available soon.
          </Text>
        </View>
      ),
      quiz: (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackEmoji}>✅</Text>
          <Text style={[styles.fallbackTitle, { color: theme.colors.text.primary }]}>
            Quiz Coming Soon
          </Text>
          <Text style={[styles.fallbackDescription, { color: theme.colors.text.secondary }]}>
            Assessment quizzes are being prepared for this unit.
          </Text>
        </View>
      ),
    };
    
    return fallbacks[lesson.type] || (
      <View style={styles.fallbackContainer}>
        <Text style={[styles.fallbackDescription, { color: theme.colors.text.secondary }]}>
          This content is not available yet.
        </Text>
      </View>
    );
  };

  // Check if content exists for the lesson type
  const hasContent = () => {
    if (lesson.type === 'learn' && !lesson.content.learn_content) return false;
    if (lesson.type === 'drill' && !lesson.content.drill_content) return false;
    if (lesson.type === 'pattern' && !lesson.content.pattern_content) return false;
    if (lesson.type === 'full_practice' && !lesson.content.full_practice_content) return false;
    if (lesson.type === 'quiz' && !lesson.content.quiz_content) return false;
    return true;
  };

  // Render lesson based on type
  const renderLesson = () => {
    if (!hasContent()) {
      return renderFallbackContent();
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
        return (
          <PatternLesson
            content={lesson.content.pattern_content!}
            onComplete={() => handleLessonComplete(lesson.xp_reward)}
            onError={handleLessonError}
          />
        );
      case 'full_practice':
        return (
          <FullPracticeLesson
            content={lesson.content.full_practice_content!}
            onComplete={(xp, answerData) => handleLessonComplete(xp)}
            onError={handleLessonError}
          />
        );
      case 'quiz':
        return (
          <QuizLesson
            lesson={lesson}
            onComplete={(score, xp) => handleLessonComplete(xp)}
            onError={handleLessonError}
          />
        );
      default:
        return (
          <View style={styles.fallbackContainer}>
            <Text style={[styles.fallbackTitle, { color: theme.colors.text.primary }]}>
              Unsupported lesson type
            </Text>
          </View>
        );
    }
  };

  // Completion Modal
  if (showCompletionModal) {
    const nextLesson = getNextLesson();
    const currentReadiness = readinessScore || progress?.readiness_score || 0;
    
    return (
      <View style={[styles.completionContainer, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.completionContent}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={[styles.completionTitle, { color: theme.colors.text.primary }]}>
            Lesson Complete!
          </Text>
          
          <View style={[styles.xpCard, { backgroundColor: theme.colors.primary[50], borderColor: theme.colors.primary[200] }]}>
            <Text style={[styles.xpLabel, { color: theme.colors.primary[700] }]}>XP Earned</Text>
            <Text style={[styles.xpValue, { color: theme.colors.primary[600] }]}>+{earnedXp}</Text>
          </View>

          <View style={[styles.statsRow, { backgroundColor: theme.colors.surface.primary, borderColor: theme.colors.border.light }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {currentReadiness}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Interview Ready
              </Text>
            </View>
          </View>

          {nextLesson ? (
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: theme.colors.primary[500] }]}
              onPress={handleContinueToNext}
            >
              <Text style={styles.continueButtonText}>
                Continue to Next Lesson →
              </Text>
              <Text style={styles.nextLessonName}>
                {nextLesson.name}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.completedAllCard, { backgroundColor: theme.colors.semantic.success + '20' }]}>
              <Text style={[styles.completedAllText, { color: theme.colors.semantic.success }]}>
                🎊 You've completed this learning path!
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.backButtonOutline, { borderColor: theme.colors.border.light }]}
            onPress={handleGoBack}
          >
            <Text style={[styles.backButtonOutlineText, { color: theme.colors.text.secondary }]}>
              Back to Learn
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary[500] }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{lessonTypeInfo.emoji}</Text>
          <Text style={styles.headerTitle}>{lesson.name}</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>
              {lessonTypeInfo.label} • {lesson.estimated_minutes || 5} min
            </Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+{lesson.xp_reward} XP</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Lesson Content */}
      {renderLesson()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerMetaText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  xpBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Loading skeleton
  headerSkeleton: {
    alignItems: 'center',
    marginTop: 20,
  },
  skeletonTitle: {
    width: 150,
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    width: 100,
    height: 16,
    borderRadius: 4,
  },
  contentSkeleton: {
    padding: 20,
    gap: 12,
  },
  skeletonLine: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  skeletonLineShort: {
    width: '60%',
    height: 20,
    borderRadius: 4,
  },
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Fallback content
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  fallbackEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  fallbackPreview: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  fallbackPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  fallbackPreviewText: {
    fontSize: 14,
    lineHeight: 22,
  },
  // Completion modal
  completionContainer: {
    flex: 1,
  },
  completionContent: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  completionEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  xpCard: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  xpValue: {
    fontSize: 40,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  continueButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  nextLessonName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  completedAllCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  completedAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonOutline: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  backButtonOutlineText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

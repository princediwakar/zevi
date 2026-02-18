import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useAuth } from '../hooks/useAuth';
  import { Spacer, LearnScreenSkeleton, SwissStreakBox } from '../components';
import { Lesson, QuestionCategory } from '../types';
import { ArrowRight } from 'lucide-react-native';

type LearnScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LearnScreen'>;

// Category info for learning paths
const PATH_INFO: Record<QuestionCategory, { label: string; description: string }> = {
  product_sense: { label: 'Product Sense', description: 'Design, improve, and add features to products' },
  execution: { label: 'Execution', description: 'Metrics, prioritization, and roadmap planning' },
  strategy: { label: 'Strategy', description: 'Business strategy and market analysis' },
  behavioral: { label: 'Behavioral', description: 'Leadership, teamwork, and conflicts' },
  technical: { label: 'Technical', description: 'Technical PM questions and system design' },
  estimation: { label: 'Estimation', description: 'Fermi estimates and guesstimates' },
  pricing: { label: 'Pricing', description: 'Pricing strategies and models' },
  ab_testing: { label: 'A/B Testing', description: 'Experiment design and analysis' },
};

// SWISS DESIGN: Sharp, bold, minimal
// Using centralized theme tokens for consistency
export default function LearnScreen() {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  const { user } = useAuth();
  const { progress, currentLesson, fetchProgress, fetchCurrentLesson, initializeCurrentLesson, fetchWeakAreas } = useProgressStore();
  const { units, fetchPath } = useLearningPathStore();
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id;

  // Get completed lesson IDs
  const completedLessonIds = React.useMemo(() => {
    return new Set(progress?.completed_lessons || []);
  }, [progress?.completed_lessons]);

  // Calculate totals
  const totalLessonsCompleted = completedLessonIds.size;
  const totalLessons = React.useMemo(() => {
    if (!units) return 0;
    return units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0);
  }, [units]);

  // Determine if all lessons are complete
  const allLessonsComplete = totalLessons > 0 && totalLessonsCompleted >= totalLessons;

  // Get the next lesson to continue - trust currentLesson from progress store
  // which is path-aware and set by database functions
  const nextLesson = React.useMemo(() => {
    // currentLesson is set by the database and is already path-aware
    // It represents the lesson the user should do next in their active path
    if (currentLesson && !completedLessonIds.has(currentLesson.id)) {
      return currentLesson;
    }

    // If currentLesson is completed (edge case), we need to advance it
    // This shouldn't happen normally, but handle it gracefully
    if (currentLesson && completedLessonIds.has(currentLesson.id)) {
      // Return null to trigger re-initialization
      return null;
    }

    return null;
  }, [currentLesson, completedLessonIds]);

  // Fetch data on focus
  useFocusEffect(
    useCallback(() => {
      fetchPath();
      if (userId) {
        fetchProgress(userId);
        fetchCurrentLesson(userId);
        fetchWeakAreas(userId);
      }
    }, [userId, fetchPath, fetchProgress, fetchCurrentLesson, fetchWeakAreas])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPath(),
      userId ? fetchProgress(userId) : Promise.resolve(),
      userId ? fetchCurrentLesson(userId) : Promise.resolve(),
      userId ? fetchWeakAreas(userId) : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [userId, fetchPath, fetchProgress, fetchCurrentLesson, fetchWeakAreas]);

  const streak = progress?.current_streak || 0;
  
  // Show skeleton while loading initial data
  const isLoading = !progress || !units;
  
  if (isLoading) {
    return <LearnScreenSkeleton />;
  }

  const handleStartLesson = () => {
    // Use nextLesson which is the computed, path-aware lesson to continue
    if (nextLesson && nextLesson.id) {
      navigation.navigate('LessonScreen', { lessonId: nextLesson.id });
    } else if (!allLessonsComplete && userId) {
      // If no next lesson but not all complete, initialize it
      initializeCurrentLesson(userId).then(() => {
        const lesson = useProgressStore.getState().currentLesson;
        if (lesson && lesson.id) {
          navigation.navigate('LessonScreen', { lessonId: lesson.id });
        }
      });
    }
  };

  // Get lesson type number
  const getLessonNumber = (type: string) => {
    switch (type) {
      case 'learn': return '01';
      case 'drill': return '02';
      case 'pattern': return '03';
      case 'full_practice': return '04';
      case 'quiz': return '05';
      default: return '00';
    }
  };

  return (
    <View style={styles.container}>
      {/* Swiss header - bold bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LEARN</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerCount}>
            {totalLessonsCompleted}/{totalLessons}
          </Text>
          <SwissStreakBox streak={streak} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.text.primary}
          />
        }
      >
        {/* Unified Lesson Section - Same structure for all states */}
        <View style={styles.lessonSection}>
          <Text style={styles.sectionLabel}>
            {allLessonsComplete ? 'COMPLETE' : 'NEXT LESSON'}
          </Text>
          
          {allLessonsComplete ? (
            // COMPLETE STATE - Centered content, same height as lesson card
            <View style={styles.completeStateCard}>
              <View style={styles.doneLine} />
              <Text style={styles.doneTitle}>ALL DONE</Text>
              <Text style={styles.doneSubtitle}>You've completed all lessons</Text>
              <View style={styles.doneLine} />
            </View>
          ) : !currentLesson && totalLessons === 0 ? (
            // NO LESSONS STATE
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyTitle}>NO LESSONS</Text>
              <Text style={styles.emptySubtitle}>Browse learning paths below</Text>
            </View>
          ) : (
            // LESSON CARD - Same structure for both with/without lesson
            <View style={styles.lessonCard}>            
              <Text style={styles.lessonName}>
                {currentLesson ? currentLesson.name : 'Ready to start'}
              </Text>
              
              <View style={styles.lessonMeta}>
                <Text style={styles.lessonMetaText}>
                  {currentLesson ? `${currentLesson.estimated_minutes || 5} MIN` : '—'}
                </Text>
                <Text style={styles.lessonMetaText}>
                  {currentLesson ? `+${currentLesson.xp_reward || 10} XP` : '—'}
                </Text>
              </View>
            </View>
          )}

          {/* START button - Always visible, disabled state handled */}
          {!allLessonsComplete && (
            <TouchableOpacity
              style={[
                styles.startButton, 
                !currentLesson && totalLessons > 0 && styles.startButtonOutline
              ]}
              onPress={handleStartLesson}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>
                {currentLesson ? 'START' : 'START LEARNING'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Full Learning Paths List - Combined */}
        <PathListSection onPathPress={(category) => navigation.navigate('CategoryDetail', { category })} />
      </ScrollView>
    </View>
  );
}

// Path List Section - Full browse list (combined from LearningPathBrowseScreen)
function PathListSection({ onPathPress }: { onPathPress: (cat: QuestionCategory) => void }) {
  const { progress } = useProgressStore();
  const { units } = useLearningPathStore();
  
  const categories: QuestionCategory[] = [
    'product_sense',
    'execution', 
    'strategy',
    'behavioral',
    'technical',
    'estimation',
    'pricing',
    'ab_testing'
  ];

  // Calculate progress for each category
  const pathProgress = React.useMemo(() => {
    const completedIds = new Set(progress?.completed_lessons || []);
    
    const progressData = categories.map(cat => {
      let total = 0;
      let completed = 0;
      
      units.forEach(unit => {
        const unitCategory = (unit as any).pathCategory || (unit as any).category;
        if (unitCategory === cat) {
          (unit.lessons || []).forEach((lesson: any) => {
            total++;
            if (completedIds.has(lesson.id)) completed++;
          });
        }
      });
      
      return {
        category: cat,
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
    
    return progressData;
  }, [units, progress]);

  return (
    <View style={styles.pathListSection}>
      <Text style={styles.pathListTitle}>BROWSE LEARNING PATHS</Text>
      
      {pathProgress.map((path, index) => {
        const info = PATH_INFO[path.category];
        const isNext = path.completed < path.total;
        
        return (
          <TouchableOpacity
            key={path.category}
            style={[
              styles.pathRow,
              isNext && path.completed > 0 && styles.pathRowNext,
            ]}
            onPress={() => onPathPress(path.category)}
          >
            {/* Number indicator */}
            <View style={[styles.numberContainer, path.completed >= path.total && path.total > 0 && styles.numberContainerDone]}>
              <Text style={[styles.numberText, path.completed >= path.total && path.total > 0 && styles.numberTextDone]}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            
            {/* Path Info */}
            <View style={styles.pathInfo}>
              <View style={styles.pathNameRow}>
                {isNext && path.completed > 0 && (
                  <View style={styles.nextBadgeSmall}>
                    <Text style={styles.nextBadgeTextSmall}>NEXT</Text>
                  </View>
                )}
                <Text style={[
                  styles.pathLabel,
                  path.completed >= path.total && path.total > 0 && styles.pathLabelDone,
                ]}>
                  {info.label}
                </Text>
              </View>
              <Text style={styles.pathDescription}>{info.description}</Text>
            </View>
            
            {/* Progress count - Always render to prevent layout shifts */}
            <View style={[styles.progressBadge, path.completed >= path.total && path.total > 0 && styles.progressBadgeDone]}>
              <Text style={[styles.progressText, path.completed >= path.total && path.total > 0 && styles.progressTextDone]}>
                {path.total > 0 ? `${path.completed}/${path.total}` : '—'}
              </Text>
            </View>
            
            {/* Arrow */}
            <ArrowRight size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header - Swiss bold
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  headerCount: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingTop: theme.swiss.layout.sectionGap,
  },
  
  // Separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginBottom: theme.swiss.layout.sectionGap,
  },
  
  // Lesson Section
  lessonSection: {
    marginBottom: theme.swiss.layout.elementGap,
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  
  // Lesson Card - bordered, sharp
  lessonCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[5],
    marginBottom: theme.swiss.layout.elementGap,
  },
  lessonName: {
    fontSize: 22,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: 30,
    marginBottom: theme.spacing[4],
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  lessonMetaText: {
    fontSize: theme.swiss.fontSize.small + 2,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // START Button
  startButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5] - 2,
    alignItems: 'center',
  },
  startButtonOutline: {
    backgroundColor: 'transparent',
  },
  startButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  
  // Complete State Card - Matches lesson card height
  completeStateCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.sectionGap,
    marginBottom: theme.swiss.layout.elementGap,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneLine: {
    width: 40,
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.spacing[3],
  },
  doneTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  doneSubtitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    textTransform: 'uppercase',
    marginTop: theme.spacing[2],
  },
  // Empty State Card - Matches lesson card height
  emptyStateCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.border.light,
    padding: theme.swiss.layout.sectionGap,
    marginBottom: theme.swiss.layout.elementGap,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  emptySubtitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // ============================================
  // PATH LIST SECTION (Combined Browse)
  // ============================================
  pathListSection: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[10],
  },
  pathListTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[4],
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  pathRowNext: {
    backgroundColor: theme.colors.neutral[50],
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text.primary,
    paddingLeft: theme.spacing[3],
    marginLeft: -theme.spacing[3],
  },
  pathRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  numberContainerDone: {
    borderColor: theme.colors.neutral[300],
  },
  numberText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  numberTextDone: {
    color: theme.colors.text.disabled,
  },
  pathInfo: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  pathNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  pathLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'left',
    flex: 1,
  },
  pathLabelDone: {
    color: theme.colors.text.secondary,
  },
  pathDescription: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  nextBadgeContainer: {
    width: 50,
    marginRight: theme.spacing[2],
  },
  nextBadgeSmall: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
  },
  nextBadgeTextSmall: {
    fontSize: 10,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  nextBadgeHidden: {
    opacity: 0,
  },
  progressBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
  },
  progressBadgeDone: {
    backgroundColor: theme.colors.neutral[100],
  },
  progressText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  progressTextDone: {
    color: theme.colors.text.secondary,
  },
});

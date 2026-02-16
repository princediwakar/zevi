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
import { Spacer } from '../components';
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
  const { user, isGuest, guestId } = useAuth();
  const { progress, fetchProgress, fetchWeakAreas } = useProgressStore();
  const { units, fetchPath } = useLearningPathStore();
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id || guestId;

  // Get completed lesson IDs
  const completedLessonIds = React.useMemo(() => {
    return new Set(progress?.completed_lessons || []);
  }, [progress?.completed_lessons]);

  // Get the next uncompleted lesson (today's lesson)
  const todaysLesson = React.useMemo((): Lesson | null => {
    if (!units || units.length === 0) return null;
    
    const allLessons: Lesson[] = [];
    units.forEach((unit) => {
      if (unit.lessons) {
        allLessons.push(...unit.lessons);
      }
    });
    
    for (const lesson of allLessons) {
      if (!completedLessonIds.has(lesson.id)) {
        return lesson;
      }
    }
    return null;
  }, [units, completedLessonIds]);

  // Calculate totals
  const totalLessonsCompleted = completedLessonIds.size;
  const totalLessons = React.useMemo(() => {
    if (!units) return 0;
    return units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0);
  }, [units]);

  // Fetch data on focus
  useFocusEffect(
    useCallback(() => {
      fetchPath();
      if (userId) {
        fetchProgress(userId, isGuest);
        fetchWeakAreas(userId, isGuest);
      }
    }, [userId, isGuest, fetchPath, fetchProgress, fetchWeakAreas])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPath(),
      userId ? fetchProgress(userId, isGuest) : Promise.resolve(),
      userId ? fetchWeakAreas(userId, isGuest) : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [userId, isGuest, fetchPath, fetchProgress, fetchWeakAreas]);

  const streak = progress?.current_streak || 0;

  const handleStartLesson = () => {
    if (todaysLesson) {
      navigation.navigate('LessonScreen', { lessonId: todaysLesson.id });
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
          {streak > 0 && (
            <View style={styles.streakBox}>
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
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

        {/* ============================================ */}
        {/* ALL DONE STATE */}
        {/* ============================================ */}
        {totalLessonsCompleted > 0 && !todaysLesson && (
          <View style={styles.doneContent}>
            <View style={styles.doneLine} />
            <Text style={styles.doneTitle}>COMPLETE</Text>
            <Text style={styles.doneSubtitle}>All lessons done</Text>
            <View style={styles.doneLine} />
          </View>
        )}

        {/* ============================================ */}
        {/* TODAY'S LESSON */}
        {/* ============================================ */}
        {todaysLesson && (
          <View style={styles.lessonSection}>
            <Text style={styles.sectionLabel}>TODAY'S LESSON</Text>
            
            {/* Lesson card - stark bordered */}
            <View style={styles.lessonCard}>
              {/* Number indicator */}
              <Text style={styles.lessonNumber}>
                {getLessonNumber(todaysLesson.type)}
              </Text>
              
              {/* Lesson name - heavy */}
              <Text style={styles.lessonName}>{todaysLesson.name}</Text>
              
              {/* Meta info */}
              <View style={styles.lessonMeta}>
                <Text style={styles.lessonMetaText}>
                  {todaysLesson.estimated_minutes || 5} MIN
                </Text>
                <Text style={styles.lessonMetaText}>
                  +{todaysLesson.xp_reward || 10} XP
                </Text>
              </View>
            </View>

            {/* START button - bordered */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartLesson}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>START</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================ */}
        {/* NO LESSONS */}
        {/* ============================================ */}
        {!todaysLesson && totalLessonsCompleted === 0 && (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>NO LESSONS</Text>
            <Text style={styles.emptySubtitle}>Browse learning paths below</Text>
          </View>
        )}

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
    
    // Sort: incomplete first (by least completed), then completed (by most total)
    progressData.sort((a, b) => {
      if (a.completed < a.total && b.completed >= b.total) return -1;
      if (b.completed < b.total && a.completed >= a.total) return 1;
      if (a.completed < a.total && b.completed < b.total) return a.completed - b.completed;
      return b.total - a.total;
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
              <View style={styles.pathRowLeft}>
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
            
            {/* Progress count */}
            {path.total > 0 && (
              <View style={[styles.progressBadge, path.completed >= path.total && styles.progressBadgeDone]}>
                <Text style={[styles.progressText, path.completed >= path.total && styles.progressTextDone]}>
                  {path.completed}/{path.total}
                </Text>
              </View>
            )}
            
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
  streakBox: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  streakText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
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
    padding: theme.swiss.layout.sectionGap,
    marginBottom: theme.swiss.layout.elementGap,
  },
  lessonNumber: {
    fontSize: 48,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  lessonName: {
    fontSize: theme.swiss.fontSize.heading,
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
  startButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  
  // Done State
  doneContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.swiss.layout.sectionGap + theme.spacing[4],
  },
  doneLine: {
    width: 40,
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.spacing[5],
  },
  doneTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
    color: theme.colors.text.primary,
  },
  doneSubtitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  doneAction: {
    marginTop: theme.swiss.layout.sectionGap,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.swiss.layout.screenPadding,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  doneActionText: {
    fontSize: theme.swiss.fontSize.small + 2,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  
  // Empty State
  emptyContent: {
    alignItems: 'center',
    paddingVertical: theme.swiss.layout.sectionGap + theme.spacing[4],
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
  
  // Browse Link
  browseLink: {
    alignItems: 'center',
    paddingVertical: theme.swiss.layout.sectionGap,
  },
  browseLinkText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
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
  pathLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
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
  nextBadgeSmall: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    marginRight: theme.spacing[2],
  },
  nextBadgeTextSmall: {
    fontSize: 10,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.wide,
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

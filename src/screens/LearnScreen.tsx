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
import { Lesson } from '../types';

type LearnScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LearnScreen'>;

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

  const handleBrowseCategories = () => {
    navigation.navigate('LearningPathBrowse');
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
        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* ============================================ */}
        {/* ALL DONE STATE */}
        {/* ============================================ */}
        {totalLessonsCompleted > 0 && !todaysLesson && (
          <View style={styles.doneContent}>
            <View style={styles.doneLine} />
            <Text style={styles.doneTitle}>COMPLETE</Text>
            <Text style={styles.doneSubtitle}>All lessons done</Text>
            <View style={styles.doneLine} />
            
            <TouchableOpacity 
              style={styles.doneAction}
              onPress={handleBrowseCategories}
            >
              <Text style={styles.doneActionText}>BROWSE →</Text>
            </TouchableOpacity>
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
            <TouchableOpacity onPress={handleBrowseCategories}>
              <Text style={styles.emptyLink}>BROWSE →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.separator} />

        {/* Bottom browse link */}
        <TouchableOpacity 
          style={styles.browseLink}
          onPress={handleBrowseCategories}
        >
          <Text style={styles.browseLinkText}>BROWSE →</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: theme.spacing[4],
  },
  emptyLink: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
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
});

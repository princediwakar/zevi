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
    navigation.navigate('CategoryDetail', { category: 'product_sense' });
  };

  // Get lesson type emoji
  const getLessonEmoji = (type: string) => {
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
            tintColor="#000000"
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
                {getLessonEmoji(todaysLesson.type)}
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
    backgroundColor: '#FFFFFF',
  },
  
  // Header - Swiss bold
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  streakBox: {
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  
  // Separator
  separator: {
    height: 3,
    backgroundColor: '#000000',
    marginBottom: 24,
  },
  
  // Lesson Section
  lessonSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#666666',
    marginBottom: 16,
  },
  
  // Lesson Card - bordered
  lessonCard: {
    borderWidth: 2,
    borderColor: '#000000',
    padding: 24,
    marginBottom: 24,
  },
  lessonNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 16,
  },
  lessonName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 30,
    marginBottom: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  lessonMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
  },
  
  // START Button
  startButton: {
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#000000',
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  
  // Done State
  doneContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 48,
  },
  doneLine: {
    width: 40,
    height: 3,
    backgroundColor: '#000000',
    marginVertical: 20,
  },
  doneTitle: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#000000',
  },
  doneSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  doneAction: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#000000',
  },
  doneActionText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#000000',
  },
  
  // Empty State
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000000',
    marginBottom: 16,
  },
  emptyLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 1,
  },
  
  // Browse Link
  browseLink: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  browseLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1,
  },
});

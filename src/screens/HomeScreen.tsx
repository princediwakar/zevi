import React, { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl, ActivityIndicator, Text, SectionList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';
import { 
  QuestionTrackCard,
  QuickActions,
  Spacer,
  H1,
  H2,
  BodyMD,
  BodyLG,
  Row,
  Column,
  Card,
  HomeScreenSkeleton,
  PrimaryButton,
} from '../components';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useProgressStore } from '../stores/progressStore';
import { useQuestionsStore } from '../stores/questionsStore';
import { QuestionCategory, QUESTION_CATEGORIES } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, isGuest, guestId } = useAuth();
  
  const { path, units, loading: pathLoading, fetchPath } = useLearningPathStore();
  const { progress, loading: progressLoading, fetchProgress, readinessScore, weakAreas, incorrectQuestions, fetchWeakAreas } = useProgressStore();
  const { fetchQuestions, categoryStats, fetchCategoryStats } = useQuestionsStore();

  const [refreshing, setRefreshing] = useState(false);
  const userId = user?.id || guestId || undefined;

  const loadData = useCallback(async () => {
    if (userId) {
      await fetchPath();
      await fetchProgress(userId, isGuest);
      await fetchQuestions({});
      await fetchCategoryStats(); // Fetch category counts
      await fetchWeakAreas(userId, isGuest); // Fetch weak areas
    }
  }, [userId, isGuest, fetchPath, fetchProgress, fetchQuestions, fetchCategoryStats, fetchWeakAreas]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const isLoading = pathLoading || (progressLoading && !progress);

  // User stats
  const streak = progress?.current_streak || 0;
  const totalQuestions = progress?.total_questions_completed || 0;
  const readiness = readinessScore || progress?.readiness_score || 0;

  // Check if user is new (cold start)
  const isNewUser = totalQuestions === 0;

  const getCategoryMastery = (category: QuestionCategory): number => {
    if (!progress?.category_progress) return 0;
    return progress.category_progress[category] || 0;
  };

  const getCompletedCount = (category: QuestionCategory): number => {
    const mastery = getCategoryMastery(category);
    return Math.floor((mastery / 100) * (categoryStats[category] || 10));
  };

  const handleTrackPress = (category: QuestionCategory) => {
    navigation.navigate('QuestionList', { category });
  };

  const handleDailyQuiz = () => navigation.navigate('QuickQuiz', {});
  const handleRandomPractice = () => navigation.navigate('QuickQuiz', {});
  
  // Navigate to the first weak area category, or product_sense if no weak areas
  const handleReviewMistakes = () => {
    if (incorrectQuestions.length > 0) {
      // Navigate to a specific question they got wrong
      const firstWrong = incorrectQuestions[0];
      if (firstWrong?.question_id) {
        navigation.navigate('QuestionDetail', { questionId: firstWrong.question_id });
        return;
      }
    }
    // Fallback: navigate to first weak area or product_sense
    const targetCategory = weakAreas.length > 0 ? weakAreas[0].category : 'product_sense';
    navigation.navigate('QuestionList', { category: targetCategory });
  };
  
  // Navigate to weakest category for focused practice
  const handleWeakAreas = () => {
    if (weakAreas.length > 0) {
      navigation.navigate('QuestionList', { category: weakAreas[0].category });
    } else {
      navigation.navigate('QuestionList', { category: 'product_sense' });
    }
  };
  
  const handleStartPath = () => {
    if (units.length > 0 && units[0].lessons?.length > 0) {
      navigation.navigate('LessonScreen', { lessonId: units[0].lessons[0].id });
    }
  };

  if (isLoading && !path) {
    return <HomeScreenSkeleton />;
  }

  const sections = [
    // New User Welcome - Only show for users with no progress
    ...(isNewUser ? [{
      title: 'Welcome',
      data: ['welcome'],
      renderItem: () => (
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>👋 Welcome to Zevi!</Text>
          <Text style={styles.welcomeSubtitle}>
            Your personalized PM interview prep starts here. Try a sample question to see how it works.
          </Text>
          <TouchableOpacity 
            style={styles.trySampleButton}
            onPress={handleRandomPractice}
            accessibilityLabel="Try a sample question"
            accessibilityHint="Start with a practice question to see how Zevi works"
            accessibilityRole="button"
          >
            <Text style={styles.trySampleButtonText}>Try a Sample Question →</Text>
          </TouchableOpacity>
        </View>
      ),
    }] : []),
    // Continue Learning - Promoted from footer to top (only show if user has progress)
    ...(!isNewUser && units.length > 0 && units[0].lessons?.length > 0 ? [{
      title: 'Continue Learning',
      data: ['continue_learning'],
      renderItem: () => (
        <TouchableOpacity 
          style={styles.continueCardPromoted} 
          onPress={handleStartPath}
          activeOpacity={0.8}
        >
          <Row style={styles.continueRow}>
            <View style={styles.continueIconContainer}>
              <Text style={styles.continueIcon}>📖</Text>
            </View>
            <Column style={styles.continueInfo}>
              <Text style={styles.continueLabelPromoted}>CONTINUE LEARNING</Text>
              <Text style={styles.continuePathPromoted}>
                {path?.name || 'Your Learning Path'}
              </Text>
              <Text style={styles.continueLesson}>
                Next: {units[0].lessons[0].name}
              </Text>
            </Column>
            <Text style={styles.continueArrow}>→</Text>
          </Row>
        </TouchableOpacity>
      ),
    }] : []),
    {
      title: 'Quick Actions',
      data: ['quick_actions'],
      renderItem: () => (
        <QuickActions
          onDailyQuiz={handleDailyQuiz}
          onRandomPractice={handleRandomPractice}
          onReviewMistakes={handleReviewMistakes}
          onWeakAreas={handleWeakAreas}
        />
      ),
    },
    {
      title: 'Progress',
      data: ['progress'],
      renderItem: () => (
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>QUESTIONS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{readiness}%</Text>
            <Text style={styles.statLabel}>READY</Text>
          </View>
        </View>
      ),
    },
    {
      title: 'Tracks',
      data: ['tracks'],
      renderItem: () => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PRACTICE TRACKS</Text>
        </View>
      ),
    },
    ...QUESTION_CATEGORIES.slice(0, 6).map((category) => ({
      title: category,
      data: [category],
      renderItem: () => (
        <View style={styles.trackCardWrapper}>
          <QuestionTrackCard
            category={category}
            questionCount={categoryStats[category] || 0}
            masteryLevel={getCategoryMastery(category)}
            completedCount={getCompletedCount(category)}
            onPress={() => handleTrackPress(category)}
          />
        </View>
      ),
    })),
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Row style={styles.headerRow}>
          <Column>
            <Text style={styles.greeting}>Welcome back</Text>
            <H1 style={styles.title}>Ready to practice?</H1>
          </Column>
        </Row>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderSectionHeader={({ section }) => {
          if (section.data[0] === 'quick_actions' || 
              section.data[0] === 'progress' ||
              section.data[0] === 'tracks') {
            return null;
          }
          return null;
        }}
        renderItem={({ item, section }) => section.renderItem()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.colors.primary[500]} 
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListFooterComponent={
          <View style={styles.footer}>
            {units.length > 0 && units[0].lessons?.length > 0 && (
              <View style={styles.continueCard} onTouchEnd={handleStartPath}>
                <Text style={styles.continueLabel}>CONTINUE LEARNING</Text>
                <Row style={styles.continueContent}>
                  <Text style={styles.continuePath}>{path?.name || 'Your Learning Path'}</Text>
                  <Text style={styles.continueArrow}>→</Text>
                </Row>
              </View>
            )}
            <Spacer size={100} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: theme.colors.text.inverse,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  title: {
    color: theme.colors.text.inverse,
    letterSpacing: -1,
  },
  scrollContent: {
    paddingTop: theme.spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  statBox: {
    flex: 1,
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    marginTop: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
  trackCardWrapper: {
    paddingHorizontal: theme.spacing[4],
  },
  footer: {
    paddingHorizontal: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  continueCard: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  continueLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  continueContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continuePath: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  continueArrow: {
    fontSize: 18,
    color: theme.colors.primary[500],
  },
  continueArrowInverse: {
    fontSize: 20,
    color: theme.colors.text.inverse,
  },
  // New user welcome card styles
  welcomeCard: {
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
    padding: theme.spacing[5],
    backgroundColor: theme.colors.primary[50],
    borderWidth: 1,
    borderColor: theme.colors.primary[200],
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing[4],
  },
  trySampleButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  trySampleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  // Promoted Continue Learning card styles
  continueCardPromoted: {
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.primary[500],
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
  },
  continueRow: {
    alignItems: 'center',
  },
  continueIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  continueIcon: {
    fontSize: 24,
  },
  continueInfo: {
    flex: 1,
  },
  continueLabelPromoted: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: theme.spacing[1],
  },
  continuePathPromoted: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    letterSpacing: -0.5,
  },
  continueLesson: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: theme.spacing[1],
  },
});

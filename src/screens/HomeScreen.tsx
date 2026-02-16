import React, { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';
import { HomeScreenSkeleton, CategoryListSection } from '../components';
import { useProgressStore } from '../stores/progressStore';
import { useQuestionsStore } from '../stores/questionsStore';
import { getPersonalizedQuestion } from '../services/questionService';
import { Question } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  
  const { progress, loading: progressLoading, fetchProgress } = useProgressStore();
  const { fetchQuestions, fetchCategoryStats } = useQuestionsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [todaysQuestion, setTodaysQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  
  const userId = user?.id;

  // Check if user has practiced today
  const hasPracticedToday = React.useMemo(() => {
    if (!progress?.last_practice_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return progress.last_practice_date === today;
  }, [progress?.last_practice_date]);

  const loadData = useCallback(async () => {
    if (userId) {
      await fetchProgress(userId);
      await fetchQuestions({});
      await fetchCategoryStats();
      
      if (!hasPracticedToday) {
        try {
          setLoadingQuestion(true);
          const question = await getPersonalizedQuestion(userId);
          setTodaysQuestion(question);
        } catch (error) {
          console.error('Error loading question:', error);
        } finally {
          setLoadingQuestion(false);
        }
      } else {
        setLoadingQuestion(false);
      }
    }
  }, [userId, fetchProgress, fetchQuestions, fetchCategoryStats, hasPracticedToday]);

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

  const isLoading = progressLoading && !progress;
  const streak = progress?.current_streak || 0;

  const handleStartQuestion = () => {
    if (todaysQuestion) {
      navigation.navigate('QuestionDetail', { questionId: todaysQuestion.id });
    } else {
      navigation.navigate('QuickQuiz', { questionCount: 1 });
    }
  };

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  // ============================================
  // SWISS STYLE: DONE FOR TODAY
  // Using theme tokens for consistency
  // ============================================
  if (hasPracticedToday) {
    return (
      <View style={styles.doneContainer}>
        {/* Stark header bar */}
        <View style={styles.doneHeader}>
          <Text style={styles.doneHeaderText}>ZEVI</Text>
          {streak > 0 && (
            <View style={styles.streakBox}>
              <Text style={styles.streakBoxText}>{streak}</Text>
            </View>
          )}
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.doneScrollView}
          contentContainerStyle={styles.doneScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Centered content with heavy line */}
          <View style={styles.doneContent}>
            <View style={styles.doneLine} />
            <Text style={styles.doneTitle}>DONE</Text>
            <Text style={styles.doneSubtitle}>Come back tomorrow</Text>
            <View style={styles.doneLine} />
          </View>

          {/* Full Category List - Combined */}
          <CategoryListSection onCategoryPress={(category) => navigation.navigate('QuestionList', { category })} />
        </ScrollView>
      </View>
    );
  }

  // ============================================
  // SWISS STYLE: TODAY'S QUESTION
  // Using theme tokens for all styling
  // ============================================
  return (
    <View style={styles.container}>
      {/* Top bar - Swiss grid */}
      <View style={styles.topBar}>
        <Text style={styles.brand}>ZEVI</Text>
        {streak > 0 && (
          <View style={styles.streakBox}>
            <Text style={styles.streakBoxText}>{streak}</Text>
          </View>
        )}
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

        {/* TODAY'S QUESTION Section */}
        <View style={styles.questionSection}>
          <Text style={styles.sectionLabel}>TODAY'S QUESTION</Text>
          
          {/* Question card - bordered */}
          <View style={styles.questionCard}>
            {loadingQuestion ? (
              <ActivityIndicator size="large" color={theme.colors.text.primary} />
            ) : todaysQuestion ? (
              <Text style={styles.questionText}>
                {todaysQuestion.question_text}
              </Text>
            ) : (
              <Text style={styles.noQuestion}>No question available</Text>
            )}
          </View>

          {/* Minimal metadata - bordered boxes */}
          {todaysQuestion && (
            <View style={styles.metaRow}>
              <View style={styles.metaBox}>
                <Text style={styles.metaText}>
                  {todaysQuestion.category.replace('_', ' ')}
                </Text>
              </View>
              <View style={styles.metaBox}>
                <Text style={styles.metaText}>{todaysQuestion.difficulty}</Text>
              </View>
              {todaysQuestion.company && (
                <View style={styles.metaBox}>
                  <Text style={styles.metaText}>{todaysQuestion.company}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* START - Large bordered button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartQuestion}
          disabled={loadingQuestion || !todaysQuestion}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>

        {/* Full Category List - Combined with Today's Question */}
        <CategoryListSection onCategoryPress={(category) => navigation.navigate('QuestionList', { category })} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Top bar - Swiss grid
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  brand: {
    fontSize: 24,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  streakBox: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  streakBoxText: {
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
  
  // Separator line - heavy black line
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginBottom: theme.swiss.layout.sectionGap,
  },
  
  // Question Section
  questionSection: {
    marginBottom: theme.swiss.layout.elementGap,
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  questionCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.sectionGap,
    marginBottom: theme.swiss.layout.elementGap,
    minHeight: 150,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 28,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: 36,
    letterSpacing: theme.swiss.letterSpacing.tight,
  },
  noQuestion: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.disabled,
  },
  
  // Meta row - bordered boxes
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.swiss.layout.sectionGap,
  },
  metaBox: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  metaText: {
    fontSize: theme.swiss.fontSize.small - 1,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // START Button - bordered, sharp
  startButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
    marginBottom: theme.swiss.layout.elementGap,
  },
  startButtonText: {
    fontSize: theme.swiss.fontSize.body + 2,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  
  // Alternative link
  altLink: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
  altLinkText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },

  // ============================================
  // DONE STATE - Swiss stark
  // ============================================
  doneContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  doneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  doneHeaderText: {
    fontSize: 24,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  doneScrollView: {
    flex: 1,
  },
  doneScrollContent: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingTop: theme.swiss.layout.sectionGap,
  },
  doneContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6],
  },
  doneLine: {
    width: 60,
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.swiss.layout.elementGap,
  },
  doneTitle: {
    fontSize: theme.swiss.fontSize.display,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.xwide4,
  },
  doneSubtitle: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    textTransform: 'uppercase',
  },

  // ============================================
  // CATEGORY LIST SECTION (Combined Browse)
  // ============================================
  categoryListSection: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[10],
  },
  categoryListTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[4],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  categoryRowNext: {
    backgroundColor: theme.colors.neutral[50],
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text.primary,
    paddingLeft: theme.spacing[3],
    marginLeft: -theme.spacing[3],
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  categoryLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  categoryLabelDone: {
    color: theme.colors.text.secondary,
  },
  categoryCount: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  categoryCountDone: {
    color: theme.colors.text.disabled,
  },
  progressIndicator: {
    width: 50,
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.text.primary,
  },
});

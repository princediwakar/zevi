import React, { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';
import { Spacer, HomeScreenSkeleton } from '../components';
import { useProgressStore } from '../stores/progressStore';
import { useQuestionsStore } from '../stores/questionsStore';
import { getPersonalizedQuestion } from '../services/questionService';
import { Question, QuestionCategory, QUESTION_CATEGORIES } from '../types';
import { ArrowRight } from 'lucide-react-native';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// Category labels
const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  product_sense: 'Product Sense',
  execution: 'Execution',
  strategy: 'Strategy',
  behavioral: 'Behavioral',
  technical: 'Technical',
  estimation: 'Estimation',
  pricing: 'Pricing',
  ab_testing: 'A/B Testing',
};

// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, isGuest, guestId } = useAuth();
  
  const { progress, loading: progressLoading, fetchProgress } = useProgressStore();
  const { fetchQuestions, fetchCategoryStats } = useQuestionsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [todaysQuestion, setTodaysQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  
  const userId = user?.id || guestId || undefined;

  // Check if user has practiced today
  const hasPracticedToday = React.useMemo(() => {
    if (!progress?.last_practice_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return progress.last_practice_date === today;
  }, [progress?.last_practice_date]);

  const loadData = useCallback(async () => {
    if (userId) {
      await fetchProgress(userId, isGuest);
      await fetchQuestions({});
      await fetchCategoryStats();
      
      if (!hasPracticedToday) {
        try {
          setLoadingQuestion(true);
          const question = await getPersonalizedQuestion(userId, isGuest);
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
  }, [userId, isGuest, fetchProgress, fetchQuestions, fetchCategoryStats, hasPracticedToday]);

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

  const handleBrowseCategories = () => {
    navigation.navigate('CategoryBrowse');
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

        {/* Centered content with heavy line */}
        <View style={styles.doneContent}>
          <View style={styles.doneLine} />
          <Text style={styles.doneTitle}>DONE</Text>
          <Text style={styles.doneSubtitle}>Come back tomorrow</Text>
          <View style={styles.doneLine} />
        </View>

        {/* Bottom action */}
        <TouchableOpacity 
          style={styles.doneAction}
          onPress={handleBrowseCategories}
          activeOpacity={0.7}
        >
          <Text style={styles.doneActionText}>BROWSE →</Text>
        </TouchableOpacity>
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
        {/* Heavy separator line */}
        <View style={styles.separator} />

        {/* Question - extremely bold */}
        <View style={styles.questionSection}>
          {loadingQuestion ? (
            <ActivityIndicator size="large" color={theme.colors.text.primary} />
          ) : todaysQuestion ? (
            <Text style={styles.questionText}>
              {todaysQuestion.question_text}
            </Text>
          ) : (
            <Text style={styles.noQuestion}>No question</Text>
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

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* START - Large bordered button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartQuestion}
          disabled={loadingQuestion || !todaysQuestion}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>

        {/* Alternative link */}
        <TouchableOpacity 
          style={styles.altLink}
          onPress={handleBrowseCategories}
        >
          <Text style={styles.altLinkText}>BROWSE →</Text>
        </TouchableOpacity>

        {/* Category Progress Overview */}
        <CategoryProgressSection onCategoryPress={(category) => navigation.navigate('CategoryBrowse', { category })} />
      </ScrollView>
    </View>
  );
}

// Category Progress Section - shows which categories have been practiced
function CategoryProgressSection({ onCategoryPress }: { onCategoryPress: (cat: QuestionCategory) => void }) {
  const { progress } = useProgressStore();
  const { categoryStats } = useQuestionsStore();
  
  // Get category progress
  const categoryProgress = React.useMemo(() => {
    const categories: QuestionCategory[] = ['product_sense', 'execution', 'strategy', 'behavioral', 'technical', 'estimation', 'ab_testing'];
    
    const progressData = categories.map(cat => {
      const completed = progress?.category_progress?.[cat] || 0;
      const total = categoryStats[cat] || 0;
      return {
        category: cat,
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
    
    // Sort by least practiced (next to practice) to most practiced
    progressData.sort((a, b) => a.completed - b.completed);
    
    // Mark first incomplete as "next"
    const firstIncomplete = progressData.find(p => p.completed < p.total);
    return { categories: progressData, nextCategory: firstIncomplete?.category };
  }, [progress, categoryStats]);

  return (
    <View style={styles.categoryProgressSection}>
      <Text style={styles.categoryProgressTitle}>CATEGORY PROGRESS</Text>
      
      {categoryProgress.categories.map((cat) => {
        const isNext = cat.category === categoryProgress.nextCategory;
        const hasProgress = cat.completed > 0;
        
        return (
          <TouchableOpacity
            key={cat.category}
            style={[
              styles.categoryProgressRow,
              isNext && styles.categoryProgressRowNext,
            ]}
            onPress={() => onCategoryPress(cat.category)}
          >
            {/* NEXT badge */}
            {isNext && (
              <View style={styles.nextBadgeSmall}>
                <Text style={styles.nextBadgeTextSmall}>NEXT</Text>
              </View>
            )}
            
            {/* Category name */}
            <Text style={[
              styles.categoryProgressLabel,
              hasProgress && styles.categoryProgressLabelDone,
            ]}>
              {CATEGORY_LABELS[cat.category]}
            </Text>
            
            {/* Progress */}
            <View style={styles.categoryProgressMeta}>
              <Text style={[
                styles.categoryProgressCount,
                hasProgress && styles.categoryProgressCountDone,
              ]}>
                {cat.completed}/{cat.total}
              </Text>
              {hasProgress && (
                <View style={styles.categoryProgressBar}>
                  <View style={[styles.categoryProgressFill, { width: `${cat.percent}%` }]} />
                </View>
              )}
            </View>
            
            <ArrowRight size={16} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        );
      })}
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
    minHeight: 200,
    justifyContent: 'center',
    marginBottom: theme.swiss.layout.elementGap,
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
  doneContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.swiss.layout.screenPadding,
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
  doneAction: {
    borderTopWidth: theme.swiss.border.heavy,
    borderTopColor: theme.colors.text.primary,
    paddingVertical: theme.swiss.layout.sectionGap,
    alignItems: 'center',
  },
  doneActionText: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.xwide,
  },

  // ============================================
  // CATEGORY PROGRESS SECTION
  // ============================================
  categoryProgressSection: {
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[10],
  },
  categoryProgressTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[4],
  },
  categoryProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  categoryProgressRowNext: {
    backgroundColor: theme.colors.neutral[50],
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text.primary,
    paddingLeft: theme.spacing[2],
    marginLeft: -theme.spacing[2],
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
  categoryProgressLabel: {
    flex: 1,
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  categoryProgressLabelDone: {
    color: theme.colors.text.secondary,
  },
  categoryProgressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing[2],
    gap: theme.spacing[2],
  },
  categoryProgressCount: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  categoryProgressCountDone: {
    color: theme.colors.text.disabled,
  },
  categoryProgressBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.neutral[200],
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.text.secondary,
  },
});

import React, { useCallback, useState, useRef } from 'react';
import { View, StyleSheet, RefreshControl, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';
  import { HomeScreenSkeleton, CategoryListSection, SwissStreakBox } from '../components';
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
  
  // Track the date when today's question was loaded
  const loadedDateRef = useRef<string | null>(null);
  
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
        const today = new Date().toISOString().split('T')[0];
        
        // Only fetch a new question if:
        // 1. We haven't loaded a question today yet, OR
        // 2. The loaded question is from a previous day
        const needsNewQuestion = !loadedDateRef.current || loadedDateRef.current !== today;
        
        if (needsNewQuestion) {
          try {
            setLoadingQuestion(true);
            const question = await getPersonalizedQuestion(userId);
            setTodaysQuestion(question);
            loadedDateRef.current = today; // Store the date when we loaded this question
          } catch (error) {
            console.error('Error loading question:', error);
          } finally {
            setLoadingQuestion(false);
          }
        } else {
          // Already have today's question, just keep it
          setLoadingQuestion(false);
        }
      } else {
        setLoadingQuestion(false);
        // Reset the loaded date when user has practiced
        loadedDateRef.current = null;
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

  // Show skeleton during initial data load to prevent UI shifts
  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  // Show skeleton while loading question to prevent layout shifts
  if (loadingQuestion) {
    return <HomeScreenSkeleton />;
  }

  // ============================================
  // UNIFIED LAYOUT - Same structure for both states to prevent UI shifts
  // ============================================
  return (
    <View style={styles.container}>
      {/* Top bar - Swiss grid - Same for both states */}
      <View style={styles.topBar}>
        <Text style={styles.brand}>ZEVI</Text>
        <SwissStreakBox streak={streak} />
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
        {hasPracticedToday ? (
          // DONE STATE - Same height as question section to prevent shifts
          <View style={styles.doneStateContainer}>
            <View style={styles.doneLine} />
            <Text style={styles.doneTitle}>DONE</Text>
            <Text style={styles.doneSubtitle}>Come back tomorrow</Text>
            <View style={styles.doneLine} />
          </View>
        ) : (
          // TODAY'S QUESTION Section
          <View style={styles.questionSection}>
            <Text style={styles.sectionLabel}>TODAY'S QUESTION</Text>
            
            {/* Question card - bordered */}
            <View style={styles.questionCard}>
              {todaysQuestion ? (
                <Text style={styles.questionText}>
                  {todaysQuestion.question_text}
                </Text>
              ) : (
                <Text style={styles.noQuestion}>No question available</Text>
              )}
            </View>

            {/* Minimal metadata - bordered boxes - always render to prevent shifts */}
            <View style={styles.metaRow}>
              <View style={[styles.metaBox, !todaysQuestion && styles.metaBoxEmpty]}>
                <Text style={styles.metaText}>
                  {todaysQuestion ? todaysQuestion.category.replace('_', ' ') : ''}
                </Text>
              </View>
              <View style={[styles.metaBox, !todaysQuestion && styles.metaBoxEmpty]}>
                <Text style={styles.metaText}>
                  {todaysQuestion ? todaysQuestion.difficulty : ''}
                </Text>
              </View>
              <View style={[styles.metaBox, !todaysQuestion && styles.metaBoxEmpty, !todaysQuestion?.company && styles.metaBoxHidden]}>
                <Text style={styles.metaText}>
                  {todaysQuestion?.company || ''}
                </Text>
              </View>
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
          </View>
        )}

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
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
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
    padding: theme.spacing[5],
    marginBottom: theme.swiss.layout.elementGap,
    minHeight: 130,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: 30,
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
  metaBoxEmpty: {
    borderColor: theme.colors.border.light,
  },
  metaBoxHidden: {
    opacity: 0,
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
  // DONE STATE - Unified with question section
  // ============================================
  doneStateContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[10],
    marginBottom: theme.swiss.layout.elementGap,
    minHeight: 300, // Match approximate question section height
    justifyContent: 'center',
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

});

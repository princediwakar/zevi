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
import { Question } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// SWISS DESIGN: Sharp, bold, minimal, high contrast
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
  // Stark, bold, black & white with accent
  // ============================================
  if (hasPracticedToday) {
    return (
      <View style={styles.doneContainer}>
        {/* Stark black header bar */}
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
  // Heavy typography, stark layout, sharp edges
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
            tintColor="#000" 
          />
        }
      >
        {/* Heavy separator line */}
        <View style={styles.separator} />

        {/* Question - extremely bold */}
        <View style={styles.questionSection}>
          {loadingQuestion ? (
            <ActivityIndicator size="large" color="#000" />
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Top bar - Swiss grid
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
  streakBox: {
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakBoxText: {
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
    paddingTop: 32,
  },
  
  // Separator line
  separator: {
    height: 3,
    backgroundColor: '#000000',
    marginBottom: 32,
  },
  
  // Question Section
  questionSection: {
    minHeight: 200,
    justifyContent: 'center',
    marginBottom: 24,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  noQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
  },
  
  // Meta row - bordered boxes
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  metaBox: {
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // START Button - bordered, sharp
  startButton: {
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#000000',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  
  // Alternative link
  altLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  altLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 1,
  },

  // ============================================
  // DONE STATE - Swiss stark
  // ============================================
  doneContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  doneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  doneHeaderText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
  doneContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  doneLine: {
    width: 60,
    height: 3,
    backgroundColor: '#000000',
    marginVertical: 24,
  },
  doneTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 4,
  },
  doneSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  doneAction: {
    borderTopWidth: 3,
    borderTopColor: '#000000',
    paddingVertical: 24,
    alignItems: 'center',
  },
  doneActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 2,
  },
});

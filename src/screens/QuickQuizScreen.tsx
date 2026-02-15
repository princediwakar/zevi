import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useQuestionsStore } from '../stores/questionsStore';
import { usePracticeStore } from '../stores/practiceStore';
import { useAuth } from '../hooks/useAuth';
import { Question, MCQOption } from '../types';
import { sampleQuestions } from '../data/sampleQuestions';
import { theme } from '../theme';

type QuickQuizNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuickQuiz'>;
type QuickQuizRouteProp = RouteProp<RootStackParamList, 'QuickQuiz'>;

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
// ============================================

export default function QuickQuizScreen() {
  const navigation = useNavigation<QuickQuizNavigationProp>();
  const route = useRoute<QuickQuizRouteProp>();
  const initialQuestions = route.params?.questions;
  const sourceQuestionId = route.params?.sourceQuestionId;
  const questionCount = route.params?.questionCount ?? 5;
  const { user, guestId } = useAuth();

  const { getRandomMCQQuestion, getRecommendedQuestions } = useQuestionsStore();
  const {
    currentQuestion,
    currentQuestionIndex,
    questionQueue,
    currentQueueIndex,
    totalQuizSteps,
    currentQuizStep,
    startQuiz,
    answerMCQSubQuestion,
    nextQuizQuestion,
    submitAnswer,
    resetPractice,
  } = usePracticeStore();

  const [selectedOption, setSelectedOption] = useState<MCQOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Animation for progress bar using reanimated
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    loadQuiz();
    return () => resetPractice();
  }, [initialQuestions, route.params?.lessonId]);

  useEffect(() => {
    if (totalQuizSteps > 0) {
      progressWidth.value = withTiming((currentQuizStep / totalQuizSteps) * 100, {
        duration: 500,
      });
    }
  }, [currentQuizStep, totalQuizSteps]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const loadQuiz = async () => {
    let queue: Question[] = [];
    const { lessonId } = route.params || {};
    const userId = user?.id || guestId;
    const isGuest = !user?.id;
    
    setInitializing(true);

    if (lessonId) {
       const { getQuestionsByLessonId } = useQuestionsStore.getState();
       queue = await getQuestionsByLessonId(lessonId);
    } else if (initialQuestions && initialQuestions.length > 0) {
      queue = initialQuestions;
    } else {
      try {
        if (userId) {
          queue = await getRecommendedQuestions(userId, isGuest, questionCount);
        }
      } catch (error) {
        console.error('Error getting personalized questions:', error);
      }
      
      if (queue.length === 0) {
        const mcqQuestions = sampleQuestions.filter(q => q.mcq_version?.enabled);
        const shuffled = [...mcqQuestions].sort(() => Math.random() - 0.5);
        queue = shuffled.slice(0, questionCount);
      }
    }

    if (queue.length === 0) {
      const mcqQuestions = sampleQuestions.filter(q => q.mcq_version?.enabled);
      queue = mcqQuestions.slice(0, questionCount);
    }

    if (queue.length > 0) {
      try {
        const finalUserId = userId || 'guest';
        await startQuiz(queue, finalUserId, isGuest);
      } catch (error) {
        console.error('Error starting quiz:', error);
        try {
          const mcqQuestions = sampleQuestions.filter(q => q.mcq_version?.enabled);
          await startQuiz(mcqQuestions.slice(0, questionCount), 'guest', true);
        } catch (e) {
          console.error('Fatal error starting quiz:', e);
        }
      }
    }
    setInitializing(false);
  };

  const handleOptionPress = (option: MCQOption) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption.correct;
    const subQuestions = currentQuestion.mcq_version?.sub_questions || [];
    const currentSubQuestion = subQuestions[currentQuestionIndex];
    const optionIndex = currentSubQuestion.options.findIndex(o => o.text === selectedOption.text);

    answerMCQSubQuestion(currentQuestionIndex, optionIndex, isCorrect);

    const userId = user?.id || guestId || 'guest';
    const isGuest = !user?.id;
    await submitAnswer(userId, isGuest);

    setShowFeedback(true);
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    const userId = user?.id || guestId || 'guest';
    const isGuest = !user?.id;
    const hasNext = await nextQuizQuestion(userId, isGuest);
      
    if (hasNext) {
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      navigation.navigate('QuizResults', { sourceQuestionId });
    }
  };

  if (initializing || !currentQuestion || !currentQuestion.mcq_version) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      </View>
    );
  }

  const subQuestions = currentQuestion.mcq_version.sub_questions;
  const currentSubQuestion = subQuestions[currentQuestionIndex];
  
  // Flattened Progress: Step X/Y
  const stepProgress = `${currentQuizStep}/${totalQuizSteps}`;
  
  return (
    <View style={styles.container}>
      {/* Swiss Progress indicator - bold bar at top */}
      <View style={styles.progressIndicator}>
        <Animated.View style={[styles.progressBar, progressBarStyle]} />
        <Text style={styles.progressText}>
          {currentQueueIndex + 1}/{questionQueue.length} • STEP {stepProgress}
        </Text>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Large question text with heavy weight */}
        <Text style={styles.questionText}>
          {currentQuestion.question_text}
        </Text>

        <Text style={styles.subQuestionPrompt}>
          {currentSubQuestion.prompt}
        </Text>

        {/* Large touch targets with thick borders - Swiss style */}
        <View style={styles.optionsContainer}>
          {currentSubQuestion.options.map((option, index) => {
            const isSelected = selectedOption?.text === option.text;
            const showCorrect = showFeedback && option.correct;
            const showIncorrect = showFeedback && isSelected && !option.correct;

            // Determine card variant based on state
            let borderColor = theme.colors.text.primary;
            let backgroundColor = theme.colors.background;

            if (showCorrect) {
              backgroundColor = theme.colors.semantic.success + '20';
              borderColor = theme.colors.semantic.success;
            } else if (showIncorrect) {
              backgroundColor = theme.colors.semantic.error + '20';
              borderColor = theme.colors.semantic.error;
            } else if (isSelected) {
              borderColor = theme.colors.text.primary;
            }

            const optionKey = `${currentQuestion.id}-${currentQuestionIndex}-${option.text}`;

            return (
              <TouchableOpacity
                key={optionKey}
                style={[
                  styles.optionCard,
                  { borderColor, backgroundColor },
                  (showCorrect || showIncorrect || isSelected) && styles.optionCardSelected,
                ]}
                onPress={() => !showFeedback && handleOptionPress(option)}
                disabled={showFeedback}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    (showCorrect || showIncorrect || isSelected) && styles.optionTextSelected,
                  ]}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Immediate feedback panel - Swiss bordered */}
        {showFeedback && selectedOption && (
          <View
            style={[
              styles.feedbackCard,
              selectedOption.correct ? styles.correctFeedback : styles.incorrectFeedback,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {selectedOption.correct ? 'CORRECT' : 'INCORRECT'}
            </Text>
            <Text style={styles.feedbackText}>
              {selectedOption.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action button - Swiss bordered */}
      <View style={styles.buttonContainer}>
        {!showFeedback ? (
          <TouchableOpacity
            style={[styles.submitButton, !selectedOption && styles.submitButtonDisabled]}
            onPress={() => selectedOption && handleSubmit()}
            disabled={!selectedOption}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>SUBMIT ANSWER</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentQuizStep < totalQuizSteps ? 'NEXT STEP' : 'SEE RESULTS'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Minimal close button - Swiss bordered */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.closeButtonText}>CLOSE</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================
// SWISS STYLE: Sharp edges, bold typography, no gradients
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Progress indicator - bold bar at top
  progressIndicator: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingTop: theme.swiss.layout.screenPadding,
    paddingBottom: theme.spacing[4],
    borderBottomWidth: theme.swiss.border.standard,
    borderBottomColor: theme.colors.text.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  progressText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    letterSpacing: theme.swiss.letterSpacing.normal,
  },

  // Content area
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.swiss.layout.screenPadding,
    paddingBottom: 100,
  },

  // Question text - large and heavy
  questionText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    marginBottom: theme.swiss.layout.sectionGap,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  subQuestionPrompt: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    marginBottom: theme.swiss.layout.sectionGap + theme.spacing[4],
    color: theme.colors.text.secondary,
  },

  // Options - large touch targets with thick borders
  optionsContainer: {
    marginBottom: theme.swiss.layout.sectionGap,
    gap: theme.spacing[3],
  },
  optionCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
    minHeight: 72,
    justifyContent: 'center',
    padding: theme.spacing[4],
  },
  optionCardSelected: {
    borderWidth: theme.swiss.border.heavy,
  },
  optionText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  optionTextSelected: {
    fontWeight: theme.swiss.fontWeight.semibold,
  },

  // Feedback card - Swiss bordered
  feedbackCard: {
    marginBottom: theme.swiss.layout.sectionGap,
    borderLeftWidth: 4,
    padding: theme.spacing[4],
  },
  correctFeedback: {
    borderLeftColor: theme.colors.semantic.success,
    backgroundColor: theme.colors.semantic.success + '10',
  },
  incorrectFeedback: {
    borderLeftColor: theme.colors.semantic.error,
    backgroundColor: theme.colors.semantic.error + '10',
  },
  feedbackTitle: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  feedbackText: {
    fontSize: theme.swiss.fontSize.body,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },

  // Button container
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.swiss.layout.screenPadding,
    backgroundColor: theme.colors.background,
    borderTopWidth: theme.swiss.border.heavy,
    borderTopColor: theme.colors.text.primary,
  },
  
  // Submit button - bordered, filled
  submitButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  
  // Next button - bordered, outline
  nextButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },

  // Close button
  closeButton: {
    position: 'absolute',
    top: theme.swiss.layout.headerPaddingTop,
    right: theme.swiss.layout.screenPadding,
    zIndex: 10,
    padding: theme.spacing[2],
  },
  closeButtonText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },

  // Loading
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
  },
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { Container, H2, H3, BodyLG, BodyMD, BodySM, LabelMD, Card, PrimaryButton, OutlineButton, GhostButton } from '../components/ui';
import { theme } from '../theme';

type QuickQuizNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuickQuiz'>;
type QuickQuizRouteProp = RouteProp<RootStackParamList, 'QuickQuiz'>;

export default function QuickQuizScreen() {
  const navigation = useNavigation<QuickQuizNavigationProp>();
  const route = useRoute<QuickQuizRouteProp>();
  const initialQuestions = route.params?.questions;
  const sourceQuestionId = route.params?.sourceQuestionId;
  const questionCount = route.params?.questionCount ?? 5; // Default to 5 for sprint mode
  const { user, guestId } = useAuth();

  const { getRandomMCQQuestion, getRecommendedQuestions } = useQuestionsStore();
  const {
    currentQuestion,
    currentQuestionIndex, // This is sub-question index within the current question
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
       // Fetch specific questions for this lesson
       const { getQuestionsByLessonId } = useQuestionsStore.getState();
       queue = await getQuestionsByLessonId(lessonId);
    } else if (initialQuestions && initialQuestions.length > 0) {
      queue = initialQuestions;
    } else {
      // Try personalized first, with robust fallback
      try {
        if (userId) {
          queue = await getRecommendedQuestions(userId, isGuest, questionCount);
        }
      } catch (error) {
        console.error('Error getting personalized questions:', error);
      }
      
      // Fallback: use sample questions if queue is empty
      if (queue.length === 0) {
        // Get MCQ questions from sample data
        const mcqQuestions = sampleQuestions.filter(q => q.mcq_version?.enabled);
        
        // Shuffle and pick questionCount
        const shuffled = [...mcqQuestions].sort(() => Math.random() - 0.5);
        queue = shuffled.slice(0, questionCount);
      }
    }

    // Final check: ensure we have questions
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
        // Try with sample questions directly
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

    // Check correctness
    const isCorrect = selectedOption.correct;

    // Find option index
    const subQuestions = currentQuestion.mcq_version?.sub_questions || [];
    const currentSubQuestion = subQuestions[currentQuestionIndex];
    const optionIndex = currentSubQuestion.options.findIndex(o => o.text === selectedOption.text);

    answerMCQSubQuestion(currentQuestionIndex, optionIndex, isCorrect);

    // Submit result to store immediately to record progress/stats
    const userId = user?.id || guestId || 'guest';
    const isGuest = !user?.id;
    await submitAnswer(userId, isGuest);

    setShowFeedback(true);
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    // Use store's intelligent next step logic
    const userId = user?.id || guestId || 'guest';
    const isGuest = !user?.id;
    const hasNext = await nextQuizQuestion(userId, isGuest);
      
    if (hasNext) {
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Quiz complete - pass sourceQuestionId to enable returning to the question
      navigation.navigate('QuizResults', { sourceQuestionId });
    }
  };

  if (initializing || !currentQuestion || !currentQuestion.mcq_version) {
    return (
      <Container variant="screen" padding="lg" safeArea>
        <BodyLG align="center" style={{ marginTop: theme.spacing[14] }}>
          LOADING QUESTION...
        </BodyLG>
      </Container>
    );
  }

  const subQuestions = currentQuestion.mcq_version.sub_questions;
  const currentSubQuestion = subQuestions[currentQuestionIndex];
  
  // Flattened Progress: Step X/Y
  const stepProgress = `${currentQuizStep}/${totalQuizSteps}`;
  
  return (
    <Container variant="screen" padding="none" safeArea>
      {/* Focus Mode: Minimal progress indicator at top */}
      <View style={styles.progressIndicator}>
        <Animated.View
          style={[
            styles.progressBar,
            progressBarStyle
          ]}
        />
        <LabelMD color="secondary" style={styles.progressText}>
          {currentQueueIndex + 1}/{questionQueue.length} • STEP {stepProgress}
        </LabelMD>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Large question text with heavy weight */}
        <H2 style={styles.questionText}>
          {currentQuestion.question_text}
        </H2>

        <BodyLG style={styles.subQuestionPrompt}>
          {currentSubQuestion.prompt}
        </BodyLG>

        {/* Large touch targets with thick borders */}
        <View style={styles.optionsContainer}>
          {currentSubQuestion.options.map((option, index) => {
            const isSelected = selectedOption?.text === option.text;
            const showCorrect = showFeedback && option.correct;
            const showIncorrect = showFeedback && isSelected && !option.correct;

            // Determine card variant based on state
            let cardVariant: 'outline' | 'filled' = 'outline';
            let borderColor = theme.colors.border.medium;

            if (showCorrect) {
              cardVariant = 'filled';
              borderColor = theme.colors.semantic.success as any;
            } else if (showIncorrect) {
              cardVariant = 'filled';
              borderColor = theme.colors.semantic.error as any;
            } else if (isSelected) {
              borderColor = theme.colors.primary[500] as any;
            }

            // Use a combination of question ID, sub-question index, and option text for unique key
            const optionKey = `${currentQuestion.id}-${currentQuestionIndex}-${option.text}`;

            return (
              <Card
                key={optionKey}
                variant={cardVariant}
                radius="none"
                padding={4}
                style={[
                  styles.optionCard,
                  { borderColor },
                  (showCorrect || showIncorrect || isSelected) && styles.optionCardSelected,
                ]}
                onTouchEnd={() => !showFeedback && handleOptionPress(option)}
              >
                <BodyMD
                  style={[
                    styles.optionText,
                    (showCorrect || showIncorrect || isSelected) && styles.optionTextSelected,
                  ]}
                >
                  {option.text}
                </BodyMD>
              </Card>
            );
          })}
        </View>

        {/* Immediate feedback panel */}
        {showFeedback && selectedOption && (
          <Card
            variant="filled"
            radius="none"
            padding={4}
            style={[
              styles.feedbackCard,
              selectedOption.correct ? styles.correctFeedback : styles.incorrectFeedback,
            ]}
          >
            <H3 style={styles.feedbackTitle}>
              {selectedOption.correct ? 'CORRECT' : 'INCORRECT'}
            </H3>
            <BodyMD style={styles.feedbackText}>
              {selectedOption.explanation}
            </BodyMD>
          </Card>
        )}
      </ScrollView>

      {/* Action button */}
      <View style={styles.buttonContainer}>
        {!showFeedback ? (
          <PrimaryButton
            size="lg"
            fullWidth
            disabled={!selectedOption}
            onPress={() => selectedOption && handleSubmit()}
            style={!selectedOption && styles.disabledButton}
          >
            SUBMIT ANSWER
          </PrimaryButton>
        ) : (
          <PrimaryButton
            size="lg"
            fullWidth
            onPress={handleNext}
          >
            {currentQuizStep < totalQuizSteps ? 'NEXT STEP' : 'SEE RESULTS'}
          </PrimaryButton>
        )}
      </View>

      {/* Minimal close button */}
      <GhostButton
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        ✕
      </GhostButton>
    </Container>
  );
}

const styles = StyleSheet.create({
  // Progress indicator - thin line at top
  progressIndicator: {
    paddingHorizontal: theme.spacing[6], // 24px
    paddingTop: theme.spacing[6], // 24px
    paddingBottom: theme.spacing[3], // 12px
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  progressBar: {
    height: 2,
    backgroundColor: theme.colors.primary[500],
    marginBottom: theme.spacing[2], // 8px
  },
  progressText: {
    textAlign: 'right',
    opacity: 0.7,
  },

  // Content area
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing[6], // 24px
    paddingBottom: 80, // Extra padding for button
  },

  // Question text - large and heavy
  questionText: {
    marginBottom: theme.spacing[6], // 24px
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subQuestionPrompt: {
    marginBottom: theme.spacing[8], // 40px
    fontWeight: '500',
  },

  // Options - large touch targets with thick borders
  optionsContainer: {
    marginBottom: theme.spacing[8], // 40px
    gap: theme.spacing[3], // 12px gap between options
  },
  optionCard: {
    borderWidth: theme.spacing.borderWidth.medium, // Thick borders (2px)
    minHeight: 72, // Large touch target
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderWidth: theme.spacing.borderWidth.thick, // Even thicker when selected (3px)
  },
  optionText: {
    fontWeight: '400',
  },
  optionTextSelected: {
    fontWeight: '600',
  },

  // Feedback card
  feedbackCard: {
    marginBottom: theme.spacing[8], // 40px
    borderLeftWidth: 4,
  },
  correctFeedback: {
    borderLeftColor: theme.colors.semantic.success,
    backgroundColor: `${theme.colors.semantic.success}10`, // 10% opacity
  },
  incorrectFeedback: {
    borderLeftColor: theme.colors.semantic.error,
    backgroundColor: `${theme.colors.semantic.error}10`, // 10% opacity
  },
  feedbackTitle: {
    marginBottom: theme.spacing[2], // 8px
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  feedbackText: {
    lineHeight: 24,
  },

  // Button container
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing[6], // 24px
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Close button
  closeButton: {
    position: 'absolute',
    top: theme.spacing[7], // 32px from top (accounting for safe area)
    right: theme.spacing[6], // 24px from right
    zIndex: 10,
    opacity: 0.7,
  },
});

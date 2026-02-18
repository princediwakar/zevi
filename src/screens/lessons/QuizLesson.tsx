import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Lesson, QuizContent, QuizQuestion } from '../../types';
import { theme } from '../../theme';

interface QuizLessonProps {
  lesson: Lesson;
  onComplete: (score: number, xp: number) => void;
  onError: (error: string) => void;
}

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
// ============================================

const QuizLesson: React.FC<QuizLessonProps> = ({ lesson, onComplete, onError }) => {
  const content = lesson.content.quiz_content as QuizContent;

  // Guard against missing or empty content
  if (!content || !content.questions || content.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz questions available</Text>
      </View>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(content.questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion: QuizQuestion = content.questions[currentQuestionIndex] || content.questions[0];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults || submitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < content.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (submitted) return;

    // Calculate score
    let correctCount = 0;
    content.questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected !== -1 && q.correct_answer === selected) {
        correctCount++;
      }
    });

    const calculatedScore = correctCount;
    setScore(calculatedScore);
    setShowResults(true);
    setSubmitted(true);

    // Check if passed (8/10)
    const passed = calculatedScore >= content.passing_score;

    if (passed) {
      Alert.alert('Quiz Passed!', `You scored ${calculatedScore}/${content.questions.length}. Next unit unlocked.`);
    } else {
      Alert.alert('Quiz Failed', `You scored ${calculatedScore}/${content.questions.length}. Need ${content.passing_score} to pass.`);
    }

    // Notify parent component
    const xpEarned = passed ? lesson.xp_reward : 0;
    onComplete(calculatedScore, xpEarned);
  };

  const renderQuestion = () => {
    const question = content.questions[currentQuestionIndex];
    const selected = selectedAnswers[currentQuestionIndex];

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.text}
        </Text>

        <View style={styles.optionsContainer}>
          {question.options?.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = index === question.correct_answer;
            const showCorrectness = showResults;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: showCorrectness && isCorrect
                      ? theme.colors.semantic.success + '20'
                      : isSelected
                      ? theme.colors.surface.secondary
                      : theme.colors.background,
                    borderColor: showCorrectness && isCorrect
                      ? theme.colors.semantic.success
                      : isSelected
                      ? theme.colors.text.primary
                      : theme.colors.text.primary,
                  },
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResults}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: showCorrectness && isCorrect
                        ? theme.colors.semantic.success
                        : isSelected
                        ? theme.colors.text.primary
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
                {showCorrectness && isCorrect && (
                  <View style={styles.resultIndicator}>
                    <Text style={styles.resultText}>✓</Text>
                  </View>
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <View style={styles.resultIndicator}>
                    <Text style={styles.resultTextError}>✗</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderProgress = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            QUESTION {currentQuestionIndex + 1} OF {content.questions.length}
          </Text>
          <Text style={styles.scoreText}>
            Score {score}/{content.questions.length} • Pass: {content.passing_score}
          </Text>
        </View>
        <View style={styles.progressBar}>
          {content.questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentQuestionIndex
                    ? theme.colors.text.primary
                    : theme.colors.neutral[300],
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Progress - Swiss bordered */}
      {renderProgress()}

      {/* Question */}
      <ScrollView style={styles.content}>
        {renderQuestion()}
      </ScrollView>

      {/* Navigation - Swiss bordered */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.navButtonText,
            currentQuestionIndex === 0 && styles.navButtonTextDisabled
          ]}>
            PREVIOUS
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < content.questions.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              selectedAnswers[currentQuestionIndex] === -1 && styles.navButtonDisabled
            ]}
            onPress={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.navButtonText,
              styles.navButtonTextPrimary
            ]}>
              NEXT
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              (selectedAnswers.some(answer => answer === -1) || submitted) && styles.navButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={selectedAnswers.some(answer => answer === -1) || submitted}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.navButtonText,
              styles.navButtonTextPrimary
            ]}>
              {submitted ? 'SUBMITTED' : 'SUBMIT QUIZ'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ============================================
// SWISS STYLE: Sharp edges, bold typography, no gradients
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: theme.swiss.layout.screenPadding,
  },
  
  // Header - Swiss bordered
  header: {
    padding: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderBottomWidth: theme.swiss.border.standard,
    borderBottomColor: theme.colors.text.primary,
  },
  headerText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  
  // Progress Container
  progressContainer: {
    padding: theme.spacing[3],
    borderBottomWidth: theme.swiss.border.standard,
    borderBottomColor: theme.colors.text.primary,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  progressText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  scoreText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  progressBar: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  progressDot: {
    width: 24,
    height: 4,
    borderRadius: 0,
  },
  
  // Content
  content: {
    flex: 1,
    padding: theme.spacing[3],
  },
  
  // Question
  questionContainer: {
    marginBottom: theme.spacing[6],
  },
  questionText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.swiss.layout.sectionGap,
    lineHeight: 30,
  },
  
  // Options
  optionsContainer: {
    gap: theme.spacing[3],
  },
  optionButton: {
    padding: theme.spacing[4],
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  optionText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  resultIndicator: {
    marginLeft: theme.spacing[2],
  },
  resultText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.semantic.success,
  },
  resultTextError: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.semantic.error,
  },
  
  // Navigation - Swiss bordered
  navigation: {
    flexDirection: 'row',
    padding: theme.spacing[3],
    gap: theme.spacing[3],
    borderTopWidth: theme.swiss.border.heavy,
    borderTopColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing[4],
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    backgroundColor: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
  },
  navButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  navButtonTextPrimary: {
    color: theme.colors.text.inverse,
  },
  navButtonTextDisabled: {
    color: theme.colors.text.secondary,
  },
});

export default QuizLesson;

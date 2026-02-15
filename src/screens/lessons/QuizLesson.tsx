import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Lesson, QuizContent, QuizQuestion } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface QuizLessonProps {
  lesson: Lesson;
  onComplete: (score: number, xp: number) => void;
  onError: (error: string) => void;
}

const QuizLesson: React.FC<QuizLessonProps> = ({ lesson, onComplete, onError }) => {
  const { theme } = useTheme();
  const content = lesson.content.quiz_content as QuizContent;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(content.questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion: QuizQuestion = content.questions[currentQuestionIndex];

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

    // Unlock next unit if passed
    if (passed) {
      // TODO: Implement unlocking logic
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
        <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
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
                      ? theme.colors.primary[100]
                      : theme.colors.surface.primary,
                    borderColor: showCorrectness && isCorrect
                      ? theme.colors.semantic.success
                      : isSelected
                      ? theme.colors.primary[500]
                      : theme.colors.border.light,
                  },
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResults}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: showCorrectness && isCorrect
                        ? theme.colors.semantic.success
                        : isSelected
                        ? theme.colors.primary[700]
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Text>

                {showResults && isCorrect && (
                  <View style={styles.resultIndicator}>
                    <CheckCircle size={20} color={theme.colors.semantic.success} />
                  </View>
                )}
                {showResults && isSelected && !isCorrect && (
                  <View style={styles.resultIndicator}>
                    <XCircle size={20} color={theme.colors.semantic.error} />
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
        <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
          Question {currentQuestionIndex + 1} of {content.questions.length}
        </Text>
        <View style={styles.progressBar}>
          {content.questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentQuestionIndex
                    ? theme.colors.primary[500]
                    : theme.colors.border.light,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text.primary }]}>
          Quiz: {lesson.name}
        </Text>
        <Text style={[styles.headerSubtext, { color: theme.colors.text.secondary }]}>
          Score {score}/{content.questions.length} • Pass: {content.passing_score}/{content.questions.length}
        </Text>
      </View>

      {/* Progress */}
      {renderProgress()}

      {/* Question */}
      <ScrollView style={styles.content}>
        {renderQuestion()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.light,
            },
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text.secondary }]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < content.questions.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.navButton,
              {
                backgroundColor: theme.colors.primary[500],
              },
            ]}
            onPress={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
          >
            <Text style={[styles.navButtonText, { color: theme.colors.text.inverse }]}>
              Next
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              {
                backgroundColor: submitted
                  ? theme.colors.semantic.success
                  : theme.colors.primary[500],
              },
            ]}
            onPress={handleSubmit}
            disabled={selectedAnswers.some(answer => answer === -1) || submitted}
          >
            <Text style={[styles.navButtonText, { color: theme.colors.text.inverse }]}>
              {submitted ? 'Submitted' : 'Submit Quiz'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 16,
    marginBottom: 12,
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  resultIndicator: {
    marginLeft: 8,
  },
  navigation: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizLesson;
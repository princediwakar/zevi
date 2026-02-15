import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { DrillContent } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface DrillLessonProps {
  content: DrillContent;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function DrillLesson({ content, onComplete, onError }: DrillLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const progress = ((currentQuestion + 1) / content.questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmitAnswer = () => {
    const correctOptions = new Set(content.questions[currentQuestion].correct_options);
    const isAnswerCorrect = selectedOptions.size === correctOptions.size &&
      [...selectedOptions].every(option => correctOptions.has(option));

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < content.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOptions(new Set());
        setShowResult(false);
      } else {
        // Lesson complete
        onComplete();
      }
    }, 2000);
  };

  const renderQuestion = () => {
    const question = content.questions[currentQuestion];

    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
          {question.text}
        </Text>

        <View style={styles.optionsContainer}>
          {Array.from(
            new Set([
              ...question.correct_options,
              ...question.incorrect_options,
            ])
          ).map((option, index) => {
            const isSelected = selectedOptions.has(option);
            const isCorrectOption = question.correct_options.includes(option);
            const showCorrectness = showResult;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      showCorrectness && isCorrectOption
                        ? theme.colors.semantic.success + '20'
                        : isSelected
                        ? theme.colors.primary[100]
                        : theme.colors.surface.primary,
                    borderColor:
                      showCorrectness && isCorrectOption
                        ? theme.colors.semantic.success
                        : isSelected
                        ? theme.colors.primary[500]
                        : theme.colors.border.light,
                  },
                ]}
                onPress={() => !showResult && handleOptionSelect(option)}
                disabled={showResult}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          showCorrectness && isCorrectOption
                            ? theme.colors.semantic.success
                            : isSelected
                            ? theme.colors.primary[700]
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                  {showResult && (
                    <View>
                      {isCorrectOption ? (
                        <CheckCircle size={20} color={theme.colors.semantic.success} />
                      ) : isSelected && (
                        <XCircle size={20} color={theme.colors.semantic.error} />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.feedbackContainer}>
            <Text
              style={[
                styles.feedbackText,
                {
                  color: isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error,
                },
              ]}
            >
              {isCorrect
                ? question.feedback.correct
                : question.feedback.incorrect}
            </Text>
          </View>
        )}

        {!showResult && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  selectedOptions.size > 0 ? theme.colors.primary[500] : theme.colors.primary[300],
              },
            ]}
            onPress={handleSubmitAnswer}
            disabled={selectedOptions.size === 0}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: theme.colors.primary[500] },
          ]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text.primary }]}>
          Drill: {content.focus_step}
        </Text>
        <Text style={[styles.headerSubtext, { color: theme.colors.text.secondary }]}>
          Question {currentQuestion + 1} of {content.questions.length}
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView style={styles.content}>
        {renderQuestion()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heartsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.backgroundPaper,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
  },
  header: {
    padding: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerText: {
    fontSize: theme.typography.heading.h3.fontSize,
    fontWeight: theme.typography.heading.h3.fontWeight,
    marginBottom: theme.spacing[1],
  },
  headerSubtext: {
    fontSize: theme.typography.body.lg.fontSize,
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
  },
  questionContainer: {
    gap: theme.spacing[5],
  },
  questionText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '600',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: theme.spacing[3],
  },
  optionButton: {
    padding: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.md,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  optionText: {
    fontSize: theme.typography.body.lg.fontSize,
    flex: 1,
    marginRight: theme.spacing[2],
  },
  feedbackContainer: {
    padding: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.sm,
    marginTop: theme.spacing[4],
  },
  feedbackText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '500',
    lineHeight: 24,
  },
  submitButton: {
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing[5],
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
});

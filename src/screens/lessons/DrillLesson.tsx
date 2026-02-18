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

// SWISS STYLE: Sharp edges, bold typography, high contrast

export function DrillLesson({ content, onComplete, onError }: DrillLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const totalQuestions = content.questions.length || 1;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

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
      if (currentQuestion < totalQuestions - 1) {
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

    // Get unique options
    const allOptions = Array.from(
      new Set([
        ...(question.correct_options || []),
        ...(question.incorrect_options || []),
      ])
    );

    return (
      <View style={styles.questionContainer}>
        {/* Question Code Box */}
        <View style={styles.questionCodeBox}>
          <Text style={styles.questionCodeText}>Q{currentQuestion + 1}</Text>
        </View>
        
        <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
          {question.text}
        </Text>

        {/* Options - Swiss bordered boxes */}
        <View style={styles.optionsContainer}>
          {allOptions.map((option, index) => {
            const isSelected = selectedOptions.has(option);
            const isCorrectOption = (question.correct_options || []).includes(option);
            const showCorrectness = showResult;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: showCorrectness && isCorrectOption
                      ? theme.colors.semantic.success + '10'
                      : isSelected
                      ? theme.colors.text.primary
                      : theme.colors.background,
                    borderColor: showCorrectness && isCorrectOption
                      ? theme.colors.semantic.success
                      : isSelected
                      ? theme.colors.text.primary
                      : theme.colors.text.primary,
                  },
                ]}
                onPress={() => !showResult && handleOptionSelect(option)}
                disabled={showResult}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  {/* Option letter */}
                  <View style={[
                    styles.optionLetter,
                    {
                      borderColor: isSelected ? theme.colors.background : theme.colors.text.primary,
                      backgroundColor: isSelected ? theme.colors.background : 'transparent',
                    }
                  ]}>
                    <Text style={[
                      styles.optionLetterText,
                      { color: isSelected ? theme.colors.text.primary : theme.colors.text.primary }
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected ? theme.colors.background : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                  
                  {showCorrectness && (
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

        {/* Feedback - Swiss bordered */}
        {showResult && (
          <View style={[
            styles.feedbackContainer,
            {
              borderColor: isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error,
              backgroundColor: isCorrect ? theme.colors.semantic.success + '10' : theme.colors.semantic.error + '10',
            }
          ]}>
            <Text
              style={[
                styles.feedbackTitle,
                {
                  color: isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error,
                },
              ]}
            >
              {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
            </Text>
            <Text
              style={[
                styles.feedbackText,
                {
                  color: theme.colors.text.primary,
                },
              ]}
            >
              {isCorrect
                ? question.feedback?.correct || 'Well done!'
                : question.feedback?.incorrect || 'Review this topic.'}
            </Text>
          </View>
        )}

        {/* Submit Button - Swiss bordered, filled */}
        {!showResult && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: selectedOptions.size > 0 
                  ? theme.colors.text.primary 
                  : theme.colors.neutral[300],
                borderColor: theme.colors.text.primary,
              },
            ]}
            onPress={handleSubmitAnswer}
            disabled={selectedOptions.size === 0}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.submitButtonText,
              { color: selectedOptions.size > 0 ? theme.colors.background : theme.colors.neutral[500] }
            ]}>SUBMIT</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Bar - Swiss heavy */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: theme.colors.text.primary },
          ]}
        />
      </View>

      {/* Header - Swiss bold */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text.primary }]}>
          {content.focus_step?.toUpperCase() || 'DRILL'}
        </Text>
        <Text style={[styles.headerSubtext, { color: theme.colors.text.secondary }]}>
          {currentQuestion + 1} / {totalQuestions}
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView style={styles.content}>
        {renderQuestion()}
      </ScrollView>
    </View>
  );
}

// SWISS STYLE: Sharp edges, bold typography, no gradients, high contrast
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.neutral[200],
  },
  progressFill: {
    height: '100%',
  },
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  headerText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  headerSubtext: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    marginTop: theme.spacing[1],
  },
  content: {
    flex: 1,
    padding: theme.swiss.layout.screenPadding,
  },
  questionContainer: {
    gap: theme.swiss.layout.sectionGap,
  },
  questionCodeBox: {
    width: 48,
    height: 48,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  questionCodeText: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
  },
  questionText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
  optionButton: {
    padding: theme.spacing[4],
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetterText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.bold,
  },
  optionText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    flex: 1,
    lineHeight: 22,
  },
  feedbackContainer: {
    padding: theme.swiss.layout.sectionGap,
    borderWidth: theme.swiss.border.standard,
    marginTop: theme.spacing[2],
  },
  feedbackTitle: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[2],
  },
  feedbackText: {
    fontSize: theme.swiss.fontSize.body,
    lineHeight: 22,
  },
  submitButton: {
    paddingVertical: theme.spacing[4],
    borderWidth: theme.swiss.border.heavy,
    alignItems: 'center',
    marginTop: theme.swiss.layout.elementGap,
  },
  submitButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
});

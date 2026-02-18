import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { usePracticeStore } from '../stores/practiceStore';
import { theme } from '../theme';

type QuizResultsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;
type QuizResultsRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
// ============================================

export default function QuizResultsScreen() {
  const navigation = useNavigation<QuizResultsNavigationProp>();
  const route = useRoute<QuizResultsRouteProp>();
  const sourceQuestionId = route.params?.sourceQuestionId;
  
  const { 
    quizAnswers, 
    calculateQuizScore, 
    resetPractice, 
    feedback, 
    currentMode, 
    currentQuestion,
    textAnswer 
  } = usePracticeStore();
  const [scoreData, setScoreData] = useState({ correct: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const score = calculateQuizScore();
    setScoreData(score);
  }, []);

  const handleContinue = () => {
    resetPractice();
    
    if (sourceQuestionId) {
      // For text practice from a question, go back to question detail
      navigation.navigate('QuestionDetail', { questionId: sourceQuestionId });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleTryAgain = () => {
    resetPractice();
    if (sourceQuestionId) {
      // Retry the same text practice question
      navigation.navigate('TextPractice', { questionId: sourceQuestionId });
    } else {
      navigation.navigate('MainTabs');
    }
  };
  
  const handleGoHome = () => {
    resetPractice();
    navigation.navigate('MainTabs');
  };

  const getScoreMessage = () => {
    if (scoreData.percentage >= 80) return 'EXCELLENT';
    if (scoreData.percentage >= 60) return 'GOOD JOB';
    return 'KEEP LEARNING';
  };

  const getScoreColor = () => {
    if (currentMode === 'text' && feedback) {
       if (feedback.score >= 8) return theme.colors.semantic.success;
       if (feedback.score >= 6) return theme.colors.semantic.warning;
       return theme.colors.semantic.error;
    }

    if (scoreData.percentage >= 80) return theme.colors.semantic.success;
    if (scoreData.percentage >= 60) return theme.colors.semantic.warning;
    return theme.colors.semantic.error;
  };

  return (
    <View style={styles.container}>
      {/* Swiss Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentMode === 'text' ? 'FEEDBACK' : 'QUIZ RESULTS'}</Text>
      </View>

      {/* Score Section - Swiss bordered */}
      <View style={styles.scoreContainer}>
        {currentMode === 'text' && feedback ? (
          <View style={styles.scoreContent}>
            <Text style={[styles.scorePercentage, { color: getScoreColor() }]}>
              {feedback.score}/10
            </Text>
            <Text style={styles.scoreLabel}>AI EVALUATION</Text>
            <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
              {feedback.score >= 8 ? 'EXCELLENT' : feedback.score >= 6 ? 'GOOD JOB' : 'KEEP PRACTICING'}
            </Text>
          </View>
        ) : (
          <View style={styles.scoreContent}>
            <Text style={[styles.scorePercentage, { color: getScoreColor() }]}>
              {scoreData.percentage}%
            </Text>
            <Text style={styles.scoreLabel}>
              {scoreData.correct} / {scoreData.total} CORRECT
            </Text>
            <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
              {getScoreMessage()}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {currentMode === 'text' && feedback ? (
          <View>
            {/* Strengths */}
            <Text style={styles.sectionLabel}>STRENGTHS</Text>
            <View style={styles.feedbackSection}>
              {feedback.strengths.map((point, i) => (
                <View key={`str-${i}`} style={styles.feedbackPoint}>
                  <Text style={styles.feedbackBullet}>+</Text>
                  <Text style={styles.feedbackText}>{point}</Text>
                </View>
              ))}
            </View>

            {/* Improvements */}
            <Text style={styles.sectionLabel}>IMPROVEMENTS</Text>
            <View style={styles.feedbackSection}>
              {feedback.improvements.map((point, i) => (
                <View key={`imp-${i}`} style={styles.feedbackPoint}>
                  <Text style={styles.feedbackBullet}>-</Text>
                  <Text style={styles.feedbackText}>{point}</Text>
                </View>
              ))}
            </View>

            {/* Expert Comparison */}
            <Text style={styles.sectionLabel}>EXPERT HIGHLIGHTS</Text>
            <View style={styles.expertCard}>
               {feedback.expertHighlights.map((point, i) => (
                <View key={`exp-${i}`} style={styles.feedbackPoint}>
                  <Text style={styles.feedbackBullet}>*</Text>
                  <Text style={styles.feedbackText}>{point}</Text>
                </View>
               ))}
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>DETAILED BREAKDOWN</Text>
        
            <View style={styles.resultsList}>
              {quizAnswers.map((answer, index) => (
                <View
                  key={`${answer.questionId}-${answer.subQuestionIndex}`}
                  style={[
                    styles.resultCard,
                    answer.isCorrect ? styles.correctCard : styles.incorrectCard
                  ]}
                >
                  <View style={styles.resultHeader}>
                    <Text style={styles.questionNumber}>
                      Q{index + 1}
                    </Text>
                    <Text style={[
                      styles.resultStatus,
                      { color: answer.isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error }
                    ]}>
                      {answer.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </Text>
                  </View>
                  
                  <Text style={styles.questionText} numberOfLines={2}>
                    {answer.questionText}
                  </Text>
                  
                  <View style={styles.subQuestionContainer}>
                    <Text style={styles.subQuestionPrompt}>
                      {answer.subQuestionPrompt}
                    </Text>
                  </View>
                  
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>SELECTED:</Text>
                    <Text style={styles.selectedAnswer}>
                      {answer.selectedOptionText}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Text Mode Answer Review */}
        {currentMode === 'text' && (
           <View style={styles.answerReviewSection}>
             <Text style={styles.sectionLabel}>YOUR ANSWER</Text>
             <View style={styles.answerReviewCard}>
               <Text style={styles.answerReviewText}>{textAnswer}</Text>
             </View>
           </View>
        )}

        {/* Action Buttons - Swiss bordered */}
        <View style={styles.actions}>
          {currentMode === 'text' && sourceQuestionId ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  VIEW EXPERT ANSWER
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleTryAgain}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  PRACTICE AGAIN
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {sourceQuestionId ? 'VIEW QUESTION' : 'CONTINUE'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleTryAgain}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  {sourceQuestionId ? 'TRY AGAIN' : 'TRY ANOTHER QUIZ'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
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
  
  // Header - Swiss bold bar
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  
  // Score Container
  scoreContainer: {
    borderBottomWidth: theme.swiss.border.standard,
    borderBottomColor: theme.colors.text.primary,
    padding: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.sectionGap,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: 64,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: -2,
    marginBottom: theme.spacing[2],
  },
  scoreLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[2],
  },
  scoreMessage: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentInner: {
    padding: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.sectionGap + theme.spacing[8],
  },
  
  // Section Label
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  
  // Feedback Section
  feedbackSection: {
    marginBottom: theme.spacing[4],
  },
  feedbackPoint: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  feedbackBullet: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[2],
    width: 16,
  },
  feedbackText: {
    flex: 1,
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  
  // Expert Card - Swiss bordered
  expertCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  
  // Results List
  resultsList: {
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  resultCard: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
    borderLeftWidth: 4,
  },
  correctCard: {
    borderLeftColor: theme.colors.semantic.success,
  },
  incorrectCard: {
    borderLeftColor: theme.colors.semantic.error,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  questionNumber: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  resultStatus: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  questionText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  subQuestionContainer: {
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.secondary,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  subQuestionPrompt: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  answerLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing[2],
  },
  selectedAnswer: {
    flex: 1,
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  
  // Answer Review
  answerReviewSection: {
    marginTop: theme.spacing[4],
  },
  answerReviewCard: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
  },
  answerReviewText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  
  // Actions
  actions: {
    gap: theme.spacing[3],
    marginTop: theme.swiss.layout.sectionGap,
  },
  primaryButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  secondaryButton: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
});

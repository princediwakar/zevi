import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { usePracticeStore } from '../stores/practiceStore';
import { Container, H1, H2, H3, BodyLG, BodyMD, BodySM, Card, PrimaryButton, OutlineButton, LabelSM } from '../components/ui';
import { theme } from '../theme';

type QuizResultsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;
type QuizResultsRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;

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
    
    // If we came from a question detail screen, go back to it to start answering
    if (sourceQuestionId) {
      navigation.navigate('QuestionDetail', { questionId: sourceQuestionId });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleTryAgain = () => {
    resetPractice();
    // If we have a source question, try another quiz for the same question
    if (sourceQuestionId) {
      navigation.navigate('QuickQuiz', { sourceQuestionId });
    } else {
      navigation.navigate('QuickQuiz');
    }
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
    return theme.colors.semantic.error; // Or a neutral color
  };

  return (
    <Container variant="screen" padding="none" safeArea scrollable>
      <View style={styles.header}>
        <H1 style={styles.title}>{currentMode === 'text' ? 'FEEDBACK' : 'QUIZ RESULTS'}</H1>
        
        {currentMode === 'text' && feedback ? (
          <View style={styles.scoreContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
              <H1 style={[styles.scorePercentage, { color: getScoreColor() }]}>
                {feedback.score}/10
              </H1>
            </View>
            <H3 style={styles.scoreFraction}>
              AI EVALUATION
            </H3>
            <BodyLG style={styles.scoreMessage}>
              {feedback.score >= 8 ? 'EXCELLENT' : feedback.score >= 6 ? 'GOOD JOB' : 'KEEP PRACTICING'}
            </BodyLG>
          </View>
        ) : (
          <View style={styles.scoreContainer}>
            <H1 style={[styles.scorePercentage, { color: getScoreColor() }]}>
              {scoreData.percentage}%
            </H1>
            <H3 style={styles.scoreFraction}>
              {scoreData.correct} / {scoreData.total} CORRECT
            </H3>
            <BodyLG style={styles.scoreMessage}>{getScoreMessage()}</BodyLG>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {currentMode === 'text' && feedback ? (
          <View>
            {/* Strengths */}
            <LabelSM style={styles.sectionLabel}>STRENGTHS</LabelSM>
            <View style={styles.feedbackSection}>
              {feedback.strengths.map((point, i) => (
                <View key={`str-${i}`} style={styles.feedbackPoint}>
                  <LabelSM color="success">✓</LabelSM>
                  <BodyMD>{point}</BodyMD>
                </View>
              ))}
            </View>

            {/* Improvements */}
            <LabelSM style={styles.sectionLabel}>IMPROVEMENTS</LabelSM>
            <View style={styles.feedbackSection}>
              {feedback.improvements.map((point, i) => (
                <View key={`imp-${i}`} style={styles.feedbackPoint}>
                  <LabelSM color="warning">⚠</LabelSM>
                  <BodyMD>{point}</BodyMD>
                </View>
              ))}
            </View>

            {/* Expert Comparison */}
            <LabelSM style={styles.sectionLabel}>EXPERT HIGHLIGHTS</LabelSM>
            <Card variant="filled" padding={5} style={styles.expertCard}>
               {feedback.expertHighlights.map((point, i) => (
                <View key={`exp-${i}`} style={styles.feedbackPoint}>
                  <LabelSM color="primary">★</LabelSM>
                  <BodyMD>{point}</BodyMD>
                </View>
              ))}
               <OutlineButton 
                size="sm" 
                style={{ marginTop: 12 }}
                onPress={() => {
                   // Navigate to Question Detail to see full expert answer? 
                   // Or expand here. For now, just a placeholder action.
                }}
               >
                 VIEW FULL EXPERT ANSWER
               </OutlineButton>
            </Card>

          </View>
        ) : (
          <>
            <LabelSM style={styles.sectionLabel}>DETAILED BREAKDOWN</LabelSM>
        
        <View style={styles.resultsList}>
          {quizAnswers.map((answer, index) => (
            <Card
              key={`${answer.questionId}-${answer.subQuestionIndex}`}
              variant="outline"
              padding={5} // 20px
              radius="none"
              style={[
                styles.resultCard,
                answer.isCorrect ? styles.correctCard : styles.incorrectCard
              ]}
            >
              <View style={styles.resultHeader}>
                <LabelSM color="secondary" style={styles.questionNumber}>
                  QUESTION {index + 1}
                </LabelSM>
                <LabelSM 
                  style={{ 
                    color: answer.isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error
                  }}
                >
                  {answer.isCorrect ? 'CORRECT' : 'INCORRECT'}
                </LabelSM>
              </View>
              
              <BodyMD style={styles.questionText} numberOfLines={2}>
                {answer.questionText}
              </BodyMD>
              
              <View style={styles.subQuestionContainer}>
                 <BodySM color="secondary" style={styles.subQuestionPrompt}>
                  {answer.subQuestionPrompt}
                </BodySM>
              </View>
              
              <View style={styles.answerContainer}>
                <LabelSM color="secondary" style={{ marginBottom: 4 }}>SELECTED:</LabelSM>
                <BodyMD style={styles.selectedAnswer}>
                  {answer.selectedOptionText}
                </BodyMD>
              </View>
            </Card>
          ))}
        </View>

      </>
    )}

        {/* Text Mode Answer Review (Collapsed by default maybe?) */}
        {currentMode === 'text' && (
           <View style={{ marginTop: 24, marginBottom: 24 }}>
             <LabelSM style={styles.sectionLabel}>YOUR ANSWER</LabelSM>
             <Card variant="outline" padding={4}>
               <BodyMD color="secondary">{textAnswer}</BodyMD>
             </Card>
           </View>
        )}

        <View style={styles.actions}>
          <PrimaryButton
            size="lg"
            fullWidth
            onPress={handleContinue}
            style={styles.primaryButton}
          >
            {sourceQuestionId ? 'START ANSWERING' : 'CONTINUE TO APP'}
          </PrimaryButton>
          
          <OutlineButton
            size="lg"
            fullWidth
            onPress={handleTryAgain}
          >
            {sourceQuestionId ? 'TRY AGAIN' : 'TRY ANOTHER QUIZ'}
          </OutlineButton>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing[6], // 24px
    paddingBottom: theme.spacing[10], // 64px
    backgroundColor: theme.colors.surface.secondary,
    borderBottomWidth: theme.spacing.borderWidth.thin,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    marginBottom: theme.spacing[8], // 40px
    letterSpacing: -1,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scorePercentage: {
    fontSize: 80, // Massive typography
    lineHeight: 80,
    marginBottom: theme.spacing[4], // 16px
    letterSpacing: -4,
  },
  scoreFraction: {
    marginBottom: theme.spacing[2], // 8px
  },
  scoreMessage: {
    opacity: 0.7,
  },
  content: {
    padding: theme.spacing[6], // 24px
  },
  sectionLabel: {
    marginBottom: theme.spacing[4], // 16px
    opacity: 0.5,
  },
  resultsList: {
    gap: theme.spacing[4], // 16px
    marginBottom: theme.spacing[8], // 40px
  },
  resultCard: {
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
    marginBottom: theme.spacing[2], // 8px
  },
  questionNumber: {
    opacity: 0.7,
  },
  questionText: {
    fontWeight: '600',
    marginBottom: theme.spacing[3], // 12px
  },
  subQuestionContainer: {
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.secondary,
    marginBottom: theme.spacing[3],
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border.medium,
  },
  subQuestionPrompt: {
    fontStyle: 'italic',
  },
  answerContainer: {
    marginTop: theme.spacing[1],
  },
  selectedAnswer: {
    fontWeight: '500',
  },
  actions: {
    gap: theme.spacing[3], // 12px
    paddingBottom: theme.spacing[8], // 40px
  },
  primaryButton: {
    marginBottom: theme.spacing[3], // 12px
  },
  feedbackSection: {
    marginBottom: theme.spacing[6],
    gap: theme.spacing[3],
  },
  feedbackPoint: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  expertCard: {
    backgroundColor: theme.colors.surface.secondary,
  }
});

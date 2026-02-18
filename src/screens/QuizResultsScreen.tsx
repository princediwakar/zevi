import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { usePracticeStore } from '../stores/practiceStore';
import { theme } from '../theme';

type QuizResultsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;
type QuizResultsRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;

// ============================================
// SWISS DESIGN: Dual-mode screen
//   • Text/Voice mode  → AI FEEDBACK
//   • MCQ / Quiz mode  → QUIZ RESULTS
// ============================================

export default function QuizResultsScreen() {
  const navigation = useNavigation<QuizResultsNavigationProp>();
  const route = useRoute<QuizResultsRouteProp>();
  const insets = useSafeAreaInsets();
  const sourceQuestionId = route.params?.sourceQuestionId;

  const {
    quizAnswers,
    calculateQuizScore,
    resetPractice,
    feedback,
    currentMode,
    currentQuestion,
    textAnswer,
  } = usePracticeStore();

  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0, percentage: 0 });

  useEffect(() => {
    if (currentMode !== 'text') {
      setQuizScore(calculateQuizScore());
    }
  }, []);

  const isTextMode = currentMode === 'text';

  // ── Navigation helpers ──────────────────────────────────────────────────
  const goBack = () => {
    resetPractice();
    if (sourceQuestionId) {
      navigation.navigate('QuestionDetail', { questionId: sourceQuestionId });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const tryAgain = () => {
    resetPractice();
    if (sourceQuestionId) {
      navigation.navigate('TextPractice', { questionId: sourceQuestionId });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const goHome = () => {
    resetPractice();
    navigation.navigate('MainTabs');
  };

  // ── Score colour ────────────────────────────────────────────────────────
  const scoreColor = () => {
    if (isTextMode && feedback) {
      if (feedback.score >= 8) return theme.colors.semantic.success;
      if (feedback.score >= 5) return theme.colors.semantic.warning;
      return theme.colors.semantic.error;
    }
    if (quizScore.percentage >= 80) return theme.colors.semantic.success;
    if (quizScore.percentage >= 60) return theme.colors.semantic.warning;
    return theme.colors.semantic.error;
  };

  // ── Render: AI FEEDBACK (text / voice practice) ─────────────────────────
  if (isTextMode) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI FEEDBACK</Text>
          <TouchableOpacity onPress={goHome} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner}>

          {feedback ? (
            <>
              {/* Score block */}
              <View style={styles.scoreBlock}>
                <Text style={[styles.scoreNum, { color: scoreColor() }]}>
                  {feedback.score}
                </Text>
                <Text style={styles.scoreOutOf}>/10</Text>
              </View>
              <Text style={[styles.scoreVerdict, { color: scoreColor() }]}>
                {feedback.score >= 8 ? 'EXCELLENT' : feedback.score >= 5 ? 'SOLID WORK' : 'NEEDS WORK'}
              </Text>

              <View style={styles.divider} />

              {/* Strengths */}
              {feedback.strengths?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>WHAT WORKED</Text>
                  {feedback.strengths.map((pt, i) => (
                    <View key={i} style={styles.feedbackRow}>
                      <Text style={[styles.bullet, { color: theme.colors.semantic.success }]}>+</Text>
                      <Text style={styles.feedbackText}>{pt}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Improvements */}
              {feedback.improvements?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>IMPROVE ON</Text>
                  {feedback.improvements.map((pt, i) => (
                    <View key={i} style={styles.feedbackRow}>
                      <Text style={[styles.bullet, { color: theme.colors.semantic.warning }]}>△</Text>
                      <Text style={styles.feedbackText}>{pt}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Expert Highlights */}
              {feedback.expertHighlights?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>EXPERT APPROACH</Text>
                  <View style={styles.expertCard}>
                    {feedback.expertHighlights.map((pt, i) => (
                      <View key={i} style={styles.feedbackRow}>
                        <Text style={styles.bullet}>→</Text>
                        <Text style={styles.feedbackText}>{pt}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Recommended Practice */}
              {feedback.recommendedPractice && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>NEXT STEP</Text>
                  <View style={styles.nextStepCard}>
                    <Text style={styles.nextStepText}>{feedback.recommendedPractice}</Text>
                  </View>
                </View>
              )}

              {/* Your Answer */}
              {textAnswer ? (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>YOUR ANSWER</Text>
                  <View style={styles.answerCard}>
                    <Text style={styles.answerText}>{textAnswer}</Text>
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            /* Feedback unavailable */
            <View style={styles.noFeedbackBlock}>
              <Text style={styles.noFeedbackTitle}>ANSWER SAVED</Text>
              <Text style={styles.noFeedbackSub}>
                AI feedback could not be generated, but your answer has been saved.
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {sourceQuestionId ? (
              <TouchableOpacity style={styles.primaryBtn} onPress={tryAgain}>
                <Text style={styles.primaryBtnText}>PRACTICE AGAIN</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.secondaryBtn, !sourceQuestionId && styles.primaryBtn]}
              onPress={goHome}
            >
              <Text style={[styles.secondaryBtnText, !sourceQuestionId && styles.primaryBtnText]}>
                BACK TO HOME
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Render: QUIZ RESULTS (MCQ mode) ────────────────────────────────────
  const verdictLabel =
    quizScore.percentage >= 80 ? 'EXCELLENT' :
    quizScore.percentage >= 60 ? 'GOOD JOB' :
    'KEEP LEARNING';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QUIZ RESULTS</Text>
        <TouchableOpacity onPress={goHome} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner}>
        {/* Score block */}
        <View style={styles.scoreBlock}>
          <Text style={[styles.scoreNum, { color: scoreColor() }]}>
            {quizScore.percentage}
          </Text>
          <Text style={styles.scoreOutOf}>%</Text>
        </View>
        <Text style={styles.scoreCorrect}>
          {quizScore.correct} / {quizScore.total} CORRECT
        </Text>
        <Text style={[styles.scoreVerdict, { color: scoreColor() }]}>
          {verdictLabel}
        </Text>

        <View style={styles.divider} />

        {/* Answer list */}
        <Text style={styles.sectionLabel}>BREAKDOWN</Text>
        <View style={styles.quizList}>
          {quizAnswers.map((ans, i) => (
            <View
              key={`${ans.questionId}-${ans.subQuestionIndex}`}
              style={[
                styles.quizCard,
                ans.isCorrect ? styles.quizCardCorrect : styles.quizCardWrong,
              ]}
            >
              <View style={styles.quizCardHeader}>
                <Text style={styles.quizCardNum}>Q{i + 1}</Text>
                <Text
                  style={[
                    styles.quizCardStatus,
                    { color: ans.isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error },
                  ]}
                >
                  {ans.isCorrect ? 'CORRECT' : 'WRONG'}
                </Text>
              </View>
              <Text style={styles.quizCardPrompt} numberOfLines={2}>
                {ans.subQuestionPrompt || ans.questionText}
              </Text>
              <Text style={styles.quizCardAnswer}>→ {ans.selectedOptionText}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={goBack}>
            <Text style={styles.primaryBtnText}>
              {sourceQuestionId ? 'VIEW QUESTION' : 'CONTINUE'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={tryAgain}>
            <Text style={styles.secondaryBtnText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES — Swiss: bold type, black borders, white bg
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  closeBtn: {
    padding: theme.spacing[2],
  },
  closeBtnText: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontWeight: theme.swiss.fontWeight.bold,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollInner: {
    padding: theme.swiss.layout.screenPadding,
    paddingBottom: theme.spacing[12],
  },

  // Score
  scoreBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[2],
  },
  scoreNum: {
    fontSize: 80,
    fontWeight: theme.swiss.fontWeight.black,
    lineHeight: 80,
    letterSpacing: -4,
  },
  scoreOutOf: {
    fontSize: 28,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.secondary,
    marginBottom: 10,
    marginLeft: 4,
  },
  scoreCorrect: {
    textAlign: 'center',
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[2],
  },
  scoreVerdict: {
    textAlign: 'center',
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
    marginBottom: theme.spacing[6],
  },

  // Divider
  divider: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginBottom: theme.swiss.layout.sectionGap,
  },

  // Sections
  section: {
    marginBottom: theme.swiss.layout.sectionGap,
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },

  // Feedback rows
  feedbackRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
    alignItems: 'flex-start',
  },
  bullet: {
    width: 20,
    fontSize: 16,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  feedbackText: {
    flex: 1,
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },

  // Expert card
  expertCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
  },

  // Next step card
  nextStepCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.text.primary,
    paddingLeft: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  nextStepText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.primary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Answer card
  answerCard: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.secondary,
  },
  answerText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },

  // No feedback
  noFeedbackBlock: {
    paddingVertical: theme.spacing[12],
    alignItems: 'center',
  },
  noFeedbackTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  noFeedbackSub: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Quiz cards
  quizList: {
    gap: theme.spacing[3],
    marginBottom: theme.swiss.layout.sectionGap,
  },
  quizCard: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    borderLeftWidth: 4,
    padding: theme.spacing[4],
  },
  quizCardCorrect: {
    borderLeftColor: theme.colors.semantic.success,
  },
  quizCardWrong: {
    borderLeftColor: theme.colors.semantic.error,
  },
  quizCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  quizCardNum: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  quizCardStatus: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  quizCardPrompt: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    lineHeight: 20,
  },
  quizCardAnswer: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
  },

  // Actions
  actions: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[4],
  },
  primaryBtn: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  secondaryBtn: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
});

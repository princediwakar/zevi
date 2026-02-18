import React, { useEffect, useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useQuestionsStore } from '../stores/questionsStore';
import { usePracticeStore } from '../stores/practiceStore';
import { useAuth } from '../hooks/useAuth';
import { Question } from '../types';
import * as practiceService from '../services/practiceService';
import { theme } from '../theme';

type QuestionDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuestionDetail'>;
type QuestionDetailScreenRouteProp = RouteProp<RootStackParamList, 'QuestionDetail'>;

// SWISS DESIGN: Sharp edges, bold typography
// Using centralized theme tokens for consistency
export default function QuestionDetailScreen() {
  const navigation = useNavigation<QuestionDetailScreenNavigationProp>();
  const route = useRoute<QuestionDetailScreenRouteProp>();
  const { questionId } = route.params;

  const { questions, getQuestionById, getRelatedQuestions } = useQuestionsStore();
  const { startPractice, loading: practiceLoading } = usePracticeStore();
  const { user } = useAuth();
  
  const [question, setQuestion] = useState<Question | null>(
    questions.find((q) => q.id === questionId) || null
  );
  const [relatedQuestions, setRelatedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(!question);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [checkingCompletion, setCheckingCompletion] = useState(true);

  const loadData = useCallback(async () => {
      if (!questionId) return;
      
      let currentQuestion = question;
      if (!currentQuestion) {
        setLoading(true);
        currentQuestion = await getQuestionById(questionId);
        if (currentQuestion) setQuestion(currentQuestion);
        setLoading(false);
      }

      if (currentQuestion) {
          const related = await getRelatedQuestions(currentQuestion.id, currentQuestion.category);
          setRelatedQuestions(related);

          const userId = user?.id;
          if (userId) {
              try {
                  setCheckingCompletion(true);
                  const sessions = await practiceService.getQuestionSessions(userId, currentQuestion.id);
                  const completedFn = sessions.some(s => s.completed);
                  setIsCompleted(completedFn);
              } catch (e) {
                  logger.error("Failed to check completion", e);
              } finally {
                  setCheckingCompletion(false);
              }
          }
      }
  }, [questionId, user, getQuestionById, getRelatedQuestions]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.text.primary} />
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>NOT FOUND</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleStartPractice = async (mode: 'mcq' | 'text') => {
    // Require login to practice
    if (!user) {
      Alert.alert('LOGIN REQUIRED', 'Please sign in to practice.');
      navigation.navigate('Auth');
      return;
    }

    if (!question || !question.id) {
      logger.error('Invalid question - cannot start practice');
      return;
    }
    
    try {
      await startPractice(question, mode, user.id);
      
      if (mode === 'mcq') {
         navigation.navigate('QuickQuiz', { questions: [question], sourceQuestionId: question.id });
      } else {
         navigation.navigate('TextPractice', { questionId: question.id });
      }
    } catch (error) {
      logger.error('Failed to start practice session:', error);
      Alert.alert('ERROR', 'Failed to start practice. Please try again.');
    }
  };

  const navigateToQuestion = (q: Question) => {
      navigation.push('QuestionDetail', { questionId: q.id });
  };

  return (
    <View style={styles.container}>
      {/* Swiss Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Metadata - bordered boxes */}
        <View style={styles.metaRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaText}>
              {question.category.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaText}>{String(question.difficulty).toUpperCase()}</Text>
          </View>
          {question.company && (
            <View style={styles.metaBox}>
              <Text style={styles.metaText}>{question.company.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Question Text - bold */}
        <Text style={styles.questionText}>
          {question.question_text}
        </Text>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Hint Section */}
        <View style={styles.section}>
          {showHint ? (
            <View style={styles.hintBox}>
              <View style={styles.hintHeader}>
                <Text style={styles.sectionLabel}>HINT</Text>
                <TouchableOpacity onPress={() => setShowHint(false)}>
                  <Text style={styles.hintHide}>HIDE</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.hintText}>
                {question.framework_hint || 'No hint available.'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.showHintButton}
              onPress={() => setShowHint(true)}
            >
              <Text style={styles.showHintText}>SHOW HINT</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Expert Answer */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ANSWER</Text>
          
          {isCompleted || checkingCompletion ? (
            question.expert_answer ? (
              <View style={styles.answerBox}>
                <Text style={styles.answerText}>{question.expert_answer}</Text>
              </View>
            ) : (
              <Text style={styles.noAnswer}>No answer available</Text>
            )
          ) : (
            <View style={styles.lockedBox}>
              <Text style={styles.lockedText}>COMPLETE TO UNLOCK</Text>
            </View>
          )}
        </View>

        {/* Related Questions
        {relatedQuestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RELATED</Text>
            {relatedQuestions.slice(0, 3).map(q => (
              <TouchableOpacity
                key={q.id}
                style={styles.relatedRow}
                onPress={() => navigateToQuestion(q)}
              >
                <Text style={styles.relatedText} numberOfLines={2}>
                  {q.question_text}
                </Text>
                <Text style={styles.relatedArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )} */}

      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => handleStartPractice('text')}
          disabled={practiceLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Error
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.swiss.layout.screenPadding,
  },
  errorTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.swiss.layout.elementGap,
  },
  errorButton: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  errorButtonText: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Main container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  
  // Separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.swiss.layout.sectionGap,
  },
  
  // Meta row
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  metaBox: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1] + 1,
  },
  metaText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // Question text
  questionText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: 32,
    marginBottom: theme.spacing[2],
  },
  
  // Section
  section: {
    marginBottom: theme.swiss.layout.sectionGap,
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[3],
  },
  
  // Hint box
  hintBox: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
  },
  hintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  hintHide: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  hintText: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  
  // Show hint button
  showHintButton: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
  },
  showHintText: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // Answer box
  answerBox: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
  },
  answerText: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  noAnswer: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.disabled,
    fontStyle: 'italic',
  },
  
  // Locked box
  lockedBox: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.border.light,
    padding: theme.swiss.layout.sectionGap,
    alignItems: 'center',
  },
  lockedText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.disabled,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Related questions
  relatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.border.light,
  },
  relatedText: {
    flex: 1,
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[4],
  },
  relatedArrow: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  
  // Footer
  footer: {
    padding: theme.swiss.layout.screenPadding,
    borderTopWidth: theme.swiss.border.heavy,
    borderTopColor: theme.colors.text.primary,
  },
  startButton: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[5] - 2,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide,
  },
});

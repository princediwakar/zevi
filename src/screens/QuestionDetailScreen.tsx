import React, { useEffect, useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
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

export default function QuestionDetailScreen() {
  const navigation = useNavigation<QuestionDetailScreenNavigationProp>();
  const route = useRoute<QuestionDetailScreenRouteProp>();
  const { questionId } = route.params;

  const { questions, getQuestionById, getRelatedQuestions } = useQuestionsStore();
  const { startPractice, loading: practiceLoading } = usePracticeStore();
  const { user, guestId, isGuest } = useAuth();
  
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

          const userId = user?.id || guestId;
          if (userId) {
              try {
                  setCheckingCompletion(true);
                  const sessions = await practiceService.getQuestionSessions(userId, currentQuestion.id, isGuest);
                  const completedFn = sessions.some(s => s.completed);
                  setIsCompleted(completedFn);
              } catch (e) {
                  logger.error("Failed to check completion", e);
              } finally {
                  setCheckingCompletion(false);
              }
          }
      }
  }, [questionId, user, guestId, isGuest, getQuestionById, getRelatedQuestions]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
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
    const userId = user?.id || guestId;
    if (!userId) {
      logger.error('No user ID available');
      return;
    }

    if (!question || !question.id) {
      logger.error('Invalid question - cannot start practice');
      return;
    }
    
    try {
      await startPractice(question, mode, userId, isGuest);
      
      if (mode === 'mcq') {
         navigation.navigate('QuickQuiz', { questions: [question], sourceQuestionId: question.id });
      } else {
         navigation.navigate('TextPractice', { questionId: question.id });
      }
    } catch (error) {
      logger.error('Failed to start practice session:', error);
      if (isGuest) {
        if (mode === 'mcq') {
           navigation.navigate('QuickQuiz', { questions: [question], sourceQuestionId: question.id });
        } else {
           navigation.navigate('TextPractice', { questionId: question.id });
        }
      }
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

        {/* Related Questions */}
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
        )}

        <View style={styles.separator} />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 24,
  },
  errorButton: {
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  separator: {
    height: 3,
    backgroundColor: '#000000',
    marginVertical: 24,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaBox: {
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 32,
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 12,
  },
  hintBox: {
    borderWidth: 2,
    borderColor: '#000000',
    padding: 16,
  },
  hintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hintHide: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
  },
  showHintButton: {
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 12,
    alignItems: 'center',
  },
  showHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  answerBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 16,
  },
  answerText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 22,
  },
  noAnswer: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  lockedBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 24,
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 1,
  },
  relatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  relatedText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    marginRight: 16,
  },
  relatedArrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  footer: {
    padding: 24,
    borderTopWidth: 3,
    borderTopColor: '#000000',
  },
  startButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

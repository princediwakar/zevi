import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useQuestionsStore } from '../stores/questionsStore';
import { usePracticeStore } from '../stores/practiceStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import * as practiceService from '../services/practiceService';
import { theme } from '../theme';
import { VoiceRecorder } from '../components/VoiceRecorder';

type TextPracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TextPractice'>;
type TextPracticeScreenRouteProp = RouteProp<RootStackParamList, 'TextPractice'>;

interface PreviousAttempt {
  id: string;
  created_at: string;
  user_answer: string;
}

export default function TextPracticeScreen() {
  const navigation = useNavigation<TextPracticeScreenNavigationProp>();
  const route = useRoute<TextPracticeScreenRouteProp>();
  const { questionId } = route.params;

  const { getQuestionById } = useQuestionsStore();
  const {
    textAnswer = '',
    setTextAnswer,
    saveDraft,
    loadDraft,
    submitAnswer,
    loading,
    resetPractice,
    startPractice,
  } = usePracticeStore();
  const { user } = useAuth();
  const { updateAfterCompletion } = useProgressStore();
  
  const [question, setQuestion] = useState<any>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [previousAttempts, setPreviousAttempts] = useState<PreviousAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  
  const loadDraftRef = useRef(loadDraft);
  loadDraftRef.current = loadDraft;
  
  const handleRecordingComplete = useCallback((audioUri: string, transcription: string) => {
    setTextAnswer(transcription);
  }, [setTextAnswer]);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const fetched = await getQuestionById(questionId);
        setQuestion(fetched);
        
        // Start practice session with 'text' mode
        if (fetched && user?.id) {
          await startPractice(fetched, 'text', user.id);
        }
      } catch (e) {
        console.error('Failed to load question:', e);
      } finally {
        setLoadingQuestion(false);
      }
    }
    loadQuestion();
  }, [questionId, getQuestionById, user?.id, startPractice]);

  useEffect(() => {
    async function loadAttempts() {
      if (!user?.id) {
        setLoadingAttempts(false);
        return;
      }
      
      try {
        const sessions = await practiceService.getQuestionSessions(user.id, questionId);
        const attempts = sessions
          .filter(s => s.completed && s.user_answer)
          .map(s => ({
            id: s.id,
            created_at: s.created_at,
            user_answer: typeof s.user_answer === 'string' ? s.user_answer : JSON.stringify(s.user_answer)
          }));
        setPreviousAttempts(attempts);
      } catch (e) {
        console.error('Failed to load previous attempts:', e);
      } finally {
        setLoadingAttempts(false);
      }
    }
    
    loadAttempts();
  }, [questionId, user]);

  useEffect(() => {
    const userId = user?.id;
    if (userId) {
      loadDraftRef.current(userId, questionId);
    }
  }, [questionId, user]);

  const handleSaveDraft = async () => {
    const userId = user?.id;
    if (userId) {
      const success = await saveDraft(userId);
      if (success) {
        Alert.alert('SAVED', 'Draft saved successfully');
      } else {
        Alert.alert('ERROR', 'Failed to save draft. Please try again.');
      }
    } else {
      Alert.alert('NOTICE', 'Sign in to save drafts');
    }
  };

  const handleSubmit = async () => {
    if (!textAnswer.trim() || textAnswer.length < 50) {
      Alert.alert('TOO SHORT', 'Please write a more detailed answer (min 50 chars) before submitting.');
      return;
    }

    const userId = user?.id;

    if (userId && question) {
      const sessionSubmitted = await submitAnswer(userId);

      if (sessionSubmitted) {
        await generateFeedbackAndComplete(userId);
      } else {
        Alert.alert('ERROR', 'Failed to submit answer. Please try again.');
      }
    }
  };

  const generateFeedbackAndComplete = async (userId: string) => {
    if (!question) return;

    try {
      const { generateFeedback } = usePracticeStore.getState();
      await generateFeedback(userId);

      const { error: feedbackError } = usePracticeStore.getState();

      if (feedbackError) {
        console.error('Feedback generation error:', feedbackError);
        resetPractice();
        navigation.navigate('QuizResults');
        return;
      }

      await updateAfterCompletion(userId, 'text', question.category);

      resetPractice();
      navigation.navigate('QuizResults');
    } catch (err) {
      console.error('Error generating feedback:', err);
      resetPractice();
      navigation.navigate('QuizResults');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loadingQuestion) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.text.primary} />
      </View>
    );
  }

  if (!question) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Question not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.errorButton}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border.light }]}>
        <TouchableOpacity onPress={handleSaveDraft}>
          <Text style={[styles.headerButton, { color: theme.colors.text.primary }]}>SAVE</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>PRACTICE</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerButton, { color: theme.colors.text.primary }]}>BACK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Question */}
        <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
          {question.question_text}
        </Text>

        {/* Hint Toggle */}
        <TouchableOpacity 
          style={[styles.hintToggle, { borderColor: theme.colors.border.light }]}
          onPress={() => setShowHint(!showHint)}
        >
          <Text style={[styles.hintToggleText, { color: theme.colors.text.secondary }]}>
            {showHint ? '− HIDE HINT' : '+ SHOW HINT'}
          </Text>
        </TouchableOpacity>

        {showHint && (
          <View style={[styles.hintBox, { borderLeftColor: theme.colors.primary[500] }]}>
            <Text style={[styles.hintText, { color: theme.colors.text.primary }]}>
              {question.framework_hint || 'No hint available.'}
            </Text>
          </View>
        )}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.text.primary }]} />

        {/* Voice Recorder - PROMINENT */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.text.primary }]}>
            🎤 RECORD YOUR ANSWER
          </Text>
          
          <VoiceRecorder 
            onRecordingComplete={handleRecordingComplete}
            maxDuration={300}
            mode="practice"
          />
        </View>

        {/* Current Answer */}
        {textAnswer ? (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text.primary }]}>
              YOUR ANSWER
            </Text>
            <View style={[styles.currentAnswerBox, { borderColor: theme.colors.text.primary }]}>
              <ScrollView style={styles.answerScroll} nestedScrollEnabled>
                <Text style={[styles.currentAnswerText, { color: theme.colors.text.primary }]}>
                  {textAnswer}
                </Text>
              </ScrollView>
            </View>
            <View style={styles.statsRow}>
              <Text style={[styles.statText, { color: theme.colors.text.secondary }]}>
                {textAnswer.length} characters
              </Text>
              <Text style={[styles.statText, { color: theme.colors.text.secondary }]}>
                ~{Math.ceil(textAnswer.length / 5)} words
              </Text>
            </View>
          </View>
        ) : null}

        {/* Previous Attempts - at the bottom */}
        {!loadingAttempts && previousAttempts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text.secondary }]}>
              PREVIOUS ATTEMPTS ({previousAttempts.length})
            </Text>
            
            {previousAttempts.map((attempt, index) => (
              <View 
                key={attempt.id} 
                style={[styles.attemptCard, { borderColor: theme.colors.border.light }]}
              >
                <View style={styles.attemptHeader}>
                  <Text style={[styles.attemptNumber, { color: theme.colors.text.secondary }]}>
                    ATTEMPT {previousAttempts.length - index}
                  </Text>
                  <Text style={[styles.attemptDate, { color: theme.colors.text.secondary }]}>
                    {formatDate(attempt.created_at)}
                  </Text>
                </View>
                <Text style={[styles.attemptText, { color: theme.colors.text.primary }]}>
                  {attempt.user_answer}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border.light }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: textAnswer.trim() ? theme.colors.text.primary : theme.colors.border.light 
            }
          ]}
          onPress={handleSubmit}
          disabled={loading || !textAnswer.trim()}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  errorButton: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.primary[500],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
  },
  headerButton: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.xwide,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[6],
  },
  questionText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    lineHeight: 32,
    marginBottom: theme.spacing[4],
  },
  hintToggle: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderWidth: 1,
    marginBottom: theme.spacing[4],
  },
  hintToggleText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  hintBox: {
    borderLeftWidth: 3,
    paddingLeft: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  hintText: {
    fontSize: theme.swiss.fontSize.body,
    lineHeight: 22,
  },
  divider: {
    height: 2,
    marginVertical: theme.spacing[6],
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[3],
  },
  instructionText: {
    fontSize: theme.swiss.fontSize.body,
    marginBottom: theme.spacing[4],
  },
  attemptCard: {
    borderWidth: 1,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  attemptNumber: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  attemptDate: {
    fontSize: theme.swiss.fontSize.small,
  },
  attemptText: {
    fontSize: theme.swiss.fontSize.body,
    lineHeight: 22,
  },
  currentAnswerBox: {
    borderWidth: 2,
    padding: theme.spacing[4],
    minHeight: 100,
    maxHeight: 200,
  },
  answerScroll: {
    maxHeight: 160,
  },
  currentAnswerText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[2],
  },
  statText: {
    fontSize: theme.swiss.fontSize.small,
  },
  footer: {
    padding: theme.spacing[4],
    borderTopWidth: 1,
  },
  submitButton: {
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide,
  },
});

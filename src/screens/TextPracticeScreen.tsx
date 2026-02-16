import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useQuestionsStore } from '../stores/questionsStore';
import { usePracticeStore } from '../stores/practiceStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import {
  Container,
  DisplayLG,
  BodyLG,
  BodyXL,
  LabelSM,
  PrimaryButton,
  GhostButton,
  OutlineButton,
  Row,
  Spacer
} from '../components/ui';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { theme } from '../theme';

type TextPracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TextPractice'>;
type TextPracticeScreenRouteProp = RouteProp<RootStackParamList, 'TextPractice'>;

export default function TextPracticeScreen() {
  const navigation = useNavigation<TextPracticeScreenNavigationProp>();
  const route = useRoute<TextPracticeScreenRouteProp>();
  const { questionId } = route.params;

  const { questions } = useQuestionsStore();
  const {
    textAnswer,
    setTextAnswer,
    saveDraft,
    loadDraft,
    submitAnswer,
    loading,
    resetPractice,
  } = usePracticeStore();
  const { user } = useAuth();
  const { updateAfterCompletion } = useProgressStore();
  
  const question = questions.find((q) => q.id === questionId);
  
  const [showHint, setShowHint] = useState(false);
  
  // refs for Store functions to avoid effect re-runs
  const loadDraftRef = useRef(loadDraft);
  
  // Keep refs updated
  useEffect(() => {
    loadDraftRef.current = loadDraft;
  }, [loadDraft]);

  useEffect(() => {
    // Load draft if user is logged in
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
      // First, submit the answer to create/update the session
      const sessionSubmitted = await submitAnswer(userId);

      if (sessionSubmitted) {
        // Now generate AI feedback using the practice store method
        await generateFeedbackAndComplete(userId);
      } else {
        Alert.alert('ERROR', 'Failed to submit answer. Please try again.');
      }
    }
  };

  // Generate AI feedback and update progress
  const generateFeedbackAndComplete = async (userId: string) => {
    if (!question) return;

    try {
      const { generateFeedback } = usePracticeStore.getState();
      await generateFeedback(userId);

      const { error: feedbackError } = usePracticeStore.getState();

      if (feedbackError) {
        console.error('Feedback generation error:', feedbackError);
        // Continue anyway - show results without feedback
        resetPractice();
        navigation.navigate('QuizResults');
        return;
      }

      // Update progress after successful completion
      await updateAfterCompletion(userId, 'text', question.category);

      // Navigate to results which shows feedback
      resetPractice();
      navigation.navigate('QuizResults');
    } catch (err) {
      console.error('Error generating feedback:', err);
      // Fallback - still navigate to results
      resetPractice();
      navigation.navigate('QuizResults');
    }
  };

  if (!question) return null;

  // Handle transcription from VoiceRecorder
  const handleRecordingComplete = useCallback((audioUri: string, transcription: string) => {
    setTextAnswer(transcription);
  }, [setTextAnswer]);

  return (
    <Container variant="screen" padding="none" safeArea>
      {/* Header */}
      <View style={styles.header}>
          <GhostButton size="sm" onPress={handleSaveDraft}>
              SAVE DRAFT
          </GhostButton>
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
         {/* Massive Question Text */}
         {question.question_text.length > 100 ? (
             <BodyXL style={styles.questionText}>{question.question_text}</BodyXL>
         ) : (
             <DisplayLG style={styles.questionText}>{question.question_text}</DisplayLG>
         )}
         
         <Spacer size={theme.spacing[6]} />

          {/* Framework Hint Section */}
          <View style={styles.section}>
              {showHint ? (
                  <View style={styles.hintContainer}>
                      <Row style={styles.hintHeader}>
                      <LabelSM>FRAMEWORK HINT</LabelSM>
                      <TouchableOpacity onPress={() => setShowHint(false)}>
                          <LabelSM style={{ color: theme.colors.primary[500] }}>HIDE</LabelSM>
                      </TouchableOpacity>
                      </Row>
                      <BodyLG style={styles.hintText}>
                      {question.framework_hint || 'No specific framework hint for this question.'}
                      </BodyLG>
                  </View>
              ) : (
                  <OutlineButton 
                      size="sm" 
                      onPress={() => setShowHint(true)}
                      style={styles.hintButton}
                  >
                      SHOW FRAMEWORK HINT
                  </OutlineButton>
              )}
          </View>

          <Spacer size={theme.spacing[8]} />
      </ScrollView>

      {/* Voice Recorder - Fixed position below scroll */}
      <View style={styles.recorderContainer}>
        <VoiceRecorder 
          onRecordingComplete={handleRecordingComplete}
          maxDuration={300} // 5 minutes
          mode="practice"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
           <Row style={styles.footerHeader}>
              <LabelSM color="secondary">
                  {textAnswer.length} CHARACTERS
              </LabelSM>
              <LabelSM color="secondary">
                  {Math.ceil(textAnswer.length / 5)} WORDS (EST)
              </LabelSM>
           </Row>
           <Spacer size={theme.spacing[3]} />
           <PrimaryButton
             size="lg"
             fullWidth
             onPress={handleSubmit}
             loading={loading}
             disabled={loading || !textAnswer.trim()}
           >
               SUBMIT ANSWER
           </PrimaryButton>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[6], // 24px
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing[6], // 24px
    flexGrow: 1,
  },
  questionText: {
    color: theme.colors.text.primary,
  },
  section: {
    marginBottom: theme.spacing[4],
  },
  hintContainer: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
    paddingLeft: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.surface.secondary,
  },
  hintHeader: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  hintText: {
    color: theme.colors.text.primary,
  },
  hintButton: {
    alignSelf: 'flex-start',
  },
  footer: {
    padding: theme.spacing[6], // 24px
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.surface.primary,
  },
  footerHeader: {
      justifyContent: 'space-between',
  },
  recorderContainer: {
    paddingHorizontal: theme.spacing[4],
  },
});

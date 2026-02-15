import React, { useEffect, useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
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
import { 
  Container, 
  DisplayLG, 
  H2,
  H3, 
  BodyLG, 
  BodyMD, 
  LabelSM, 
  PrimaryButton, 
  OutlineButton,
  GhostButton,
  Row,
  Spacer,
  HorizontalSpacer
} from '../components/ui';
import { QuestionCard } from '../components/QuestionCard';
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
      
      // 1. Load Question if not present
      let currentQuestion = question;
      if (!currentQuestion) {
        setLoading(true);
        currentQuestion = await getQuestionById(questionId);
        if (currentQuestion) setQuestion(currentQuestion);
        setLoading(false);
      }

      if (currentQuestion) {
          // 2. Load Related Questions
          const related = await getRelatedQuestions(currentQuestion.id, currentQuestion.category);
          setRelatedQuestions(related);

          // 3. Check Completion Status
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

  // Use useFocusEffect to reload data when returning to the screen (e.g. after practice)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <Container variant="screen" padding="lg" safeArea>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container variant="screen" padding="lg" safeArea>
        <View style={styles.centerContainer}>
          <H3 style={{ color: theme.colors.semantic.error }}>QUESTION NOT FOUND</H3>
          <Spacer size={theme.spacing[5]} />
          <GhostButton onPress={() => navigation.goBack()}>GO BACK</GhostButton>
        </View>
      </Container>
    );
  }

  const handleStartPractice = async (mode: 'mcq' | 'text') => {
    const userId = user?.id || guestId;
    if (!userId) {
      logger.error('No user ID available');
      return;
    }

    // Validate question has a valid ID before starting
    if (!question || !question.id) {
      logger.error('Invalid question - cannot start practice');
      return;
    }
    
    try {
      // Start session - this will validate the question exists in DB for non-guest users
      await startPractice(question, mode, userId, isGuest);
      
      if (mode === 'mcq') {
         // Pass sourceQuestionId to enable returning to this question after quiz
         navigation.navigate('QuickQuiz', { questions: [question], sourceQuestionId: question.id });
      } else {
         navigation.navigate('TextPractice', { questionId: question.id });
      }
    } catch (error) {
      logger.error('Failed to start practice session:', error);
      // For guest users or if question is from sample data, try to continue anyway
      if (isGuest) {
        if (mode === 'mcq') {
           navigation.navigate('QuickQuiz', { questions: [question], sourceQuestionId: question.id });
        } else {
           navigation.navigate('TextPractice', { questionId: question.id });
        }
      } else {
        // Show error for logged-in users
        Alert.alert(
          'Cannot Start Practice',
          'This question is not available in the database. Please try refreshing or selecting a different question.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const navigateToQuestion = (q: Question) => {
      navigation.push('QuestionDetail', { questionId: q.id });
  };

  return (
    <Container variant="screen" padding="none" safeArea>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTouchable}>
                <LabelSM>← GO BACK</LabelSM>
            </TouchableOpacity>
        </View>

        {/* Metadata Badges */}
        <Row style={styles.badges}>
          <View style={styles.badge}>
            <LabelSM style={styles.badgeText}>{question.category.replace('_', ' ')}</LabelSM>
          </View>
          <HorizontalSpacer size={theme.spacing[2]} />
          <View style={styles.badge}>
            <LabelSM style={styles.badgeText}>{question.difficulty}</LabelSM>
          </View>
          {question.company && (
            <>
                <HorizontalSpacer size={theme.spacing[2]} />
                <View style={styles.badge}>
                <LabelSM style={styles.badgeText}>{question.company}</LabelSM>
                </View>
            </>
          )}
        </Row>

        <Spacer size={theme.spacing[6]} />

        {/* Massive Typography Question */}
        {question.question_text.length > 100 ? (
             <H2 style={styles.questionText}>{question.question_text}</H2>
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

        {/* Expert Answer Section */}
        <View style={styles.section}>
             <LabelSM color="secondary" style={styles.sectionTitle}>EXPERT ANSWER</LabelSM>
             <Spacer size={theme.spacing[2]} />
             
             {isCompleted || checkingCompletion ? (
                 question.expert_answer ? (
                    <View style={styles.expertAnswerCard}>
                        <BodyLG>{question.expert_answer}</BodyLG>
                    </View>
                 ) : (
                    <BodyMD color="secondary">No expert answer available for this question.</BodyMD>
                 )
             ) : (
                <View style={styles.previewCard}>
                    <BodyMD color="secondary" numberOfLines={3} style={styles.previewText}>
                        {question.expert_answer || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
                    </BodyMD>
                    <View style={styles.blurOverlay}>
                         <View style={styles.blurBadge}>
                             <LabelSM style={styles.blurText}>COMPLETE TO UNLOCK</LabelSM>
                         </View>
                    </View>
                </View>
             )}
        </View>

        <Spacer size={theme.spacing[6]} />

        {/* Related Questions Section */}
        {relatedQuestions.length > 0 && (
            <View style={styles.section}>
                <LabelSM color="secondary" style={styles.sectionTitle}>RELATED QUESTIONS</LabelSM>
                <Spacer size={theme.spacing[4]} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {relatedQuestions.map(q => (
                        <QuestionCard 
                            key={q.id} 
                            question={q} 
                            onPress={navigateToQuestion} 
                        />
                    ))}
                </ScrollView>
            </View>
        )}

      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
         <PrimaryButton
           size="lg"
           fullWidth
           onPress={() => handleStartPractice('text')}
           loading={practiceLoading}
           disabled={practiceLoading}
         >
             START ANSWERING
         </PrimaryButton>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing[6], // 24px
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  backButtonTouchable: {
    padding: theme.spacing[2],
    marginLeft: -theme.spacing[2],
  },
  badges: {
    flexWrap: 'wrap',
  },
  badge: {
    borderWidth: 1,
    borderColor: theme.colors.border.strong,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: 0, 
  },
  badgeText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  questionText: {
    color: theme.colors.text.primary,
  },
  section: {
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  expertAnswerCard: {
    borderWidth: 1,
    borderColor: theme.colors.border.strong,
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surface.secondary,
  },
  previewCard: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing[5],
    position: 'relative',
    backgroundColor: theme.colors.surface.primary,
  },
  previewText: {
    opacity: 0.3,
  },
  blurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBadge: {
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  blurText: {
    color: theme.colors.primary[500],
    letterSpacing: 1,
    fontWeight: '700',
  },
  horizontalScroll: {
    marginHorizontal: -theme.spacing[6], // Negative margin to scroll edge-to-edge
    paddingHorizontal: theme.spacing[6],
  },
  footer: {
    padding: theme.spacing[6],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.surface.primary,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    marginBottom: theme.spacing[3],
  },
});

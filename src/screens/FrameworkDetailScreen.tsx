import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { FRAMEWORKS, FrameworkStep, MCQuestion, FillInBlankExercise } from '../data/frameworks';
import { FrameworkName } from '../types';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { Spacer, H1, H2, H3, BodyMD, BodySM, LabelSM, Card, Row, Column, FillInBlank } from '../components';
import { CheckCircle } from 'lucide-react-native';

type FrameworkDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FrameworkDetail'>;
type FrameworkDetailRouteProp = RouteProp<RootStackParamList, 'FrameworkDetail'>;

// Category info mapping - Using Swiss-style theme colors
const CATEGORY_INFO: Record<string, { label: string; icon: string; color: string }> = {
  product_sense: { label: 'Product Sense', icon: '💡', color: theme.colors.primary[500] },
  execution: { label: 'Execution', icon: '⚡', color: theme.colors.primary[600] },
  strategy: { label: 'Strategy', icon: '🎯', color: theme.colors.primary[700] },
  behavioral: { label: 'Behavioral', icon: '👤', color: theme.colors.semantic.success },
};

export default function FrameworkDetailScreen() {
  const navigation = useNavigation<FrameworkDetailNavigationProp>();
  const route = useRoute<FrameworkDetailRouteProp>();
  const { frameworkName } = route.params;
  const { progress, updateFrameworkMastery } = useProgressStore();
  const { user, isGuest, guestId } = useAuth();
  
  // State for interactive exercises
  const [currentFillInBlank, setCurrentFillInBlank] = useState(0);
  const [currentMCQuestion, setCurrentMCQuestion] = useState(0);
  const [fillInBlankCompleted, setFillInBlankCompleted] = useState(false);
  const [mcqCompleted, setMcqCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMCQResult, setShowMCQResult] = useState(false);

  const frameworkKey = frameworkName as FrameworkName;
  const framework = FRAMEWORKS[frameworkKey];

  const userId = user?.id || guestId || '';

  // Get framework mastery from progress
  const getFrameworkMastery = (): number => {
    return progress?.framework_mastery?.[frameworkName.toLowerCase()] || 0;
  };

  const handlePracticePress = () => {
    navigation.navigate('QuickQuiz', {});
  };

  const handleLessonPress = (stepIndex: number) => {
    // Navigate to lesson for this step if available, otherwise show detailed info
    const step = framework.steps[stepIndex];
    if (step) {
      // For now, show comprehensive info about the step
      // In future, this could navigate to a specific lesson
      const keyPoints = step.key_points?.join('\n• ') || 'No key points available';
      alert(`${step.name}\n\n${step.description}\n\nKey Points:\n• ${keyPoints}\n\n💡 Tip: Practice using this step in the Pattern Practice section below!`);
    }
  };

  const handleStartPractice = () => {
    // Navigate to QuickQuiz with this framework filter
    navigation.navigate('QuickQuiz', {});
  };

  const handleFillInBlankComplete = (success: boolean) => {
    setFillInBlankCompleted(true);
    if (success && userId) {
      // Update framework mastery
      const currentMastery = getFrameworkMastery();
      const newMastery = Math.min(100, currentMastery + 5);
      updateFrameworkMastery(userId, frameworkName, newMastery, isGuest);
    }
  };

  const handleMCAnswerSelect = (index: number) => {
    if (!showMCQResult) {
      setSelectedAnswer(index);
    }
  };

  const handleMCSubmit = () => {
    if (selectedAnswer === null) return;
    setShowMCQResult(true);
    
    const currentQuestion = framework.mc_questions?.[currentMCQuestion];
    if (currentQuestion && selectedAnswer === currentQuestion.correct_answer && userId) {
      // Update framework mastery
      const currentMastery = getFrameworkMastery();
      const newMastery = Math.min(100, currentMastery + 5);
      updateFrameworkMastery(userId, frameworkName, newMastery, isGuest);
    }
  };

  const handleMCNext = () => {
    if (framework.mc_questions && currentMCQuestion < framework.mc_questions.length - 1) {
      setCurrentMCQuestion(currentMCQuestion + 1);
      setSelectedAnswer(null);
      setShowMCQResult(false);
    } else {
      setMcqCompleted(true);
    }
  };

  if (!framework) {
    return (
      <View style={styles.container}>
        <Text>Framework not found</Text>
      </View>
    );
  }

  const mastery = getFrameworkMastery();
  const categoryInfo = CATEGORY_INFO[framework.category];
  const mcQuestions = framework.mc_questions;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: framework.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.frameworkIconContainer}>
            <Text style={styles.frameworkIconText}>{framework.name.charAt(0)}</Text>
          </View>
          <H1 style={styles.frameworkTitle}>{framework.name}</H1>
          <BodyMD style={styles.frameworkDescription}>{framework.description}</BodyMD>
          {categoryInfo && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {categoryInfo.icon} {categoryInfo.label}
              </Text>
            </View>
          )}
        </View>
        {/* Mastery indicator */}
        <View style={styles.masteryContainer}>
          <View style={styles.masteryBar}>
            <View style={[styles.masteryFill, { width: `${mastery}%` }]} />
          </View>
          <Text style={styles.masteryText}>{mastery}% Mastery</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* When to Use This Framework */}
        <View style={styles.section}>
          <H2 style={styles.sectionTitle}>WHEN TO USE THIS FRAMEWORK</H2>
          <Card variant="outline" style={styles.whenToUseCard}>
            {framework.when_to_use && framework.when_to_use.length > 0 ? (
              framework.when_to_use.map((rule, index) => (
                <View key={index} style={styles.whenToUseItem}>
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                  <View style={styles.whenToUseContent}>
                    <Text style={styles.questionTypeText}>{rule.question_type}</Text>
                    <Text style={styles.exampleText}>e.g., "{rule.example}"</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noContentText}>
                Learn when to apply this framework in product management interviews.
              </Text>
            )}
          </Card>
        </View>

        {/* Framework Steps */}
        {framework.steps && framework.steps.length > 0 && (
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>LEARN THE FRAMEWORK</H2>
            <Text style={styles.sectionSubtitle}>
              {framework.steps.length} steps to master
            </Text>

            {framework.steps.map((step: FrameworkStep, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.stepCard}
                onPress={() => handleLessonPress(index)}
                activeOpacity={0.8}
              >
                <Row style={styles.stepHeader}>
                  <View style={[styles.stepNumber, { backgroundColor: framework.color }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Column style={styles.stepInfo}>
                    <Text style={styles.stepName}>{step.name}</Text>
                    <BodySM color="secondary">{step.description}</BodySM>
                  </Column>
                  <Text style={styles.stepArrow}>→</Text>
                </Row>
                {step.key_points && step.key_points.length > 0 && (
                  <View style={styles.keyPoints}>
                    {step.key_points.map((point, pointIndex) => (
                      <View key={pointIndex} style={styles.keyPointItem}>
                        <Text style={styles.keyPointBullet}>•</Text>
                        <Text style={styles.keyPointText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Fill-in-the-Blank Exercises */}
        {framework.fill_in_blank && framework.fill_in_blank.length > 0 && !fillInBlankCompleted && (
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>FILL IN THE BLANKS</H2>
            <Text style={styles.sectionSubtitle}>
              Test your knowledge of {framework.name}
            </Text>
            
            <FillInBlank
              sentence={framework.fill_in_blank[currentFillInBlank].sentence}
              blanks={framework.fill_in_blank[currentFillInBlank].blanks}
              onComplete={handleFillInBlankComplete}
            />
          </View>
        )}

        {fillInBlankCompleted && (
          <View style={styles.section}>
            <View style={styles.completedBanner}>
              <CheckCircle size={24} color={theme.colors.semantic.success} />
              <Text style={styles.completedText}>Fill-in-the-blank exercises completed!</Text>
            </View>
          </View>
        )}

        {/* MCQ Exercises */}
        {mcQuestions && mcQuestions.length > 0 && !mcqCompleted && (
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>QUIZ: TEST YOUR KNOWLEDGE</H2>
            <Text style={styles.sectionSubtitle}>
              Question {currentMCQuestion + 1} of {mcQuestions.length}
            </Text>

            <Card variant="outline" style={styles.mcqCard}>
              <Text style={styles.mcqQuestion}>
                {mcQuestions[currentMCQuestion].question}
              </Text>

              {mcQuestions[currentMCQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.mcqOption,
                    selectedAnswer === index && styles.mcqOptionSelected,
                    showMCQResult && index === mcQuestions[currentMCQuestion].correct_answer && styles.mcqOptionCorrect,
                    showMCQResult && selectedAnswer === index && index !== mcQuestions[currentMCQuestion].correct_answer && styles.mcqOptionWrong,
                  ]}
                  onPress={() => handleMCAnswerSelect(index)}
                  disabled={showMCQResult}
                >
                  <Text style={[
                    styles.mcqOptionText,
                    selectedAnswer === index && styles.mcqOptionTextSelected,
                  ]}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Text>
                </TouchableOpacity>
              ))}

              {showMCQResult && (
                <View style={styles.mcqExplanation}>
                  <Text style={styles.mcqExplanationText}>
                    {mcQuestions[currentMCQuestion].explanation}
                  </Text>
                </View>
              )}

              {!showMCQResult ? (
                <TouchableOpacity
                  style={[
                    styles.mcqSubmitButton,
                    { backgroundColor: framework.color },
                    selectedAnswer === null && styles.mcqSubmitDisabled,
                  ]}
                  onPress={handleMCSubmit}
                  disabled={selectedAnswer === null}
                >
                  <Text style={styles.mcqSubmitText}>Submit Answer</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.mcqSubmitButton, { backgroundColor: framework.color }]}
                  onPress={handleMCNext}
                >
                  <Text style={styles.mcqSubmitText}>
                    {currentMCQuestion < mcQuestions.length - 1
                      ? 'Next Question'
                      : 'Finish Quiz'}
                  </Text>
                </TouchableOpacity>
              )}
            </Card>
          </View>
        )}

        {mcqCompleted && (
          <View style={styles.section}>
            <View style={styles.completedBanner}>
              <CheckCircle size={24} color={theme.colors.semantic.success} />
              <Text style={styles.completedText}>Quiz completed!</Text>
            </View>
          </View>
        )}

        {/* Practice Questions Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.practiceButton, { backgroundColor: framework.color }]}
            onPress={handlePracticePress}
            activeOpacity={0.8}
          >
            <Text style={styles.practiceButtonText}>Practice Questions</Text>
            <Text style={styles.practiceButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <Spacer size={100} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  backButton: {
    marginBottom: theme.spacing[4],
  },
  backText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  frameworkIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.text.inverse + '33', // 20% opacity
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  frameworkIconText: {
    color: theme.colors.text.inverse,
    fontSize: 36,
    fontWeight: '700',
  },
  frameworkTitle: {
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  frameworkDescription: {
    color: theme.colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: theme.spacing[3],
  },
  categoryBadge: {
    backgroundColor: theme.colors.text.inverse + '33', // 20% opacity
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.spacing.borderRadius.full,
  },
  categoryBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: '500',
  },
  masteryContainer: {
    alignItems: 'center',
  },
  masteryBar: {
    width: '100%',
    height: 6,
    backgroundColor: theme.colors.text.inverse + '4D', // 30% opacity
    borderRadius: 3,
    marginBottom: theme.spacing[2],
  },
  masteryFill: {
    height: '100%',
    backgroundColor: theme.colors.text.inverse,
    borderRadius: 3,
  },
  masteryText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing[4],
  },
  section: {
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },
  whenToUseCard: {
    padding: theme.spacing[4],
  },
  whenToUseItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
  },
  checkmark: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  checkmarkText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },
  whenToUseContent: {
    flex: 1,
  },
  questionTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  exampleText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  noContentText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  stepCard: {
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  stepHeader: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  stepNumberText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  stepArrow: {
    fontSize: 18,
    color: theme.colors.text.secondary,
  },
  keyPoints: {
    marginTop: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  keyPointItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[1],
  },
  keyPointBullet: {
    color: theme.colors.primary[500],
    marginRight: theme.spacing[2],
    fontSize: 14,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
  },
  practiceButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  practiceButtonArrow: {
    color: theme.colors.text.inverse,
    fontSize: 20,
  },
  // Completed banner
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.semantic.success + '20',
    padding: theme.spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.semantic.success,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.semantic.success,
    marginLeft: theme.spacing[2],
  },
  // MCQ styles
  mcqCard: {
    padding: theme.spacing[4],
  },
  mcqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    lineHeight: 24,
  },
  mcqOption: {
    padding: theme.spacing[3],
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    borderRadius: 8,
    marginBottom: theme.spacing[2],
  },
  mcqOptionSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  mcqOptionCorrect: {
    borderColor: theme.colors.semantic.success,
    backgroundColor: theme.colors.semantic.success + '20',
  },
  mcqOptionWrong: {
    borderColor: theme.colors.semantic.error,
    backgroundColor: theme.colors.semantic.error + '20',
  },
  mcqOptionText: {
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  mcqOptionTextSelected: {
    color: theme.colors.primary[700],
    fontWeight: '600',
  },
  mcqExplanation: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 8,
  },
  mcqExplanationText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  mcqSubmitButton: {
    padding: theme.spacing[3],
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  mcqSubmitDisabled: {
    opacity: 0.5,
  },
  mcqSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});

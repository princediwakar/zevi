import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { FullPracticeContent, UserOutline } from '../../types';
import { ChevronRight, ChevronLeft, Clock, Eye, EyeOff, CheckCircle, HelpCircle, Send } from 'lucide-react-native';
import { OutlineBuilder } from '../../components/OutlineBuilder';

interface FullPracticeLessonProps {
  content: FullPracticeContent;
  onComplete: (xpEarned: number, answerData?: any) => void;
  onError: (error: string) => void;
}

export function FullPracticeLesson({ content, onComplete, onError }: FullPracticeLessonProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [outline, setOutline] = useState<UserOutline>({});
  const [timeLeft, setTimeLeft] = useState<number>(content.time_limit ? content.time_limit * 60 : 0); // seconds
  const [isTimerActive, setIsTimerActive] = useState(!!content.time_limit);
  const [showExpertOutline, setShowExpertOutline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize outline structure with empty arrays for each framework step
  useEffect(() => {
    const initialOutline: UserOutline = {};
    content.framework_steps.forEach(step => {
      initialOutline[step] = outline[step] || [];
    });
    setOutline(initialOutline);
  }, [content.framework_steps]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as ReturnType<typeof setTimeout>);
            setIsTimerActive(false);
            Alert.alert('Time\'s Up!', 'Your practice time has ended. You can still submit your outline.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);


  const handleOutlineChange = (newOutline: UserOutline) => {
    setOutline(newOutline);
  };

  const handleStepChangeIndex = (step: number) => {
    setCurrentStepIndex(step);
  };

  const handleSubmit = () => {
    // Validate that all steps have some content
    const emptySteps = content.framework_steps.filter(step => {
      const points = outline[step];
      return !points || points.length === 0 || points.every(p => !p.trim());
    });
    if (emptySteps.length > 0) {
      Alert.alert(
        'Incomplete Outline',
        `You haven't filled out: ${emptySteps.join(', ')}. Do you want to submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit Anyway', onPress: () => setShowSubmissionModal(true) }
        ]
      );
      return;
    }
    setShowSubmissionModal(true);
  };

  const confirmSubmission = () => {
    setIsSubmitting(true);
    setShowSubmissionModal(false);

    // Simulate API call for evaluation
    setTimeout(() => {
      // Calculate XP: base XP + bonus for completeness
      const baseXp = 100; // Could be from lesson.xp_reward
      const completenessBonus = content.framework_steps.filter(step => {
        const points = outline[step];
        return points && points.length > 0 && points.some(p => p.trim());
      }).length * 10;
      const xpEarned = baseXp + completenessBonus;

      // Prepare answer data for AI evaluation
      const answerData = {
        outline,
        framework: content.framework_name,
        timeSpent: content.time_limit ? (content.time_limit * 60 - timeLeft) : null,
        submittedAt: new Date().toISOString()
      };

      onComplete(xpEarned, answerData);
      setIsSubmitting(false);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStep = content.framework_steps[currentStepIndex];
  const currentExpertOutline = content.expert_outline[currentStep] || [];
  const progress = ((currentStepIndex + 1) / content.framework_steps.length) * 100;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: theme.colors.primary[500] },
          ]}
        />
      </View>

      {/* Header with Timer and Expert Toggle */}
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.primary[600]]}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>
              Step {currentStepIndex + 1} of {content.framework_steps.length}
            </Text>
            <Text style={styles.frameworkText}>{content.framework_name}</Text>
          </View>

          <View style={styles.headerRight}>
            {content.time_limit && (
              <View style={styles.timerContainer}>
                <Clock size={16} color="white" />
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.expertToggle}
              onPress={() => setShowExpertOutline(!showExpertOutline)}
            >
              {showExpertOutline ? (
                <EyeOff size={20} color="white" />
              ) : (
                <Eye size={20} color="white" />
              )}
              <Text style={styles.expertToggleText}>
                {showExpertOutline ? 'Hide Expert' : 'Expert'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Question Display */}
      <View style={styles.questionSection}>
        <Text style={[styles.questionLabel, { color: theme.colors.text.secondary }]}>Question</Text>
        <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>{content.question}</Text>
      </View>

      {/* Main Content Area */}
      <ScrollView 
        style={styles.contentArea}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Current Step Header */}
        <View style={styles.stepHeader}>
          <Text style={[styles.stepNumber, { color: theme.colors.primary[500] }]}>
            {currentStepIndex + 1}
          </Text>
          <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>{currentStep}</Text>
        </View>

        <OutlineBuilder
          sections={content.framework_steps}
          value={outline}
          onChange={handleOutlineChange}
          expertOutline={content.expert_outline}
          showExpertOutline={showExpertOutline}
          onExpertOutlineToggle={setShowExpertOutline}
          currentStep={currentStepIndex}
          onStepChange={handleStepChangeIndex}
          mode="full_practice"
          variant="outline"
          size="md"
          placeholder="Add bullet point..."
        />


        {/* Outline Progress */}
        <View style={styles.outlineProgress}>
          <Text style={[styles.outlineProgressTitle, { color: theme.colors.text.primary }]}>
            Outline Progress
          </Text>
          <View style={styles.stepsProgress}>
            {content.framework_steps.map((step, index) => (
              <TouchableOpacity
                key={step}
                style={[
                  styles.stepIndicator,
                  {
                    backgroundColor: outline[step]?.some(point => point.trim())
                      ? theme.colors.semantic.success
                      : index === currentStepIndex
                      ? theme.colors.primary[500]
                      : theme.colors.border.light,
                  },
                ]}
                onPress={() => setCurrentStepIndex(index)}
              >
                <Text
                  style={[
                    styles.stepIndicatorText,
                    {
                      color: outline[step]?.length > 0 || index === currentStepIndex
                        ? theme.colors.text.inverse
                        : theme.colors.text.secondary,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary[500] }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Send size={20} color="white" />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Practice'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submission Modal - placed outside KeyboardAvoidingView for proper modal behavior */}
      <Modal
        visible={showSubmissionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubmissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface.primary }]}>
            <CheckCircle size={48} color={theme.colors.primary[500]} />
            <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
              Submit Your Practice?
            </Text>
            <Text style={[styles.modalText, { color: theme.colors.text.secondary }]}>
              Your outline will be evaluated using AI feedback. You'll receive detailed scores on structure, completeness, and framework adherence.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowSubmissionModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text.primary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary[500] }]}
                onPress={confirmSubmission}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text.inverse }]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  progressFill: {
    height: '100%',
  },
  headerGradient: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    borderBottomLeftRadius: theme.spacing.borderRadius.xl,
    borderBottomRightRadius: theme.spacing.borderRadius.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[1],
  },
  frameworkText: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  timerText: {
    fontSize: theme.typography.body.md.fontSize,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  expertToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  expertToggleText: {
    fontSize: theme.typography.label.sm.fontSize,
    color: theme.colors.text.inverse,
  },
  questionSection: {
    padding: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  questionLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing[2],
  },
  questionText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '600',
    lineHeight: 24,
  },
  contentArea: {
    flex: 1,
    padding: theme.spacing[5],
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  stepNumber: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: '700',
    marginRight: theme.spacing[3],
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  stepTitle: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '600',
    flex: 1,
  },
  expertSection: {
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  expertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  expertTitle: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
  expertList: {
    gap: theme.spacing[2],
  },
  expertPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[2],
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: theme.spacing[2],
    flexShrink: 0,
  },
  expertPointText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: 20,
    flex: 1,
  },
  inputSection: {
    marginBottom: theme.spacing[8],
  },
  inputLabel: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[3],
  },
  textInput: {
    borderRadius: theme.spacing.borderRadius.md,
    borderWidth: 2,
    padding: theme.spacing[4],
    fontSize: theme.typography.body.lg.fontSize,
    lineHeight: 24,
    minHeight: 150,
  },
  inputHint: {
    fontSize: theme.typography.label.sm.fontSize,
    marginTop: theme.spacing[2],
    fontStyle: 'italic',
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[8],
  },
  stepNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    borderRadius: theme.spacing.borderRadius.sm,
    backgroundColor: theme.colors.surface.secondary,
  },
  stepNavButtonNext: {
    backgroundColor: theme.colors.primary[500],
  },
  stepNavButtonText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '500',
  },
  outlineProgress: {
    marginBottom: theme.spacing[5],
  },
  outlineProgressTitle: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[4],
  },
  stepsProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontSize: theme.typography.label.md.fontSize,
    fontWeight: '600',
  },
  submitSection: {
    padding: theme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.md,
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[5],
  },
  modalContent: {
    width: '100%',
    borderRadius: theme.spacing.borderRadius.xl,
    padding: theme.spacing[6],
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  modalTitle: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    borderRadius: theme.spacing.borderRadius.sm,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.surface.secondary,
  },
  modalButtonText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '500',
  },
});

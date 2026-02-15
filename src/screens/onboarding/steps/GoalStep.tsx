import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps, OnboardingData } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

const GOALS = [
  { id: 'apm', label: 'Land an APM role', icon: '🎓', description: 'New grad focused' },
  { id: 'pm', label: 'Become a PM', icon: '🚀', description: 'Career switcher' },
  { id: 'spm', label: 'Level up to SPM+', icon: '📈', description: 'Current PM' },
  { id: 'just_exploring', label: 'Just exploring', icon: '🎯', description: 'No specific goal' },
] as const;

// Map specific goals to roles for the backend
const GOAL_TO_ROLE_MAP: Record<string, OnboardingData['targetRole']> = {
  'apm': 'apm',
  'pm': 'pm',
  'spm': 'spm',
  'just_exploring': 'pm' // Default to PM
};

export default function GoalStep({ onNext, onBack, data, updateData }: OnboardingStepProps) {
  
  const handleSelect = (goalId: string) => {
    // We store the goal primarily, but for now we map it to targetRole for compatibility
    updateData({ targetRole: GOAL_TO_ROLE_MAP[goalId] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityHint="Return to the previous step"
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text> 
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '16%' }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          What's your goal?
        </Text>
        <Text style={styles.subtitle}>
          We'll tailor your learning path to match your objective.
        </Text>

        <View style={styles.goalsContainer}>
          {GOALS.map((goal) => {
            const roleForGoal = GOAL_TO_ROLE_MAP[goal.id];
            const isSelected = data.targetRole === roleForGoal; 
            
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => handleSelect(goal.id)}
                style={[
                  styles.goalCard,
                  isSelected ? styles.goalCardSelected : styles.goalCardUnselected
                ]}
                accessibilityLabel={`${goal.label}: ${goal.description}`}
                accessibilityHint="Tap to select this goal"
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                </View>
                <View style={styles.goalInfo}>
                  <Text style={[
                    styles.goalLabel,
                    isSelected ? styles.goalLabelSelected : styles.goalLabelUnselected
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={styles.goalDescription}>
                    {goal.description}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            data.targetRole ? styles.continueButtonEnabled : styles.continueButtonDisabled
          ]}
          onPress={onNext}
          disabled={!data.targetRole}
          accessibilityLabel="Continue to next step"
          accessibilityHint="Proceed to select your target companies"
          accessibilityRole="button"
          accessibilityState={{ disabled: !data.targetRole }}
        >
          <Text style={[
            styles.continueButtonText,
            data.targetRole ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.spacing.borderWidth.thin,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing[2],
    marginLeft: -theme.spacing[2],
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.spacing.borderRadius.sm,
    marginLeft: theme.spacing[4],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.spacing.borderRadius.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
  },
  title: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: theme.typography.heading.h2.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.body.lg.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[8],
  },
  goalsContainer: {
    gap: theme.spacing[4],
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: theme.spacing.borderWidth.medium,
  },
  goalCardSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  goalCardUnselected: {
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalInfo: {
    flex: 1,
    marginLeft: theme.spacing[4],
  },
  goalLabel: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
  },
  goalLabelSelected: {
    color: theme.colors.primary[600],
  },
  goalLabelUnselected: {
    color: theme.colors.text.primary,
  },
  goalDescription: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: theme.colors.text.inverse,
    fontWeight: '700',
    fontSize: 12,
  },
  footer: {
    padding: theme.spacing[6],
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
  },
  continueButton: {
    width: '100%',
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    alignItems: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: theme.colors.primary[500],
    shadowColor: theme.colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.neutral[200],
  },
  continueButtonText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
  },
  continueButtonTextEnabled: {
    color: theme.colors.text.inverse,
  },
  continueButtonTextDisabled: {
    color: theme.colors.text.disabled,
  },
});


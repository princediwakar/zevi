import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps, OnboardingData } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#1E293B',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginLeft: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  goalCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  goalCardUnselected: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    marginLeft: 16,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalLabelSelected: {
    color: '#1D4ED8',
  },
  goalLabelUnselected: {
    color: '#0F172A',
  },
  goalDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  continueButtonTextEnabled: {
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#94A3B8',
  },
});

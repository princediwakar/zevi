import React, { useState } from 'react';
import { View, SafeAreaView, StatusBar, Alert, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types';
import { OnboardingData } from './types';
import WelcomeStep from './steps/WelcomeStep';
import GoalStep from './steps/GoalStep';
import CompanyStep from './steps/CompanyStep';
import ExperienceStep from './steps/ExperienceStep';
import TimelineStep from './steps/TimelineStep';
import ReminderStep from './steps/ReminderStep';
import PathRevealStep from './steps/PathRevealStep';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProfile, initializeLearningPath } from '../../services/onboardingService';
import { theme } from '../../theme';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

const STEP_NAMES = ['Welcome', 'Your Goal', 'Target Companies', 'Experience', 'Timeline', 'Reminders', 'Ready!'];

export default function OnboardingFlow() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    targetCompanies: [],
    weeklyGoal: 5,
  });

  const totalSteps = 7;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const { user, isGuest } = useAuth();

  const finishOnboarding = async () => {
    // Prevent multiple concurrent calls
    if (isFinishing) return;
    setIsFinishing(true);

    try {
      // Only save to Supabase if user is authenticated (not a guest)
      if (user && !isGuest) {
        await saveUserProfile(user.id, data);
        await initializeLearningPath(user.id, data);
      } else if (isGuest) {
        // For guests, just log - data will be stored locally
        console.log('Guest user completing onboarding:', data);
      } else {
        console.warn('No user found during onboarding completion');
      }
      
      // Mark onboarding as completed
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      
      // Navigate to MainTabs
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      
      // Show error alert to user
      Alert.alert(
        'Unable to Save Preferences',
        'We couldn\'t save your preferences. You can continue to the app and update them later in Settings.',
        [
          { 
            text: 'Continue Anyway', 
            onPress: async () => {
              // Mark as completed anyway to allow access
              await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }
          }
        ]
      );
    } finally {
      setIsFinishing(false);
    }
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} data={data} updateData={updateData} />,
    <GoalStep key="goal" onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />,
    <CompanyStep key="company" onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />,
    <ExperienceStep key="experience" onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />,
    <TimelineStep key="timeline" onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />,
    <ReminderStep key="reminder" onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />,
    <PathRevealStep key="reveal" onNext={finishOnboarding} onBack={prevStep} data={data} updateData={updateData} />,
  ];

  // Render the current step
  // If step index is out of bounds (e.g. finished), we might want to trigger finish
  if (step >= steps.length) {
    finishOnboarding();
    return null;
  }

  // Show progress indicator for steps 1-6 (not WelcomeStep)
  const showProgress = step > 0 && step < totalSteps;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Progress Indicator */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressStepText}>Step {step} of {totalSteps - 1}</Text>
            <Text style={styles.progressStepName}>{STEP_NAMES[step]}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      )}
      
      {steps[step]}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 0.5,
  },
  progressStepName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary[500],
    letterSpacing: 0.5,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 2,
  },
});

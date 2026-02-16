import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

export default function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Swiss Style Hero Container with Letter Code */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroCode}>PM</Text>
        </View>
        
        <Text style={styles.title}>
          Master PM Interviews
        </Text>
        <Text style={styles.subtitle}>
          Your Personalized Path
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={onNext}
          accessibilityLabel="Get Started"
          accessibilityHint="Begin your personalized PM interview preparation"
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            GET STARTED
          </Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity 
          style={styles.secondaryButton}
          accessibilityLabel="I already have an account"
          accessibilityHint="Sign in to your existing account"
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>
            I ALREADY HAVE AN ACCOUNT
          </Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
    padding: theme.spacing[6],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    width: 160,
    height: 160,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[10],
    borderWidth: 4,
    borderColor: theme.colors.primary[700],
  },
  heroCode: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: theme.typography.heading.h1.fontSize,
    fontWeight: theme.typography.heading.h1.fontWeight,
    textAlign: 'center',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  subtitle: {
    fontSize: theme.typography.body.xl.fontSize,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 28,
    paddingHorizontal: theme.spacing[4],
  },
  buttonContainer: {
    width: '100%',
    marginBottom: theme.spacing[4],
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[500],
    width: '100%',
    paddingVertical: theme.spacing[4],
    borderWidth: 2,
    borderColor: theme.colors.primary[700],
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: theme.typography.heading.h4.fontSize,
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: theme.spacing[6],
    paddingVertical: theme.spacing[2],
  },
  secondaryButtonText: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: theme.typography.body.sm.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

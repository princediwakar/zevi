import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

export default function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Placeholder for a hero illustration */}
        <View style={styles.heroContainer}>
          <Text style={styles.emoji}>🚀</Text>
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
            Get Started
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          accessibilityLabel="I already have an account"
          accessibilityHint="Sign in to your existing account"
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>
            I ALREADY HAVE AN ACCOUNT
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
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    width: 256,
    height: 256,
    backgroundColor: '#DBEAFE',
    borderRadius: 128,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

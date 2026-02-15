import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';



export default function PathRevealStep({ onNext, data }: OnboardingStepProps) {
  
  useEffect(() => {
    // Simulate "Building your path..." delay
    const timer = setTimeout(() => {
      onNext();
    }, 2500); // 2.5s delay for effect

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>🔮</Text>
      </View>
      
      <Text style={styles.title}>
        Generating your path...
      </Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Analyzing {data.targetCompanies.length} target companies...
        </Text>
        <Text style={styles.statusText}>
          Calibrating for {data.targetRole?.toUpperCase()} role...
        </Text>
        <Text style={styles.statusText}>
          Optimizing for {data.weeklyGoal} days/week...
        </Text>
      </View>

      <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: theme.colors.primary[50],
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[10],
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: theme.typography.heading.h2.fontWeight,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  statusText: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  loader: {
    marginTop: theme.spacing[10],
  },
});



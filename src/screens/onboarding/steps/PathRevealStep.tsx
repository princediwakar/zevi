import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#EFF6FF',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
});

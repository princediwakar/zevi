import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const LEVELS = [
  { 
    id: 'new_grad', 
    title: 'New Grad / Student', 
    subtitle: 'No formal PM experience yet',
    icon: '🎓' 
  },
  { 
    id: 'career_switcher', 
    title: 'Career Switcher', 
    subtitle: '3-5 years in tech (Eng, Design, etc.)', 
    icon: '🔄' 
  },
  { 
    id: 'current_pm', 
    title: 'Current PM', 
    subtitle: '2+ years of PM experience', 
    icon: '💼' 
  },
] as const;

export default function ExperienceStep({ onNext, onBack, data, updateData }: OnboardingStepProps) {
  
  const handleSelect = (level: typeof LEVELS[number]['id']) => {
    updateData({ experienceLevel: level });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text> 
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Your experience level?
        </Text>
        <Text style={styles.subtitle}>
          This helps us adjust the difficulty of your questions.
        </Text>

        <View style={styles.levelsContainer}>
          {LEVELS.map((level) => {
            const isSelected = data.experienceLevel === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                onPress={() => handleSelect(level.id)}
                style={[
                  styles.levelCard,
                  isSelected ? styles.levelCardSelected : styles.levelCardUnselected
                ]}
              >
                <Text style={styles.levelIcon}>{level.icon}</Text>
                <View style={styles.levelInfo}>
                  <Text style={[
                    styles.levelTitle,
                    isSelected ? styles.levelTitleSelected : styles.levelTitleUnselected
                  ]}>
                    {level.title}
                  </Text>
                  <Text style={styles.levelSubtitle}>
                    {level.subtitle}
                  </Text>
                </View>
                
                <View style={[
                  styles.radioOuter,
                  isSelected ? styles.radioOuterSelected : styles.radioOuterUnselected
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            data.experienceLevel ? styles.continueButtonEnabled : styles.continueButtonDisabled
          ]}
          onPress={onNext}
          disabled={!data.experienceLevel}
        >
          <Text style={[
            styles.continueButtonText,
            data.experienceLevel ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
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
  levelsContainer: {
    gap: 16,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  levelCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  levelCardUnselected: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  levelIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  levelTitleSelected: {
    color: '#1D4ED8',
  },
  levelTitleUnselected: {
    color: '#0F172A',
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  radioOuterUnselected: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
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

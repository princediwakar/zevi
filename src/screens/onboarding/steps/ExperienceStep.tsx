import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

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
  levelsContainer: {
    gap: theme.spacing[4],
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[5],
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: theme.spacing.borderWidth.medium,
  },
  levelCardSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  levelCardUnselected: {
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  levelIcon: {
    fontSize: 36,
    marginRight: theme.spacing[4],
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
  },
  levelTitleSelected: {
    color: theme.colors.primary[600],
  },
  levelTitleUnselected: {
    color: theme.colors.text.primary,
  },
  levelSubtitle: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: theme.spacing.borderWidth.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[500],
  },
  radioOuterUnselected: {
    borderColor: theme.colors.neutral[300],
    backgroundColor: theme.colors.background,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.text.inverse,
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


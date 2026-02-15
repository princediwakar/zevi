import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';



const TIMELINES = [
  { id: 'urgent', label: 'Less than 2 weeks', sub: 'Urgent Mode' },
  { id: '1-3_months', label: '1-3 months', sub: 'Recommended' },
  { id: '3+_months', label: '3+ months', sub: 'Long-term prep' },
  { id: 'no_date', label: 'No interview scheduled', sub: 'Just learning' },
] as const;

const GOALS = [
  { days: 3, label: 'Casual', sub: '3 days/week' },
  { days: 5, label: 'Regular', sub: '5 days/week' },
  { days: 7, label: 'Intense', sub: '7 days/week' },
];

export default function TimelineStep({ onNext, onBack, data, updateData }: OnboardingStepProps) {
  
  // Local state for immediate feedback before saving to parent
  const [timeline, setTimeline] = useState(data.interviewTimeline);
  const [goal, setGoal] = useState(data.weeklyGoal);

  const handleNext = () => {
    updateData({ 
      interviewTimeline: timeline,
      weeklyGoal: goal
    });
    onNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text> 
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '70%' }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          When's your interview?
        </Text>
        <Text style={styles.subtitle}>
          We'll build a backward plan from your target date.
        </Text>

        <View style={styles.timelineContainer}>
          {TIMELINES.map((t) => {
            const isSelected = timeline === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setTimeline(t.id)}
                style={[
                  styles.timelineCard,
                  isSelected ? styles.timelineCardSelected : styles.timelineCardUnselected
                ]}
              >
                <View style={[
                  styles.radioOuter,
                  isSelected ? styles.radioOuterSelected : styles.radioOuterUnselected
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.timelineInfo}>
                  <Text style={[
                    styles.timelineLabel,
                    isSelected ? styles.timelineLabelSelected : styles.timelineLabelUnselected
                  ]}>
                    {t.label}
                  </Text>
                  <Text style={styles.timelineSub}>{t.sub}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.goalTitle}>
          Weekly practice goal
        </Text>
        <Text style={styles.goalSubtitle}>
          Consistency is key. Pick a realistic goal.
        </Text>

        <View style={styles.goalsRow}>
          {GOALS.map((g) => {
             const isSelected = goal === g.days;
             return (
               <TouchableOpacity
                 key={g.days}
                 onPress={() => setGoal(g.days)}
                 style={[
                   styles.goalCard,
                   isSelected ? styles.goalCardSelected : styles.goalCardUnselected
                 ]}
               >
                 <Text style={[
                   styles.goalDays,
                   isSelected ? styles.goalDaysSelected : styles.goalDaysUnselected
                 ]}>
                   {g.days}
                 </Text>
                 <Text style={[
                   styles.goalLabel,
                   isSelected ? styles.goalLabelSelected : styles.goalLabelUnselected
                 ]}>
                   Active Days
                 </Text>
                 <Text style={styles.goalSub}>{g.label}</Text>
               </TouchableOpacity>
             );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            timeline ? styles.continueButtonEnabled : styles.continueButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!timeline}
        >
          <Text style={[
            styles.continueButtonText,
            timeline ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
          ]}>
            Create My Plan
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
  timelineContainer: {
    gap: theme.spacing[3],
    marginBottom: theme.spacing[10],
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: theme.spacing.borderWidth.medium,
  },
  timelineCardSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  timelineCardUnselected: {
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: theme.spacing.borderWidth.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary[500],
  },
  radioOuterUnselected: {
    borderColor: theme.colors.neutral[300],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary[500],
  },
  timelineInfo: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '600',
  },
  timelineLabelSelected: {
    color: theme.colors.primary[600],
  },
  timelineLabelUnselected: {
    color: theme.colors.text.primary,
  },
  timelineSub: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.secondary,
  },
  goalTitle: {
    fontSize: theme.typography.heading.h3.fontSize,
    fontWeight: theme.typography.heading.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  goalSubtitle: {
    fontSize: theme.typography.body.lg.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[6],
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[8],
  },
  goalCard: {
    flex: 1,
    padding: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: theme.spacing.borderWidth.medium,
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  goalCardUnselected: {
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  goalDays: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: theme.typography.heading.h2.fontWeight,
  },
  goalDaysSelected: {
    color: theme.colors.primary[500],
  },
  goalDaysUnselected: {
    color: theme.colors.text.primary,
  },
  goalLabel: {
    fontSize: theme.typography.body.md.fontSize,
    fontWeight: '500',
    marginTop: theme.spacing[1],
  },
  goalLabelSelected: {
    color: theme.colors.primary[500],
  },
  goalLabelUnselected: {
    color: theme.colors.text.secondary,
  },
  goalSub: {
    fontSize: theme.typography.body.sm.fontSize,
    color: theme.colors.text.disabled,
    marginTop: theme.spacing[1],
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



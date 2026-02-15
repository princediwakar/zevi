import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  timelineContainer: {
    gap: 12,
    marginBottom: 40,
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  timelineCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  timelineCardUnselected: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  radioOuterSelected: {
    borderColor: '#2563EB',
  },
  radioOuterUnselected: {
    borderColor: '#CBD5E1',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  timelineInfo: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  timelineLabelSelected: {
    color: '#1D4ED8',
  },
  timelineLabelUnselected: {
    color: '#0F172A',
  },
  timelineSub: {
    fontSize: 14,
    color: '#64748B',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  goalSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  goalCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  goalCardUnselected: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  goalDays: {
    fontSize: 28,
    fontWeight: '700',
  },
  goalDaysSelected: {
    color: '#2563EB',
  },
  goalDaysUnselected: {
    color: '#1E293B',
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  goalLabelSelected: {
    color: '#2563EB',
  },
  goalLabelUnselected: {
    color: '#475569',
  },
  goalSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
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

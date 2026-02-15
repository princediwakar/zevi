import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';



export default function ReminderStep({ onNext, onBack, data, updateData }: OnboardingStepProps) {
  
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState<'morning' | 'evening'>('evening');

  const handleFinish = () => {
    updateData({ 
      preferredPracticeTime: enabled ? time : undefined
    });
    // FUTURE: Request notification permissions here
    onNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text> 
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '90%' }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>🔔</Text>
        </View>

        <Text style={styles.title}>
          Don't break your streak!
        </Text>
        <Text style={styles.subtitle}>
          People who set a daily reminder are 3x more likely to hit their goals.
        </Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Reminders</Text>
            <Switch 
              value={enabled} 
              onValueChange={setEnabled}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {enabled && (
            <View style={styles.timeOptions}>
              <Text style={styles.timeLabel}>When do you want to practice?</Text>
              
              <View style={styles.timeOptionsContainer}>
                <TouchableOpacity 
                  onPress={() => setTime('morning')}
                  style={[
                    styles.timeOption,
                    time === 'morning' ? styles.timeOptionSelected : styles.timeOptionUnselected
                  ]}
                >
                  <Text style={styles.timeEmoji}>☀️</Text>
                  <Text style={[
                    styles.timeText,
                    time === 'morning' ? styles.timeTextSelected : styles.timeTextUnselected
                  ]}>
                    Morning (8:00 AM)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setTime('evening')}
                  style={[
                    styles.timeOption,
                    time === 'evening' ? styles.timeOptionSelected : styles.timeOptionUnselected
                  ]}
                >
                  <Text style={styles.timeEmoji}>🌙</Text>
                  <Text style={[
                    styles.timeText,
                    time === 'evening' ? styles.timeTextSelected : styles.timeTextUnselected
                  ]}>
                    Evening (7:00 PM)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleFinish}
        >
          <Text style={styles.primaryButtonText}>
            Start Learning
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleFinish}
        >
          <Text style={styles.secondaryButtonText}>
            Maybe later
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary[100],
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: theme.typography.heading.h2.fontWeight,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.body.lg.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[10],
  },
  settingsCard: {
    width: '100%',
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing[6],
    borderRadius: theme.spacing.borderRadius.lg,
    marginBottom: theme.spacing[6],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  settingLabel: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
    color: theme.colors.text.primary,
  },
  timeOptions: {
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing[6],
  },
  timeLabel: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  timeOptionsContainer: {
    gap: theme.spacing[3],
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: theme.spacing.borderWidth.medium,
  },
  timeOptionSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  timeOptionUnselected: {
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  timeEmoji: {
    fontSize: 20,
    marginRight: theme.spacing[3],
  },
  timeText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
  timeTextSelected: {
    color: theme.colors.primary[600],
  },
  timeTextUnselected: {
    color: theme.colors.text.secondary,
  },
  footer: {
    padding: theme.spacing[6],
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    backgroundColor: theme.colors.primary[500],
    shadowColor: theme.colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
    color: theme.colors.text.inverse,
  },
  secondaryButton: {
    marginTop: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  secondaryButtonText: {
    fontSize: theme.typography.body.sm.fontSize,
    color: theme.colors.text.disabled,
    fontWeight: '600',
    textAlign: 'center',
  },
});



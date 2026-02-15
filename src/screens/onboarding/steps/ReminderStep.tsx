import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#DBEAFE',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  settingsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  timeOptions: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 24,
  },
  timeLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  timeOptionsContainer: {
    gap: 12,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  timeOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  timeOptionUnselected: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  timeEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeTextSelected: {
    color: '#1D4ED8',
  },
  timeTextUnselected: {
    color: '#475569',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
});

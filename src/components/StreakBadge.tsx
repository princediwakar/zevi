import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface StreakBadgeProps {
  streak: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, showLabel = true, size = 'md' }: StreakBadgeProps) {
  const { theme } = useTheme();

  const getStreakEmoji = () => {
    if (streak >= 30) return '🌟';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '✨';
    return '💪';
  };

  const getStreakColor = () => {
    if (streak >= 30) return '#FFD700'; // Gold
    if (streak >= 14) return '#FF6B6B'; // Red
    if (streak >= 7) return '#FF8C42'; // Orange
    if (streak >= 3) return '#4ECDC4'; // Teal
    return theme.colors.text.secondary;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4 },
          icon: { fontSize: 14 },
          text: { fontSize: 12 },
        };
      case 'lg':
        return {
          container: { paddingHorizontal: 16, paddingVertical: 8 },
          icon: { fontSize: 24 },
          text: { fontSize: 18 },
        };
      default:
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6 },
          icon: { fontSize: 18 },
          text: { fontSize: 14 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const color = getStreakColor();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        { 
          backgroundColor: color + '20',
          borderColor: color + '40',
        }
      ]}
    >
      <Text style={[styles.icon, sizeStyles.icon]}>{getStreakEmoji()}</Text>
      <Text
        style={[
          styles.text,
          sizeStyles.text,
          { color }
        ]}
      >
        {streak}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { color: color + '80' }]}>
          day{streak !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
}

// Milestone streak badges
export function StreakMilestoneBadge({ streak }: { streak: number }) {
  const milestones = [
    { days: 7, label: 'Week Warrior', icon: '⚡', color: '#FF8C42' },
    { days: 14, label: 'Two Week Titan', icon: '🌟', color: '#FF6B6B' },
    { days: 30, label: 'Monthly Master', icon: '🏆', color: '#FFD700' },
    { days: 100, label: 'Century Streak', icon: '💎', color: '#9B59B6' },
  ];

  const achievedMilestone = milestones
    .slice()
    .reverse()
    .find(m => streak >= m.days);

  if (!achievedMilestone) return null;

  return (
    <View
      style={[
        styles.milestoneBadge,
        { 
          backgroundColor: achievedMilestone.color + '20',
          borderColor: achievedMilestone.color,
        }
      ]}
    >
      <Text style={styles.milestoneIcon}>{achievedMilestone.icon}</Text>
      <View>
        <Text style={[styles.milestoneLabel, { color: achievedMilestone.color }]}>
          {achievedMilestone.label}
        </Text>
        <Text style={styles.milestoneDays}>
          {streak} day streak
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontWeight: '700',
  },
  label: {
    fontWeight: '500',
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  milestoneIcon: {
    fontSize: 28,
  },
  milestoneLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  milestoneDays: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

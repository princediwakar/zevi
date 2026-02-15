import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

// SWISS STYLE: No emojis - use number codes and symbols instead
interface StreakBadgeProps {
  streak: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, showLabel = true, size = 'md' }: StreakBadgeProps) {
  // Get streak level based on days
  const getStreakLevel = () => {
    if (streak >= 30) return { level: 'III', color: theme.colors.streak.gold };
    if (streak >= 14) return { level: 'II', color: theme.colors.streak.red };
    if (streak >= 7) return { level: 'I', color: theme.colors.streak.orange };
    if (streak >= 3) return { level: '+', color: theme.colors.streak.teal };
    return { level: '-', color: theme.colors.text.secondary };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingHorizontal: theme.spacing[2], paddingVertical: theme.spacing[1] },
          text: { fontSize: 12 },
          label: { fontSize: 10 },
        };
      case 'lg':
        return {
          container: { paddingHorizontal: theme.spacing[4], paddingVertical: theme.spacing[2] },
          text: { fontSize: 24 },
          label: { fontSize: 14 },
        };
      default:
        return {
          container: { paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[1] + 2 },
          text: { fontSize: 16 },
          label: { fontSize: 11 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const { level, color } = getStreakLevel();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        { 
          backgroundColor: theme.colors.surface.primary,
          borderColor: color,
          borderWidth: theme.spacing.borderWidth.thin,
        }
      ]}
    >
      <View style={[styles.levelBadge, { backgroundColor: color }]}>
        <Text style={styles.levelText}>{level}</Text>
      </View>
      <Text
        style={[
          styles.text,
          sizeStyles.text,
          { color: theme.colors.text.primary }
        ]}
      >
        {streak}
      </Text>
      {showLabel && (
        <Text style={[styles.label, sizeStyles.label, { color: theme.colors.text.secondary }]}>
          DAY{streak !== 1 ? 'S' : ''}
        </Text>
      )}
    </View>
  );
}

// Milestone streak badges - Swiss Style
export function StreakMilestoneBadge({ streak }: { streak: number }) {
  const milestones = [
    { days: 7, label: 'WEEK WARRIOR', level: 'I', color: theme.colors.streak.orange },
    { days: 14, label: 'TWO WEEK TITAN', level: 'II', color: theme.colors.streak.red },
    { days: 30, label: 'MONTHLY MASTER', level: 'III', color: theme.colors.streak.gold },
    { days: 100, label: 'CENTURY STREAK', level: 'X', color: theme.colors.streak.purple },
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
          backgroundColor: theme.colors.surface.primary,
          borderColor: achievedMilestone.color,
          borderWidth: theme.spacing.borderWidth.medium,
        }
      ]}
    >
      <View style={[styles.milestoneLevel, { backgroundColor: achievedMilestone.color }]}>
        <Text style={styles.milestoneLevelText}>{achievedMilestone.level}</Text>
      </View>
      <View>
        <Text style={[styles.milestoneLabel, { color: achievedMilestone.color }]}>
          {achievedMilestone.label}
        </Text>
        <Text style={[styles.milestoneDays, { color: theme.colors.text.secondary }]}>
          {streak} DAY STREAK
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
    gap: theme.spacing[2],
  },
  levelBadge: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: theme.colors.text.inverse,
    fontSize: 11,
    fontWeight: '800',
  },
  text: {
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
    borderWidth: theme.spacing.borderWidth.medium,
    gap: theme.spacing[4],
  },
  milestoneLevel: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneLevelText: {
    color: theme.colors.text.inverse,
    fontSize: 24,
    fontWeight: '900',
  },
  milestoneLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  milestoneDays: {
    fontSize: 12,
    marginTop: theme.spacing[1],
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

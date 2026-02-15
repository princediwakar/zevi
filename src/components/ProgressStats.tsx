import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ProgressStatsProps {
  currentStreak: number;
  totalCompleted: number;
  categoryBreakdown?: Record<string, number>;
}

// SWISS STYLE: No emojis - use number indicators instead
export function ProgressStats({ currentStreak, totalCompleted, categoryBreakdown = {} }: ProgressStatsProps) {
  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.mainStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <View style={styles.streakIndicator} />
          <Text style={styles.statLabel}>DAY STREAK</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalCompleted}</Text>
          <Text style={styles.statLabel}>COMPLETED</Text>
        </View>
      </View>

      {topCategories.length > 0 && (
        <View style={styles.categoryStats}>
          <Text style={styles.categoryTitle}>TOP CATEGORIES</Text>
          {topCategories.map(([category, count]) => (
            <View key={category} style={styles.categoryRow}>
              <Text style={styles.categoryName}>
                {category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Text>
              <Text style={styles.categoryCount}>{count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
    // SWISS STYLE: Minimal shadow
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  mainStats: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
    letterSpacing: -1,
  },
  streakIndicator: {
    width: 24,
    height: 4,
    backgroundColor: theme.colors.primary[500],
    marginBottom: theme.spacing[2],
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
  divider: {
    width: theme.spacing.borderWidth.thin,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing[4],
  },
  categoryStats: {
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing[3],
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[1] + 2,
  },
  categoryName: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary[500],
  },
});

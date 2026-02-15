import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ProgressStatsProps {
  currentStreak: number;
  totalCompleted: number;
  categoryBreakdown?: Record<string, number>;
}

export function ProgressStats({ currentStreak, totalCompleted, categoryBreakdown = {} }: ProgressStatsProps) {
  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.mainStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStreak} 🔥</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalCompleted}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {topCategories.length > 0 && (
        <View style={styles.categoryStats}>
          <Text style={styles.categoryTitle}>Top Categories</Text>
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
    borderRadius: theme.spacing[4],
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing[4],
  },
  categoryStats: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing[3],
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
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
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary[500],
  },
});

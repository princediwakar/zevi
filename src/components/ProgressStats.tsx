import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  categoryStats: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  categoryName: {
    fontSize: 14,
    color: '#374151',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

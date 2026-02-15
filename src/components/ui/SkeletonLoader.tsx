/**
 * Skeleton Loader Components
 * Pre-built loading skeletons for common screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { theme } from '../../theme';

interface SkeletonLoaderProps {
  variant?: 'home' | 'list' | 'detail';
}

/**
 * Home Screen Skeleton - matches HomeScreen layout
 */
export function HomeScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width="40%" height={14} borderRadius={4} />
        <Skeleton width="70%" height={28} borderRadius={4} style={{ marginTop: 8 }} />
      </View>

      {/* Stats Grid Skeleton */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Skeleton width="30%" height={24} borderRadius={4} />
          <Skeleton width="50%" height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
        <View style={styles.statBox}>
          <Skeleton width="30%" height={24} borderRadius={4} />
          <Skeleton width="50%" height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
        <View style={styles.statBox}>
          <Skeleton width="30%" height={24} borderRadius={4} />
          <Skeleton width="50%" height={10} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
      </View>

      {/* Quick Actions Skeleton */}
      <View style={styles.section}>
        <Skeleton width="100%" height={80} borderRadius={0} />
      </View>

      {/* Practice Tracks Skeleton */}
      <View style={styles.section}>
        <Skeleton width="40%" height={12} borderRadius={4} />
        <View style={styles.trackCards}>
          <Skeleton width="100%" height={100} borderRadius={0} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={100} borderRadius={0} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={100} borderRadius={0} />
        </View>
      </View>
    </View>
  );
}

/**
 * Question List Skeleton - matches QuestionListScreen layout
 */
export function QuestionListSkeleton() {
  return (
    <View style={styles.container}>
      {/* Search Bar Skeleton */}
      <View style={styles.section}>
        <Skeleton width="100%" height={48} borderRadius={0} />
      </View>

      {/* Filter Chips Skeleton */}
      <View style={styles.filterRow}>
        <Skeleton width={80} height={32} borderRadius={16} />
        <Skeleton width={100} height={32} borderRadius={16} />
        <Skeleton width={90} height={32} borderRadius={16} />
      </View>

      {/* Question Cards Skeleton */}
      <View style={styles.listContent}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.questionCard}>
            <View style={styles.cardHeader}>
              <Skeleton width={80} height={20} borderRadius={0} />
              <Skeleton width={60} height={20} borderRadius={0} />
            </View>
            <Skeleton width="100%" height={40} borderRadius={4} style={{ marginTop: 8 }} />
            <Skeleton width="60%" height={16} borderRadius={4} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Question Detail Skeleton - matches QuestionDetailScreen layout
 */
export function QuestionDetailSkeleton() {
  return (
    <View style={styles.container}>
      {/* Back Button & Badges */}
      <View style={styles.section}>
        <Skeleton width={60} height={16} borderRadius={4} />
        <View style={styles.badges}>
          <Skeleton width={80} height={24} borderRadius={0} />
          <Skeleton width={70} height={24} borderRadius={0} />
          <Skeleton width={60} height={24} borderRadius={0} />
        </View>
      </View>

      {/* Question Text */}
      <View style={styles.section}>
        <Skeleton width="100%" height={60} borderRadius={4} />
      </View>

      {/* Hint Button */}
      <View style={styles.section}>
        <Skeleton width={140} height={36} borderRadius={0} />
      </View>

      {/* Expert Answer Preview */}
      <View style={styles.section}>
        <Skeleton width="40%" height={12} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={120} borderRadius={4} />
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Skeleton width="100%" height={48} borderRadius={0} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={56} borderRadius={0} />
      </View>
    </View>
  );
}

/**
 * Main SkeletonLoader component
 */
export function SkeletonLoader({ variant = 'home' }: SkeletonLoaderProps) {
  switch (variant) {
    case 'list':
      return <QuestionListSkeleton />;
    case 'detail':
      return <QuestionDetailSkeleton />;
    case 'home':
    default:
      return <HomeScreenSkeleton />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing[4],
  },
  header: {
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
    marginHorizontal: -theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  statBox: {
    flex: 1,
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing[4],
  },
  trackCards: {
    marginTop: theme.spacing[4],
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[6],
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  listContent: {
    padding: theme.spacing[6],
  },
  questionCard: {
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing[6],
    backgroundColor: theme.colors.surface.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
});

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
    <View style={styles.homeContainer}>
      {/* Top bar - Swiss grid */}
      <View style={styles.homeTopBar}>
        <Skeleton width={60} height={20} borderRadius={0} />
        <Skeleton width={40} height={32} borderRadius={0} />
      </View>

      <View style={styles.homeContent}>
        {/* TODAY'S QUESTION Section */}
        <View style={styles.homeQuestionSection}>
          <Skeleton width={140} height={14} borderRadius={0} style={{ marginBottom: 16 }} />
          
          {/* Question card - bordered */}
          <View style={styles.homeQuestionCard}>
            <Skeleton width="90%" height={28} borderRadius={0} style={{ marginBottom: 8 }} />
            <Skeleton width="70%" height={28} borderRadius={0} />
          </View>

          {/* Meta row skeleton */}
          <View style={styles.homeMetaRow}>
            <Skeleton width={100} height={32} borderRadius={0} />
            <Skeleton width={80} height={32} borderRadius={0} />
            <Skeleton width={90} height={32} borderRadius={0} />
          </View>
        </View>

        {/* START Button skeleton */}
        <Skeleton width="100%" height={56} borderRadius={0} style={{ marginBottom: 24 }} />

        {/* Category List Section skeleton */}
        <Skeleton width={180} height={14} borderRadius={0} style={{ marginBottom: 16 }} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <View key={i} style={styles.homeCategoryRow}>
            <Skeleton width={120} height={20} borderRadius={0} />
            <Skeleton width={50} height={16} borderRadius={0} />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Learn Screen Skeleton - matches LearnScreen layout
 */
export function LearnScreenSkeleton() {
  return (
    <View style={styles.learnContainer}>
      {/* Header - Swiss bold */}
      <View style={styles.learnHeader}>
        <Skeleton width={80} height={24} borderRadius={0} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Skeleton width={60} height={20} borderRadius={0} />
          <Skeleton width={40} height={32} borderRadius={0} />
        </View>
      </View>

      <View style={styles.learnContent}>
        {/* NEXT LESSON Section */}
        <View style={styles.learnLessonSection}>
          <Skeleton width={120} height={14} borderRadius={0} style={{ marginBottom: 16 }} />
          
          {/* Lesson card - stark bordered */}
          <View style={styles.learnLessonCard}>
            <Skeleton width="80%" height={28} borderRadius={0} style={{ marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Skeleton width={60} height={18} borderRadius={0} />
              <Skeleton width={60} height={18} borderRadius={0} />
            </View>
          </View>

          {/* START button skeleton */}
          <Skeleton width="100%" height={56} borderRadius={0} />
        </View>

        {/* Path List Section skeleton */}
        <Skeleton width={200} height={14} borderRadius={0} style={{ marginBottom: 16 }} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <View key={i} style={styles.learnPathRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Skeleton width={40} height={40} borderRadius={0} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Skeleton width={120} height={20} borderRadius={0} style={{ marginBottom: 4 }} />
                <Skeleton width="60%" height={14} borderRadius={0} />
              </View>
            </View>
            <Skeleton width={50} height={16} borderRadius={0} />
          </View>
        ))}
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
  // Home Screen Skeleton Styles
  homeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  homeTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss?.layout?.headerPaddingTop || 60,
    paddingHorizontal: theme.swiss?.layout?.screenPadding || 16,
    paddingBottom: theme.swiss?.layout?.headerPaddingBottom || 12,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.text.primary,
  },
  homeContent: {
    flex: 1,
    paddingHorizontal: theme.swiss?.layout?.screenPadding || 16,
    paddingTop: theme.swiss?.layout?.sectionGap || 24,
  },
  homeQuestionSection: {
    marginBottom: theme.swiss?.layout?.elementGap || 16,
  },
  homeQuestionCard: {
    borderWidth: 1,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss?.layout?.sectionGap || 24,
    marginBottom: theme.swiss?.layout?.elementGap || 16,
    minHeight: 150,
    justifyContent: 'center',
  },
  homeMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.swiss?.layout?.sectionGap || 24,
  },
  homeCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  // Learn Screen Skeleton Styles
  learnContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  learnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss?.layout?.headerPaddingTop || 60,
    paddingHorizontal: theme.swiss?.layout?.screenPadding || 16,
    paddingBottom: theme.swiss?.layout?.headerPaddingBottom || 12,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.text.primary,
  },
  learnContent: {
    flex: 1,
    paddingHorizontal: theme.swiss?.layout?.screenPadding || 16,
    paddingTop: theme.swiss?.layout?.sectionGap || 24,
  },
  learnLessonSection: {
    marginBottom: theme.swiss?.layout?.elementGap || 16,
  },
  learnLessonCard: {
    borderWidth: 1,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss?.layout?.sectionGap || 24,
    marginBottom: theme.swiss?.layout?.elementGap || 16,
  },
  learnPathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
});

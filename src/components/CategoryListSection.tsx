import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useProgressStore } from '../stores/progressStore';
import { useQuestionsStore } from '../stores/questionsStore';
import { QuestionCategory } from '../types';
import { theme } from '../theme';
import { ArrowRight } from 'lucide-react-native';

type CategoryListSectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Category labels
const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  product_sense: 'Product Sense',
  execution: 'Execution',
  strategy: 'Strategy',
  behavioral: 'Behavioral',
  technical: 'Technical',
  estimation: 'Estimation',
  pricing: 'Pricing',
  ab_testing: 'A/B Testing',
};

// Categories to display
const CATEGORIES: QuestionCategory[] = [
  'product_sense',
  'execution',
  'strategy',
  'behavioral',
  'technical',
  'estimation',
  'pricing',
  'ab_testing'
];

interface CategoryListSectionProps {
  onCategoryPress?: (category: QuestionCategory) => void;
  showTitle?: boolean;
}

export function CategoryListSection({ 
  onCategoryPress,
  showTitle = true 
}: CategoryListSectionProps) {
  const navigation = useNavigation<CategoryListSectionNavigationProp>();
  const { progress, loading: progressLoading } = useProgressStore();
  const { categoryStats, loading: statsLoading } = useQuestionsStore();

  const isLoading = progressLoading || statsLoading;

  // Get category progress - maintain fixed order from CATEGORIES array
  const categoryProgress = useMemo(() => {
    return CATEGORIES.map(cat => {
      const completed = progress?.category_progress?.[cat] ?? 0;
      const total = categoryStats[cat] || 0;
      // Cap completed at total to avoid display issues (data integrity bug workaround)
      const displayCompleted = Math.min(completed, total);
      return {
        category: cat,
        completed: displayCompleted,
        total,
        percent: total > 0 ? Math.round((displayCompleted / total) * 100) : 0,
      };
    });
    // No sorting - keep the fixed order: product_sense, execution, strategy, behavioral, technical, estimation, pricing, ab_testing
  }, [progress, categoryStats]);

  const handleCategoryPress = (category: QuestionCategory) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      // Default navigation behavior
      navigation.navigate('QuestionList', { category });
    }
  };

  // Show placeholder rows during loading to prevent layout shifts
  if (isLoading) {
    return (
      <View style={styles.container}>
        {showTitle && <Text style={styles.title}>BROWSE BY CATEGORY</Text>}
        {CATEGORIES.map((cat) => (
          <View key={cat} style={styles.categoryRow}>
            <View style={styles.categoryRowLeft}>
              <Text style={styles.categoryLabel}>{CATEGORY_LABELS[cat]}</Text>
            </View>
            <View style={styles.categoryRowRight}>
              <View style={styles.progressContainer}>
                <View style={styles.progressIndicator} />
              </View>
              <Text style={styles.categoryCount}>—</Text>
              <ArrowRight size={20} color={theme.colors.text.secondary} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // Show placeholder rows when no questions available
  const hasAnyQuestions = Object.values(categoryStats).some(count => count > 0);
  if (!hasAnyQuestions) {
    return (
      <View style={styles.container}>
        {showTitle && <Text style={styles.title}>BROWSE BY CATEGORY</Text>}
        {CATEGORIES.map((cat) => (
          <View key={cat} style={styles.categoryRow}>
            <View style={styles.categoryRowLeft}>
              <Text style={styles.categoryLabel}>{CATEGORY_LABELS[cat]}</Text>
            </View>
            <View style={styles.categoryRowRight}>
              <View style={styles.progressContainer}>
                <View style={styles.progressIndicator} />
              </View>
              <Text style={styles.categoryCount}>0/0</Text>
              <ArrowRight size={20} color={theme.colors.text.secondary} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={styles.title}>BROWSE BY CATEGORY</Text>
      )}
      
      {categoryProgress.map((cat) => {
        const isNext = cat.completed < cat.total;
        
        return (
          <TouchableOpacity
            key={cat.category}
            style={[
              styles.categoryRow,
              // Always reserve space for the left border to prevent shifts
              { paddingLeft: theme.spacing[3] },
              isNext && cat.completed > 0 && styles.categoryRowNext,
            ]}
            onPress={() => handleCategoryPress(cat.category)}
            activeOpacity={0.7}
          >
            {/* Category name - bold */}
            <View style={styles.categoryRowLeft}>
              <Text style={[
                styles.categoryLabel,
                cat.completed >= cat.total && cat.total > 0 && styles.categoryLabelDone,
              ]}>
                {CATEGORY_LABELS[cat.category]}
              </Text>
            </View>
            
            {/* Count and progress - Always render progress container to prevent shifts */}
            <View style={styles.categoryRowRight}>
              <View style={[styles.progressContainer, cat.completed === 0 && styles.progressContainerHidden]}>
                <View style={styles.progressIndicator}>
                  <View style={[styles.progressFill, { width: `${Math.min(cat.percent, 100)}%` }]} />
                </View>
              </View>
              <Text style={[
                styles.categoryCount,
                cat.completed >= cat.total && cat.total > 0 && styles.categoryCountDone,
              ]}>
                {cat.completed}/{cat.total}
              </Text>
              <ArrowRight size={20} color={theme.colors.text.secondary} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[10],
  },
  title: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[4],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  categoryRowNext: {
    backgroundColor: theme.colors.neutral[50],
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text.primary,
    paddingLeft: theme.spacing[3] - 3, // Adjust for border width
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  categoryLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  categoryLabelDone: {
    color: theme.colors.text.secondary,
  },
  categoryCount: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    minWidth: 50,
    textAlign: 'right',
  },
  categoryCountDone: {
    color: theme.colors.text.disabled,
  },
  progressContainer: {
    width: 60,
  },
  progressContainerHidden: {
    opacity: 0,
  },
  progressIndicator: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.text.primary,
    borderRadius: 2,
  },
  loadingContainer: {
    paddingVertical: theme.spacing[8],
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: theme.spacing[8],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
  },
});

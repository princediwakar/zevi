import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useQuestionsStore } from '../stores/questionsStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { QuestionCategory, QUESTION_CATEGORIES } from '../types';
import { theme } from '../theme';
import { ArrowRight } from 'lucide-react-native';

type CategoryBrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryBrowse'>;

// Swiss design - all black
const CATEGORY_INFO: Record<QuestionCategory, { label: string; color: string }> = {
  product_sense: { label: 'PRODUCT SENSE', color: theme.colors.text.primary },
  execution: { label: 'EXECUTION', color: theme.colors.text.primary },
  strategy: { label: 'STRATEGY', color: theme.colors.text.primary },
  behavioral: { label: 'BEHAVIORAL', color: theme.colors.text.primary },
  estimation: { label: 'ESTIMATION', color: theme.colors.text.primary },
  technical: { label: 'TECHNICAL', color: theme.colors.text.primary },
  pricing: { label: 'PRICING', color: theme.colors.text.primary },
  ab_testing: { label: 'A/B TESTING', color: theme.colors.text.primary },
};

export default function CategoryBrowseScreen() {
  const navigation = useNavigation<CategoryBrowseScreenNavigationProp>();
  const { categoryStats, fetchCategoryStats } = useQuestionsStore();
  const { progress, fetchProgress, getCategoryProgress } = useProgressStore();
  const { user, isGuest, guestId } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  const userId = user?.id || guestId;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchCategoryStats();
    if (userId) {
      await fetchProgress(userId, isGuest);
      const catProgress = await getCategoryProgress(userId, isGuest);
      setUserProgress(catProgress);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const categories: QuestionCategory[] = [
    'product_sense',
    'execution',
    'strategy',
    'behavioral',
    'estimation',
    'technical',
    'pricing',
    'ab_testing'
  ];

  // Find the next category to practice (least progress)
  const nextCategory = React.useMemo(() => {
    let minProgress = Infinity;
    let nextCat: QuestionCategory | null = null;
    
    categories.forEach(cat => {
      const completed = userProgress[cat] || 0;
      const total = categoryStats[cat] || 0;
      if (total > 0 && completed < total && completed < minProgress) {
        minProgress = completed;
        nextCat = cat;
      }
    });
    
    // If all completed, find one with any questions
    if (!nextCat) {
      for (const cat of categories) {
        const total = categoryStats[cat] || 0;
        if (total > 0) {
          nextCat = cat;
          break;
        }
      }
    }
    
    return nextCat;
  }, [userProgress, categoryStats, categories]);

  const handleCategoryPress = (category: QuestionCategory) => {
    navigation.navigate('QuestionList', { category });
  };

  return (
    <View style={styles.container}>
      {/* Swiss header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BROWSE</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.text.primary} />
        }
      >

        {/* Categories as stark rows */}
        {categories.map((category) => {
          const info = CATEGORY_INFO[category];
          const count = categoryStats[category] || 0;
          const progress = userProgress[category] || 0;
          const isNext = category === nextCategory;

          return (
            <TouchableOpacity
              key={category}
              style={[styles.categoryRow, isNext && styles.categoryRowNext]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              {/* NEXT badge */}
              {isNext && (
                <View style={styles.nextBadge}>
                  <Text style={styles.nextBadgeText}>NEXT</Text>
                </View>
              )}
              
              {/* Category name - bold */}
              <Text style={[styles.categoryLabel, isNext && styles.categoryLabelNext]}>{info.label}</Text>
              
              {/* Count and progress */}
              <View style={styles.categoryMeta}>
                <Text style={[styles.categoryCount, progress > 0 && styles.categoryCountDone]}>{count} Q</Text>
                {progress > 0 && (
                  <View style={styles.progressIndicator}>
                    <View style={[styles.progressFill, { width: `${Math.min(100, progress)}%` }]} />
                  </View>
                )}
                <ArrowRight size={20} color={isNext ? theme.colors.text.primary : theme.colors.text.secondary} />
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header - Swiss style
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  backButton: {
    width: 80,
  },
  backText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  headerSpacer: {
    width: 80,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  
  // Separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.swiss.layout.sectionGap,
  },
  
  // Category Row - Swiss bordered
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[5],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.border.light,
  },
  categoryRowNext: {
    backgroundColor: theme.colors.neutral[50],
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text.primary,
    paddingLeft: theme.spacing[2],
    marginLeft: -theme.spacing[2],
  },
  nextBadge: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    marginRight: theme.spacing[2],
  },
  nextBadgeText: {
    fontSize: 10,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  categoryLabel: {
    fontSize: theme.swiss.fontSize.heading - 6,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  categoryLabelNext: {
    fontWeight: theme.swiss.fontWeight.black,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  categoryCount: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  categoryCountDone: {
    color: theme.colors.text.disabled,
  },
  progressIndicator: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.text.primary,
  },
  arrow: {
    fontSize: theme.swiss.fontSize.label + 4,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});

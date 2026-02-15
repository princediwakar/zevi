import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useQuestionsStore } from '../stores/questionsStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { QuestionCategory } from '../types';
import { theme } from '../theme';

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
  const { getCategoryProgress } = useProgressStore();
  const { user } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchCategoryStats();
    if (user) {
      const progress = await getCategoryProgress(user.id);
      setUserProgress(progress);
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
  ];

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
        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Categories as stark rows */}
        {categories.map((category) => {
          const info = CATEGORY_INFO[category];
          const count = categoryStats[category] || 0;
          const progress = userProgress[category] || 0;

          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryRow}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              {/* Category name - bold */}
              <Text style={styles.categoryLabel}>{info.label}</Text>
              
              {/* Count and progress */}
              <View style={styles.categoryMeta}>
                <Text style={styles.categoryCount}>{count} Q</Text>
                {progress > 0 && (
                  <View style={styles.progressIndicator}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                )}
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.separator} />
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
  categoryLabel: {
    fontSize: theme.swiss.fontSize.heading - 6,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
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

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

const CATEGORY_INFO: Record<QuestionCategory, { label: string; color: string }> = {
  product_sense: { label: 'PRODUCT SENSE', color: '#000000' },
  execution: { label: 'EXECUTION', color: '#000000' },
  strategy: { label: 'STRATEGY', color: '#000000' },
  behavioral: { label: 'BEHAVIORAL', color: '#000000' },
  estimation: { label: 'ESTIMATION', color: '#000000' },
  technical: { label: 'TECHNICAL', color: '#000000' },
  pricing: { label: 'PRICING', color: '#000000' },
  ab_testing: { label: 'A/B TESTING', color: '#000000' },
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  backButton: {
    width: 80,
  },
  backText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
  headerSpacer: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  separator: {
    height: 3,
    backgroundColor: '#000000',
    marginVertical: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  progressIndicator: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E5E5',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  arrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

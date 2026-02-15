import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { FRAMEWORKS } from '../data/frameworks';
import { QuestionCategory, QUESTION_CATEGORIES } from '../types';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useAuth } from '../hooks/useAuth';
import { Spacer, H1, H2, BodySM } from '../components';
import { CheckCircle, ArrowRight } from 'lucide-react-native';

type LearnScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LearnScreen'>;

// Swiss design: minimal, high contrast
const CATEGORY_INFO: Record<QuestionCategory, { label: string; icon: string; color: string }> = {
  product_sense: { label: 'Product Sense', icon: '💡', color: '#2563EB' },
  execution: { label: 'Execution', icon: '⚡', color: '#7C3AED' },
  strategy: { label: 'Strategy', icon: '🎯', color: '#059669' },
  behavioral: { label: 'Behavioral', icon: '👤', color: '#F59E0B' },
  technical: { label: 'Technical', icon: '🔧', color: '#EC4899' },
  estimation: { label: 'Estimation', icon: '📊', color: '#14B8A6' },
  pricing: { label: 'Pricing', icon: '💰', color: '#64748B' },
  ab_testing: { label: 'A/B Testing', icon: '🧪', color: '#EF4444' },
};

interface CategoryWithProgress {
  category: QuestionCategory;
  label: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
}

export default function LearnScreen() {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  const { user, isGuest, guestId } = useAuth();
  const { progress, fetchProgress, readinessScore, fetchWeakAreas } = useProgressStore();
  const { units, fetchPath } = useLearningPathStore();
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id || guestId;

  // Fetch data on focus
  useFocusEffect(
    useCallback(() => {
      fetchPath();
      if (userId) {
        fetchProgress(userId, isGuest);
        fetchWeakAreas(userId, isGuest);
      }
    }, [userId, isGuest, fetchPath, fetchProgress, fetchWeakAreas])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPath(),
      userId ? fetchProgress(userId, isGuest) : Promise.resolve(),
      userId ? fetchWeakAreas(userId, isGuest) : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [userId, isGuest, fetchPath, fetchProgress, fetchWeakAreas]);

  // Group units by category and calculate progress
  const categoriesWithProgress = useMemo((): CategoryWithProgress[] => {
    const completedLessonIds = new Set(progress?.completed_lessons || []);
    
    // Count lessons by category
    const categoryMap = new Map<QuestionCategory, { completed: number; total: number }>();
    
    QUESTION_CATEGORIES.forEach(cat => {
      categoryMap.set(cat, { completed: 0, total: 0 });
    });
    
    units.forEach(unit => {
      const category = (unit as any).pathCategory || 'product_sense';
      const catData = categoryMap.get(category) || { completed: 0, total: 0 };
      catData.total += (unit.lessons?.length || 0);
      catData.completed += (unit.lessons?.filter((l: any) => completedLessonIds.has(l.id)).length || 0);
      categoryMap.set(category, catData);
    });
    
    return QUESTION_CATEGORIES.map(cat => {
      const data = categoryMap.get(cat) || { completed: 0, total: 0 };
      const info = CATEGORY_INFO[cat];
      return {
        category: cat,
        label: info.label,
        icon: info.icon,
        color: info.color,
        completed: data.completed,
        total: data.total,
      };
    });
  }, [units, progress]);

  // Calculate overall stats
  const totalLessons = categoriesWithProgress.reduce((sum, c) => sum + c.total, 0);
  const totalCompleted = categoriesWithProgress.reduce((sum, c) => sum + c.completed, 0);
  const progressPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const handleCategoryPress = (category: QuestionCategory) => {
    navigation.navigate('CategoryDetail', { category });
  };

  const currentReadiness = readinessScore || progress?.readiness_score || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <H1 style={styles.title}>LEARN</H1>
        <BodySM color="secondary" style={styles.headerSubtitle}>
          {totalCompleted}/{totalLessons} lessons completed
        </BodySM>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{progress?.current_streak || 0}</Text>
            <Text style={styles.statLabel}>streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{totalCompleted * 10}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{currentReadiness}%</Text>
            <Text style={styles.statLabel}>ready</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
      >
        {/* Categories with Progress */}
        <Text style={styles.sectionTitle}>YOUR LEARNING PATHS</Text>
        
        {categoriesWithProgress.map((cat) => {
          const catProgress = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
          const hasLessons = cat.total > 0;
          
          return (
            <TouchableOpacity
              key={cat.category}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat.category)}
              activeOpacity={0.7}
            >
              {/* Left: Icon */}
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                <Text style={styles.categoryIconText}>{cat.icon}</Text>
              </View>

              {/* Center: Info */}
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                {hasLessons ? (
                  <View style={styles.categoryProgressRow}>
                    <View style={styles.categoryProgressBar}>
                      <View 
                        style={[
                          styles.categoryProgressFill, 
                          { width: `${catProgress}%`, backgroundColor: cat.color }
                        ]} 
                      />
                    </View>
                    <Text style={styles.categoryProgressText}>
                      {cat.completed}/{cat.total}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.categoryEmpty}>No lessons yet</Text>
                )}
              </View>

              {/* Right: Arrow */}
              <ArrowRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}

        <Spacer size={40} />
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
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[5],
    paddingHorizontal: theme.spacing[6],
    backgroundColor: '#2563EB',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[4],
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing[4],
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: theme.spacing[3],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[6],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: theme.spacing[4],
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: theme.spacing[4],
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  categoryProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryEmpty: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});

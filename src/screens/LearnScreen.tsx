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
import { FRAMEWORKS, FrameworkDefinition } from '../data/frameworks';
import { QuestionCategory, QUESTION_CATEGORIES, FrameworkName } from '../types';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useAuth } from '../hooks/useAuth';
import { Spacer, H1, H2, H3, BodyMD, BodySM, LabelSM, Card, Row, Column } from '../components';

type LearnScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LearnScreen'>;

// Category info mapping - Using Swiss-style theme colors
const CATEGORY_INFO: Record<QuestionCategory, { label: string; icon: string; color: string; description: string }> = {
  product_sense: { label: 'Product Sense', icon: '💡', color: theme.colors.primary[500], description: 'Design, improve, and add features to products' },
  execution: { label: 'Execution', icon: '⚡', color: theme.colors.primary[600], description: 'Metrics, prioritization, and roadmap planning' },
  strategy: { label: 'Strategy', icon: '🎯', color: theme.colors.primary[700], description: 'Business strategy and market analysis' },
  behavioral: { label: 'Behavioral', icon: '👤', color: theme.colors.semantic.success, description: 'Leadership, teamwork, and conflicts' },
  technical: { label: 'Technical', icon: '🔧', color: theme.colors.primary[400], description: 'Technical PM questions and system design' },
  estimation: { label: 'Estimation', icon: '📊', color: theme.colors.semantic.warning, description: 'Fermi estimates and guesstimates' },
  pricing: { label: 'Pricing', icon: '💰', color: theme.colors.neutral[500], description: 'Pricing strategies and models' },
  ab_testing: { label: 'A/B Testing', icon: '🧪', color: theme.colors.semantic.error, description: 'Experiment design and analysis' },
};

// Get frameworks that belong to a category
const getFrameworksByCategory = (category: QuestionCategory): FrameworkDefinition[] => {
  return Object.values(FRAMEWORKS).filter(
    (fw) => fw.category === category || fw.applicable_categories?.includes(category)
  );
};

export default function LearnScreen() {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  const { user, isGuest, guestId } = useAuth();
  const { progress, fetchProgress, readinessScore, weakAreas, fetchWeakAreas } = useProgressStore();
  const { path, units, fetchPath } = useLearningPathStore();
  const [searchQuery, setSearchQuery] = useState('');
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

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPath(),
      userId ? fetchProgress(userId, isGuest) : Promise.resolve(),
      userId ? fetchWeakAreas(userId, isGuest) : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [userId, isGuest, fetchPath, fetchProgress, fetchWeakAreas]);

  // Get all frameworks as an array
  const frameworks = Object.values(FRAMEWORKS);

  // Filter frameworks by search
  const filteredFrameworks = frameworks.filter(
    (fw) =>
      fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories by search
  const filteredCategories = QUESTION_CATEGORIES.filter(
    (cat) =>
      CATEGORY_INFO[cat].label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get framework mastery from progress
  const getFrameworkMastery = (frameworkName: string): number => {
    return progress?.framework_mastery?.[frameworkName.toLowerCase()] || 0;
  };

  // Get category mastery from progress
  const getCategoryMastery = (category: string): number => {
    return progress?.category_progress?.[category] || 0;
  };

  // Get framework count for a category
  const getFrameworkCount = (category: QuestionCategory): number => {
    return getFrameworksByCategory(category).length;
  };

  // Calculate total lessons in path
  const totalLessons = useMemo(() => {
    return units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0);
  }, [units]);

  // Calculate completed lessons
  const completedLessons = useMemo(() => {
    return progress?.completed_lessons?.length || 0;
  }, [progress]);

  // Get recommended category based on weak areas
  const recommendedCategory = useMemo((): QuestionCategory | null => {
    if (weakAreas && weakAreas.length > 0) {
      return weakAreas[0].category as QuestionCategory;
    }
    // Default to product_sense for new users
    return 'product_sense';
  }, [weakAreas]);

  // Get the next recommended lesson (first incomplete lesson in weak area)
  const recommendedLesson = useMemo(() => {
    if (!units || units.length === 0) return null;
    
    // If we have weak areas, prioritize those
    if (weakAreas && weakAreas.length > 0) {
      const targetCategory = weakAreas[0].category;
      for (const unit of units) {
        if (unit.lessons) {
          for (const lesson of unit.lessons) {
            // Check if this lesson belongs to weak category and is not completed
            if ((lesson as any).category === targetCategory && 
                !progress?.completed_lessons?.includes(lesson.id)) {
              return lesson;
            }
          }
        }
      }
    }
    
    // Fallback: return first incomplete lesson
    for (const unit of units) {
      if (unit.lessons) {
        for (const lesson of unit.lessons) {
          if (!progress?.completed_lessons?.includes(lesson.id)) {
            return lesson;
          }
        }
      }
    }
    return null;
  }, [units, weakAreas, progress]);

  // Current readiness score
  const currentReadiness = readinessScore || progress?.readiness_score || 0;

  // Get total estimated time remaining
  const estimatedTimeRemaining = useMemo(() => {
    const remainingLessons = totalLessons - completedLessons;
    const avgMinutesPerLesson = 10; // Average lesson time
    return remainingLessons * avgMinutesPerLesson;
  }, [totalLessons, completedLessons]);

  const handleFrameworkPress = (frameworkName: string) => {
    navigation.navigate('FrameworkDetail', { frameworkName });
  };

  const handleCategoryPress = (category: string) => {
    navigation.navigate('CategoryDetail', { category });
  };

  const handleContinueLearning = () => {
    // Prioritize recommended lesson if available
    const lessonToStart = recommendedLesson || (units.length > 0 && units[0].lessons?.length > 0 ? units[0].lessons[0] : null);
    if (lessonToStart) {
      navigation.navigate('LessonScreen', { lessonId: lessonToStart.id });
    }
  };

  const handleStartRecommended = () => {
    if (recommendedLesson) {
      navigation.navigate('LessonScreen', { lessonId: recommendedLesson.id });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with readiness score */}
      <View style={styles.header}>
        <H1 style={styles.title}>LEARN</H1>
        <BodySM color="secondary" style={styles.headerSubtitle}>
          Master frameworks for PM interviews
        </BodySM>
        
        {/* Readiness Score Banner */}
        {currentReadiness > 0 && (
          <View style={styles.readinessBanner}>
            <View style={styles.readinessInfo}>
              <Text style={styles.readinessLabel}>Interview Ready</Text>
              <Text style={styles.readinessValue}>{currentReadiness}%</Text>
            </View>
            <View style={styles.readinessBar}>
              <View 
                style={[
                  styles.readinessFill, 
                  { 
                    width: `${currentReadiness}%`,
                    backgroundColor: currentReadiness >= 80 ? theme.colors.semantic.success : 
                                   currentReadiness >= 50 ? theme.colors.semantic.warning : theme.colors.primary[500]
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search frameworks or categories..."
            placeholderTextColor={theme.colors.text.disabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Personalized Recommendation Card */}
        {recommendedCategory && currentReadiness < 100 && (
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>RECOMMENDED FOR YOU</H2>
            <TouchableOpacity
              style={[styles.recommendedCard, { borderLeftColor: CATEGORY_INFO[recommendedCategory].color }]}
              onPress={handleStartRecommended}
              activeOpacity={0.8}
            >
              <View style={styles.recommendedContent}>
                <View style={styles.recommendedHeader}>
                  <Text style={styles.recommendedBadge}>Based on your weak areas</Text>
                </View>
                <Text style={styles.recommendedTitle}>
                  {CATEGORY_INFO[recommendedCategory].icon} {CATEGORY_INFO[recommendedCategory].label}
                </Text>
                <Text style={styles.recommendedDescription}>
                  Focus on {CATEGORY_INFO[recommendedCategory].description.toLowerCase()}
                </Text>
                {weakAreas.length > 0 && weakAreas[0].successRate && (
                  <Text style={styles.recommendedContext}>
                    Your success rate: {Math.round(weakAreas[0].successRate)}% in this area
                  </Text>
                )}
              </View>
              <View style={styles.recommendedAction}>
                <Text style={styles.recommendedArrow}>Start →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Continue Learning Section - Enhanced */}
        {(units.length > 0 && units[0].lessons?.length > 0) && (
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>CONTINUE LEARNING</H2>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={handleContinueLearning}
              activeOpacity={0.8}
            >
              <Row style={styles.continueHeader}>
                <View style={styles.continueIconContainer}>
                  <Text style={styles.continueIcon}>📖</Text>
                </View>
                <Column style={styles.continueInfo}>
                  <LabelSM color="secondary">{path?.name || 'Your Learning Path'}</LabelSM>
                  <Text style={styles.continueTitle}>
                    {recommendedLesson?.name || units[0].lessons[0].name}
                  </Text>
                  {/* Progress context */}
                  <View style={styles.progressContext}>
                    <Text style={styles.progressText}>
                      {completedLessons} of {totalLessons} lessons completed
                    </Text>
                    <Text style={styles.timeText}>
                      ~{estimatedTimeRemaining} min remaining
                    </Text>
                  </View>
                </Column>
                <Text style={styles.continueArrow}>→</Text>
              </Row>
              {/* Progress bar */}
              <View style={styles.pathProgressBar}>
                <View 
                  style={[
                    styles.pathProgressFill, 
                    { width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Frameworks Section */}
        <View style={styles.section}>
          <Row style={styles.sectionHeader}>
            <H2 style={styles.sectionTitle}>FRAMEWORKS</H2>
            <TouchableOpacity onPress={() => {/* Could navigate to full frameworks list */}}>
              <LabelSM color="primary">See All →</LabelSM>
            </TouchableOpacity>
          </Row>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.frameworksScroll}
          >
            {filteredFrameworks.map((framework) => {
              const mastery = getFrameworkMastery(framework.name);
              return (
                <TouchableOpacity
                  key={framework.name}
                  style={styles.frameworkCard}
                  onPress={() => handleFrameworkPress(framework.name)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.frameworkIcon, { backgroundColor: framework.color }]}>
                    <Text style={styles.frameworkIconText}>{framework.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.frameworkName}>{framework.name}</Text>
                  <Text style={styles.frameworkDescription} numberOfLines={2}>
                    {framework.description}
                  </Text>
                  <View style={styles.masteryContainer}>
                    <View style={styles.masteryBar}>
                      <View
                        style={[
                          styles.masteryFill,
                          { width: `${mastery}%`, backgroundColor: framework.color },
                        ]}
                      />
                    </View>
                    <Text style={styles.masteryText}>{mastery}%</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* By Category Section */}
        <View style={styles.section}>
          <Row style={styles.sectionHeader}>
            <H2 style={styles.sectionTitle}>BY CATEGORY</H2>
            <LabelSM color="secondary">{filteredCategories.length}</LabelSM>
          </Row>

          {filteredCategories.slice(0, 6).map((category) => {
            const info = CATEGORY_INFO[category];
            const mastery = getCategoryMastery(category);
            const frameworkCount = getFrameworkCount(category);

            // Check if this is a weak area
            const isWeakArea = weakAreas?.some(w => w.category === category);
            
            // Calculate concepts mastered (approximation)
            const conceptsMastered = Math.round((mastery / 100) * frameworkCount);

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryCard,
                  isWeakArea && styles.categoryCardHighlight
                ]}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <Row style={styles.categoryRow}>
                  <View style={[styles.categoryIcon, { backgroundColor: info.color + '20' }]}>
                    <Text style={styles.categoryIconText}>{info.icon}</Text>
                  </View>
                  <Column style={styles.categoryInfo}>
                    <Row style={styles.categoryNameRow}>
                      <Text style={styles.categoryName}>{info.label}</Text>
                      {isWeakArea && (
                        <View style={[styles.weakBadge, { backgroundColor: theme.colors.semantic.error + '20' }]}>
                          <Text style={[styles.weakBadgeText, { color: theme.colors.semantic.error }]}>
                            Needs work
                          </Text>
                        </View>
                      )}
                    </Row>
                    <BodySM color="secondary">
                      {frameworkCount} framework{frameworkCount !== 1 ? 's' : ''} • {conceptsMastered}/{frameworkCount} mastered
                    </BodySM>
                  </Column>
                  <View style={styles.categoryMastery}>
                    <Text style={[styles.masteryPercent, { color: info.color }]}>
                      {mastery}%
                    </Text>
                  </View>
                </Row>
                <View style={styles.categoryProgressBarContainer}>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        { width: `${mastery}%`, backgroundColor: info.color },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Spacer size={100} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.primary[500],
  },
  title: {
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    opacity: 0.9,
  },
  // Readiness banner styles - Swiss-style: using theme with opacity
  readinessBanner: {
    marginTop: theme.spacing[4],
    backgroundColor: theme.colors.primary[500] + '26', // 15% opacity
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing[3],
  },
  readinessInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  readinessLabel: {
    color: theme.colors.text.inverse,
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.9,
  },
  readinessValue: {
    color: theme.colors.text.inverse,
    fontSize: 18,
    fontWeight: '700',
  },
  readinessBar: {
    height: 6,
    backgroundColor: theme.colors.text.inverse + '33', // 20% opacity
    borderRadius: 3,
  },
  readinessFill: {
    height: '100%',
    borderRadius: 3,
  },
  //
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing[4],
  },
  searchContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  searchInput: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[3],
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
  // Recommended card styles
  recommendedCard: {
    marginHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: theme.colors.border.light,
    overflow: 'hidden',
  },
  recommendedContent: {
    padding: theme.spacing[4],
  },
  recommendedHeader: {
    marginBottom: theme.spacing[2],
  },
  recommendedBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary[600],
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  recommendedDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  recommendedContext: {
    fontSize: 12,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing[2],
    fontWeight: '500',
  },
  recommendedAction: {
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  recommendedArrow: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary[600],
    textAlign: 'right',
  },
  //
  frameworksScroll: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
  },
  frameworkCard: {
    width: 160,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing[4],
  },
  frameworkIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  frameworkIconText: {
    color: theme.colors.text.inverse,
    fontSize: 20,
    fontWeight: '700',
  },
  frameworkName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  frameworkDescription: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
    lineHeight: 16,
  },
  masteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  masteryBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  masteryFill: {
    height: '100%',
  },
  masteryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    minWidth: 35,
  },
  categoryCard: {
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[2],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  categoryCardHighlight: {
    borderColor: theme.colors.semantic.error,
    backgroundColor: theme.colors.semantic.error + '05',
  },
  categoryRow: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  weakBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  weakBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  categoryMastery: {
    alignItems: 'flex-end',
  },
  masteryPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryProgressBarContainer: {
    marginTop: theme.spacing[3],
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  categoryProgressFill: {
    height: '100%',
  },
  // Continue learning enhanced styles
  continueCard: {
    marginHorizontal: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.primary[500],
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
  },
  continueHeader: {
    alignItems: 'center',
  },
  continueIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.text.inverse + '33', // 20% opacity
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  continueIcon: {
    fontSize: 24,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    marginTop: theme.spacing[1],
  },
  progressContext: {
    marginTop: theme.spacing[2],
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.text.inverse,
    opacity: 0.6,
    marginTop: 2,
  },
  continueArrow: {
    fontSize: 20,
    color: theme.colors.text.inverse,
  },
  pathProgressBar: {
    height: 4,
    backgroundColor: theme.colors.text.inverse + '4D', // 30% opacity
    borderRadius: 2,
    marginTop: theme.spacing[3],
  },
  pathProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.text.inverse,
    borderRadius: 2,
  },
});

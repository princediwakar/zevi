import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { FRAMEWORKS, FrameworkDefinition } from '../data/frameworks';
import { QuestionCategory, LessonType } from '../types';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { useAuth } from '../hooks/useAuth';
import { Spacer, H1, H2, H3, BodyMD, BodySM, LabelSM, Card, Row, Column } from '../components';

type CategoryDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

// Category info mapping - Using Swiss-style theme colors
const CATEGORY_INFO: Record<QuestionCategory, { label: string; icon: string; color: string; description: string; whenToUse: string }> = {
  product_sense: { 
    label: 'Product Sense', 
    icon: '💡', 
    color: theme.colors.primary[500], 
    description: 'Design, improve, and add features to products',
    whenToUse: 'Use for questions about designing new products, improving existing products, or adding new features.'
  },
  execution: { 
    label: 'Execution', 
    icon: '⚡', 
    color: theme.colors.primary[600], 
    description: 'Metrics, prioritization, and roadmap planning',
    whenToUse: 'Use for questions about defining metrics, prioritizing features, or planning roadmaps.'
  },
  strategy: { 
    label: 'Strategy', 
    icon: '🎯', 
    color: theme.colors.primary[700], 
    description: 'Business strategy and market analysis',
    whenToUse: 'Use for questions about competitive analysis, market entry, or business strategy.'
  },
  behavioral: { 
    label: 'Behavioral', 
    icon: '👤', 
    color: theme.colors.semantic.success, 
    description: 'Leadership, teamwork, and conflicts',
    whenToUse: 'Use for "Tell me about a time..." questions about leadership, conflict, or teamwork.'
  },
  technical: { 
    label: 'Technical', 
    icon: '🔧', 
    color: theme.colors.primary[400], 
    description: 'Technical PM questions and system design',
    whenToUse: 'Use for questions about technical architecture, system design, or technical trade-offs.'
  },
  estimation: { 
    label: 'Estimation', 
    icon: '📊', 
    color: theme.colors.semantic.warning, 
    description: 'Fermi estimates and guesstimates',
    whenToUse: 'Use for "How many..." or "Estimate the size of..." type questions.'
  },
  pricing: { 
    label: 'Pricing', 
    icon: '💰', 
    color: theme.colors.neutral[500], 
    description: 'Pricing strategies and models',
    whenToUse: 'Use for questions about pricing strategies, value-based pricing, or monetization.'
  },
  ab_testing: { 
    label: 'A/B Testing', 
    icon: '🧪', 
    color: theme.colors.semantic.error, 
    description: 'Experiment design and analysis',
    whenToUse: 'Use for questions about designing experiments, statistical significance, or test results.'
  },
};

// Get frameworks that belong to a category
const getFrameworksByCategory = (category: QuestionCategory): FrameworkDefinition[] => {
  return Object.values(FRAMEWORKS).filter(
    (fw) => fw.category === category || fw.applicable_categories?.includes(category)
  );
};

// Get lesson type icon
const getLessonTypeIcon = (type: LessonType): string => {
  switch (type) {
    case 'learn': return '📖';
    case 'drill': return '🎯';
    case 'pattern': return '📝';
    case 'full_practice': return '✍️';
    case 'quiz': return '❓';
    default: return '📚';
  }
};

// Get lesson type label
const getLessonTypeLabel = (type: LessonType): string => {
  switch (type) {
    case 'learn': return 'Learn';
    case 'drill': return 'Drill';
    case 'pattern': return 'Pattern';
    case 'full_practice': return 'Practice';
    case 'quiz': return 'Quiz';
    default: return 'Lesson';
  }
};

export default function CategoryDetailScreen() {
  const navigation = useNavigation<CategoryDetailNavigationProp>();
  const route = useRoute<CategoryDetailRouteProp>();
  const { category } = route.params;
  const { progress } = useProgressStore();
  const { units, fetchPath } = useLearningPathStore();
  const { user, isGuest, guestId } = useAuth();

  const categoryKey = category as QuestionCategory;
  const info = CATEGORY_INFO[categoryKey];
  const frameworks = getFrameworksByCategory(categoryKey);

  // Get learn lessons for this category from the learning path
  const learnLessons = React.useMemo(() => {
    const lessons: any[] = [];
    units.forEach(unit => {
      if (unit.lessons) {
        unit.lessons.forEach(lesson => {
          // Match lessons to this category based on category
          if ((lesson as any).category === categoryKey || 
              (lesson as any).framework_category === categoryKey) {
            lessons.push(lesson);
          }
        });
      }
    });
    return lessons;
  }, [units, categoryKey]);

  // Get framework mastery from progress
  const getFrameworkMastery = (frameworkName: string): number => {
    return progress?.framework_mastery?.[frameworkName.toLowerCase()] || 0;
  };

  const handleFrameworkPress = (frameworkName: string) => {
    navigation.navigate('FrameworkDetail', { frameworkName });
  };

  const handlePracticePress = () => {
    navigation.navigate('QuestionList', { category });
  };

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('LessonScreen', { lessonId });
  };

  if (!info) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: info.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.categoryIcon}>{info.icon}</Text>
        <H1 style={styles.categoryTitle}>{info.label}</H1>
        <BodyMD style={styles.categoryDescription}>{info.description}</BodyMD>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* When to Use This Category */}
        <View style={styles.section}>
          <H2 style={styles.sectionTitle}>WHEN TO USE</H2>
          <Card variant="outline" style={styles.whenToUseCard}>
            <Text style={styles.whenToUseText}>{info.whenToUse}</Text>
          </Card>
        </View>

        {/* Learn Concepts Section */}
        {learnLessons.length > 0 && (
          <View style={styles.section}>
            <H2 style={styles.sectionTitle}>LEARN CONCEPTS</H2>
            <Text style={styles.sectionSubtitle}>
              Master the fundamentals with structured lessons
            </Text>

            {learnLessons.slice(0, 6).map((lesson: any) => {
              const isCompleted = progress?.completed_lessons?.includes(lesson.id);
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonCard}
                  onPress={() => handleLessonPress(lesson.id)}
                  activeOpacity={0.8}
                >
                  <Row style={styles.lessonRow}>
                    <View style={[styles.lessonIcon, { backgroundColor: info.color + '20' }]}>
                      <Text style={styles.lessonIconText}>{getLessonTypeIcon(lesson.type)}</Text>
                    </View>
                    <Column style={styles.lessonInfo}>
                      <Text style={styles.lessonName}>{lesson.name}</Text>
                      <BodySM color="secondary">
                        {getLessonTypeLabel(lesson.type)} • {lesson.estimated_minutes || 10} min
                      </BodySM>
                    </Column>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>✓</Text>
                      </View>
                    )}
                    <Text style={styles.lessonArrow}>→</Text>
                  </Row>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Frameworks in This Category */}
        <View style={styles.section}>
          <H2 style={styles.sectionTitle}>FRAMEWORKS</H2>
          <Text style={styles.sectionSubtitle}>
            {frameworks.length} framework{frameworks.length !== 1 ? 's' : ''} available
          </Text>

          {frameworks.map((framework) => {
            const mastery = getFrameworkMastery(framework.name);
            return (
              <TouchableOpacity
                key={framework.name}
                style={styles.frameworkCard}
                onPress={() => handleFrameworkPress(framework.name)}
                activeOpacity={0.8}
              >
                <Row style={styles.frameworkRow}>
                  <View style={[styles.frameworkIcon, { backgroundColor: framework.color }]}>
                    <Text style={styles.frameworkIconText}>{framework.name.charAt(0)}</Text>
                  </View>
                  <Column style={styles.frameworkInfo}>
                    <Text style={styles.frameworkName}>{framework.name}</Text>
                    <BodySM color="secondary" numberOfLines={2}>
                      {framework.description}
                    </BodySM>
                  </Column>
                  <View style={styles.frameworkMastery}>
                    <Text style={[styles.masteryPercent, { color: framework.color }]}>
                      {mastery}%
                    </Text>
                  </View>
                </Row>
                {mastery > 0 && (
                  <View style={styles.masteryBar}>
                    <View
                      style={[
                        styles.masteryFill,
                        { width: `${mastery}%`, backgroundColor: framework.color },
                      ]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Practice Questions Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.practiceButton, { backgroundColor: info.color }]}
            onPress={handlePracticePress}
            activeOpacity={0.8}
          >
            <Text style={styles.practiceButtonText}>Practice Questions</Text>
            <Text style={styles.practiceButtonArrow}>→</Text>
          </TouchableOpacity>
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
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  backButton: {
    marginBottom: theme.spacing[4],
  },
  backText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: theme.spacing[2],
  },
  categoryTitle: {
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[2],
  },
  categoryDescription: {
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing[4],
  },
  section: {
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },
  whenToUseCard: {
    padding: theme.spacing[4],
  },
  whenToUseText: {
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  // Lesson card styles
  lessonCard: {
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  lessonRow: {
    alignItems: 'center',
  },
  lessonIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
    borderRadius: theme.spacing.borderRadius.sm,
  },
  lessonIconText: {
    fontSize: 20,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
  },
  completedBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: '700',
  },
  lessonArrow: {
    fontSize: 18,
    color: theme.colors.text.secondary,
  },
  frameworkCard: {
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  frameworkRow: {
    alignItems: 'center',
  },
  frameworkIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  frameworkIconText: {
    color: theme.colors.text.inverse,
    fontSize: 18,
    fontWeight: '700',
  },
  frameworkInfo: {
    flex: 1,
  },
  frameworkName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  frameworkMastery: {
    alignItems: 'flex-end',
  },
  masteryPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  masteryBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    marginTop: theme.spacing[3],
  },
  masteryFill: {
    height: '100%',
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
  },
  practiceButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  practiceButtonArrow: {
    color: theme.colors.text.inverse,
    fontSize: 20,
  },
});

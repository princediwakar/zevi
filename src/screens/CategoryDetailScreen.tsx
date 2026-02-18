import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { QuestionCategory } from '../types';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { Spacer } from '../components';
import { ArrowRight, Check } from 'lucide-react-native';

type CategoryDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

// Swiss design category info - BLACK & WHITE, no bright colors
const CATEGORY_INFO: Record<QuestionCategory, { label: string; code: string; color: string; description: string }> = {
  product_sense: { label: 'Product Sense', code: 'PS', color: theme.colors.category.product_sense, description: 'Design, improve, and add features to products' },
  execution: { label: 'Execution', code: 'EX', color: theme.colors.category.execution, description: 'Metrics, prioritization, and roadmap planning' },
  strategy: { label: 'Strategy', code: 'ST', color: theme.colors.category.strategy, description: 'Business strategy and market analysis' },
  behavioral: { label: 'Behavioral', code: 'BH', color: theme.colors.category.behavioral, description: 'Leadership, teamwork, and conflicts' },
  technical: { label: 'Technical', code: 'TC', color: theme.colors.category.technical, description: 'Technical PM questions and system design' },
  estimation: { label: 'Estimation', code: 'EST', color: theme.colors.category.estimation, description: 'Fermi estimates and guesstimates' },
  pricing: { label: 'Pricing', code: 'PRC', color: theme.colors.category.pricing, description: 'Pricing strategies and models' },
  ab_testing: { label: 'A/B Testing', code: 'AB', color: theme.colors.category.ab_testing, description: 'Experiment design and analysis' },
};

// Lesson type configs - Swiss muted colors
const LESSON_TYPE_CONFIG: Record<string, { label: string; bgColor: string }> = {
  learn: { label: 'LEARN', bgColor: theme.colors.neutral[200] },
  drill: { label: 'DRILL', bgColor: theme.colors.neutral[300] },
  pattern: { label: 'PATTERN', bgColor: theme.colors.neutral[200] },
  full_practice: { label: 'PRACTICE', bgColor: theme.colors.neutral[200] },
  quiz: { label: 'QUIZ', bgColor: theme.colors.neutral[300] },
  practice: { label: 'PRACTICE', bgColor: theme.colors.neutral[200] },
};

export default function CategoryDetailScreen() {
  const navigation = useNavigation<CategoryDetailNavigationProp>();
  const route = useRoute<CategoryDetailRouteProp>();
  const { category } = route.params;
  const { progress, currentLesson } = useProgressStore();
  const { units } = useLearningPathStore();
  const insets = useSafeAreaInsets();

  const categoryKey = category as QuestionCategory;
  const info = CATEGORY_INFO[categoryKey];

  // Get lessons grouped by unit for this category
  const categoryData = React.useMemo(() => {
    if (!units || units.length === 0) return { unitsWithLessons: [], totalLessons: 0, completedCount: 0 };
    
    const completedIds = new Set(progress?.completed_lessons || []);
    
    // First, get units for this category and sort them by order_index
    const categoryUnits = units
      .filter(unit => {
        const unitCategory = (unit as any).pathCategory || (unit as any).category;
        return unitCategory === categoryKey;
      })
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    
    // Build units with their lessons
    const unitsWithLessons = categoryUnits.map(unit => {
      const unitLessons = (unit.lessons || [])
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
        .map((lesson: any) => ({
          ...lesson,
          isCompleted: completedIds.has(lesson.id),
          isCurrent: currentLesson?.id === lesson.id,
        }));
      
      const completedInUnit = unitLessons.filter((l: any) => l.isCompleted).length;
      
      return {
        ...unit,
        lessons: unitLessons,
        completedCount: completedInUnit,
        totalCount: unitLessons.length,
      };
    });
    
    const totalLessons = unitsWithLessons.reduce((sum, u) => sum + u.totalCount, 0);
    const completedCount = unitsWithLessons.reduce((sum, u) => sum + u.completedCount, 0);
    
    return { unitsWithLessons, totalLessons, completedCount };
  }, [units, categoryKey, progress, currentLesson]);

  const { unitsWithLessons, totalLessons, completedCount } = categoryData;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('LessonScreen', { lessonId });
  };

  const getLessonTypeConfig = (type: string) => {
    return LESSON_TYPE_CONFIG[type] || LESSON_TYPE_CONFIG.learn;
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
      {/* Header - Swiss bordered, compact */}
      <View style={[styles.header, { backgroundColor: theme.colors.text.primary }]}>
        {/* Top row: back + code badge */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.categoryCodeBadge}>
            <Text style={styles.categoryCode}>{info.code}</Text>
          </View>
        </View>

        <Text style={styles.categoryTitle}>{info.label}</Text>
        <Text style={styles.categoryDescription}>{info.description}</Text>
        
        {/* Progress - Swiss sharp bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: theme.colors.text.inverse }]} />
          </View>
          <Text style={styles.progressText}>{completedCount}/{totalLessons} LESSONS COMPLETE</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lessons Section */}
        <Text style={styles.sectionTitle}>LESSONS</Text>

        {unitsWithLessons.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No lessons in this category yet</Text>
          </View>
        ) : (
          // Show units with their lessons - grouped by unit
          unitsWithLessons.map((unit: any) => (
            <View key={unit.id} style={styles.unitSection}>
              {/* Unit Header */}
              <View style={styles.unitHeader}>
                <Text style={styles.unitName}>{unit.name}</Text>
                <Text style={styles.unitProgress}>
                  {unit.completedCount}/{unit.totalCount}
                </Text>
              </View>
              
              {/* Lessons in this unit */}
              {unit.lessons.map((lesson: any, index: number) => {
                const typeConfig = getLessonTypeConfig(lesson.type || 'learn');
                const isCurrentLesson = lesson.isCurrent && !lesson.isCompleted;
                
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonCard,
                      lesson.isCompleted && styles.lessonCardCompleted,
                      isCurrentLesson && styles.lessonCardCurrent,
                    ]}
                    onPress={() => handleLessonPress(lesson.id)}
                    activeOpacity={0.7}
                  >
                    {/* Current lesson badge */}
                    {isCurrentLesson && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>CURRENT</Text>
                    </View>
                    )}
                    
                    {/* Number Badge - shows lesson number */}
                    <View style={[
                      styles.numberBadge, 
                      { 
                        backgroundColor: lesson.isCompleted ? theme.colors.neutral[200] : isCurrentLesson ? theme.colors.text.primary : typeConfig.bgColor,
                        borderColor: lesson.isCompleted ? theme.colors.text.disabled : theme.colors.text.primary, 
                        borderWidth: theme.swiss.border.standard 
                      }
                    ]}>
                      <Text style={[
                        styles.numberText, 
                        { color: lesson.isCompleted ? theme.colors.text.disabled : isCurrentLesson ? theme.colors.text.inverse : theme.colors.text.primary }
                      ]}>{String(index + 1).padStart(2, '0')}</Text>
                    </View>
                    
                    {/* Lesson Info */}
                    <View style={styles.lessonInfo}>
                      <Text style={[
                        styles.lessonName, 
                        lesson.isCompleted && styles.lessonNameCompleted,
                      ]}>
                        {lesson.name}
                      </Text>
                      <View style={styles.lessonMeta}>
                        <Text style={[
                          styles.lessonType,
                          lesson.isCompleted && styles.lessonMetaCompleted,
                        ]}>{typeConfig.label}</Text>
                        <Text style={styles.metaDivider}>·</Text>
                        <Text style={[
                          styles.lessonDuration,
                          lesson.isCompleted && styles.lessonMetaCompleted,
                        ]}>{lesson.estimated_minutes || 10} MIN</Text>
                      </View>
                    </View>
                    
                    {/* Status - Swiss sharp */}
                    {lesson.isCompleted ? (
                      <View style={[styles.statusComplete, styles.statusCompleteGray]}>
                        <Check size={16} color={theme.colors.text.inverse} />
                      </View>
                    ) : isCurrentLesson ? (
                      <ArrowRight size={24} color={theme.colors.text.primary} />
                    ) : (
                      <View style={styles.statusDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

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
  
  // Header - Swiss bordered, compact
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingBottom: theme.swiss.layout.elementGap,
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  backButton: {},
  backText: {
    color: theme.colors.text.inverse,
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  categoryCodeBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderWidth: theme.swiss.border.standard,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryCode: {
    color: theme.colors.text.inverse,
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  categoryTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  categoryDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.swiss.fontSize.label,
    marginBottom: theme.spacing[3],
  },
  progressContainer: {
    marginTop: 0,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 0,
  },
  progressFill: {
    height: '100%',
    borderRadius: 0,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.swiss.fontSize.small,
    marginTop: 4,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.swiss.layout.screenPadding,
  },
  
  // Section
  sectionTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[4],
  },
  
  // Unit Section
  unitSection: {
    marginBottom: theme.spacing[6],
  },
  
  // Unit Header
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  unitName: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  unitProgress: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  
  // Lesson Card - Swiss bordered
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.border.light,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  
  // Current lesson - highlighted/active
  lessonCardCurrent: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  
  // Completed lessons - grayed
  lessonCardCompleted: {
    backgroundColor: theme.colors.neutral[50],
    borderColor: theme.colors.neutral[200],
  },
  
  // Current badge
  currentBadge: {
    position: 'absolute',
    top: -10,
    left: theme.spacing[4],
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    zIndex: 1,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Number Badge - shows lesson number
  numberBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.bold,
  },
  
  // Status - completed (check)
  statusComplete: {
    width: 28,
    height: 28,
    backgroundColor: theme.colors.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  statusCompleteGray: {
    backgroundColor: theme.colors.neutral[300],
  },
  
  // Status - pending dot
  statusDot: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.neutral[300],
    borderRadius: 0,
  },
  
  lessonInfo: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },
  lessonName: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  lessonNameCompleted: {
    color: theme.colors.text.disabled,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[1],
  },
  lessonType: {
    fontSize: theme.swiss.fontSize.small,
    color: theme.colors.text.secondary,
  },
  lessonMetaCompleted: {
    color: theme.colors.text.disabled,
  },
  metaDivider: {
    fontSize: theme.swiss.fontSize.small,
    color: theme.colors.text.disabled,
    marginHorizontal: theme.spacing[1],
  },
  lessonDuration: {
    fontSize: theme.swiss.fontSize.small,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    padding: theme.swiss.layout.sectionGap + theme.spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.disabled,
  },
});

import React from 'react';
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
import { QuestionCategory } from '../types';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';
import { Spacer, H1, H2, BodyMD, BodySM, Card, Row, Column } from '../components';
import { CheckCircle, ArrowRight } from 'lucide-react-native';

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
const LESSON_TYPE_CONFIG: Record<string, { label: string; code: string; bgColor: string }> = {
  learn: { label: 'LEARN', code: 'LRN', bgColor: theme.colors.neutral[200] },
  drill: { label: 'DRILL', code: 'DRL', bgColor: theme.colors.neutral[300] },
  pattern: { label: 'PATTERN', code: 'PAT', bgColor: theme.colors.neutral[200] },
  full_practice: { label: 'PRACTICE', code: 'PRX', bgColor: theme.colors.neutral[200] },
  quiz: { label: 'QUIZ', code: 'QZ', bgColor: theme.colors.neutral[300] },
  practice: { label: 'PRACTICE', code: 'PRX', bgColor: theme.colors.neutral[200] },
};

export default function CategoryDetailScreen() {
  const navigation = useNavigation<CategoryDetailNavigationProp>();
  const route = useRoute<CategoryDetailRouteProp>();
  const { category } = route.params;
  const { progress } = useProgressStore();
  const { units } = useLearningPathStore();

  const categoryKey = category as QuestionCategory;
  const info = CATEGORY_INFO[categoryKey];

  // Get lessons for this category
  const categoryLessons = React.useMemo(() => {
    const completedIds = new Set(progress?.completed_lessons || []);
    const lessons: any[] = [];
    
    units.forEach(unit => {
      const unitCategory = (unit as any).pathCategory || (unit as any).category;
      if (unitCategory === categoryKey) {
        (unit.lessons || []).forEach((lesson: any) => {
          lessons.push({
            ...lesson,
            unitName: unit.name,
            isCompleted: completedIds.has(lesson.id),
          });
        });
      }
    });
    
    return lessons;
  }, [units, categoryKey, progress]);

  const completedCount = categoryLessons.filter(l => l.isCompleted).length;
  const progressPercent = categoryLessons.length > 0 ? Math.round((completedCount / categoryLessons.length) * 100) : 0;

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
      {/* Header - Swiss bordered */}
      <View style={[styles.header, { backgroundColor: theme.colors.text.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        
        <View style={styles.categoryCodeContainer}>
          <Text style={styles.categoryCode}>{info.code}</Text>
        </View>
        <Text style={styles.categoryTitle}>{info.label}</Text>
        <Text style={styles.categoryDescription}>{info.description}</Text>
        
        {/* Progress - Swiss sharp bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: theme.colors.text.inverse }]} />
          </View>
          <Text style={styles.progressText}>{completedCount}/{categoryLessons.length} LESSONS COMPLETE</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lessons Section */}
        <Text style={styles.sectionTitle}>LESSONS</Text>
        
        {categoryLessons.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No lessons in this category yet</Text>
          </View>
        ) : (
          categoryLessons.map((lesson, index) => {
            const typeConfig = getLessonTypeConfig(lesson.type || 'learn');
            
            return (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => handleLessonPress(lesson.id)}
                activeOpacity={0.7}
              >
                {/* Type Badge - Swiss Style */}
                <View style={[styles.typeBadge, { backgroundColor: typeConfig.bgColor, borderColor: theme.colors.text.primary, borderWidth: theme.swiss.border.standard }]}>
                  <Text style={[styles.typeCode, { color: theme.colors.text.primary }]}>{typeConfig.code}</Text>
                </View>
                
                {/* Lesson Info */}
                <View style={styles.lessonInfo}>
                  <Text style={[styles.lessonName, lesson.isCompleted && styles.lessonNameCompleted]}>
                    {lesson.name}
                  </Text>
                  <View style={styles.lessonMeta}>
                    <Text style={styles.lessonType}>{typeConfig.label}</Text>
                    <Text style={styles.metaDivider}>·</Text>
                    <Text style={styles.lessonDuration}>{lesson.estimated_minutes || 10} MIN</Text>
                  </View>
                </View>
                
                {/* Status - Swiss sharp */}
                {lesson.isCompleted ? (
                  <View style={styles.statusComplete}>
                    <Text style={styles.statusCode}>✓</Text>
                  </View>
                ) : (
                  <ArrowRight size={20} color={theme.colors.text.secondary} />
                )}
              </TouchableOpacity>
            );
          })
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
  
  // Header - Swiss bordered
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingBottom: theme.swiss.layout.sectionGap,
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  backButton: {
    marginBottom: theme.spacing[4],
  },
  backText: {
    color: theme.colors.text.inverse,
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  categoryCodeContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    borderWidth: theme.swiss.border.heavy,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryCode: {
    color: theme.colors.text.inverse,
    fontSize: 28,
    fontWeight: theme.swiss.fontWeight.bold,
  },
  categoryTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    marginBottom: theme.spacing[2],
  },
  categoryDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.typography.body.md.fontSize,
    marginBottom: theme.spacing[4],
  },
  progressContainer: {
    marginTop: theme.spacing[2],
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 0, // Sharp!
  },
  progressFill: {
    height: '100%',
    borderRadius: 0, // Sharp!
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
  typeBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeCode: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.bold,
  },
  statusComplete: {
    width: 28,
    height: 28,
    backgroundColor: theme.colors.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0, // Sharp!
  },
  statusCode: {
    color: theme.colors.text.inverse,
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.bold,
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

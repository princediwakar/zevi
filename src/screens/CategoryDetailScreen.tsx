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

// Swiss design category info - with letter codes
const CATEGORY_INFO: Record<QuestionCategory, { label: string; code: string; color: string; description: string }> = {
  product_sense: { label: 'Product Sense', code: 'PS', color: '#2563EB', description: 'Design, improve, and add features to products' },
  execution: { label: 'Execution', code: 'EX', color: '#7C3AED', description: 'Metrics, prioritization, and roadmap planning' },
  strategy: { label: 'Strategy', code: 'ST', color: '#059669', description: 'Business strategy and market analysis' },
  behavioral: { label: 'Behavioral', code: 'BH', color: '#F59E0B', description: 'Leadership, teamwork, and conflicts' },
  technical: { label: 'Technical', code: 'TC', color: '#EC4899', description: 'Technical PM questions and system design' },
  estimation: { label: 'Estimation', code: 'EST', color: '#14B8A6', description: 'Fermi estimates and guesstimates' },
  pricing: { label: 'Pricing', code: 'PRC', color: '#64748B', description: 'Pricing strategies and models' },
  ab_testing: { label: 'A/B Testing', code: 'AB', color: '#EF4444', description: 'Experiment design and analysis' },
};

// Lesson type configs - with letter codes
const LESSON_TYPE_CONFIG: Record<string, { label: string; code: string; bgColor: string }> = {
  learn: { label: 'LEARN', code: 'LRN', bgColor: '#E0E7FF' },
  drill: { label: 'DRILL', code: 'DRL', bgColor: '#EDE9FE' },
  pattern: { label: 'PATTERN', code: 'PAT', bgColor: '#D1FAE5' },
  full_practice: { label: 'PRACTICE', code: 'PRX', bgColor: '#D1FAE5' },
  quiz: { label: 'QUIZ', code: 'QZ', bgColor: '#FEF3C7' },
  practice: { label: 'PRACTICE', code: 'PRX', bgColor: '#D1FAE5' },
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
      {/* Header */}
      <View style={[styles.header, { backgroundColor: info.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.categoryCodeContainer}>
          <Text style={styles.categoryCode}>{info.code}</Text>
        </View>
        <Text style={styles.categoryTitle}>{info.label}</Text>
        <Text style={styles.categoryDescription}>{info.description}</Text>
        
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: '#FFFFFF' }]} />
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
                <View style={[styles.typeBadge, { backgroundColor: typeConfig.bgColor + '20', borderColor: typeConfig.bgColor, borderWidth: 2 }]}>
                  <Text style={[styles.typeCode, { color: typeConfig.bgColor }]}>{typeConfig.code}</Text>
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
                
                {/* Status */}
                {lesson.isCompleted ? (
                  <View style={styles.statusComplete}>
                    <Text style={styles.statusCode}>✓</Text>
                  </View>
                ) : (
                  <ArrowRight size={20} color="#9CA3AF" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[6],
  },
  backButton: {
    marginBottom: theme.spacing[4],
  },
  backText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  categoryCodeContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryCode: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: theme.spacing[2],
  },
  categoryDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: theme.spacing[4],
  },
  progressContainer: {
    marginTop: theme.spacing[2],
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
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
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeCode: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusComplete: {
    width: 28,
    height: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCode: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  lessonInfo: {
    flex: 1,
    marginLeft: 12,
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  lessonNameCompleted: {
    color: '#9CA3AF',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lessonType: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaDivider: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    padding: theme.spacing[8],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

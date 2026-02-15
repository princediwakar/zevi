import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { QuestionCategory, QUESTION_CATEGORIES } from '../types';
import { Spacer } from '../components';
import { ArrowRight } from 'lucide-react-native';
import { useProgressStore } from '../stores/progressStore';
import { useLearningPathStore } from '../stores/learningPathStore';

type LearningPathBrowseNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LearningPathBrowse'>;

// Swiss design category info
const CATEGORY_INFO: Record<QuestionCategory, { label: string; code: string; description: string }> = {
  product_sense: { label: 'Product Sense', code: 'PS', description: 'Design, improve, and add features to products' },
  execution: { label: 'Execution', code: 'EX', description: 'Metrics, prioritization, and roadmap planning' },
  strategy: { label: 'Strategy', code: 'ST', description: 'Business strategy and market analysis' },
  behavioral: { label: 'Behavioral', code: 'BH', description: 'Leadership, teamwork, and conflicts' },
  technical: { label: 'Technical', code: 'TC', description: 'Technical PM questions and system design' },
  estimation: { label: 'Estimation', code: 'EST', description: 'Fermi estimates and guesstimates' },
  pricing: { label: 'Pricing', code: 'PRC', description: 'Pricing strategies and models' },
  ab_testing: { label: 'A/B Testing', code: 'AB', description: 'Experiment design and analysis' },
};

export default function LearningPathBrowseScreen() {
  const navigation = useNavigation<LearningPathBrowseNavigationProp>();
  const { progress } = useProgressStore();
  const { units } = useLearningPathStore();

  // Calculate progress for each category
  const getCategoryProgress = (category: QuestionCategory) => {
    const completedIds = new Set(progress?.completed_lessons || []);
    let total = 0;
    let completed = 0;
    
    units.forEach(unit => {
      const unitCategory = (unit as any).pathCategory || (unit as any).category;
      if (unitCategory === category) {
        (unit.lessons || []).forEach((lesson: any) => {
          total++;
          if (completedIds.has(lesson.id)) completed++;
        });
      }
    });
    
    return { completed, total };
  };

  const handleCategoryPress = (category: QuestionCategory) => {
    navigation.navigate('CategoryDetail', { category });
  };

  return (
    <View style={styles.container}>
      {/* Swiss header - bold bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LEARNING PATHS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >



        {/* Learning Paths as stark rows */}
        {QUESTION_CATEGORIES.map((category, index) => {
          const info = CATEGORY_INFO[category];
          const { completed, total } = getCategoryProgress(category);
          const hasProgress = completed > 0;
          
          return (
            <TouchableOpacity
              key={category}
              style={styles.pathRow}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              {/* Number indicator */}
              <View style={[styles.numberContainer, hasProgress && styles.numberContainerDone]}>
                <Text style={[styles.numberText, hasProgress && styles.numberTextDone]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              
              {/* Path Info */}
              <View style={styles.pathInfo}>
                <Text style={[styles.pathLabel, hasProgress && styles.pathLabelDone]}>{info.label}</Text>
                <Text style={styles.pathDescription}>{info.description}</Text>
              </View>
              
              {/* Progress count - subtle */}
              {total > 0 && (
                <View style={[styles.progressBadge, hasProgress && styles.progressBadgeDone]}>
                  <Text style={[styles.progressText, hasProgress && styles.progressTextDone]}>
                    {completed}/{total}
                  </Text>
                </View>
              )}
              
              {/* Arrow */}
              <ArrowRight size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          );
        })}


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
  
  // Header - Swiss bold
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
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
  
  // Intro Text
  introText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
    marginBottom: theme.spacing[2],
  },
  
  // Path Row - Swiss bordered
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[5],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.border.light,
  },
  numberContainer: {
    width: 48,
    height: 48,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  numberContainerDone: {
    borderColor: theme.colors.neutral[300],
  },
  numberText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  numberTextDone: {
    color: theme.colors.text.disabled,
  },
  pathInfo: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  pathLabel: {
    fontSize: theme.swiss.fontSize.body + 2,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
    marginBottom: theme.spacing[1],
  },
  pathLabelDone: {
    color: theme.colors.text.secondary,
  },
  pathDescription: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // Progress badge - subtle
  progressBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
  },
  progressBadgeDone: {
    backgroundColor: theme.colors.neutral[100],
  },
  progressText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  progressTextDone: {
    color: theme.colors.text.secondary,
  },
});

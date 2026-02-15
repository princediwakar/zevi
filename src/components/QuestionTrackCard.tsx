import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../theme';
import { QuestionCategory, Question } from '../types';
import { Card, BodyLG, BodyMD, LabelSM, Row, Column } from './ui';
import { useQuestionsStore } from '../stores/questionsStore';

interface QuestionTrackCardProps {
  category: QuestionCategory;
  questionCount: number;
  masteryLevel: number; // 0-100
  completedCount: number;
  onPress: () => void;
}

// Category display names - Swiss style, minimal
const CATEGORY_INFO: Record<QuestionCategory, { name: string; number: string; icon: string }> = {
  product_sense: { name: 'Product Sense', number: '01', icon: '💡' },
  execution: { name: 'Execution', number: '02', icon: '⚡' },
  strategy: { name: 'Strategy', number: '03', icon: '🎯' },
  behavioral: { name: 'Behavioral', number: '04', icon: '👤' },
  technical: { name: 'Technical', number: '05', icon: '🔧' },
  estimation: { name: 'Estimation', number: '06', icon: '📊' },
  pricing: { name: 'Pricing', number: '07', icon: '💰' },
  ab_testing: { name: 'A/B Testing', number: '08', icon: '🧪' },
};

export const QuestionTrackCard: React.FC<QuestionTrackCardProps> = ({
  category,
  questionCount,
  masteryLevel,
  completedCount,
  onPress,
}) => {
  const info = CATEGORY_INFO[category] || { name: category, number: '00', icon: '📝' };
  const { questions } = useQuestionsStore();
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);

  // Get sample questions for this category
  useEffect(() => {
    const categoryQuestions = questions.filter(q => q.category === category).slice(0, 2);
    setPreviewQuestions(categoryQuestions);
  }, [questions, category]);

  const getMasteryLabel = () => {
    if (masteryLevel >= 80) return 'Mastered';
    if (masteryLevel >= 50) return 'Learning';
    if (masteryLevel >= 20) return 'Building';
    return 'Start';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.semantic.success;
      case 'intermediate': return theme.colors.semantic.warning;
      case 'advanced': return theme.colors.semantic.error;
      default: return theme.colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      accessibilityLabel={`${info.name} track. ${getMasteryLabel()}. ${completedCount} of ${questionCount} completed`}
      accessibilityHint="Tap to practice questions in this category"
      accessibilityRole="button"
    >
      <Card variant="outline" style={styles.card}>
        {/* Header Row */}
        <Row style={styles.headerRow}>
          <View style={styles.numberBox}>
            <Text style={styles.numberText}>{info.number}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.categoryName}>{info.name}</Text>
            <Text style={styles.masteryLabel}>{getMasteryLabel()}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Row>

        {/* Question Previews - Dimmed as examples */}
        <View style={styles.previewContainer}>
          {previewQuestions.length > 0 ? (
            <>
              <View style={styles.exampleLabel}>
                <Text style={styles.exampleLabelText}>EXAMPLE QUESTIONS</Text>
              </View>
              {previewQuestions.map((q, index) => (
                <View key={q.id || index} style={styles.previewItem} pointerEvents="none">
                  <View style={styles.previewHeader}>
                    <View style={[styles.difficultyBadge, { borderColor: theme.colors.border.medium }]}>
                      <LabelSM style={[styles.difficultyText, { color: theme.colors.text.disabled }]}>
                        {String(q.difficulty || 'beginner').toUpperCase()}
                      </LabelSM>
                    </View>
                    {q.company && (
                      <Text style={styles.companyTextDimmed}>{q.company}</Text>
                    )}
                  </View>
                  <BodyMD numberOfLines={2} style={styles.previewTextDimmed}>
                    {q.question_text || 'No question available'}
                  </BodyMD>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyPreview}>
              <Text style={styles.emptyText}>
                {questionCount > 0 
                  ? `${questionCount} questions available` 
                  : 'No questions yet - tap to practice'}
              </Text>
            </View>
          )}
        </View>

        {/* Progress Line */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(masteryLevel, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressLabel}>
            {completedCount}/{questionCount}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing[3],
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 0,
    backgroundColor: theme.colors.surface.primary,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  numberBox: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
  },
  numberText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  masteryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.primary[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: theme.colors.primary[500],
    fontWeight: '300',
  },
  previewContainer: {
    marginBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  exampleLabel: {
    marginBottom: theme.spacing[2],
  },
  exampleLabelText: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.text.disabled,
    letterSpacing: 1,
  },
  previewItem: {
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    opacity: 0.6, // Dimmed to show as examples
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
    gap: theme.spacing[2],
  },
  difficultyBadge: {
    borderWidth: 1,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  companyText: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  companyTextDimmed: {
    fontSize: 10,
    color: theme.colors.text.disabled,
    fontWeight: '500',
  },
  previewText: {
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  previewTextDimmed: {
    color: theme.colors.text.disabled,
    lineHeight: 18,
    fontSize: 13,
  },
  emptyPreview: {
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    minWidth: 45,
    textAlign: 'right',
  },
});

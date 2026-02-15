import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { QuestionCategory } from '../types';
import { Card, BodyLG, BodySM, LabelSM } from './ui';
import { theme } from '../theme';

interface CategoryCardProps {
  category: QuestionCategory;
  questionCount: number;
  userProgress?: number;
  onPress: () => void;
}

const CATEGORY_INFO: Record<QuestionCategory, { label: string; icon: string; color: string }> = {
  product_sense: { label: 'Product Sense', icon: '💡', color: theme.colors.category.product_sense },
  execution: { label: 'Execution', icon: '⚡', color: theme.colors.category.execution },
  strategy: { label: 'Strategy', icon: '🎯', color: theme.colors.category.strategy },
  behavioral: { label: 'Behavioral', icon: '👥', color: theme.colors.category.behavioral },
  estimation: { label: 'Estimation', icon: '📊', color: theme.colors.category.estimation },
  technical: { label: 'Technical', icon: '⚙️', color: theme.colors.category.technical },
  pricing: { label: 'Pricing', icon: '💰', color: theme.colors.category.pricing },
  ab_testing: { label: 'A/B Testing', icon: '🧪', color: theme.colors.category.ab_testing },
};

export function CategoryCard({ category, questionCount, userProgress = 0, onPress }: CategoryCardProps) {
  const info = CATEGORY_INFO[category];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card
        variant="outline"
        padding={6} // 24px
        style={[
          styles.card,
          { borderLeftColor: info.color, borderLeftWidth: theme.spacing.borderWidth.medium }
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <BodyLG style={styles.icon}>{info.icon}</BodyLG>
            </View>
            <View style={styles.textContainer}>
              <BodyLG style={styles.label}>{info.label}</BodyLG>
              <BodySM color="secondary">{questionCount} QUESTIONS</BodySM>
            </View>
            <BodyLG style={styles.arrow}>→</BodyLG>
          </View>

          {userProgress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${userProgress}%`, backgroundColor: info.color }
                  ]}
                />
              </View>
              <LabelSM color="secondary" style={styles.progressText}>
                {userProgress}% COMPLETE
              </LabelSM>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing[3], // 12px
  },
  content: {
    // Card handles padding
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3], // 12px
    borderRadius: theme.spacing.borderRadius.none, // Sharp edges
  },
  icon: {
    // Using BodyLG component styles
  },
  textContainer: {
    flex: 1,
  },
  label: {
    marginBottom: theme.spacing[1], // 4px
    fontWeight: '600',
  },
  arrow: {
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: theme.spacing[4], // 16px
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.spacing.borderRadius.none, // Sharp edges
    overflow: 'hidden',
    marginBottom: theme.spacing[1], // 4px
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.spacing.borderRadius.none, // Sharp edges
  },
  progressText: {
    opacity: 0.8,
  },
});

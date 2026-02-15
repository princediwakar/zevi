import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Text } from 'react-native';
import { theme } from '../theme';
import { Question } from '../types';
import { 
  Card, 
  LabelSM,
} from './ui';

interface QuestionCardProps {
  question: Question;
  onPress: (question: Question) => void;
  style?: StyleProp<ViewStyle>;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onPress,
  style,
}) => {
  const difficultyLabel = String(question.difficulty);
  
  // Debug: show raw text if empty
  const displayText = question.question_text || 'NO TEXT: ' + JSON.stringify(question).slice(0, 100);
  
  return (
    <TouchableOpacity 
      onPress={() => onPress(question)} 
      activeOpacity={0.8}
      accessibilityLabel={`Question: ${displayText.slice(0, 50)}...`}
      accessibilityHint={`Tap to view ${difficultyLabel} difficulty question from ${question.company || 'General'} company`}
      accessibilityRole="button"
    >
      <Card variant="outline" style={[styles.card, style]}>
        {/* Question Text - with native Text for guaranteed rendering */}
        <Text numberOfLines={3} style={styles.questionText}>
          {displayText}
        </Text>

        {/* Company and Difficulty Row */}
        <View style={styles.footer}>
          {question.company && (
            <LabelSM color="secondary">{question.company}</LabelSM>
          )}
          <View style={styles.difficultyContainer}>
            <LabelSM color="secondary">{difficultyLabel.toUpperCase()}</LabelSM>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 100,
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    justifyContent: 'space-between',
    // SWISS STYLE: Sharp edges handled by Card component (borderRadius: none)
  },
  questionText: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing[3],
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing[3],
  },
  difficultyContainer: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.surface.secondary,
    // SWISS STYLE: Sharp edges, no border-radius
    borderRadius: theme.spacing.borderRadius.none,
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
  },
});

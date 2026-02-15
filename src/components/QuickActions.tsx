import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../theme';

interface QuickActionsProps {
  onDailyQuiz: () => void;
  onRandomPractice: () => void;
  onReviewMistakes: () => void;
  onWeakAreas: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onDailyQuiz,
  onRandomPractice,
  onReviewMistakes,
  onWeakAreas,
}) => {
  const actions = [
    { id: 'daily', title: '5-Question Sprint', subtitle: '5 quick questions', onPress: onDailyQuiz },
    { id: 'random', title: 'Any Category', subtitle: 'Random question', onPress: onRandomPractice },
    { id: 'review', title: 'Past Mistakes', subtitle: 'Review wrong answers', onPress: onReviewMistakes },
    { id: 'weak', title: 'My Weak Spots', subtitle: 'Custom to you', onPress: onWeakAreas },
  ];


  return (
    <View style={styles.container} accessibilityLabel="Quick actions menu">
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            activeOpacity={0.7}
            style={styles.actionButton}
            accessibilityLabel={action.title}
            accessibilityHint={`Tap to start ${action.title.toLowerCase()}. ${action.subtitle} questions`}
            accessibilityRole="button"
          >
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  actionButton: {
    width: '48%',
    minHeight: 48,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[3],
    backgroundColor: theme.colors.surface.primary,
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  actionSubtitle: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
});

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { QuestionCategory, Difficulty } from '../types';
import { theme } from '../theme';

interface FilterBarProps {
  selectedCategory?: QuestionCategory;
  selectedDifficulty?: Difficulty;
  onCategorySelect: (category?: QuestionCategory) => void;
  onDifficultySelect: (difficulty?: Difficulty) => void;
  onClear: () => void;
}

const CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: 'product_sense', label: 'Product Sense' },
  { value: 'execution', label: 'Execution' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'estimation', label: 'Estimation' },
  { value: 'technical', label: 'Technical' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'ab_testing', label: 'A/B Testing' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function FilterBar({
  selectedCategory,
  selectedDifficulty,
  onCategorySelect,
  onDifficultySelect,
  onClear,
}: FilterBarProps) {
  const hasFilters = selectedCategory || selectedDifficulty;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hasFilters && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={onClear}
            accessibilityLabel="Clear all filters"
            accessibilityHint="Removes all selected category and difficulty filters"
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>Clear All ✕</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category:</Text>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.chip,
                selectedCategory === cat.value && styles.chipActive,
              ]}
              onPress={() =>
                onCategorySelect(selectedCategory === cat.value ? undefined : cat.value)
              }
              accessibilityLabel={`${cat.label} category filter`}
              accessibilityHint={`Filter questions by ${cat.label.toLowerCase()}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === cat.value }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat.value && styles.chipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Difficulty:</Text>
          {DIFFICULTIES.map((diff) => (
            <TouchableOpacity
              key={diff.value}
              style={[
                styles.chip,
                selectedDifficulty === diff.value && styles.chipActive,
              ]}
              onPress={() =>
                onDifficultySelect(selectedDifficulty === diff.value ? undefined : diff.value)
              }
              accessibilityLabel={`${diff.label} difficulty filter`}
              accessibilityHint={`Filter questions by ${diff.label.toLowerCase()} difficulty`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedDifficulty === diff.value }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedDifficulty === diff.value && styles.chipTextActive,
                ]}
              >
                {diff.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: theme.spacing.borderWidth.thin,
    borderBottomColor: theme.colors.border.light,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing[3],
    gap: theme.spacing[3],
  },
  clearButton: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    // SWISS STYLE: Sharp edges, no border-radius
    borderRadius: theme.spacing.borderRadius.none,
    backgroundColor: theme.colors.semantic.error,
    marginRight: theme.spacing[2],
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.semantic.error,
  },
  clearButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginRight: theme.spacing[1],
  },
  chip: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    minHeight: 40,
    // SWISS STYLE: Sharp edges, no border-radius
    borderRadius: theme.spacing.borderRadius.none,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  chipTextActive: {
    color: theme.colors.text.inverse,
  },
  divider: {
    width: theme.spacing.borderWidth.thin,
    height: 24,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing[2],
  },
});

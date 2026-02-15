import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { QuestionCategory, Difficulty } from '../types';

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
});

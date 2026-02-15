import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Text,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { QuestionCard } from '../components/QuestionCard';
import { useQuestionsStore } from '../stores/questionsStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { QuestionCategory, Difficulty } from '../types';
import { theme } from '../theme';

type QuestionListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuestionList'>;
type QuestionListScreenRouteProp = RouteProp<RootStackParamList, 'QuestionList'>;

// Swiss design - all use theme tokens
export default function QuestionListScreen() {
  const navigation = useNavigation<QuestionListScreenNavigationProp>();
  const route = useRoute<QuestionListScreenRouteProp>();
  const { category: initialCategory } = route.params || {};

  const {
    questions,
    loading,
    hasMore,
    fetchQuestions,
    loadMore,
    searchQuestions,
  } = useQuestionsStore();
  
  const { progress } = useProgressStore();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | undefined>(
    initialCategory as QuestionCategory
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  // Get category progress for header
  const categoryProgress = React.useMemo(() => {
    if (!selectedCategory || !progress) return { completed: 0, total: 0 };
    const completed = progress.category_progress?.[selectedCategory] || 0;
    const total = questions.length;
    return { completed, total };
  }, [selectedCategory, progress, questions.length]);

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, selectedDifficulty]);

  const loadQuestions = async () => {
    if (isSearching && searchQuery) {
      return;
    }
    await fetchQuestions({
      category: selectedCategory,
      difficulty: selectedDifficulty,
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      loadQuestions();
      return;
    }
    setIsSearching(true);
    await searchQuestions(searchQuery);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadQuestions();
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !isSearching) {
      loadMore({
        category: selectedCategory,
        difficulty: selectedDifficulty,
      });
    }
  };

  // Get category display name
  const getCategoryName = () => {
    if (!selectedCategory) return 'QUESTIONS';
    return selectedCategory.replace('_', ' ').toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Swiss header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{getCategoryName()}</Text>
          {categoryProgress.total > 0 && (
            <Text style={styles.headerProgress}>{categoryProgress.completed}/{categoryProgress.total} DONE</Text>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search bar - bordered */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={handleSearch}
        >
          {searchQuery ? (
            <Text style={styles.searchClear} onPress={handleClearSearch}>✕</Text>
          ) : null}
          <Text style={searchQuery ? styles.searchText : styles.searchPlaceholder}>
            {searchQuery || 'Search...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips - bordered boxes */}
      <View style={styles.filterRow}>
        {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => (
          <TouchableOpacity 
            key={diff} 
            onPress={() => setSelectedDifficulty(selectedDifficulty === diff ? undefined : diff)}
            style={[
              styles.filterChip, 
              selectedDifficulty === diff && styles.filterChipActive
            ]}
          >
            <Text style={[
              styles.filterText,
              selectedDifficulty === diff && styles.filterTextActive
            ]}>
              {String(diff).toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Heavy separator */}
      <View style={styles.separator} />

      {/* Questions list */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.questionRow}
            onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.questionText} numberOfLines={2}>
              {item.question_text}
            </Text>
            <View style={styles.questionMeta}>
              <Text style={styles.questionMetaText}>{item.difficulty}</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={theme.colors.text.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>NO QUESTIONS</Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  handleClearSearch();
                  setSelectedDifficulty(undefined);
                }}
              >
                <Text style={styles.resetText}>RESET</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header - Swiss style
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
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
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.heading - 6,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  headerProgress: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginTop: 2,
  },
  headerSpacer: {
    width: 80,
  },
  
  // Search
  searchContainer: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingVertical: theme.spacing[4],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  searchText: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.primary,
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.disabled,
    flex: 1,
  },
  searchClear: {
    fontSize: theme.typography.body.md.fontSize,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[3],
    fontWeight: theme.swiss.fontWeight.medium,
  },
  
  // Filters - Swiss bordered
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.swiss.layout.screenPadding,
    gap: theme.spacing[2],
  },
  filterChip: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
  },
  filterChipActive: {
    backgroundColor: theme.colors.text.primary,
  },
  filterText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  filterTextActive: {
    color: theme.colors.text.inverse,
  },
  
  // Separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginTop: theme.spacing[4],
  },
  
  // List
  listContent: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  questionRow: {
    paddingVertical: theme.spacing[5],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.border.light,
  },
  questionText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: theme.spacing[2],
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionMetaText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  arrow: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  loader: {
    paddingVertical: theme.swiss.layout.sectionGap,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: theme.swiss.layout.sectionGap + theme.spacing[4],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[4],
  },
  resetButton: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  resetText: {
    fontSize: theme.swiss.fontSize.label + 2,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
});

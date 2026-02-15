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
import { QuestionCategory, Difficulty } from '../types';
import { theme } from '../theme';

type QuestionListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuestionList'>;
type QuestionListScreenRouteProp = RouteProp<RootStackParamList, 'QuestionList'>;

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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | undefined>(
    initialCategory as QuestionCategory
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>();
  const [isSearching, setIsSearching] = useState(false);

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
        <Text style={styles.headerTitle}>{getCategoryName()}</Text>
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
              <ActivityIndicator color="#000000" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  backButton: {
    width: 80,
  },
  backText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#000000',
  },
  headerSpacer: {
    width: 80,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999999',
    flex: 1,
  },
  searchClear: {
    fontSize: 14,
    color: '#000000',
    marginRight: 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  filterChipActive: {
    backgroundColor: '#000000',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  separator: {
    height: 3,
    backgroundColor: '#000000',
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  questionRow: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  loader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 16,
  },
  resetButton: {
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { QuestionCard } from '../components/QuestionCard';
import { useQuestionsStore } from '../stores/questionsStore';
import { QuestionCategory, Difficulty } from '../types';
import { Container, H2, BodyLG, BodyMD, TextInput, PrimaryButton, Row, LabelSM } from '../components/ui';
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

  return (
    <Container variant="screen" padding="none" safeArea>
      <View style={styles.header}>
        <View style={styles.headerTop}>
             <H2>{selectedCategory ? selectedCategory.replace('_', ' ').toUpperCase() : 'QUESTIONS'}</H2>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            variant="outline"
            size="md"
            placeholder="Search questions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            fullWidth
            rightElement={
              searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch}>
                  <BodyMD color="secondary">✕</BodyMD>
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>

        {!isSearching && (
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
                        <LabelSM 
                            style={[
                                styles.filterText,
                                selectedDifficulty === diff && styles.filterTextActive
                            ]}
                        >
                            {String(diff).toUpperCase()}
                        </LabelSM>
                    </TouchableOpacity>
                ))}
            </View>
        )}
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestionCard
            question={item}
            onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id })}
            style={styles.card}
          />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={theme.colors.primary[500]} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <H2 style={styles.emptyTitle}>NO QUESTIONS FOUND</H2>
              <BodyLG color="secondary" align="center" style={styles.emptySubtext}>
                Try adjusting your filters or search terms
              </BodyLG>
              
              <PrimaryButton
                size="md"
                onPress={() => {
                  handleClearSearch();
                  setSelectedDifficulty(undefined);
                }}
              >
                RESET FILTERS
              </PrimaryButton>
            </View>
          ) : null
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingBottom: theme.spacing[4],
  },
  headerTop: {
      paddingHorizontal: theme.spacing[6],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[4],
  },
  searchContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },
  filterRow: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing[6],
      gap: theme.spacing[2],
  },
  // Swiss Style: sharp corners (no borderRadius)
  filterChip: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.medium,
  },
  filterChipActive: {
      backgroundColor: theme.colors.primary[500],
      borderColor: theme.colors.primary[500],
  },
  filterText: {
      color: theme.colors.text.secondary,
  },
  filterTextActive: {
      color: theme.colors.text.inverse,
  },
  listContent: {
    padding: theme.spacing[6],
  },
  card: {
      marginBottom: theme.spacing[4],
  },
  loader: {
    paddingVertical: theme.spacing[6],
  },
  emptyContainer: {
    padding: theme.spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[10],
  },
  emptyTitle: {
    marginBottom: theme.spacing[3],
    textAlign: 'center',
  },
  emptySubtext: {
    marginBottom: theme.spacing[8],
  },
});

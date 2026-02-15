import React, { useEffect, useState } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { CategoryCard } from '../components/CategoryCard';
import { useQuestionsStore } from '../stores/questionsStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { QuestionCategory } from '../types';
import { Container, H1, BodyLG, Grid, Spacer } from '../components/ui';
import { theme } from '../theme';

type CategoryBrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryBrowse'>;

export default function CategoryBrowseScreen() {
  const navigation = useNavigation<CategoryBrowseScreenNavigationProp>();
  const { categoryStats, fetchCategoryStats } = useQuestionsStore();
  const { getCategoryProgress } = useProgressStore();
  const { user } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchCategoryStats();
    if (user) {
      const progress = await getCategoryProgress(user.id);
      setUserProgress(progress);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const categories: QuestionCategory[] = [
    'product_sense',
    'execution',
    'strategy',
    'behavioral',
    'estimation',
    'technical',
    // 'pricing', 'ab_testing' - Only show if they have questions
  ];

  const handleCategoryPress = (category: QuestionCategory) => {
    navigation.navigate('QuestionList', { category });
  };

  return (
    <Container
      variant="screen"
      padding="lg"
      safeArea
      scrollable
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <H1 style={styles.header}>BROWSE</H1>
      <BodyLG color="secondary" style={styles.subtitle}>
        Select a topic to start practicing
      </BodyLG>
      
      <Spacer size={theme.spacing[4]} />

      <Grid columns={2} gap={4}>
        {categories.map((category) => {
          const count = categoryStats[category] || 0;
          const progress = userProgress[category] || 0;

          return (
            <CategoryCard
              key={category}
              category={category}
              questionCount={count}
              userProgress={progress}
              onPress={() => handleCategoryPress(category)}
            />
          );
        })}
      </Grid>
      
      <Spacer size={theme.spacing[8]} />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing[2],
    letterSpacing: -0.5,
  },
  subtitle: {
    marginBottom: theme.spacing[4],
  },
});

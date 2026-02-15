import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { 
  Container, 
  DisplayLG, 
  H2,
  H4, 
  BodyLG, 
  BodyMD, 
  LabelSM, 
  Card, 
  Grid, 
  Row,
  Spacer
} from '../components/ui';
import { theme } from '../theme';
import { QUESTION_CATEGORIES } from '../types';
import { FRAMEWORKS } from '../data/frameworks';

const getMasteryColor = (score: number) => {
    if (score >= 80) return theme.colors.semantic.success;
    if (score >= 50) return theme.colors.semantic.warning;
    return theme.colors.semantic.error;
};

const getMasteryLabel = (score: number) => {
    if (score >= 80) return 'Mastered';
    if (score >= 50) return 'Learning';
    return 'Beginner';
};

const ActivityHeatmap = ({ activityData }: { activityData: string[] }) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    const days = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'narrow' }));
    
    const activity = last7Days.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        return activityData.some(ad => ad.startsWith(dateStr));
    });

    return (
        <View style={styles.heatmapContainer}>
            <View style={styles.heatmapGrid}>
                {days.map((day, index) => (
                    <View key={index} style={styles.heatmapColumn}>
                        <LabelSM color="secondary" style={styles.heatmapLabel}>{day}</LabelSM>
                        <View 
                            style={[
                                styles.heatmapDot, 
                                activity[index] ? styles.heatmapDotActive : styles.heatmapDotInactive
                            ]} 
                        />
                    </View>
                ))}
            </View>
            <LabelSM color="secondary" align="center" style={styles.heatmapFooter}>
                LAST 7 DAYS ACTIVITY
            </LabelSM>
        </View>
    );
};

// Framework mastery section
const FrameworkMasterySection = ({ 
    frameworkMastery 
}: { 
    frameworkMastery: Record<string, number>;
}) => {
    const frameworks = Object.entries(FRAMEWORKS).filter(([_, fw]) => fw.steps.length > 0);
    
    const sortedFrameworks = frameworks.sort((a, b) => {
        const scoreA = frameworkMastery[a[0]] || 0;
        const scoreB = frameworkMastery[b[0]] || 0;
        return scoreB - scoreA;
    });

    return (
        <View style={styles.section}>
            <LabelSM color="secondary" style={styles.sectionTitle}>FRAMEWORK MASTERY</LabelSM>
            <Card variant="outline" padding={5}>
                {sortedFrameworks.length > 0 ? (
                    sortedFrameworks.map(([name, framework]) => {
                        const score = frameworkMastery[name] || 0;
                        return (
                            <View key={name} style={styles.frameworkItem}>
                                <View style={styles.frameworkHeader}>
                                    <View style={[styles.frameworkBadge, { backgroundColor: framework.color + '20' }]}>
                                        <LabelSM style={{ color: framework.color, fontWeight: '600' }}>
                                            {name}
                                        </LabelSM>
                                    </View>
                                    <LabelSM style={{ 
                                        color: getMasteryColor(score), 
                                        fontWeight: '600' 
                                    }}>
                                        {score}%
                                    </LabelSM>
                                </View>
                                <View style={styles.masteryBarBg}>
                                    <View 
                                        style={[
                                            styles.masteryBarFill, 
                                            { width: `${score}%`, backgroundColor: framework.color }
                                        ]} 
                                    />
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <BodyMD color="secondary" align="center">
                        Complete practice questions to track framework mastery
                    </BodyMD>
                )}
            </Card>
        </View>
    );
};

// Pattern mastery section
const PatternMasterySection = ({ 
    patternMastery 
}: { 
    patternMastery: Record<string, number>;
}) => {
    const patterns = [
        { id: 'design_x_for_y', name: 'Design X for Y', icon: '🎨' },
        { id: 'improve_x', name: 'Improve X', icon: '📈' },
        { id: 'metrics_for_x', name: 'Metrics for X', icon: '📊' },
        { id: 'investigate_drop', name: 'Investigate Drop', icon: '🔍' },
        { id: 'strategy', name: 'Strategy', icon: '🎯' },
        { id: 'behavioral_star', name: 'STAR', icon: '⭐' },
    ];

    return (
        <View style={styles.section}>
            <LabelSM color="secondary" style={styles.sectionTitle}>PATTERN MASTERY</LabelSM>
            <Card variant="outline" padding={5}>
                {patterns.map(pattern => {
                    const score = patternMastery[pattern.id] || 0;
                    return (
                        <View key={pattern.id} style={styles.patternItem}>
                            <View style={styles.patternHeader}>
                                <View style={styles.patternNameContainer}>
                                    <LabelSM style={styles.patternIcon}>{pattern.icon}</LabelSM>
                                    <BodyMD style={styles.patternName}>{pattern.name}</BodyMD>
                                </View>
                                <LabelSM style={{ 
                                    color: getMasteryColor(score), 
                                    fontWeight: '600' 
                                }}>
                                    {score}%
                                </LabelSM>
                            </View>
                            <View style={styles.masteryBarBg}>
                                <View 
                                    style={[
                                        styles.masteryBarFill, 
                                        { width: `${score}%`, backgroundColor: getMasteryColor(score) }
                                    ]} 
                                />
                            </View>
                        </View>
                    );
                })}
            </Card>
        </View>
    );
};

// Category readiness section
const CategoryReadinessSection = ({ 
    categoryProgress 
}: { 
    categoryProgress: Record<string, number>;
}) => {
    const categoryInfo: Record<string, { name: string; color: string; icon: string }> = {
        product_sense: { name: 'Product Sense', color: theme.colors.primary[500], icon: '💡' },
        execution: { name: 'Execution', color: theme.colors.primary[600], icon: '⚡' },
        strategy: { name: 'Strategy', color: theme.colors.primary[700], icon: '🎯' },
        behavioral: { name: 'Behavioral', color: theme.colors.semantic.success, icon: '👤' },
        technical: { name: 'Technical', color: theme.colors.primary[400], icon: '🔧' },
        estimation: { name: 'Estimation', color: theme.colors.semantic.warning, icon: '📐' },
        pricing: { name: 'Pricing', color: theme.colors.neutral[500], icon: '💰' },
        ab_testing: { name: 'A/B Testing', color: theme.colors.semantic.error, icon: '🧪' },
    };

    const getCategoryReadiness = (category: string) => {
        const count = categoryProgress[category] || 0;
        return Math.min(Math.round((count / 10) * 100), 100);
    };

    const categories = QUESTION_CATEGORIES.filter(cat => categoryProgress[cat] !== undefined || true);

    return (
        <View style={styles.section}>
            <LabelSM color="secondary" style={styles.sectionTitle}>CATEGORY READINESS</LabelSM>
            <Card variant="outline" padding={5}>
                {categories.map(category => {
                    const info = categoryInfo[category] || { name: category, color: '#666', icon: '📁' };
                    const readiness = getCategoryReadiness(category);
                    
                    return (
                        <View key={category} style={styles.categoryItem}>
                            <View style={styles.categoryHeader}>
                                <View style={styles.categoryNameContainer}>
                                    <LabelSM style={styles.categoryIcon}>{info.icon}</LabelSM>
                                    <BodyMD style={styles.categoryName}>{info.name}</BodyMD>
                                </View>
                                <View style={styles.categoryStats}>
                                    <LabelSM color="secondary">
                                        {categoryProgress[category] || 0} questions
                                    </LabelSM>
                                    <LabelSM style={{ 
                                        color: getMasteryColor(readiness), 
                                        fontWeight: '600',
                                        marginLeft: 8
                                    }}>
                                        {readiness}%
                                    </LabelSM>
                                </View>
                            </View>
                            <View style={styles.masteryBarBg}>
                                <View 
                                    style={[
                                        styles.masteryBarFill, 
                                        { width: `${readiness}%`, backgroundColor: info.color }
                                    ]} 
                                />
                            </View>
                        </View>
                    );
                })}
            </Card>
        </View>
    );
};

// Main component
export default function ProgressScreen() {
  const navigation = useNavigation();
  const { user, isGuest, guestId } = useAuth();
  const { 
    progress,
    loading,
    history,
    activityData,
    fetchProgress, 
    fetchHistory, 
    fetchActivity, 
    getCategoryProgress,
    frameworkMastery,
    patternMastery,
    readinessScore,
    fetchMastery
  } = useProgressStore();
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const userId = user?.id || guestId;
    if (userId) {
      try {
        await Promise.all([
          fetchProgress(userId, isGuest),
          fetchHistory(userId, isGuest),
          fetchActivity(userId, isGuest),
          fetchMastery(userId, isGuest),
        ]);
        const stats = await getCategoryProgress(userId, isGuest);
        setCategoryStats(stats);
      } catch (err) {
        console.error('Error loading progress data:', err);
      }
    }
  }, [user, guestId, isGuest]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const currentStreak = progress?.current_streak || 0;
  const totalCompleted = progress?.total_questions_completed || 0;
  const displayReadiness = readinessScore || progress?.readiness_score || 0;

  const calculateDaysToReadiness = () => {
    const questionsToGo = Math.max(0, 50 - totalCompleted);
    const questionsPerDay = currentStreak > 0 ? Math.max(1, currentStreak) : 1;
    const days = Math.ceil(questionsToGo / questionsPerDay);
    return days > 365 ? '∞' : days;
  };

  const getProgressColor = (score: number) => {
      if (score >= 80) return theme.colors.semantic.success;
      if (score >= 50) return theme.colors.semantic.warning;
      return theme.colors.semantic.error;
  };

  if (useProgressStore(state => state.loading)) {
      return (
          <Container variant="screen" padding="none" safeArea>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <BodyLG>Loading progress...</BodyLG>
              </View>
          </Container>
      );
  }

  return (
    <Container variant="screen" padding="none" safeArea>
      <ScrollView contentContainerStyle={styles.content}>

        <DisplayLG style={styles.title}>PROGRESS</DisplayLG>

        {/* Readiness Score - Hero Section */}
        <Card variant="filled" padding={6} style={styles.readinessCard}>
            <View style={styles.readinessHeader}>
                <View>
                    <LabelSM color="secondary">INTERVIEW READY</LabelSM>
                    <H2 style={[styles.readinessScore, { color: getProgressColor(displayReadiness) }]}>
                        {displayReadiness}%
                    </H2>
                </View>
                <View style={[styles.readinessBadge, { 
                    backgroundColor: displayReadiness >= 80 
                        ? theme.colors.semantic.success + '20' 
                        : displayReadiness >= 50 
                            ? theme.colors.semantic.warning + '20'
                            : theme.colors.primary[100]
                }]}>
                    <LabelSM style={{ 
                        color: displayReadiness >= 80 
                            ? theme.colors.semantic.success 
                            : displayReadiness >= 50 
                                ? theme.colors.semantic.warning
                                : theme.colors.primary[600],
                        fontWeight: '600'
                    }}>
                        {displayReadiness >= 80 ? '🎉 READY!' : displayReadiness >= 50 ? '👨‍🎓 IN PROGRESS' : '🌱 JUST STARTED'}
                    </LabelSM>
                </View>
            </View>
            
            <View style={styles.readinessBarBg}>
                <View 
                    style={[
                        styles.readinessBarFill, 
                        { 
                            width: `${displayReadiness}%`, 
                            backgroundColor: getProgressColor(displayReadiness) 
                        }
                    ]} 
                />
            </View>

            {displayReadiness < 80 && (
                <View style={styles.readinessFooter}>
                    <BodyMD color="secondary">
                        To reach 80% ready: Complete {Math.max(0, 40 - Math.round(displayReadiness * 0.4))} more questions
                    </BodyMD>
                    <LabelSM color="secondary">
                        Estimated: {calculateDaysToReadiness()} days
                    </LabelSM>
                </View>
            )}

            {displayReadiness >= 80 && (
                <View style={styles.readinessFooter}>
                    <BodyMD style={{ color: theme.colors.semantic.success }}>
                        🎉 Congratulations! You're ready for your interviews!
                    </BodyMD>
                </View>
            )}
        </Card>

        {/* Heatmap Section */}
        <Card variant="outline" padding={6} style={styles.heatmapCard}>
            <ActivityHeatmap activityData={activityData} />
        </Card>

        {/* Stats Grid */}
        <View style={styles.section}>
            <LabelSM color="secondary" style={styles.sectionTitle}>OVERVIEW</LabelSM>
            <Grid columns={2} gap={4}>
                <Card variant="filled" padding={5}>
                    <H4 style={styles.statNumber}>{currentStreak}</H4>
                    <LabelSM color="secondary">DAY STREAK</LabelSM>
                </Card>
                <Card variant="filled" padding={5}>
                    <H4 style={styles.statNumber}>{totalCompleted}</H4>
                    <LabelSM color="secondary">QUESTIONS SOLVED</LabelSM>
                </Card>
                <Card variant="filled" padding={5}>
                    <H4 style={styles.statNumber}>{displayReadiness}%</H4>
                    <LabelSM color="secondary">READINESS</LabelSM>
                </Card>
                <Card variant="filled" padding={5}>
                    <H4 style={styles.statNumber}>
                        {Object.keys(frameworkMastery).length > 0 
                            ? Math.round(Object.values(frameworkMastery).reduce((a, b) => a + b, 0) / Object.values(frameworkMastery).length)
                            : 0}%
                    </H4>
                    <LabelSM color="secondary">AVG FRAMEWORK</LabelSM>
                </Card>
            </Grid>
        </View>

        {/* Framework Mastery Section */}
        <FrameworkMasterySection frameworkMastery={frameworkMastery} />

        {/* Pattern Mastery Section */}
        <PatternMasterySection patternMastery={patternMastery} />

        {/* Category Readiness Section */}
        <CategoryReadinessSection categoryProgress={categoryStats} />

        {/* Recent Activity */}
        <View style={styles.section}>
            <LabelSM color="secondary" style={styles.sectionTitle}>RECENT ACTIVITY</LabelSM>
            <View style={styles.activityList}>
                {useProgressStore.getState().history.length > 0 ? (
                    useProgressStore.getState().history.slice(0, 5).map((session, index) => (
                        <Card key={index} variant="outline" padding={4} style={styles.activityCard}>
                            <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                                <LabelSM color="secondary">
                                    {new Date(session.created_at).toLocaleDateString()}
                                </LabelSM>
                                <LabelSM 
                                    style={{ 
                                        color: session.completed ? theme.colors.semantic.success : theme.colors.semantic.warning 
                                    }}
                                >
                                    {session.completed ? 'COMPLETED' : 'IN PROGRESS'}
                                </LabelSM>
                            </Row>
                            <BodyMD style={{ fontWeight: '500', marginBottom: 4 }} numberOfLines={2}>
                                {session.questions?.question_text || 'Unknown Question'}
                            </BodyMD>
                            <Row style={{ justifyContent: 'space-between' }}>
                                <LabelSM color="secondary">
                                    {(session as any).session_type?.toUpperCase() || session.mode?.toUpperCase() || 'PRACTICE'}
                                </LabelSM>
                                {session.ai_feedback && (
                                    <LabelSM style={{ color: theme.colors.primary[500] }}>
                                        SCORE: {session.ai_feedback.score}/10
                                    </LabelSM>
                                )}
                            </Row>
                        </Card>
                    ))
                ) : (
                    <Card variant="outline" padding={5}>
                        <BodyMD color="secondary" align="center">No recent activity. Start practicing!</BodyMD>
                    </Card>
                )}
            </View>
        </View>

      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing[6],
    paddingBottom: 100,
  },
  title: {
    marginBottom: theme.spacing[6],
  },
  readinessCard: {
    marginBottom: theme.spacing[6],
    backgroundColor: theme.colors.surface.secondary,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  readinessScore: {
    fontSize: 48,
    fontWeight: '700',
    marginTop: theme.spacing[1],
  },
  readinessBadge: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: 20,
  },
  readinessBarBg: {
    height: 12,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 6,
    overflow: 'hidden',
  },
  readinessBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  readinessFooter: {
    marginTop: theme.spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heatmapCard: {
    marginBottom: theme.spacing[6],
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 0,
  },
  heatmapContainer: {
    alignItems: 'center',
  },
  heatmapGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: theme.spacing[4],
  },
  heatmapColumn: {
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  heatmapLabel: {
    opacity: 0.5,
  },
  heatmapDot: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  heatmapDotActive: {
    backgroundColor: theme.colors.semantic.success,
  },
  heatmapDotInactive: {
    backgroundColor: theme.colors.neutral[300],
  },
  heatmapFooter: {
    letterSpacing: 2,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
    letterSpacing: 1,
  },
  statNumber: {
    marginBottom: theme.spacing[2],
    color: theme.colors.primary[500],
  },
  
  // Mastery styles
  masteryItem: {
    marginBottom: theme.spacing[4],
  },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  masteryLabel: {
    fontWeight: '600',
    flex: 1,
  },
  masteryScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  masteryStatus: {
    marginLeft: 4,
  },
  masteryBarBg: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  masteryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Framework styles
  frameworkItem: {
    marginBottom: theme.spacing[5],
  },
  frameworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  frameworkBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: 12,
  },
  
  // Pattern styles
  patternItem: {
    marginBottom: theme.spacing[4],
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  patternNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternIcon: {
    marginRight: theme.spacing[2],
    fontSize: 18,
  },
  patternName: {
    fontWeight: '500',
  },
  
  // Category styles
  categoryItem: {
    marginBottom: theme.spacing[4],
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: theme.spacing[2],
    fontSize: 18,
  },
  categoryName: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Activity list
  activityList: {
    gap: theme.spacing[4],
  },
  activityCard: {
    backgroundColor: theme.colors.background,
  },
});

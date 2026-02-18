import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProgressStore } from '../stores/progressStore';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';
import { QUESTION_CATEGORIES } from '../types';
import { FRAMEWORKS } from '../data/frameworks';

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
// ============================================

const getMasteryColor = (score: number) => {
    if (score >= 80) return theme.colors.semantic.success;
    if (score >= 50) return theme.colors.semantic.warning;
    return theme.colors.semantic.error;
};

const getMasteryLabel = (score: number) => {
    if (score >= 80) return 'MASTERED';
    if (score >= 50) return 'LEARNING';
    return 'BEGINNER';
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
                        <Text style={styles.heatmapLabel}>{day}</Text>
                        <View 
                            style={[
                                styles.heatmapDot, 
                                activity[index] ? styles.heatmapDotActive : styles.heatmapDotInactive
                            ]} 
                        />
                    </View>
                ))}
            </View>
            <Text style={styles.heatmapFooter}>LAST 7 DAYS</Text>
        </View>
    );
};

// Framework mastery section - Swiss bordered boxes
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
            <Text style={styles.sectionLabel}>FRAMEWORK MASTERY</Text>
            
            {/* Swiss bordered card */}
            <View style={styles.masteryCard}>
                {sortedFrameworks.length > 0 ? (
                    sortedFrameworks.map(([name, framework]) => {
                        const score = frameworkMastery[name] || 0;
                        return (
                            <View key={name} style={styles.masteryItem}>
                                <View style={styles.masteryHeader}>
                                    <View style={styles.frameworkBadge}>
                                        <Text style={styles.frameworkBadgeText}>
                                            {name.toUpperCase().slice(0, 3)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.masteryPercent, { color: getMasteryColor(score) }]}>
                                        {score}%
                                    </Text>
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
                    <Text style={styles.emptyText}>
                        Complete practice to track mastery
                    </Text>
                )}
            </View>
        </View>
    );
};

// Pattern mastery section - Swiss bordered boxes
const PatternMasterySection = ({ 
    patternMastery 
}: { 
    patternMastery: Record<string, number>;
}) => {
    const patterns = [
        { id: 'design_x_for_y', name: 'Design X for Y', code: 'DX' },
        { id: 'improve_x', name: 'Improve X', code: 'IX' },
        { id: 'metrics_for_x', name: 'Metrics for X', code: 'MX' },
        { id: 'investigate_drop', name: 'Investigate Drop', code: 'ID' },
        { id: 'strategy', name: 'Strategy', code: 'ST' },
        { id: 'behavioral_star', name: 'STAR', code: 'SR' },
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>PATTERN MASTERY</Text>
            
            <View style={styles.masteryCard}>
                {patterns.map(pattern => {
                    const score = patternMastery[pattern.id] || 0;
                    return (
                        <View key={pattern.id} style={styles.masteryItem}>
                            <View style={styles.masteryHeader}>
                                <View style={styles.patternCodeBox}>
                                    <Text style={styles.patternCode}>{pattern.code}</Text>
                                </View>
                                <Text style={styles.patternName}>{pattern.name}</Text>
                                <Text style={[styles.masteryPercent, { color: getMasteryColor(score) }]}>
                                    {score}%
                                </Text>
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
            </View>
        </View>
    );
};

// Category readiness section - Swiss bordered boxes
const CategoryReadinessSection = ({ 
    categoryProgress 
}: { 
    categoryProgress: Record<string, number>;
}) => {
    const categoryInfo: Record<string, { name: string; code: string }> = {
        product_sense: { name: 'Product Sense', code: 'PS' },
        execution: { name: 'Execution', code: 'EX' },
        strategy: { name: 'Strategy', code: 'ST' },
        behavioral: { name: 'Behavioral', code: 'BH' },
        technical: { name: 'Technical', code: 'TC' },
        estimation: { name: 'Estimation', code: 'ES' },
        pricing: { name: 'Pricing', code: 'PR' },
        ab_testing: { name: 'A/B Testing', code: 'AB' },
    };

    const getCategoryReadiness = (category: string) => {
        const count = categoryProgress[category] || 0;
        return Math.min(Math.round((count / 10) * 100), 100);
    };

    const categories = QUESTION_CATEGORIES;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>CATEGORY READINESS</Text>
            
            <View style={styles.masteryCard}>
                {categories.map(category => {
                    const info = categoryInfo[category] || { name: category, code: 'XX' };
                    const readiness = getCategoryReadiness(category);
                    
                    return (
                        <View key={category} style={styles.masteryItem}>
                            <View style={styles.masteryHeader}>
                                <View style={styles.categoryCodeBox}>
                                    <Text style={styles.categoryCode}>{info.code}</Text>
                                </View>
                                <Text style={styles.categoryName}>{info.name}</Text>
                                <Text style={styles.categoryCount}>
                                    {categoryProgress[category] || 0}
                                </Text>
                                <Text style={[styles.masteryPercent, { color: getMasteryColor(readiness) }]}>
                                    {readiness}%
                                </Text>
                            </View>
                            <View style={styles.masteryBarBg}>
                                <View 
                                    style={[
                                        styles.masteryBarFill, 
                                        { width: `${readiness}%`, backgroundColor: getMasteryColor(readiness) }
                                    ]} 
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// Main component
export default function ProgressScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { 
    progress,
    loading,
    history,
    activityData,
    fetchProgress, 
    fetchHistory, 
    fetchActivity, 
    frameworkMastery,
    patternMastery,
    readinessScore,
    resetProgress,
  } = useProgressStore();
  const [refreshing, setRefreshing] = useState(false);

  // Reset and reload whenever the logged-in user changes
  useEffect(() => {
    if (!user?.id) {
      resetProgress();
    }
  }, [user?.id]);

  const loadData = useCallback(async () => {
    const userId = user?.id;
    if (userId) {
      try {
        // fetchProgress already populates frameworkMastery, patternMastery,
        // readinessScore, and category_progress — no need to call fetchMastery
        // or getCategoryProgress separately.
        await Promise.all([
          fetchProgress(userId),
          fetchHistory(userId),
          fetchActivity(userId),
        ]);
      } catch (err) {
        console.error('Error loading progress data:', err);
      }
    }
  }, [user?.id, fetchProgress, fetchHistory, fetchActivity]);

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
  // Prefer the dedicated readinessScore from the store (set by fetchProgress),
  // fallback to the value nested inside the progress object.
  const displayReadiness = readinessScore || progress?.readiness_score || 0;
  // Use category_progress directly from the already-fetched progress object
  const categoryStats: Record<string, number> =
    (progress?.category_progress as Record<string, number>) || {};

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

  const getReadinessLabel = (score: number) => {
      if (score >= 80) return 'READY';
      if (score >= 50) return 'IN PROGRESS';
      return 'JUST STARTED';
  };

  if (loading) {
      return (
          <View style={styles.container}>
              <View style={styles.header}>
                  <Text style={styles.headerTitle}>PROGRESS</Text>
                  <View style={[styles.streakBox, styles.streakBoxHidden]}>
                      <Text style={styles.streakText}>{''}</Text>
                  </View>
              </View>
              <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>LOADING...</Text>
              </View>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      {/* Swiss Header - bold bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROGRESS</Text>
        <View style={[styles.streakBox, currentStreak === 0 && styles.streakBoxHidden]}>
          <Text style={styles.streakText}>{currentStreak > 0 ? currentStreak : ''}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={theme.colors.text.primary}
            />
        }
      >
        {/* Readiness Score - Hero Section - Swiss bordered */}
        <View style={styles.readinessCard}>
            <View style={styles.readinessHeader}>
                <View>
                    <Text style={styles.readinessLabel}>INTERVIEW READY</Text>
                    <Text style={[styles.readinessScore, { color: getProgressColor(displayReadiness) }]}>
                        {displayReadiness}%
                    </Text>
                </View>
                <View style={styles.readinessBadge}>
                    <Text style={[styles.readinessBadgeText, { color: getProgressColor(displayReadiness) }]}>
                        {getReadinessLabel(displayReadiness)}
                    </Text>
                </View>
            </View>
            
            {/* Sharp bar - no border radius */}
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
                    <Text style={styles.readinessFooterText}>
                        To reach 80%: Complete {Math.max(0, 40 - Math.round(displayReadiness * 0.4))} more
                    </Text>
                    <Text style={styles.readinessFooterText}>
                        EST: {calculateDaysToReadiness()} DAYS
                    </Text>
                </View>
            )}

            {displayReadiness >= 80 && (
                <View style={styles.readinessFooter}>
                    <Text style={[styles.readinessFooterText, { color: theme.colors.semantic.success }]}>
                        READY FOR INTERVIEWS
                    </Text>
                </View>
            )}
        </View>

        {/* Heatmap Section - Swiss bordered */}
        <View style={styles.heatmapCard}>
            <ActivityHeatmap activityData={activityData} />
        </View>

        {/* Stats Grid - Swiss bordered boxes */}
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>OVERVIEW</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{currentStreak}</Text>
                    <Text style={styles.statLabel}>DAY STREAK</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{totalCompleted}</Text>
                    <Text style={styles.statLabel}>QUESTIONS</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{displayReadiness}%</Text>
                    <Text style={styles.statLabel}>READY</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>
                        {Object.keys(frameworkMastery).length > 0 
                            ? Math.round(Object.values(frameworkMastery).reduce((a, b) => a + b, 0) / Object.values(frameworkMastery).length)
                            : 0}%
                    </Text>
                    <Text style={styles.statLabel}>AVG FRAMEWORK</Text>
                </View>
            </View>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Framework Mastery Section */}
        <FrameworkMasterySection frameworkMastery={frameworkMastery} />

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Pattern Mastery Section */}
        <PatternMasterySection patternMastery={patternMastery} />

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Category Readiness Section */}
        <CategoryReadinessSection categoryProgress={categoryStats} />

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Recent Activity */}
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
            <View style={styles.activityList}>
                {history.length > 0 ? (
                    history.slice(0, 5).map((session, index) => (
                        <View key={index} style={styles.activityCard}>
                            <View style={styles.activityHeader}>
                                <Text style={styles.activityDate}>
                                    {new Date(session.created_at).toLocaleDateString()}
                                </Text>
                                <Text style={[
                                    styles.activityStatus,
                                    { color: session.completed ? theme.colors.semantic.success : theme.colors.semantic.warning }
                                ]}>
                                    {session.completed ? 'DONE' : 'IN PROGRESS'}
                                </Text>
                            </View>
                            <Text style={styles.activityQuestion} numberOfLines={2}>
                                {session.questions?.question_text || 'Unknown'}
                            </Text>
                            <View style={styles.activityFooter}>
                                <Text style={styles.activityType}>
                                    {(session as any).session_type?.toUpperCase() || session.mode?.toUpperCase() || 'PRACTICE'}
                                </Text>
                                {session.ai_feedback && (
                                    <Text style={styles.activityScore}>
                                        SCORE: {session.ai_feedback.score}/10
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.activityCard}>
                        <Text style={styles.emptyText}>No recent activity. Start practicing!</Text>
                    </View>
                )}
            </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// ============================================
// SWISS STYLE: Sharp edges, bold typography, no gradients
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header - Swiss bold bar
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  streakBox: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  streakText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  streakBoxHidden: {
    borderColor: 'transparent',
  },
  
  // Scroll view
  scrollView: {
    flex: 1,
  },
  
  content: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingTop: theme.swiss.layout.elementGap,
    paddingBottom: theme.spacing[6],
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
  },
  
  // Heavy separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.spacing[5],
  },
  
  // Readiness Card - Swiss bordered
  readinessCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.elementGap,
    marginBottom: theme.spacing[4],
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  readinessLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
    marginBottom: theme.spacing[1],
  },
  readinessScore: {
    fontSize: 48,
    fontWeight: theme.swiss.fontWeight.black,
  },
  readinessBadge: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  readinessBadgeText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  // Sharp bar - no border radius
  readinessBarBg: {
    height: 12,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 0,
    overflow: 'hidden',
  },
  readinessBarFill: {
    height: '100%',
    borderRadius: 0,
  },
  readinessFooter: {
    marginTop: theme.spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readinessFooterText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  
  // Heatmap Card
  heatmapCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.elementGap,
    marginBottom: theme.spacing[4],
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
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  // Sharp dots - no border radius
  heatmapDot: {
    width: 24,
    height: 24,
    borderRadius: 0,
  },
  heatmapDotActive: {
    backgroundColor: theme.colors.semantic.success,
  },
  heatmapDotInactive: {
    backgroundColor: theme.colors.neutral[300],
  },
  heatmapFooter: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  section: {
    marginBottom: theme.spacing[4],
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Mastery Card - Swiss bordered
  masteryCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
  },
  masteryItem: {
    marginBottom: theme.spacing[3],
  },
  masteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  masteryPercent: {
    marginLeft: 'auto',
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
  },
  // Sharp bars
  masteryBarBg: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 0,
    overflow: 'hidden',
  },
  masteryBarFill: {
    height: '100%',
    borderRadius: 0,
  },
  
  // Framework Badge
  frameworkBadge: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
  },
  frameworkBadgeText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  
  // Pattern/Category code box
  patternCodeBox: {
    width: 28,
    height: 28,
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
  },
  patternCode: {
    fontSize: 10,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  patternName: {
    flex: 1,
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  categoryCodeBox: {
    width: 32,
    height: 24,
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
  },
  categoryCode: {
    fontSize: 10,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  categoryName: {
    flex: 1,
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  categoryCount: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing[2],
  },
  
  emptyText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Activity list
  activityList: {
    gap: theme.spacing[3],
  },
  activityCard: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  activityDate: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  activityStatus: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  activityQuestion: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityType: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  activityScore: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.primary[500],
  },
  
  bottomSpacer: {
    height: theme.spacing[6],
  },
});

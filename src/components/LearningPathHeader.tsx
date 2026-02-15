import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface LearningPathHeaderProps {
  title: string;
  category: string;
  streak: number;
  userId?: string;
  isGuest?: boolean;
  readinessScore?: number;
}

export const LearningPathHeader = ({ 
  title, 
  category, 
  streak, 
  userId, 
  isGuest,
  readinessScore = 0 
}: LearningPathHeaderProps) => {
  const navigation = useNavigation();

  const getReadinessColor = () => {
    if (readinessScore >= 80) return theme.colors.semantic.success;
    if (readinessScore >= 50) return theme.colors.semantic.warning;
    return theme.colors.primary[500];
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.content}>
               <View style={styles.titleContainer}>
                   <Text style={styles.category}>{category.toUpperCase()}</Text>
                   <Text style={styles.title}>{title}</Text>
               </View>

               <View style={styles.statsContainer}>
                   {/* Streak */}
                   <View style={styles.statPill}>
                       <Text style={styles.icon}>🔥</Text>
                       <Text style={[styles.statValue, { color: theme.colors.semantic.warning }]}>{streak}</Text>
                   </View>
               </View>
          </View>

          {/* Readiness Bar */}
          {readinessScore > 0 && (
            <TouchableOpacity 
              style={styles.readinessContainer}
              onPress={() => navigation.navigate('Progress' as never)}
            >
              <View style={styles.readinessHeader}>
                <Text style={styles.readinessLabel}>Interview Ready</Text>
                <Text style={[styles.readinessValue, { color: getReadinessColor() }]}>
                  {readinessScore}%
                </Text>
              </View>
              <View style={styles.readinessBarBg}>
                <View 
                  style={[
                    styles.readinessBarFill, 
                    { width: `${readinessScore}%`, backgroundColor: getReadinessColor() }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          )}
      </SafeAreaView>
      <View style={styles.divider} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      zIndex: 10,
  },
  safeArea: {
      backgroundColor: 'transparent',
  },
  content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  titleContainer: {
    flex: 1,
  },
  category: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.text.secondary,
      letterSpacing: 1,
      marginBottom: 2,
  },
  title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
  },
  statsContainer: {
      flexDirection: 'row',
      gap: 8,
  },
  statPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  statValue: {
      fontWeight: '700',
      fontSize: 14,
  },
  icon: {
      fontSize: 16,
  },
  readinessContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  readinessLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  readinessValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  readinessBarBg: {
    height: 6,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  readinessBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  divider: {
      height: 1,
      backgroundColor: theme.colors.border.subtle,
      width: '100%',
  }
});

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { theme } from '../theme';
import { LessonType } from '../types';

interface LessonNodeProps {
  status: 'locked' | 'current' | 'completed';
  type: LessonType;
  position: number; // -1 (left), 0 (center), 1 (right)
  onPress: () => void;
  index: number; // For staggered animations if needed
}

export const LessonNode = ({ status, type, position, onPress, index }: LessonNodeProps) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Animation for "current" status
  useEffect(() => {
    if (status === 'current') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      
      // Floating effect
      translateY.value = withRepeat(
          withSequence(
              withTiming(-5, { duration: 1200 }),
              withTiming(0, { duration: 1200 })
          ),
          -1,
          true
      );
    }
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const getBackgroundColor = () => {
    if (status === 'locked') return theme.colors.neutral[200];
    if (status === 'completed') return theme.colors.semantic.success; // Gold color?
    return theme.colors.primary[500]; // Next/Current
  };

  const getIcon = () => {
    if (status === 'locked') return '🔒';
    if (status === 'completed') return '✓';
    if (type === 'quiz') return '⚡';
    return '★';
  };

  const NODE_SIZE = 70;
  
  // Handling position logic inside the node renders itself offset
  // But ideally the container handles the margin/padding.
  // Here we just render the circle.

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={status === 'locked'}
      style={styles.touchableArea}
    >
        <Animated.View style={[
            styles.circle, 
            { 
                backgroundColor: getBackgroundColor(),
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: NODE_SIZE / 2,
                borderWidth: status === 'current' ? 4 : 0,
                borderColor: theme.colors.backgroundPaper, // White border
                elevation: status === 'current' ? 5 : 0,
                shadowColor: theme.colors.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: status === 'current' ? 0.3 : 0,
                shadowRadius: 8,
            },
            animatedStyle
        ]}>
            {/* Inner Ring for visual detail */}
            <View style={{
                position: 'absolute',
                top: 4,
                width: '100%',
                alignItems: 'center',
            }}>
                 {/* Shiny highlight */}
                 <View style={{
                     width: NODE_SIZE * 0.4,
                     height: NODE_SIZE * 0.2,
                     backgroundColor: 'rgba(255,255,255,0.2)',
                     borderRadius: 20,
                 }} />
            </View>

            <Text style={{ fontSize: 28, color: status === 'locked' ? theme.colors.text.disabled : theme.colors.text.inverse }}>
                {getIcon()}
            </Text>
            
            {status === 'current' && (
                <View style={styles.startTag}>
                    <Text style={styles.startText}>START</Text>
                    <View style={styles.tagArrow} />
                </View>
            )}
        </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 100, // Explicit width for alignment
      height: 90,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  startTag: {
      position: 'absolute',
      top: -35,
      backgroundColor: theme.colors.backgroundPaper,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.primary[500],
      elevation: 4,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
  },
  startText: {
      color: theme.colors.primary[600],
      fontWeight: 'bold',
      fontSize: 12,
      letterSpacing: 1,
  },
  tagArrow: {
      position: 'absolute',
      bottom: -6,
      left: '50%',
      marginLeft: -6,
      width: 0, 
      height: 0, 
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 6,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.colors.primary[500], 
  }
});

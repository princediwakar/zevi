import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { H3, LabelSM, Row } from './ui';

interface SwissTimerProps {
  elapsedSeconds: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const SwissTimer: React.FC<SwissTimerProps> = ({
  elapsedSeconds,
  label = 'ELAPSED',
  style,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      <LabelSM color="secondary" style={styles.label}>{label}</LabelSM>
      <H3 style={styles.time}>{formatTime(elapsedSeconds)}</H3>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: 4,
    fontSize: 10,
    letterSpacing: 1,
  },
  time: {
    fontFamily: theme.typography.utility.mono.fontFamily,
    fontSize: 24,
    letterSpacing: -1,
    lineHeight: 28,
  },
});

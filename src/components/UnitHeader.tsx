import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface UnitHeaderProps {
  title: string;
  description: string;
  backgroundColor?: string;
}

export const UnitHeader = ({ title, description, backgroundColor = theme.colors.primary[500] }: UnitHeaderProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    paddingTop: theme.spacing[6],
    marginBottom: theme.spacing[6],
    borderTopLeftRadius: theme.spacing[4],
    borderTopRightRadius: theme.spacing[4],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  content: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '800', // Extra bold
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[1],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: theme.colors.text.inverse + 'E6', // 90% opacity
    fontWeight: '500',
  }
});

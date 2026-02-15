import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface UnitHeaderProps {
  title: string;
  description: string;
  backgroundColor?: string;
}

export const UnitHeader = ({ title, description, backgroundColor = '#3B82F6' }: UnitHeaderProps) => {
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
    padding: 16,
    paddingTop: 24,
    marginBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  content: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '800', // Extra bold
    color: 'white',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  }
});

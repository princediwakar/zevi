/**
 * Swiss Style Card Component
 * Flat design with heavy border, generous padding
 */

import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

type CardVariant = 'elevated' | 'outline' | 'filled';
type CardRadius = 'none' | 'sm' | 'md';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  radius?: CardRadius;
  padding?: number;
  children: React.ReactNode;
  onPress?: () => void;
}

/**
 * Swiss Style Card with flat design and heavy borders
 */
export const Card: React.FC<CardProps> = ({
  variant = 'outline',
  radius = 'none',
  padding = 6, // 24px - generous padding from redesign plan
  children,
  style,
  onPress,
  ...props
}) => {
  // Variant configurations
  const variantConfig = {
    elevated: {
      backgroundColor: theme.colors.surface.primary,
      borderColor: 'transparent',
      borderWidth: 0,
      shadow: theme.spacing.shadow.sm, // Subtle shadow for elevation
    },
    outline: {
      backgroundColor: theme.colors.surface.primary,
      borderColor: theme.colors.border.light,
      borderWidth: theme.spacing.borderWidth.thin, // 1px border from redesign plan
      shadow: theme.spacing.shadow.none,
    },
    filled: {
      backgroundColor: theme.colors.surface.secondary,
      borderColor: 'transparent',
      borderWidth: 0,
      shadow: theme.spacing.shadow.none,
    },
  };

  // Radius configurations
  const radiusConfig = {
    none: theme.spacing.borderRadius.none,
    sm: theme.spacing.borderRadius.sm, // 4px for subtle softening
    md: theme.spacing.borderRadius.md,
  };

  const config = variantConfig[variant];
  const borderRadius = radiusConfig[radius];
  const paddingValue = padding || theme.spacing[6]; // Default to 24px

  // Build card styles
  const cardStyles = StyleSheet.create({
    base: {
      borderRadius,
      backgroundColor: config.backgroundColor,
      borderWidth: config.borderWidth,
      borderColor: config.borderColor,
      padding: paddingValue,
      ...config.shadow, // Only spread shadow properties
    },
  });

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={onPress}
        style={[cardStyles.base, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyles.base, style]} {...props}>
      {children}
    </View>
  );
};

/**
 * Card subcomponents for structured layouts
 */
export const CardHeader: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View
    style={[
      { marginBottom: theme.spacing[4] }, // 16px spacing
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

export const CardBody: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View
    style={[
      { marginVertical: theme.spacing[2] }, // 8px spacing
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

export const CardFooter: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View
    style={[
      {
        marginTop: theme.spacing[4], // 16px spacing
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: theme.spacing[2], // 8px gap between actions
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

/**
 * Predefined card variants for convenience
 */
export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="elevated" {...props} />
);

export const OutlineCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="outline" {...props} />
);

export const FilledCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="filled" {...props} />
);
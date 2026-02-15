/**
 * Swiss Style Badge Component
 * Sharp edges, compact, high contrast
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';
import { BodySM } from './Typography';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'outline';
type BadgeSize = 'lg' | 'md' | 'sm';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Swiss Style Badge with sharp edges and high contrast
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
}) => {
  // Size configurations
  const sizeConfig = {
    lg: {
      paddingVertical: theme.spacing[1], // 4px
      paddingHorizontal: theme.spacing[3], // 12px
      fontSize: 12,
    },
    md: {
      paddingVertical: 2,
      paddingHorizontal: theme.spacing[2], // 8px
      fontSize: 10,
    },
    sm: {
      paddingVertical: 1,
      paddingHorizontal: theme.spacing[1], // 4px
      fontSize: 8,
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: theme.colors.primary[500],
      textColor: theme.colors.text.inverse,
      borderColor: theme.colors.primary[500],
    },
    secondary: {
      backgroundColor: theme.colors.neutral[200],
      textColor: theme.colors.text.primary,
      borderColor: theme.colors.neutral[200],
    },
    success: {
      backgroundColor: theme.colors.semantic.success,
      textColor: theme.colors.text.inverse,
      borderColor: theme.colors.semantic.success,
    },
    error: {
      backgroundColor: theme.colors.semantic.error,
      textColor: theme.colors.text.inverse,
      borderColor: theme.colors.semantic.error,
    },
    warning: {
      backgroundColor: theme.colors.semantic.warning,
      textColor: theme.colors.text.primary,
      borderColor: theme.colors.semantic.warning,
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: theme.colors.text.primary,
      borderColor: theme.colors.border.medium,
    },
  };

  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];

  // Build styles
  const styles = StyleSheet.create({
    badge: {
      backgroundColor: config.backgroundColor,
      borderWidth: theme.spacing.borderWidth.thin,
      borderColor: config.borderColor,
      borderRadius: theme.spacing.borderRadius.none, // Sharp edges
      paddingVertical: sizeStyle.paddingVertical,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      alignSelf: 'flex-start',
    },
    text: {
      color: config.textColor,
      fontSize: sizeStyle.fontSize,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={[styles.badge, style]}>
      <BodySM style={styles.text}>
        {children}
      </BodySM>
    </View>
  );
};

/**
 * Predefined badge variants for convenience
 */
export const PrimaryBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="primary" {...props} />
);

export const SecondaryBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="secondary" {...props} />
);

export const SuccessBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="success" {...props} />
);

export const ErrorBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="error" {...props} />
);

export const WarningBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="warning" {...props} />
);

export const OutlineBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="outline" {...props} />
);
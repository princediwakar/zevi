/**
 * Swiss Style Button Component
 * Rectangular, sharp corners, bold text, solid fill or heavy outline
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../theme';
import { Typography } from './Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'lg' | 'md' | 'sm';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Swiss Style Button with sharp corners and bold text
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  // Size configurations
  const sizeConfig = {
    lg: {
      paddingVertical: theme.spacing[4], // 16px
      paddingHorizontal: theme.spacing[7], // 32px
      typographyVariant: 'body.lg' as const,
      minHeight: 56,
    },
    md: {
      paddingVertical: theme.spacing[3], // 12px
      paddingHorizontal: theme.spacing[6], // 24px
      typographyVariant: 'body.md' as const,
      minHeight: 48,
    },
    sm: {
      paddingVertical: theme.spacing[2], // 8px
      paddingHorizontal: theme.spacing[4], // 16px
      typographyVariant: 'body.sm' as const,
      minHeight: 40,
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: theme.colors.primary[500],
      borderColor: theme.colors.primary[500],
      textColor: theme.colors.text.inverse,
      borderWidth: theme.spacing.borderWidth.thin,
    },
    secondary: {
      backgroundColor: theme.colors.neutral[200],
      borderColor: theme.colors.neutral[200],
      textColor: theme.colors.text.primary,
      borderWidth: theme.spacing.borderWidth.thin,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border.medium,
      textColor: theme.colors.text.primary,
      borderWidth: theme.spacing.borderWidth.medium, // Heavy outline
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.colors.text.primary,
      borderWidth: 0,
    },
    danger: {
      backgroundColor: theme.colors.semantic.error,
      borderColor: theme.colors.semantic.error,
      textColor: theme.colors.text.inverse,
      borderWidth: theme.spacing.borderWidth.thin,
    },
  };

  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];

  // Build button styles
  const buttonStyles = StyleSheet.create({
    base: {
      borderRadius: theme.spacing.borderRadius.none, // Sharp corners
      borderWidth: config.borderWidth,
      borderColor: config.borderColor,
      backgroundColor: config.backgroundColor,
      minHeight: sizeStyle.minHeight,
      paddingVertical: sizeStyle.paddingVertical,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2], // 8px gap between icon and text
      opacity: isDisabled ? 0.5 : 1,
      width: fullWidth ? '100%' : undefined,
    } as ViewStyle,
    pressed: {
      backgroundColor: variant === 'outline' || variant === 'ghost'
        ? theme.colors.state.hover
        : config.backgroundColor === 'transparent'
        ? theme.colors.state.hover
        : `${config.backgroundColor}CC`, // Add opacity on press
    },
  });

  // Extract text content from children for accessibility
  const buttonText = typeof children === 'string' ? children : '';
  
  return (
    <TouchableOpacity
      style={[buttonStyles.base, style]}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityLabel={props.accessibilityLabel || buttonText}
      accessibilityHint={props.accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={config.textColor}
        />
      ) : (
        <>
          {leftIcon}
          <Typography
            variant={sizeStyle.typographyVariant}
            color={config.textColor}
            align="center"
            style={{ fontWeight: '600' }} // Bold text
          >
            {children}
          </Typography>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

/**
 * Predefined button variants for convenience
 */
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
);
/**
 * Swiss Style TextInput Component
 * Sharp edges, heavy borders, clear visual states
 */

import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { theme } from '../../theme';
import { BodySM } from './Typography';

type TextInputVariant = 'outline' | 'filled' | 'underlined';
type TextInputSize = 'lg' | 'md' | 'sm';

interface TextInputProps extends RNTextInputProps {
  variant?: TextInputVariant;
  size?: TextInputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Swiss Style TextInput with sharp edges and clear states
 */
export const TextInput: React.FC<TextInputProps> = ({
  variant = 'outline',
  size = 'md',
  label,
  error,
  helperText,
  leftElement,
  rightElement,
  fullWidth = false,
  style,
  placeholderTextColor = theme.colors.text.disabled,
  selectionColor = theme.colors.primary[500],
  ...props
}) => {
  // Size configurations
  const sizeConfig = {
    lg: {
      paddingVertical: theme.spacing[4], // 16px
      paddingHorizontal: theme.spacing[6], // 24px
      fontSize: 16,
      minHeight: 56,
    },
    md: {
      paddingVertical: theme.spacing[3], // 12px
      paddingHorizontal: theme.spacing[4], // 16px
      fontSize: 14,
      minHeight: 48,
    },
    sm: {
      paddingVertical: theme.spacing[2], // 8px
      paddingHorizontal: theme.spacing[3], // 12px
      fontSize: 12,
      minHeight: 40,
    },
  };

  // Variant configurations
  const variantConfig = {
    outline: {
      backgroundColor: theme.colors.surface.primary,
      borderColor: theme.colors.border.medium,
      borderWidth: theme.spacing.borderWidth.thin,
    },
    filled: {
      backgroundColor: theme.colors.surface.secondary,
      borderColor: 'transparent',
      borderWidth: 0,
    },
    underlined: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border.medium,
      borderWidth: 0,
      borderBottomWidth: theme.spacing.borderWidth.thin,
    },
  };

  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];
  const hasError = !!error;

  // Build styles
  const styles = StyleSheet.create({
    container: {
      width: fullWidth ? '100%' : undefined,
    },
    label: {
      marginBottom: theme.spacing[2], // 8px
      color: theme.colors.text.primary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: config.backgroundColor,
      borderWidth: config.borderWidth,
      borderColor: hasError ? theme.colors.semantic.error : config.borderColor,
      borderRadius: theme.spacing.borderRadius.none, // Sharp edges
      minHeight: sizeStyle.minHeight,
      ...(variant === 'underlined' && {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }),
    },
    input: {
      flex: 1,
      paddingVertical: sizeStyle.paddingVertical,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      fontSize: sizeStyle.fontSize,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.body.md.fontFamily,
    },
    leftElementContainer: {
      paddingLeft: theme.spacing[4], // 16px
    },
    rightElementContainer: {
      paddingRight: theme.spacing[4], // 16px
    },
    errorText: {
      marginTop: theme.spacing[2], // 8px
      color: theme.colors.semantic.error,
    },
    helperText: {
      marginTop: theme.spacing[2], // 8px
      color: theme.colors.text.secondary,
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <BodySM style={styles.label}>
          {label}
        </BodySM>
      )}

      <View style={styles.inputContainer}>
        {leftElement && (
          <View style={styles.leftElementContainer}>
            {leftElement}
          </View>
        )}

        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={placeholderTextColor}
          selectionColor={selectionColor}
          enablesReturnKeyAutomatically
          blurOnSubmit={false}
          {...props}
        />

        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </View>

      {hasError ? (
        <BodySM style={styles.errorText}>
          {error}
        </BodySM>
      ) : helperText ? (
        <BodySM style={styles.helperText}>
          {helperText}
        </BodySM>
      ) : null}
    </View>
  );
};

/**
 * Specialized input variants
 * SWISS STYLE: No emojis - use symbols instead
 */
export const SearchInput: React.FC<Omit<TextInputProps, 'leftElement' | 'placeholder'>> = (props) => (
  <TextInput
    leftElement={<Text style={styles.searchIcon}>⌕</Text>}
    placeholder="SEARCH..."
    {...props}
  />
);

const styles = StyleSheet.create({
  searchIcon: {
    fontSize: 18,
    color: '#71717A',
  },
});

export const EmailInput: React.FC<Omit<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect' | 'autoComplete'>> = (props) => (
  <TextInput
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    autoComplete="email"
    placeholder="email@example.com"
    {...props}
  />
);

export const PasswordInput: React.FC<Omit<TextInputProps, 'secureTextEntry' | 'autoCapitalize' | 'autoCorrect' | 'autoComplete'>> = (props) => (
  <TextInput
    secureTextEntry
    autoCapitalize="none"
    autoCorrect={false}
    autoComplete="password"
    placeholder="••••••••"
    {...props}
  />
);
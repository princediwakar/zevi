/**
 * Swiss Style Typography Component
 * Enforces the type scale with massive typography and tight tracking
 */

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

type TypographyVariant =
  | 'display.xxl' | 'display.xl' | 'display.lg'
  | 'heading.h1' | 'heading.h2' | 'heading.h3' | 'heading.h4'
  | 'body.xl' | 'body.lg' | 'body.md' | 'body.sm'
  | 'label.lg' | 'label.md' | 'label.sm';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: keyof typeof theme.colors.text | string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  uppercase?: boolean;
  children: React.ReactNode;
}

/**
 * Typography component that enforces Swiss style type scale
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body.md',
  color = 'primary',
  align = 'left',
  uppercase = false,
  children,
  style,
  ...props
}) => {
  // Parse variant to get the appropriate style
  const [type, size] = variant.split('.') as [keyof typeof theme.typography, string];

  // Get the typography style from theme with type safety
  const typographyStyle = (theme.typography[type] as any)[size];

  // Get color value
  const colorValue = color in theme.colors.text
    ? theme.colors.text[color as keyof typeof theme.colors.text]
    : color;

  // Build the style
  const textStyle = StyleSheet.create({
    base: {
      color: colorValue,
      textAlign: align,
      ...typographyStyle,
    },
    uppercase: {
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },
  });

  return (
    <Text
      style={[
        textStyle.base,
        uppercase && textStyle.uppercase,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * Predefined typography components for common use cases
 */

// Display variants - massive typography
export const DisplayXXL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display.xxl" {...props} />
);

export const DisplayXL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display.xl" {...props} />
);

export const DisplayLG: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display.lg" {...props} />
);

// Heading variants - bold and impactful
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="heading.h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="heading.h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="heading.h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="heading.h4" {...props} />
);

// Body variants - relaxed line height
export const BodyXL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body.xl" {...props} />
);

export const BodyLG: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body.lg" {...props} />
);

export const BodyMD: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body.md" {...props} />
);

export const BodySM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body.sm" {...props} />
);

// Label variants
export const LabelLG: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label.lg" {...props} />
);

export const LabelMD: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label.md" {...props} />
);

export const LabelSM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label.sm" {...props} />
);
/**
 * Swiss Style Typography System
 * Neo-Grotesque, massive typography, tight tracking
 * Based on redesign-plan.md specifications
 */

import { Platform, TextStyle } from 'react-native';

// Font families - using system fonts for Neo-Grotesque feel
const fontFamily = {
  regular: Platform.select({
    ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
    android: 'Roboto, "Helvetica Neue", sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  }),
  medium: Platform.select({
    ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
    android: 'Roboto, "Helvetica Neue", sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  }),
  semibold: Platform.select({
    ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
    android: 'Roboto, "Helvetica Neue", sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  }),
  bold: Platform.select({
    ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
    android: 'Roboto, "Helvetica Neue", sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  }),
  black: Platform.select({
    ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
    android: 'Roboto, "Helvetica Neue", sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  }),
} as const;

// Typography scale - massive typography with tight tracking
export const typography = {
  // Display - massive typography for impact
  display: {
    xxl: {
      fontSize: 64,
      lineHeight: 72,
      fontWeight: '900' as const,
      letterSpacing: -1.5, // Tight tracking
      fontFamily: fontFamily.black,
    },
    xl: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '900' as const,
      letterSpacing: -1,
      fontFamily: fontFamily.black,
    },
    lg: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: '800' as const,
      letterSpacing: -0.75,
      fontFamily: fontFamily.black,
    },
  },

  // Headings - bold and impactful
  heading: {
    h1: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '800' as const,
      letterSpacing: -0.5,
      fontFamily: fontFamily.black,
    },
    h2: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '800' as const,
      letterSpacing: -0.25,
      fontFamily: fontFamily.black,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
      letterSpacing: 0,
      fontFamily: fontFamily.bold,
    },
    h4: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700' as const,
      letterSpacing: 0,
      fontFamily: fontFamily.bold,
    },
  },

  // Body text - relaxed line height for readability
  body: {
    xl: {
      fontSize: 18,
      lineHeight: 28, // Relaxed line height
      fontWeight: '400' as const,
      letterSpacing: 0,
      fontFamily: fontFamily.regular,
    },
    lg: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
      fontFamily: fontFamily.regular,
    },
    md: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0,
      fontFamily: fontFamily.regular,
    },
    sm: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0,
      fontFamily: fontFamily.regular,
    },
  },

  // Labels and captions
  label: {
    lg: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
      fontFamily: fontFamily.semibold,
    },
    md: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
      fontFamily: fontFamily.semibold,
    },
    sm: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      fontFamily: fontFamily.semibold,
    },
  },

  // Utility styles
  utility: {
    mono: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      fontFamily: Platform.select({
        ios: 'Menlo, Monaco, "Courier New", monospace',
        android: 'monospace',
        default: 'monospace',
      }),
    },
    uppercase: {
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypographyType = keyof TypographyTokens;
export type TypographyVariant<T extends TypographyType> = keyof TypographyTokens[T];

// Helper function to create text style objects with proper typing
export const createTextStyle = <T extends TypographyType>(
  variant: TypographyVariant<T>,
  type: T = 'body' as T
): TextStyle => {
  return typography[type][variant] as TextStyle;
};

// Re-export TextStyle for consumers
export type { TextStyle };

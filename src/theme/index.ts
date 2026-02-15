/**
 * Swiss Style Design System
 * High contrast BLACK & WHITE - pure, stark, minimal
 * No blue, no gradients, no soft shadows
 * 
 * DESIGN PRINCIPLES:
 * - Sharp edges (no border-radius)
 * - High contrast (black & white only)
 * - Bold typography (800-900 weights, uppercase labels)
 * - Geometric (heavy separator lines, bordered boxes)
 * - No AI Slop (no gradients, no soft shadows, no emojis)
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

/**
 * Swiss Design Constants
 * Centralized values to ensure consistency across all screens
 */
export const swiss = {
  // Layout constants
  layout: {
    headerHeight: 120, // Includes safe area + header bar
    headerPaddingTop: 60, // Safe area for notch
    headerPaddingBottom: 16,
    screenPadding: 24,
    sectionGap: 32,
    elementGap: 16,
    tightGap: 8,
  },
  
  // Border constants - heavy, bold borders
  border: {
    heavy: 3, // 3px for major separators
    standard: 2, // 2px for cards/boxes
    light: 1, // 1px for subtle dividers
  },
  
  // Typography sizing - massive for Swiss impact
  fontSize: {
    display: 48,
    title: 32,
    heading: 24,
    body: 16,
    label: 12,
    small: 10,
  },
  
  // Font weights - bold only
  fontWeight: {
    black: '900' as const,
    bold: '800' as const,
    semibold: '700' as const,
    medium: '600' as const,
  },
  
  // Letter spacing - tight for Swiss precision
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1,
    xwide: 2,
    xwide3: 3,
    xwide4: 4,
  },
} as const;

/**
 * Complete theme object
 */
export const theme = {
  colors,
  typography,
  spacing,
  swiss,
} as const;

export type Theme = typeof theme;

/**
 * Type utilities for theme usage
 */
export type ColorToken = keyof typeof colors | string;
export type TypographyVariant = keyof typeof typography.display |
                                keyof typeof typography.heading |
                                keyof typeof typography.body |
                                keyof typeof typography.label;

/**
 * Theme context type for React Context
 */
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

/**
 * Default theme instance
 */
export default theme;

/**
 * Swiss Style Design System
 * High contrast black/white with International Blue signal color
 * Massive typography, sharp edges, high precision
 * Based on redesign-plan.md specifications
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

/**
 * Complete theme object
 */
export const theme = {
  colors,
  typography,
  spacing,
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
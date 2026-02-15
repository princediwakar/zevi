/**
 * Swiss Style Color Tokens
 * High contrast black/white with International Blue as signal color
 * Based on redesign-plan.md specifications
 */

export const colors = {
  // Core colors from redesign plan
  background: '#FFFFFF', // Pure white background
  backgroundPaper: '#F4F4F5', // Slightly off-white for paper feel

  // Text colors
  text: {
    primary: '#09090B', // Rich Black - main text
    secondary: '#71717A', // Neutral Zinc - secondary text
    disabled: '#A1A1AA', // Disabled text
    inverse: '#FFFFFF', // Text on dark backgrounds
  },

  // Primary signal color - International Blue
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB', // International Blue - main signal color
    600: '#1D4ED8',
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#1E3A8A',
  },

  // Neutral colors for surfaces and borders
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },

  // Semantic colors
  semantic: {
    success: '#10B981', // Green for success states
    error: '#EF4444', // Red for errors
    warning: '#F59E0B', // Orange for warnings
    info: '#3B82F6', // Blue for informational
  },

  // Surface colors
  surface: {
    primary: '#FFFFFF', // White surfaces
    secondary: '#F4F4F5', // Slightly off-white for elevated surfaces
    tertiary: '#E4E4E7', // Subtle background for nested elements
  },

  // Border colors
  border: {
    light: '#E4E4E7', // Light borders from redesign plan
    medium: '#D4D4D8',
    strong: '#71717A',
    subtle: '#F4F4F5', // Added for HomeScreen usage
  },

  // Interactive states
  state: {
    hover: 'rgba(0, 0, 0, 0.04)',
    pressed: 'rgba(0, 0, 0, 0.08)',
    focus: 'rgba(37, 99, 235, 0.12)', // Primary blue with opacity
    selected: 'rgba(37, 99, 235, 0.08)',
  },
} as const;

export type ColorTokens = typeof colors;
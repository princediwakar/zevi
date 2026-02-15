/**
 * Swiss Style Spacing System
 * 4pt grid system with generous padding
 * Based on redesign-plan.md specifications
 */

export const spacing = {
  // 4pt grid system
  0: 0,
  1: 4,   // 4pt
  2: 8,   // 8pt
  3: 12,  // 12pt
  4: 16,  // 16pt
  5: 20,  // 20pt
  6: 24,  // 24pt - standard padding from redesign plan
  7: 32,  // 32pt
  8: 40,  // 40pt
  9: 48,  // 48pt
  10: 56, // 56pt
  11: 64, // 64pt
  12: 72, // 72pt
  13: 80, // 80pt
  14: 96, // 96pt
  15: 128, // 128pt

  // Semantic spacing
  screenPadding: 24, // Standard screen padding from redesign plan
  cardPadding: 24,   // Card padding
  sectionGap: 32,    // Gap between sections
  elementGap: 16,    // Gap between elements
  tightGap: 8,       // Tight gap for dense layouts
  looseGap: 40,      // Loose gap for breathing room

  // Border radii - sharp edges with optional small radius
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,   // Small radius for subtle softening
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Border widths
  borderWidth: {
    hairline: 0.5,
    thin: 1,     // Standard border from redesign plan
    medium: 2,   // Heavy border option
    thick: 3,
  },

  // Shadows - minimal or neobrutalist
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    // Neobrutalist shadow option
    brutal: {
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
  },
} as const;

export type SpacingTokens = typeof spacing;

// Helper functions for common spacing patterns
export const spacingHelpers = {
  // Padding helpers
  p: (size: keyof typeof spacing) => ({ padding: spacing[size] }),
  px: (size: keyof typeof spacing) => ({ paddingHorizontal: spacing[size] }),
  py: (size: keyof typeof spacing) => ({ paddingVertical: spacing[size] }),
  pt: (size: keyof typeof spacing) => ({ paddingTop: spacing[size] }),
  pr: (size: keyof typeof spacing) => ({ paddingRight: spacing[size] }),
  pb: (size: keyof typeof spacing) => ({ paddingBottom: spacing[size] }),
  pl: (size: keyof typeof spacing) => ({ paddingLeft: spacing[size] }),

  // Margin helpers
  m: (size: keyof typeof spacing) => ({ margin: spacing[size] }),
  mx: (size: keyof typeof spacing) => ({ marginHorizontal: spacing[size] }),
  my: (size: keyof typeof spacing) => ({ marginVertical: spacing[size] }),
  mt: (size: keyof typeof spacing) => ({ marginTop: spacing[size] }),
  mr: (size: keyof typeof spacing) => ({ marginRight: spacing[size] }),
  mb: (size: keyof typeof spacing) => ({ marginBottom: spacing[size] }),
  ml: (size: keyof typeof spacing) => ({ marginLeft: spacing[size] }),

  // Gap helpers
  gap: (size: keyof typeof spacing) => ({ gap: spacing[size] }),
  rowGap: (size: keyof typeof spacing) => ({ rowGap: spacing[size] }),
  columnGap: (size: keyof typeof spacing) => ({ columnGap: spacing[size] }),
};
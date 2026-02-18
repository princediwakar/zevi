"use strict";
/**
 * Swiss Style Spacing System
 * 4pt grid system with generous padding
 * Based on redesign-plan.md specifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.spacingHelpers = exports.spacing = void 0;
exports.spacing = {
    // 4pt grid system
    0: 0,
    1: 4, // 4pt
    2: 8, // 8pt
    3: 12, // 12pt
    4: 16, // 16pt
    5: 20, // 20pt
    6: 24, // 24pt - standard padding from redesign plan
    7: 32, // 32pt
    8: 40, // 40pt
    9: 48, // 48pt
    10: 56, // 56pt
    11: 64, // 64pt
    12: 72, // 72pt
    13: 80, // 80pt
    14: 96, // 96pt
    15: 128, // 128pt
    // Semantic spacing
    screenPadding: 24, // Standard screen padding from redesign plan
    cardPadding: 24, // Card padding
    sectionGap: 32, // Gap between sections
    elementGap: 16, // Gap between elements
    tightGap: 8, // Tight gap for dense layouts
    looseGap: 40, // Loose gap for breathing room
    // Border radii - sharp edges with optional small radius
    borderRadius: {
        none: 0,
        xs: 2,
        sm: 4, // Small radius for subtle softening
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    // Border widths
    borderWidth: {
        hairline: 0.5,
        thin: 1, // Standard border from redesign plan
        medium: 2, // Heavy border option
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
};
// Helper functions for common spacing patterns
exports.spacingHelpers = {
    // Padding helpers
    p: function (size) { return ({ padding: exports.spacing[size] }); },
    px: function (size) { return ({ paddingHorizontal: exports.spacing[size] }); },
    py: function (size) { return ({ paddingVertical: exports.spacing[size] }); },
    pt: function (size) { return ({ paddingTop: exports.spacing[size] }); },
    pr: function (size) { return ({ paddingRight: exports.spacing[size] }); },
    pb: function (size) { return ({ paddingBottom: exports.spacing[size] }); },
    pl: function (size) { return ({ paddingLeft: exports.spacing[size] }); },
    // Margin helpers
    m: function (size) { return ({ margin: exports.spacing[size] }); },
    mx: function (size) { return ({ marginHorizontal: exports.spacing[size] }); },
    my: function (size) { return ({ marginVertical: exports.spacing[size] }); },
    mt: function (size) { return ({ marginTop: exports.spacing[size] }); },
    mr: function (size) { return ({ marginRight: exports.spacing[size] }); },
    mb: function (size) { return ({ marginBottom: exports.spacing[size] }); },
    ml: function (size) { return ({ marginLeft: exports.spacing[size] }); },
    // Gap helpers
    gap: function (size) { return ({ gap: exports.spacing[size] }); },
    rowGap: function (size) { return ({ rowGap: exports.spacing[size] }); },
    columnGap: function (size) { return ({ columnGap: exports.spacing[size] }); },
};

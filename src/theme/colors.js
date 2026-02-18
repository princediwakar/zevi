"use strict";
/**
 * Swiss Style Color Tokens
 * High contrast BLACK & WHITE - no blue
 * Pure, stark, minimal design
 *
 * DESIGN PRINCIPLES:
 * - Sharp edges (no border-radius)
 * - High contrast (black & white only)
 * - Bold typography (800-900 weights)
 * - Geometric (heavy separator lines, bordered boxes)
 * - No AI Slop (no gradients, no soft shadows, no emojis)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
exports.colors = {
    // Core colors - Pure black & white
    background: '#FFFFFF', // Pure white background
    backgroundPaper: '#F5F5F5', // Slightly off-white for paper feel
    // Text colors
    text: {
        primary: '#000000', // Pure Black - main text
        secondary: '#666666', // Gray - secondary text
        disabled: '#999999', // Disabled text
        inverse: '#FFFFFF', // Text on dark backgrounds
    },
    // Primary signal color - BLACK (not blue!)
    primary: {
        50: '#F5F5F5',
        100: '#E5E5E5',
        200: '#D4D4D4',
        300: '#A3A3A3',
        400: '#737373',
        500: '#404040', // Black gray - main signal
        600: '#262626',
        700: '#171717',
        800: '#0A0A0A',
        900: '#000000', // Pure black
    },
    // Neutral colors for surfaces and borders
    neutral: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    },
    // Semantic colors - minimal, functional
    semantic: {
        success: '#22C55E', // Green for success
        error: '#EF4444', // Red for errors
        warning: '#F59E0B', // Orange for warnings
        info: '#404040', // Black for informational
    },
    // Streak colors - muted, not bright
    streak: {
        gold: '#CA8A04',
        red: '#DC2626',
        orange: '#EA580C',
        teal: '#0D9488',
        purple: '#7C3AED',
    },
    // Category colors - muted, not bright
    category: {
        product_sense: '#404040',
        execution: '#525252',
        strategy: '#171717',
        behavioral: '#22C55E',
        estimation: '#CA8A04',
        technical: '#737373',
        pricing: '#A3A3A3',
        ab_testing: '#DC2626',
    },
    // Celebration - muted, no bright gradients
    celebration: {
        milestone: ['#525252', '#171717'],
        level_up: ['#22C55E', '#16A34A'],
        streak: ['#DC2626', '#B91C1C'],
        readiness: ['#404040', '#262626'],
        default: ['#525252', '#404040'],
    },
    // Surface colors
    surface: {
        primary: '#FFFFFF', // White surfaces
        secondary: '#F5F5F5', // Slightly off-white for elevated surfaces
        tertiary: '#E5E5E5', // Subtle background for nested elements
    },
    // Border colors
    border: {
        light: '#E5E5E5', // Light borders
        medium: '#D4D4D4',
        strong: '#404040',
        subtle: '#F5F5F5',
    },
    // Interactive states
    state: {
        hover: 'rgba(0, 0, 0, 0.04)',
        pressed: 'rgba(0, 0, 0, 0.08)',
        focus: 'rgba(0, 0, 0, 0.12)', // Black with opacity
        selected: 'rgba(0, 0, 0, 0.08)',
    },
};

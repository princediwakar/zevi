"use strict";
/**
 * Swiss Style Typography System
 * Neo-Grotesque, massive typography, tight tracking
 * Based on redesign-plan.md specifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextStyle = exports.typography = void 0;
var react_native_1 = require("react-native");
// Font families - using system fonts for Neo-Grotesque feel
var fontFamily = {
    regular: react_native_1.Platform.select({
        ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
        android: 'Roboto, "Helvetica Neue", sans-serif',
        default: 'system-ui, -apple-system, sans-serif',
    }),
    medium: react_native_1.Platform.select({
        ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
        android: 'Roboto, "Helvetica Neue", sans-serif',
        default: 'system-ui, -apple-system, sans-serif',
    }),
    semibold: react_native_1.Platform.select({
        ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
        android: 'Roboto, "Helvetica Neue", sans-serif',
        default: 'system-ui, -apple-system, sans-serif',
    }),
    bold: react_native_1.Platform.select({
        ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
        android: 'Roboto, "Helvetica Neue", sans-serif',
        default: 'system-ui, -apple-system, sans-serif',
    }),
    black: react_native_1.Platform.select({
        ios: '-apple-system, BlinkMacSystemFont, "Segoe UI"',
        android: 'Roboto, "Helvetica Neue", sans-serif',
        default: 'system-ui, -apple-system, sans-serif',
    }),
};
// Typography scale - massive typography with tight tracking
exports.typography = {
    // Display - massive typography for impact
    display: {
        xxl: {
            fontSize: 64,
            lineHeight: 72,
            fontWeight: '900',
            letterSpacing: -1.5, // Tight tracking
            fontFamily: fontFamily.black,
        },
        xl: {
            fontSize: 48,
            lineHeight: 56,
            fontWeight: '900',
            letterSpacing: -1,
            fontFamily: fontFamily.black,
        },
        lg: {
            fontSize: 40,
            lineHeight: 48,
            fontWeight: '800',
            letterSpacing: -0.75,
            fontFamily: fontFamily.black,
        },
    },
    // Headings - bold and impactful
    heading: {
        h1: {
            fontSize: 36,
            lineHeight: 44,
            fontWeight: '800',
            letterSpacing: -0.5,
            fontFamily: fontFamily.black,
        },
        h2: {
            fontSize: 28,
            lineHeight: 36,
            fontWeight: '800',
            letterSpacing: -0.25,
            fontFamily: fontFamily.black,
        },
        h3: {
            fontSize: 24,
            lineHeight: 32,
            fontWeight: '700',
            letterSpacing: 0,
            fontFamily: fontFamily.bold,
        },
        h4: {
            fontSize: 20,
            lineHeight: 28,
            fontWeight: '700',
            letterSpacing: 0,
            fontFamily: fontFamily.bold,
        },
    },
    // Body text - relaxed line height for readability
    body: {
        xl: {
            fontSize: 18,
            lineHeight: 28, // Relaxed line height
            fontWeight: '400',
            letterSpacing: 0,
            fontFamily: fontFamily.regular,
        },
        lg: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
            letterSpacing: 0,
            fontFamily: fontFamily.regular,
        },
        md: {
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400',
            letterSpacing: 0,
            fontFamily: fontFamily.regular,
        },
        sm: {
            fontSize: 12,
            lineHeight: 16,
            fontWeight: '400',
            letterSpacing: 0,
            fontFamily: fontFamily.regular,
        },
    },
    // Labels and captions
    label: {
        lg: {
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '600',
            letterSpacing: 0.25,
            fontFamily: fontFamily.semibold,
        },
        md: {
            fontSize: 12,
            lineHeight: 16,
            fontWeight: '600',
            letterSpacing: 0.25,
            fontFamily: fontFamily.semibold,
        },
        sm: {
            fontSize: 10,
            lineHeight: 14,
            fontWeight: '600',
            letterSpacing: 0.5,
            fontFamily: fontFamily.semibold,
        },
    },
    // Utility styles
    utility: {
        mono: {
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400',
            fontFamily: react_native_1.Platform.select({
                ios: 'Menlo, Monaco, "Courier New", monospace',
                android: 'monospace',
                default: 'monospace',
            }),
        },
        uppercase: {
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
    },
};
// Helper function to create text style objects with proper typing
var createTextStyle = function (variant, type) {
    if (type === void 0) { type = 'body'; }
    return exports.typography[type][variant];
};
exports.createTextStyle = createTextStyle;

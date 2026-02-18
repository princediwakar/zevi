"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = exports.swiss = void 0;
__exportStar(require("./colors"), exports);
__exportStar(require("./typography"), exports);
__exportStar(require("./spacing"), exports);
var colors_1 = require("./colors");
var typography_1 = require("./typography");
var spacing_1 = require("./spacing");
/**
 * Swiss Design Constants
 * Centralized values to ensure consistency across all screens
 */
exports.swiss = {
    // Layout constants
    layout: {
        headerHeight: 100, // Includes safe area + header bar
        headerPaddingTop: 50, // Safe area for notch
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
        black: '900',
        bold: '800',
        semibold: '700',
        medium: '600',
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
};
/**
 * Complete theme object
 */
exports.theme = {
    colors: colors_1.colors,
    typography: typography_1.typography,
    spacing: spacing_1.spacing,
    swiss: exports.swiss,
};
/**
 * Default theme instance
 */
exports.default = exports.theme;

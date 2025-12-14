/**
 * SAHNE - Typography System
 * Elegant, readable font configuration
 */

import { Platform } from 'react-native';

export const FontFamily = {
  // Headings - Elegant serif (for premium feel)
  heading: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia',
  }),

  // Body - Modern, clean sans-serif
  body: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Numbers/Prices - Monospace for alignment
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

export const FontSize = {
  // Display
  displayLarge: 48,
  displayMedium: 40,
  displaySmall: 32,

  // Headings
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,

  // Body
  bodyLarge: 18,
  bodyMedium: 16,
  bodySmall: 14,

  // Utility
  caption: 12,
  button: 16,
  label: 14,
} as const;

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

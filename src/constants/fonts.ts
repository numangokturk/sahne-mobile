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
  // Display (15% smaller)
  displayLarge: 41,
  displayMedium: 34,
  displaySmall: 27,

  // Headings (15% smaller)
  h1: 24,
  h2: 20,
  h3: 17,
  h4: 15,
  h5: 14,
  h6: 12,

  // Body (15% smaller)
  bodyLarge: 15,
  bodyMedium: 14,
  bodySmall: 12,

  // Utility (15% smaller)
  caption: 10,
  button: 14,
  label: 12,
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

export const LetterSpacing = {
  tight: 0,
  normal: 0.3,
  wide: 0.5,
  wider: 0.8,
} as const;

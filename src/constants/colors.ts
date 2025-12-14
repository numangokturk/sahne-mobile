/**
 * SAHNE - Luxury Color Palette
 * Premium, sophisticated color system
 */

export const Colors = {
  // Primary - Gold/Champagne (Luxury feel)
  primary: '#C9A050',
  primaryLight: '#E5D4A1',
  primaryDark: '#8B7635',

  // Secondary - Dark Navy (Elegance)
  secondary: '#1A1A2E',
  secondaryLight: '#2D2D44',

  // Background
  background: '#FAFAFA',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  // Status Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Neutrals
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  disabled: '#D1D5DB',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Special
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

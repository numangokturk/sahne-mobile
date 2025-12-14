/**
 * SAHNE - App Configuration
 */

export const Config = {
  // API Configuration
  // NOTE: ngrok URL changes on every restart - update this when needed
  API_BASE_URL: 'https://pyrheliometric-unsarcastical-harriette.ngrok-free.dev/api',
  API_TIMEOUT: 30000, // 30 seconds

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: '@sahne:auth_token',
    USER_DATA: '@sahne:user_data',
    ONBOARDING_COMPLETED: '@sahne:onboarding_completed',
  },

  // Animation Durations (ms)
  ANIMATION: {
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // App Info
  APP_NAME: 'SAHNE',
  APP_VERSION: '1.0.0',
} as const;

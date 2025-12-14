# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo and Expo Router. The project uses TypeScript with strict mode enabled and supports iOS, Android, and web platforms.

## Key Technologies

- **Expo SDK 54** - React Native framework with managed workflow
- **Expo Router v6** - File-based routing with typed routes
- **React 19** & React Native 0.81.5
- **TypeScript 5.9** with strict mode
- **React Navigation** - Tab and stack navigation
- **Reanimated 4.1** - High-performance animations
- **Expo Symbols** - SF Symbols for iOS, custom icons for other platforms

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Launch on Android emulator/device
npm run ios        # Launch on iOS simulator/device
npm run web        # Launch in web browser

# Code quality
npm run lint       # Run ESLint

# Reset project to blank state
npm run reset-project  # Moves starter code to app-example/
```

## Architecture

### File-Based Routing

The app uses Expo Router with file-based routing in the `app/` directory:

- **app/_layout.tsx** - Root layout with theme provider and navigation stack
- **app/(tabs)/** - Tab-based navigation group
  - **_layout.tsx** - Tab navigator configuration
  - **index.tsx** - Home tab screen
  - **explore.tsx** - Explore tab screen
- **app/modal.tsx** - Modal screen example

The root layout sets `unstable_settings.anchor = '(tabs)'` to make tabs the initial route.

### Theme System

The project implements a custom theming system supporting light/dark modes:

- **constants/theme.ts** - Centralized color and font definitions
  - `Colors.light` and `Colors.dark` objects define color palettes
  - `Fonts` object provides platform-specific font families
- **hooks/use-color-scheme.ts** - Detects system color scheme (platform-specific files for web)
- **hooks/use-theme-color.ts** - Hook to resolve theme colors with override support
- **components/themed-*.tsx** - Components that automatically adapt to theme

When creating new components, use `useThemeColor()` or themed components to maintain consistent theming.

### Components Organization

- **components/** - Reusable UI components
  - **ui/** - Low-level UI primitives (icon-symbol, collapsible)
  - **themed-*.tsx** - Theme-aware wrappers (ThemedView, ThemedText)
  - **haptic-tab.tsx** - Tab bar with haptic feedback
  - **parallax-scroll-view.tsx** - Animated scrolling header

Platform-specific implementations use `.ios.tsx` and `.web.tsx` extensions (e.g., `icon-symbol.ios.tsx`).

### Path Aliases

The project uses `@/` as an alias for the root directory (configured in tsconfig.json):

```typescript
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
```

### Experimental Features

Enabled in app.json:
- **typedRoutes** - TypeScript type safety for navigation
- **reactCompiler** - React Compiler for optimization
- **newArchEnabled** - React Native new architecture

## Configuration Files

- **app.json** - Expo app configuration (name, icons, plugins, experiments)
- **tsconfig.json** - TypeScript config extending `expo/tsconfig.base` with strict mode
- **eslint.config.js** - ESLint flat config using `eslint-config-expo`
- **package.json** - Dependencies and npm scripts

## Platform-Specific Notes

- **iOS**: Supports tablets, uses SF Symbols via expo-symbols
- **Android**: Edge-to-edge display enabled, predictive back gesture disabled, adaptive icons configured
- **Web**: Static output mode for deployment

## Testing

The project does not currently have a test setup configured. When adding tests, install Jest and React Native Testing Library.

---

## SAHNE Project Specific

This is a **luxury private chef reservation platform** for the Turkish market (UI in English).

### Key Project Documents
- **SAHNE-PROJECT.md** - Complete project requirements, design system, and phase breakdown
- **sahne-endpoints.json** - Backend API documentation (OpenAPI 3.1.0)

### Backend Integration
- Base URL: `https://sahne.test/api`
- Auth: Laravel Sanctum (Bearer Token)
- All endpoints documented in `sahne-endpoints.json`

### Development Approach
- **Phase-based development** (7 phases total)
- Each phase: implement → test → commit → report
- Git commit format: "Phase X: Description"
- Provide completion report after each phase

### Design System
- **Color Palette:** Gold/champagne primary (#C9A050), dark navy secondary (#1A1A2E)
- **Typography:** Playfair Display for headings, Inter/SF Pro for body
- **Style:** Premium, sophisticated, minimalist with generous whitespace
- See SAHNE-PROJECT.md for complete design specifications

### User Roles
- **Client:** Browse chefs, make reservations, write reviews
- **Chef:** Manage reservations, respond to reviews
- **Applicant:** Pending approval to become chef

### Current Phase
**Phase 1: Project Setup & Auth**
- Clean template with `npm run reset-project`
- Setup folder structure (src/, components/, services/, context/)
- Implement theme constants with luxury palette
- Configure Axios with interceptors
- Build AuthContext for token management
- Create Login, Register, and Splash screens

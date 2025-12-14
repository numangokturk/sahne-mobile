/**
 * SAHNE - Theme Context
 * Manages light/dark mode theming
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#1A1A2E',
  accent: '#C9A050',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

const darkColors: ThemeColors = {
  background: '#0D0D14',
  surface: '#1A1A2E',
  primary: '#FFFFFF',
  accent: '#C9A050',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#2D2D44',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@sahne:theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('light');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Set theme and save preference
  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Determine if dark mode is active
  const isDark = theme === 'dark' || (theme === 'auto' && systemColorScheme === 'dark');

  // Get current colors based on theme
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

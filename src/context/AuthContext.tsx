/**
 * SAHNE - Auth Context
 * Manages authentication state and operations
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { authService } from '@/src/services';
import { User, LoginRequest, RegisterRequest } from '@/src/types';
import { Config } from '@/src/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check for existing auth token on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to appropriate home screen if authenticated
      if (user.role === 'chef') {
        router.replace('/(chef)');
      } else {
        router.replace('/(client)');
      }
    }
  }, [user, segments, isLoading]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(Config.STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        setUser(JSON.parse(userData));
        // Optionally refresh user data from server
        // await refreshUser();
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('📡 Calling auth API...');
      const response = await authService.login(credentials);
      console.log('📦 Auth response received:', {
        hasToken: !!response.access_token,
        hasUser: !!response.user,
        userRole: response.user?.role,
      });

      // Save token and user data
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.AUTH_TOKEN,
        response.access_token
      );
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );

      console.log('💾 Token and user saved to storage');
      setUser(response.user);
      console.log('👤 User state updated');
    } catch (error) {
      console.error('🚨 Auth error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      // Save token and user data
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.AUTH_TOKEN,
        response.access_token
      );
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );

      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem(Config.STORAGE_KEYS.AUTH_TOKEN);
      // Only call API if we have a token
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Ignore API errors during logout
    } finally {
      // Always clear local data
      await AsyncStorage.removeItem(Config.STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER_DATA);
      setUser(null);
      console.log('🚪 Logged out, local storage cleared');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      setUser(userData);
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, logout
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

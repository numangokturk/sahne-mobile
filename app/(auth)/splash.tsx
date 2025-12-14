/**
 * SAHNE - Splash Screen
 * Initial loading screen with logo animation
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/src/context';
import { Logo } from '@/src/components/ui';
import { Colors, Spacing, Config } from '@/src/constants';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem(
          Config.STORAGE_KEYS.ONBOARDING_COMPLETED
        );
        setOnboardingCompleted(completed === 'true');
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setOnboardingChecked(true);
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && onboardingChecked) {
      // Navigate after animation completes
      setTimeout(() => {
        if (isAuthenticated && user) {
          // Navigate based on user role
          if (user.role === 'chef') {
            router.replace('/(chef)');
          } else {
            router.replace('/(client)');
          }
        } else if (!onboardingCompleted) {
          // Show onboarding for first-time users
          router.replace('/(auth)/onboarding');
        } else {
          router.replace('/(auth)/login');
        }
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, user, onboardingChecked, onboardingCompleted]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Logo size="large" showText />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
});

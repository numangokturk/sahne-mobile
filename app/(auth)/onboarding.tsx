/**
 * SAHNE - Onboarding Screen
 * 3 slides introducing the app
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, BorderRadius, Config } from '@/src/constants';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    icon: '👨‍🍳',
    title: 'Michelin Experience at Home',
    description: 'Bring the finest culinary expertise to your home with our exclusive private chef service',
  },
  {
    id: 2,
    icon: '🎉',
    title: 'For Every Special Moment',
    description: 'From intimate dinners to grand celebrations, make every occasion unforgettable',
  },
  {
    id: 3,
    icon: '✨',
    title: 'Choose, Reserve, Enjoy',
    description: 'Browse expert chefs, book your experience, and savor luxury dining at your doorstep',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(Config.STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  icon: {
    fontSize: 120,
    marginBottom: Spacing.xxl,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.bodyLarge * 1.5,
  },
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.xs,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

/**
 * SAHNE - Loading Skeleton Component
 * Animated placeholder while content loads
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/src/constants';

export const LoadingSkeleton: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.line, styles.title, { opacity }]} />
        <Animated.View style={[styles.line, styles.subtitle, { opacity }]} />
        <View style={styles.tags}>
          <Animated.View style={[styles.tag, { opacity }]} />
          <Animated.View style={[styles.tag, { opacity }]} />
          <Animated.View style={[styles.tag, { opacity }]} />
        </View>
        <Animated.View style={[styles.line, styles.footer, { opacity }]} />
      </View>
    </View>
  );
};

export const ChefListSkeleton: React.FC = () => {
  return (
    <View>
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.borderLight,
  },
  content: {
    padding: Spacing.md,
  },
  line: {
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    height: 24,
    width: '60%',
  },
  subtitle: {
    height: 16,
    width: '40%',
  },
  tags: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    width: 80,
    height: 24,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
  },
  footer: {
    height: 20,
    width: '50%',
  },
});

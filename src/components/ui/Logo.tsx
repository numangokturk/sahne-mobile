/**
 * SAHNE - Logo Component
 * App logo with text
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, FontWeight } from '@/src/constants';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
}) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const fontSize = sizeMap[size];

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontSize }]}>SAHNE</Text>
      {showText && (
        <Text style={styles.tagline}>Luxury Private Chef Experience</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
});

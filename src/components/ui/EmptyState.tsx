/**
 * SAHNE - Empty State Component
 * Displays when no content is available
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, LetterSpacing } from '@/src/constants';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode | string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
}) => {
  // Render icon - handle string emoji vs ReactNode
  const renderIcon = () => {
    if (!icon) {
      return <Search size={64} color={Colors.textLight} strokeWidth={1.5} />;
    }
    if (typeof icon === 'string') {
      return <Text style={styles.emojiIcon}>{icon}</Text>;
    }
    return icon;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  emojiIcon: {
    fontSize: 64,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: LetterSpacing.normal,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.bodyMedium * 1.5,
  },
});
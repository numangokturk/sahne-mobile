/**
 * SAHNE - Chef Home Screen (Placeholder)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/src/context';
import { Button } from '@/src/components/ui';
import { Colors, FontFamily, FontSize, Spacing } from '@/src/constants';

export default function ChefHomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Chef {user?.name}!</Text>
      <Text style={styles.subtitle}>Chef Dashboard</Text>
      <Text style={styles.info}>Phase 6 will implement the full chef dashboard</Text>

      <Button
        title="Logout"
        onPress={logout}
        variant="outline"
        style={styles.button}
      />
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
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  info: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  button: {
    marginTop: Spacing.xl,
  },
});

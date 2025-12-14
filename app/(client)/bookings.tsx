/**
 * SAHNE - Bookings Screen (Placeholder)
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { EmptyState } from '@/src/components/ui';
import { Colors, Spacing } from '@/src/constants';

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="📅"
        title="My Bookings"
        description="Your reservations will appear here. Phase 5 will implement the full booking management."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
});

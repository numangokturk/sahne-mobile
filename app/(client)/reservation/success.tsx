/**
 * SAHNE - Reservation Success Screen
 * Final step - confirmation message and next steps
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Calendar, Home } from 'lucide-react-native';
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '@/src/constants';

export default function SuccessScreen() {
  const params = useLocalSearchParams<{
    reservationId: string;
    chefName: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleViewBookings = () => {
    // Navigate to bookings tab - use push to reset the navigation
    router.push('/(client)/bookings');
  };

  const handleBackHome = () => {
    // Navigate to home - use push to reset the navigation
    router.push('/(client)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Colors.primary} strokeWidth={2} />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Reservation Sent!</Text>
        <Text style={styles.subtitle}>
          Your reservation request has been successfully sent to {params.chefName}.
        </Text>

        {/* Reservation ID */}
        <View style={styles.idCard}>
          <Text style={styles.idLabel}>Reservation Reference</Text>
          <Text style={styles.idValue}>#{params.reservationId}</Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>
              The chef will review your request within 24 hours
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>
              You will receive a confirmation email once the chef responds
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoBullet} />
            <Text style={styles.infoText}>
              You can track your reservation status in the Bookings tab
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewBookings}
          >
            <Calendar size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>View My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackHome}
          >
            <Home size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.footerText}>
          Thank you for choosing SAHNE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.bodyMedium * 1.5,
    marginBottom: Spacing.xl,
    paddingHorizontal: 20,
  },
  idCard: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  idLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  idValue: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  infoBox: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.primaryDark,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  infoBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
    marginTop: 6,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.primaryDark,
    lineHeight: FontSize.bodySmall * 1.5,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 50,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textLight,
  },
});

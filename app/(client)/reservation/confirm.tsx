/**
 * SAHNE - Reservation Confirmation Screen
 * Third step in reservation flow - review and confirm
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckSquare,
} from 'lucide-react-native';
import { reservationsService } from '@/src/services';
import { getChefPhoto } from '@/src/utils/chefPhotos';
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '@/src/constants';
import { ReservationFormData, CreateReservationRequest } from '@/src/types';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<Partial<ReservationFormData> & Record<string, string>>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Parse dietary restrictions if it's a string
  const dietaryRestrictions = params.dietaryRestrictions
    ? typeof params.dietaryRestrictions === 'string'
      ? JSON.parse(params.dietaryRestrictions)
      : params.dietaryRestrictions
    : [];

  // Calculate total price
  const packagePrice = Number(params.packagePrice || 0);
  const guestCount = Number(params.guestCount || 2);
  const totalPrice = packagePrice * guestCount;

  const handleConfirm = async () => {
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare reservation data
      const reservationData: CreateReservationRequest = {
        chef_profile_id: Number(params.chefId),
        experience_package_id: Number(params.packageId),
        date: `${params.date}T${params.time}:00`, // Combine date and time
        time: params.time || '',
        guest_count: guestCount,
        address: params.address || '',
        address_type: params.addressType || 'home',
        special_occasion: params.eventType,
        dietary_notes: dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : undefined,
        allergies: params.specialRequests || undefined,
      };

      // Create reservation
      const response = await reservationsService.createReservation(reservationData);

      // Navigate to success screen with reservation ID
      router.replace({
        pathname: '/(client)/reservation/success',
        params: {
          reservationId: response.data.id.toString(),
          chefName: params.chefName,
        },
      });
    } catch (error: any) {
      console.error('Reservation error:', error);
      alert(error.message || 'Failed to create reservation. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Reservation</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Chef Info */}
        <View style={styles.chefCard}>
          <Image
            source={getChefPhoto(Number(params.chefId))}
            style={styles.chefPhoto}
          />
          <View style={styles.chefInfo}>
            <Text style={styles.chefName}>{params.chefName}</Text>
            <Text style={styles.packageName}>{params.packageName}</Text>
          </View>
        </View>

        {/* Reservation Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>

          <View style={styles.detailRow}>
            <Calendar size={20} color={Colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(params.date!).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Clock size={20} color={Colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{params.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Users size={20} color={Colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>
                {params.guestCount} {Number(params.guestCount) === 1 ? 'guest' : 'guests'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={20} color={Colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address ({params.addressType})</Text>
              <Text style={styles.detailValue}>{params.address}</Text>
            </View>
          </View>
        </View>

        {/* Event Type */}
        {params.eventType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Type</Text>
            <Text style={styles.infoText}>{params.eventType}</Text>
          </View>
        )}

        {/* Dietary Restrictions */}
        {dietaryRestrictions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
            <View style={styles.tagsContainer}>
              {dietaryRestrictions.map((item: string) => (
                <View key={item} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Special Requests */}
        {params.specialRequests && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Requests</Text>
            <Text style={styles.infoText}>{params.specialRequests}</Text>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {params.packageName} × {params.guestCount}
            </Text>
            <Text style={styles.priceValue}>₺{totalPrice.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>₺{totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
          activeOpacity={0.7}
        >
          <CheckSquare
            size={24}
            color={acceptTerms ? Colors.primary : Colors.border}
            fill={acceptTerms ? Colors.primary : 'transparent'}
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Cancellation Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Important</Text>
          <Text style={styles.noteText}>
            Your reservation request will be sent to the chef. The chef will confirm or decline within 24 hours. You will be notified via email and push notification.
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!acceptTerms || isLoading) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!acceptTerms || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  chefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginHorizontal: 20,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  chefPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chefInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  chefName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  packageName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h5,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  detailContent: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  detailLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  infoText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textPrimary,
    lineHeight: FontSize.bodyMedium * 1.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  tagText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },
  priceSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginHorizontal: 20,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  termsText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSize.bodySmall * 1.5,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  noteCard: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    marginHorizontal: 20,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  noteTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  noteText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.primaryDark,
    lineHeight: FontSize.bodySmall * 1.5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  confirmButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

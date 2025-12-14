/**
 * SAHNE - Guest Details Screen
 * Second step in reservation flow
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Minus, Plus, MapPin } from 'lucide-react-native';
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '@/src/constants';
import { ReservationFormData, AddressType } from '@/src/types';

const EVENT_TYPES = [
  'Birthday',
  'Anniversary',
  'Business Dinner',
  'Family Gathering',
  'Romantic Dinner',
  'Other',
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Halal',
  'Kosher',
  'Dairy-free',
  'Nut-free',
];

const ADDRESS_TYPES: { value: AddressType; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'villa', label: 'Villa' },
  { value: 'other', label: 'Other' },
];

export default function GuestDetailsScreen() {
  const params = useLocalSearchParams<Partial<ReservationFormData> & Record<string, string>>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [guestCount, setGuestCount] = useState(2);
  const [eventType, setEventType] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('home');

  const handleDietaryToggle = (option: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleContinue = () => {
    if (!eventType) {
      alert('Please select an event type');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your address');
      return;
    }

    const reservationData: Partial<ReservationFormData> = {
      ...params,
      chefId: Number(params.chefId),
      packageId: Number(params.packageId),
      packagePrice: Number(params.packagePrice),
      guestCount,
      eventType,
      specialRequests: specialRequests.trim() || undefined,
      dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
      address: address.trim(),
      addressType,
    };

    router.push({
      pathname: '/(client)/reservation/confirm',
      params: {
        ...reservationData,
        dietaryRestrictions: JSON.stringify(dietaryRestrictions),
      } as any,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guest Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Number of Guests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Number of Guests</Text>
          </View>
          <View style={styles.guestCounter}>
            <TouchableOpacity
              style={[styles.counterButton, guestCount <= 2 && styles.counterButtonDisabled]}
              onPress={() => setGuestCount(Math.max(2, guestCount - 1))}
              disabled={guestCount <= 2}
            >
              <Minus size={20} color={guestCount <= 2 ? Colors.disabled : Colors.primary} />
            </TouchableOpacity>
            <View style={styles.counterValue}>
              <Text style={styles.counterText}>{guestCount}</Text>
              <Text style={styles.counterLabel}>guests</Text>
            </View>
            <TouchableOpacity
              style={[styles.counterButton, guestCount >= 12 && styles.counterButtonDisabled]}
              onPress={() => setGuestCount(Math.min(12, guestCount + 1))}
              disabled={guestCount >= 12}
            >
              <Plus size={20} color={guestCount >= 12 ? Colors.disabled : Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Minimum 2, maximum 12 guests</Text>
        </View>

        {/* Event Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Type</Text>
          <View style={styles.eventTypes}>
            {EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.eventTypeChip,
                  eventType === type && styles.eventTypeChipActive,
                ]}
                onPress={() => setEventType(type)}
              >
                <Text
                  style={[
                    styles.eventTypeText,
                    eventType === type && styles.eventTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>

          {/* Address Type */}
          <View style={styles.addressTypes}>
            {ADDRESS_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.addressTypeChip,
                  addressType === type.value && styles.addressTypeChipActive,
                ]}
                onPress={() => setAddressType(type.value)}
              >
                <Text
                  style={[
                    styles.addressTypeText,
                    addressType === type.value && styles.addressTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.addressInput}
            placeholder="Enter full address"
            placeholderTextColor={Colors.textLight}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          <Text style={styles.helperText}>Select all that apply (optional)</Text>
          <View style={styles.dietaryOptions}>
            {DIETARY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dietaryChip,
                  dietaryRestrictions.includes(option) && styles.dietaryChipActive,
                ]}
                onPress={() => handleDietaryToggle(option)}
              >
                <Text
                  style={[
                    styles.dietaryText,
                    dietaryRestrictions.includes(option) && styles.dietaryTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Special Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requests</Text>
          <Text style={styles.helperText}>
            Let the chef know about any allergies, preferences, or special requests
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter any special requests or allergies..."
            placeholderTextColor={Colors.textLight}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {specialRequests.length}/500
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!eventType || !address.trim()) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!eventType || !address.trim()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  section: {
    paddingHorizontal: 20,
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h5,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  helperText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  counterValue: {
    alignItems: 'center',
    minWidth: 100,
  },
  counterText: {
    fontFamily: FontFamily.heading,
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  counterLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  eventTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  eventTypeChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventTypeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  eventTypeText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  eventTypeTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
  addressTypes: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  addressTypeChip: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  addressTypeChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  addressTypeText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  addressTypeTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  addressInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dietaryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  dietaryChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dietaryChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  dietaryText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  dietaryTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: Spacing.sm,
  },
  characterCount: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.caption,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  continueButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

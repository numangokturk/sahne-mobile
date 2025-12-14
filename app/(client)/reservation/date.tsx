/**
 * SAHNE - Date & Time Selection Screen
 * First step in reservation flow
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react-native';
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '@/src/constants';
import { ReservationFormData } from '@/src/types';

const TIME_SLOTS = {
  lunch: [
    { label: '12:00', value: '12:00' },
    { label: '12:30', value: '12:30' },
    { label: '13:00', value: '13:00' },
    { label: '13:30', value: '13:30' },
    { label: '14:00', value: '14:00' },
  ],
  dinner: [
    { label: '18:00', value: '18:00' },
    { label: '18:30', value: '18:30' },
    { label: '19:00', value: '19:00' },
    { label: '19:30', value: '19:30' },
    { label: '20:00', value: '20:00' },
    { label: '20:30', value: '20:30' },
    { label: '21:00', value: '21:00' },
    { label: '21:30', value: '21:30' },
    { label: '22:00', value: '22:00' },
  ],
};

export default function DateSelectionScreen() {
  const params = useLocalSearchParams<{
    chefId: string;
    chefName: string;
    chefPhoto?: string;
    packageId: string;
    packageName: string;
    packagePrice: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mealPeriod, setMealPeriod] = useState<'lunch' | 'dinner'>('dinner');

  // Calculate minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  // Calculate maximum date (3 months ahead)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleContinue = () => {
    if (!selectedTime) {
      alert('Please select a time');
      return;
    }

    const reservationData: Partial<ReservationFormData> = {
      chefId: Number(params.chefId),
      chefName: params.chefName,
      chefPhoto: params.chefPhoto,
      packageId: Number(params.packageId),
      packageName: params.packageName,
      packagePrice: Number(params.packagePrice),
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
    };

    router.push({
      pathname: '/(client)/reservation/details',
      params: reservationData as any,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Chef & Package Info */}
        <View style={styles.infoCard}>
          <Text style={styles.chefName}>{params.chefName}</Text>
          <Text style={styles.packageName}>{params.packageName}</Text>
          <Text style={styles.packagePrice}>₺{Number(params.packagePrice).toLocaleString()} per person</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CalendarIcon size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>

          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
              minimumDate={minDate}
              maximumDate={maxDate}
              style={styles.datePicker}
            />
          )}
        </View>

        {/* Meal Period Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Select Meal Period</Text>
          </View>

          <View style={styles.periodButtons}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                mealPeriod === 'lunch' && styles.periodButtonActive,
              ]}
              onPress={() => {
                setMealPeriod('lunch');
                setSelectedTime(null);
              }}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  mealPeriod === 'lunch' && styles.periodButtonTextActive,
                ]}
              >
                Lunch (12:00 - 14:00)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                mealPeriod === 'dinner' && styles.periodButtonActive,
              ]}
              onPress={() => {
                setMealPeriod('dinner');
                setSelectedTime(null);
              }}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  mealPeriod === 'dinner' && styles.periodButtonTextActive,
                ]}
              >
                Dinner (18:00 - 22:00)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeSlots}>
            {TIME_SLOTS[mealPeriod].map((slot) => (
              <TouchableOpacity
                key={slot.value}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.value && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTime(slot.value)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === slot.value && styles.timeSlotTextActive,
                  ]}
                >
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedTime && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedTime}
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
  infoCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginHorizontal: 20,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  chefName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  packageName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  packagePrice: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
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
  },
  dateButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  datePicker: {
    backgroundColor: Colors.surface,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  periodButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  periodButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  periodButtonTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  timeSlotTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
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

/**
 * SAHNE - Reservation Detail Screen
 * Detailed view of a single reservation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Star,
  X,
} from 'lucide-react-native';
import { reservationsService } from '@/src/services';
import { Reservation } from '@/src/types';
import { Button } from '@/src/components/ui';
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
  LetterSpacing,
} from '@/src/constants';
import ReviewModal from '@/src/components/ReviewModal';

export default function ReservationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reservationId = Number(params.id);

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  useEffect(() => {
    fetchReservationDetail();
  }, []);

  const fetchReservationDetail = async () => {
    try {
      setLoading(true);
      const data = await reservationsService.getReservationById(reservationId);
      setReservation(data);
    } catch (error) {
      console.error('Error fetching reservation:', error);
      Alert.alert('Error', 'Failed to load reservation details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: confirmCancel,
        },
      ]
    );
  };

  const confirmCancel = async () => {
    try {
      setCancelling(true);
      await reservationsService.cancelReservation(reservationId);
      Alert.alert('Success', 'Reservation cancelled successfully');
      await fetchReservationDetail(); // Refresh data
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to cancel reservation');
    } finally {
      setCancelling(false);
    }
  };

  const handleChefPress = () => {
    if (reservation?.chef_id) {
      router.push(`/(client)/chef/${reservation.chef_id}`);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: Colors.warning,
      confirmed: Colors.success,
      completed: Colors.info,
      cancelled: Colors.textLight,
      rejected: Colors.error,
    };
    return colors[status as keyof typeof colors] || Colors.textSecondary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!reservation) {
    return null;
  }

  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';
  const canReview = reservation.status === 'completed';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(reservation.status)}15` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(reservation.status) },
              ]}
            >
              {reservation.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Chef Card */}
        <TouchableOpacity style={styles.chefCard} onPress={handleChefPress}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            style={styles.chefPhoto}
          />
          <View style={styles.chefInfo}>
            <Text style={styles.chefName}>
              {reservation.chef?.name || 'Chef'}
            </Text>
            <Text style={styles.packageName}>
              {reservation.package?.display_name || reservation.package?.name || 'Experience Package'}
            </Text>
            <Text style={styles.tapToView}>Tap to view chef profile</Text>
          </View>
        </TouchableOpacity>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Calendar size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(reservation.date)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Clock size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time & Duration</Text>
                <Text style={styles.detailValue}>
                  {reservation.time} •{' '}
                  {reservation.package?.duration_hours || 3} hours
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Users size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Guests</Text>
                <Text style={styles.detailValue}>{reservation.guest_count} people</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{reservation.address}</Text>
              </View>
            </View>

            {reservation.special_requests && (
              <View style={styles.detailRow}>
                <FileText size={20} color={Colors.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Special Requests</Text>
                  <Text style={styles.detailValue}>{reservation.special_requests}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            <TimelineItem
              label="Booking Created"
              date={reservation.created_at}
              isActive={true}
            />
            <TimelineItem
              label="Confirmed"
              date={reservation.status === 'confirmed' ? reservation.updated_at : undefined}
              isActive={reservation.status === 'confirmed' || reservation.status === 'completed'}
            />
            <TimelineItem
              label="Completed"
              date={reservation.status === 'completed' ? reservation.updated_at : undefined}
              isActive={reservation.status === 'completed'}
              isLast={true}
            />
          </View>
        </View>

        {/* Rejection Reason */}
        {reservation.status === 'rejected' && reservation.rejection_reason && (
          <View style={styles.section}>
            <View style={styles.rejectionCard}>
              <X size={24} color={Colors.error} />
              <View style={styles.rejectionContent}>
                <Text style={styles.rejectionTitle}>Rejection Reason</Text>
                <Text style={styles.rejectionText}>{reservation.rejection_reason}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Package Price</Text>
              <Text style={styles.priceValue}>₺{reservation.package?.price || 0}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Guests</Text>
              <Text style={styles.priceValue}>x{reservation.guest_count}</Text>
            </View>
            <View style={[styles.priceRow, styles.priceTotalRow]}>
              <Text style={styles.priceTotalLabel}>Total</Text>
              <Text style={styles.priceTotalValue}>₺{reservation.total_price}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {canReview && (
          <Button
            title="Write a Review"
            onPress={() => setReviewModalVisible(true)}
            icon={<Star size={20} color={Colors.white} />}
          />
        )}
        {canCancel && (
          <Button
            title={cancelling ? 'Cancelling...' : 'Cancel Reservation'}
            onPress={handleCancel}
            variant="outline"
            disabled={cancelling}
          />
        )}
      </View>

      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        reservationId={reservationId}
        chefName={reservation.chef?.name || 'Chef'}
        onClose={() => setReviewModalVisible(false)}
        onSuccess={() => {
          setReviewModalVisible(false);
          Alert.alert('Success', 'Thank you for your review!');
        }}
      />
    </SafeAreaView>
  );
}

// Timeline Item Component
const TimelineItem: React.FC<{
  label: string;
  date?: string;
  isActive: boolean;
  isLast?: boolean;
}> = ({ label, date, isActive, isLast }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIndicator}>
        <View
          style={[
            styles.timelineDot,
            isActive && styles.timelineDotActive,
          ]}
        />
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              isActive && styles.timelineLineActive,
            ]}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineLabel, isActive && styles.timelineLabelActive]}>
          {label}
        </Text>
        {date && <Text style={styles.timelineDate}>{formatDate(date)}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.wide,
  },
  chefCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
    marginBottom: Spacing.lg,
  },
  chefPhoto: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border,
  },
  chefInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  chefName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
    marginBottom: 4,
  },
  packageName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
    marginBottom: 4,
  },
  tapToView: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.primary,
    letterSpacing: LetterSpacing.normal,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h5,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  timeline: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.xs,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  timelineLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
    marginBottom: 2,
  },
  timelineLabelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  timelineDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textLight,
    letterSpacing: LetterSpacing.normal,
  },
  rejectionCard: {
    flexDirection: 'row',
    backgroundColor: `${Colors.error}10`,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: `${Colors.error}30`,
    gap: Spacing.md,
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
    letterSpacing: LetterSpacing.normal,
    marginBottom: 4,
  },
  rejectionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  priceCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  priceValue: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  priceTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  priceTotalLabel: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h5,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  priceTotalValue: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    letterSpacing: LetterSpacing.normal,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.lg,
  },
});

/**
 * SAHNE - Bookings Screen
 * Client's reservation management
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';
import { reservationsService } from '@/src/services';
import { Reservation } from '@/src/types';
import { EmptyState } from '@/src/components/ui';
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

type TabType = 'upcoming' | 'past';

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch reservations on initial mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Refresh reservations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('📅 Fetching reservations...');
      const data = await reservationsService.getMyReservations();
      console.log('✅ Reservations fetched:', data?.length || 0);
      setReservations(data || []);
    } catch (error) {
      console.error('❌ Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  }, []);

  const getFilteredReservations = () => {
    if (!reservations || reservations.length === 0) {
      console.log('⚠️ No reservations to filter');
      return [];
    }

    const now = new Date();
    console.log(`🔍 Filtering ${reservations.length} reservations for ${activeTab} tab`);

    // Log all reservations with their status and dates
    reservations.forEach((r, index) => {
      const reservationDateTime = `${r.date}T${r.time || '00:00'}:00`;
      console.log(`  [${index}] ID:${r.id} Status:${r.status} Date:${r.date} Time:${r.time} DateTime:${reservationDateTime}`);
    });

    if (activeTab === 'upcoming') {
      const filtered = reservations.filter((r) => {
        // Combine date and time for comparison
        const reservationDateTime = new Date(`${r.date}T${r.time || '00:00'}:00`);
        const isUpcoming = reservationDateTime >= now;
        const isActiveStatus = r.status === 'pending' || r.status === 'confirmed' || r.status === 'chef_confirmed';

        return isActiveStatus && isUpcoming;
      });
      console.log(`✅ Upcoming filtered: ${filtered.length} reservations`);
      return filtered;
    } else {
      const filtered = reservations.filter((r) => {
        const reservationDateTime = new Date(`${r.date}T${r.time || '00:00'}:00`);
        const isPast = reservationDateTime < now;

        return (
          r.status === 'completed' ||
          r.status === 'cancelled' ||
          r.status === 'rejected' ||
          (r.status === 'confirmed' && isPast) ||
          (r.status === 'chef_confirmed' && isPast)
        );
      });
      console.log(`✅ Past filtered: ${filtered.length} reservations`);
      return filtered;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: Colors.warning },
      confirmed: { label: 'Confirmed', color: Colors.success },
      completed: { label: 'Completed', color: Colors.info },
      cancelled: { label: 'Cancelled', color: Colors.textLight },
      rejected: { label: 'Rejected', color: Colors.error },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <View style={[styles.statusBadge, { backgroundColor: `${config.color}15` }]}>
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReservationPress = (reservationId: number) => {
    router.push(`/(client)/booking/${reservationId}`);
  };

  const filteredReservations = getFilteredReservations();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : filteredReservations.length === 0 ? (
          <EmptyState
            icon={<Calendar size={64} color={Colors.textLight} strokeWidth={1.5} />}
            title={`No ${activeTab} reservations`}
            description={
              activeTab === 'upcoming'
                ? 'Book your first luxury chef experience'
                : 'Your past reservations will appear here'
            }
          />
        ) : (
          filteredReservations.map((reservation) => (
            <TouchableOpacity
              key={reservation.id}
              style={styles.reservationCard}
              onPress={() => handleReservationPress(reservation.id)}
            >
              {/* Chef Info */}
              <View style={styles.cardHeader}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/60' }}
                  style={styles.chefPhoto}
                />
                <View style={styles.chefInfo}>
                  <Text style={styles.chefName}>
                    {reservation.chef?.user?.name || 'Chef'}
                  </Text>
                  <Text style={styles.packageName}>
                    {reservation.package?.name || 'Experience Package'}
                  </Text>
                </View>
                {getStatusBadge(reservation.status)}
              </View>

              {/* Reservation Details */}
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {formatDate(reservation.date)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {reservation.time} •{' '}
                    {reservation.package?.duration_hours || 3}h
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Users size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {reservation.guest_count} guests
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {reservation.address}
                  </Text>
                </View>
              </View>

              {/* Price */}
              <View style={styles.cardFooter}>
                <Text style={styles.priceLabel}>Total</Text>
                <Text style={styles.priceValue}>₺{reservation.total_price}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  scrollContent: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 3,
  },
  reservationCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...Shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chefPhoto: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border,
  },
  chefInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  chefName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
    marginBottom: 4,
  },
  packageName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase',
  },
  cardDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  priceValue: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    letterSpacing: LetterSpacing.normal,
  },
});

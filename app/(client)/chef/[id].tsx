/**
 * SAHNE - Chef Detail Page
 * Comprehensive chef profile with packages, gallery, reviews, and parcours
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Award,
  Calendar,
  CheckCircle,
} from 'lucide-react-native';
import { chefsService } from '@/src/services';
import { ChefProfile, ExperiencePackage, Review } from '@/src/types';
import { getChefPhoto, shouldUseLocalPhoto } from '@/src/utils/chefPhotos';
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  LetterSpacing,
  Shadow,
} from '@/src/constants';

const COVER_HEIGHT = 280;
const PROFILE_SIZE = 100;

export default function ChefDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const reviewsSectionRef = useRef<View>(null);

  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ExperiencePackage | null>(null);

  // Mock reviews data (will be fetched from API later)
  const mockReviews: Review[] = [
    {
      id: 1,
      reservation_id: 1,
      ratings: {
        cuisine: 5,
        presentation: 5,
        service: 5,
        overall: 5,
        average: 5.0,
      },
      comment: 'An absolutely incredible experience! The chef created a 5-course masterpiece that exceeded all expectations. Every dish was perfectly executed with amazing flavors.',
      chef_response: 'Thank you so much! It was a pleasure cooking for you.',
      chef_response_at: '2024-01-16',
      customer: { id: 1, name: 'Sarah Johnson' },
      chef: { id: Number(id), name: chef?.user.name || '' },
      is_reported: false,
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
    },
    {
      id: 2,
      reservation_id: 2,
      ratings: {
        cuisine: 5,
        presentation: 4,
        service: 5,
        overall: 5,
        average: 4.8,
      },
      comment: 'Wonderful dining experience. The chef was professional and the food was outstanding. Highly recommend for special occasions!',
      chef_response: null,
      chef_response_at: null,
      customer: { id: 2, name: 'Michael Chen' },
      chef: { id: Number(id), name: chef?.user.name || '' },
      is_reported: false,
      created_at: '2024-01-10',
      updated_at: '2024-01-10',
    },
    {
      id: 3,
      reservation_id: 3,
      ratings: {
        cuisine: 4,
        presentation: 5,
        service: 4,
        overall: 4,
        average: 4.3,
      },
      comment: 'Great food and presentation. The chef was very attentive to our dietary requirements.',
      chef_response: null,
      chef_response_at: null,
      customer: { id: 3, name: 'Emma Wilson' },
      chef: { id: Number(id), name: chef?.user.name || '' },
      is_reported: false,
      created_at: '2024-01-05',
      updated_at: '2024-01-05',
    },
  ];

  useEffect(() => {
    if (id) {
      fetchChefDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchChefDetail = async () => {
    try {
      setLoading(true);
      const data = await chefsService.getChefById(Number(id));
      setChef(data);
      // Auto-select first active package
      const firstPackage = data.packages.find((p) => p.is_active);
      if (firstPackage) {
        setSelectedPackage(firstPackage);
      }
    } catch (error) {
      console.error('Error fetching chef detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedPackage || !chef) {
      alert('Please select a package');
      return;
    }

    // Navigate to reservation date selection
    router.push({
      pathname: '/(client)/reservation/date',
      params: {
        chefId: chef.id.toString(),
        chefName: chef.user.name,
        chefPhoto: chef.profile_image,
        packageId: selectedPackage.id.toString(),
        packageName: selectedPackage.display_name,
        packagePrice: selectedPackage.price_per_person.toString(),
      },
    });
  };

  const scrollToReviews = () => {
    reviewsSectionRef.current?.measureLayout(
      scrollViewRef.current as any,
      (_x, y) => {
        scrollViewRef.current?.scrollTo({ y, animated: true });
      },
      () => {}
    );
  };

  const averageRating = mockReviews.length > 0
    ? mockReviews.reduce((sum, r) => sum + r.ratings.average, 0) / mockReviews.length
    : 0;

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            color={star <= rating ? Colors.primary : Colors.borderLight}
            fill={star <= rating ? Colors.primary : 'transparent'}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!chef) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Chef not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          {chef.cover_image && !shouldUseLocalPhoto(chef.cover_image) ? (
            <Image source={{ uri: chef.cover_image }} style={styles.coverImage} />
          ) : (
            <Image source={getChefPhoto(chef.id)} style={styles.coverImage} />
          )}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {chef.profile_image && !shouldUseLocalPhoto(chef.profile_image) ? (
              <Image source={{ uri: chef.profile_image }} style={styles.profileImage} />
            ) : (
              <Image source={getChefPhoto(chef.id)} style={styles.profileImage} />
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.chefName}>{chef.user.name}</Text>
            <Text style={styles.chefTitle}>{chef.title}</Text>

            {/* Rating */}
            <TouchableOpacity style={styles.ratingContainer} onPress={scrollToReviews}>
              <Star size={16} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.ratingText}>
                {averageRating.toFixed(1)} ({mockReviews.length} reviews)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoCard}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.quickInfoValue}>{chef.max_guests}</Text>
            <Text style={styles.quickInfoLabel}>Max Guests</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <Award size={20} color={Colors.primary} />
            <Text style={styles.quickInfoValue}>{chef.parcours.length}</Text>
            <Text style={styles.quickInfoLabel}>Experience</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <MapPin size={20} color={Colors.primary} />
            <Text style={styles.quickInfoValue}>{chef.regions.length}</Text>
            <Text style={styles.quickInfoLabel}>Regions</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{chef.biography}</Text>
        </View>

        {/* Culinary Philosophy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Culinary Philosophy</Text>
          <Text style={styles.aboutText}>{chef.culinary_philosophy}</Text>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {chef.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Service Regions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Regions</Text>
          <View style={styles.regionsContainer}>
            {chef.regions.map((region) => (
              <View key={region.id} style={styles.regionItem}>
                <MapPin size={16} color={Colors.textSecondary} />
                <Text style={styles.regionText}>{region.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experience Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Packages</Text>
          {chef.packages.filter((p) => p.is_active).map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                selectedPackage?.id === pkg.id && styles.packageCardSelected,
              ]}
              onPress={() => setSelectedPackage(pkg)}
            >
              <View style={styles.packageHeader}>
                <View>
                  <Text style={styles.packageName}>{pkg.display_name}</Text>
                  <Text style={styles.packagePrice}>
                    ₺{pkg.price_per_person.toLocaleString()} per person
                  </Text>
                </View>
                {selectedPackage?.id === pkg.id && (
                  <CheckCircle size={24} color={Colors.primary} />
                )}
              </View>

              {pkg.description && (
                <Text style={styles.packageDescription}>{pkg.description}</Text>
              )}

              <View style={styles.packageDetails}>
                <Text style={styles.packageDetail}>• {pkg.courses_count} courses</Text>
                {pkg.includes_wine && (
                  <Text style={styles.packageDetail}>• Wine pairing included</Text>
                )}
                {pkg.crew_members && (
                  <Text style={styles.packageDetail}>• {pkg.crew_members} crew members</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reserve Now Section */}
        <View style={styles.reserveSection}>
          {selectedPackage && (
            <Text style={styles.selectedPackageText}>
              Selected: {selectedPackage.display_name}
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.reserveButton,
              !selectedPackage && styles.reserveButtonDisabled,
            ]}
            onPress={handleBookNow}
            disabled={!selectedPackage}
          >
            <Text style={styles.reserveButtonText}>
              {selectedPackage ? 'Reserve Now' : 'Select a Package'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Photo Gallery */}
        {chef.media.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            >
              {chef.media.map((media) => (
                <View key={media.id} style={styles.galleryItem}>
                  <Image source={{ uri: media.url }} style={styles.galleryImage} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Parcours Timeline */}
        {chef.parcours.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Background</Text>
            {chef.parcours
              .sort((a, b) => Number(a.order) - Number(b.order))
              .map((item, index) => (
                <View key={item.id} style={styles.parcoursItem}>
                  <View style={styles.parcoursIconContainer}>
                    <Calendar size={20} color={Colors.primary} />
                    {index < chef.parcours.length - 1 && (
                      <View style={styles.parcoursLine} />
                    )}
                  </View>
                  <View style={styles.parcoursContent}>
                    <Text style={styles.parcoursInstitution}>{item.institution}</Text>
                    <Text style={styles.parcoursPosition}>{item.position}</Text>
                    <Text style={styles.parcoursLocation}>{item.location}</Text>
                    <Text style={styles.parcoursDate}>
                      {item.start_date} - {item.end_date}
                    </Text>
                    <Text style={styles.parcoursDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Reviews Section */}
        <View ref={reviewsSectionRef} style={styles.section}>
          <View style={styles.reviewsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.reviewsRating}>
                <Star size={20} color={Colors.primary} fill={Colors.primary} />
                <Text style={styles.reviewsAverageText}>
                  {averageRating.toFixed(1)}
                </Text>
                <Text style={styles.reviewsCountText}>
                  ({mockReviews.length} reviews)
                </Text>
              </View>
            </View>
          </View>

          {mockReviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              {/* Customer Info */}
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>
                    {review.customer.name[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.reviewHeaderInfo}>
                  <Text style={styles.reviewCustomerName}>{review.customer.name}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View>{renderStars(Math.round(review.ratings.average))}</View>
              </View>

              {/* Review Comment */}
              <Text style={styles.reviewComment}>{review.comment}</Text>

              {/* Chef Response */}
              {review.chef_response && (
                <View style={styles.chefResponseContainer}>
                  <Text style={styles.chefResponseLabel}>Chef&apos;s Response:</Text>
                  <Text style={styles.chefResponseText}>{review.chef_response}</Text>
                </View>
              )}
            </View>
          ))}

          {/* View All Reviews Button */}
          <TouchableOpacity
            style={styles.viewAllReviewsButton}
            onPress={() => alert('View All Reviews - Coming in Phase 4')}
          >
            <Text style={styles.viewAllReviewsText}>View All Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.error,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    width: '100%',
    height: COVER_HEIGHT,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    backgroundColor: Colors.surface,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginTop: -(PROFILE_SIZE / 2),
    ...Shadow.lg,
  },
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    borderWidth: 4,
    borderColor: Colors.background,
  },
  profilePlaceholder: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePlaceholderText: {
    fontFamily: FontFamily.heading,
    fontSize: 36,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  chefName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  chefTitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 4,
  },
  ratingText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
  },
  quickInfoValue: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
    letterSpacing: LetterSpacing.normal,
  },
  quickInfoLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: LetterSpacing.normal,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: LetterSpacing.normal,
  },
  aboutText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: FontSize.bodyMedium * 1.6,
    letterSpacing: LetterSpacing.normal,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  specialtyChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  specialtyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  regionsContainer: {
    gap: Spacing.sm,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  regionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  packageCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  packageCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  packageName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h5,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  packagePrice: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginTop: 4,
    letterSpacing: LetterSpacing.normal,
  },
  packageDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: FontSize.bodySmall * 1.5,
    letterSpacing: LetterSpacing.normal,
  },
  packageDetails: {
    gap: 4,
  },
  packageDetail: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  galleryContainer: {
    paddingRight: 20,
    gap: Spacing.md,
  },
  galleryItem: {
    width: 200,
    height: 150,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  parcoursItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  parcoursIconContainer: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
  },
  parcoursLine: {
    position: 'absolute',
    top: 30,
    bottom: -Spacing.lg,
    width: 2,
    backgroundColor: Colors.border,
  },
  parcoursContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  parcoursInstitution: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  parcoursPosition: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
    marginTop: 2,
    letterSpacing: LetterSpacing.normal,
  },
  parcoursLocation: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: LetterSpacing.normal,
  },
  parcoursDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    color: Colors.textLight,
    marginTop: 4,
    letterSpacing: LetterSpacing.normal,
  },
  parcoursDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: FontSize.bodySmall * 1.5,
    letterSpacing: LetterSpacing.normal,
  },
  reserveSection: {
    paddingHorizontal: 20,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginHorizontal: 20,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  selectedPackageText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    letterSpacing: LetterSpacing.normal,
  },
  reserveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  reserveButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    letterSpacing: LetterSpacing.normal,
  },
  reviewsHeader: {
    marginBottom: Spacing.md,
  },
  reviewsRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 6,
  },
  reviewsAverageText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  reviewsCountText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  reviewAvatarText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewCustomerName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  reviewDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: LetterSpacing.normal,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: FontSize.bodyMedium * 1.5,
    letterSpacing: LetterSpacing.normal,
  },
  chefResponseContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  chefResponseLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: LetterSpacing.normal,
  },
  chefResponseText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: FontSize.bodySmall * 1.5,
    letterSpacing: LetterSpacing.normal,
  },
  viewAllReviewsButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  viewAllReviewsText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    letterSpacing: LetterSpacing.normal,
  },
});

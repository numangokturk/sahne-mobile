/**
 * SAHNE - Chef Detail Page
 * Comprehensive chef profile with packages, gallery, reviews, and parcours
 */

import React, { useState, useEffect } from 'react';
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
import { ChefProfile, ExperiencePackage } from '@/src/types';
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

const COVER_HEIGHT = 200;
const PROFILE_SIZE = 100;

export default function ChefDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ExperiencePackage | null>(null);

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
    if (!selectedPackage) {
      alert('Please select a package');
      return;
    }
    // TODO: Navigate to reservation flow (Phase 4)
    console.log('Book now with package:', selectedPackage.id);
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
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          {chef.cover_image ? (
            <Image source={{ uri: chef.cover_image }} style={styles.coverImage} />
          ) : (
            <View style={[styles.coverImage, styles.coverPlaceholder]} />
          )}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {chef.profile_image ? (
              <Image source={{ uri: chef.profile_image }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.profilePlaceholder]}>
                <Text style={styles.profilePlaceholderText}>
                  {chef.user.name[0].toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.chefName}>{chef.user.name}</Text>
            <Text style={styles.chefTitle}>{chef.title}</Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.ratingText}>4.8 (24 reviews)</Text>
            </View>
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
      </ScrollView>

      {/* Fixed Book Now Button */}
      <View style={[styles.bookNowContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[
            styles.bookNowButton,
            !selectedPackage && styles.bookNowButtonDisabled,
          ]}
          onPress={handleBookNow}
          disabled={!selectedPackage}
        >
          <Text style={styles.bookNowText}>
            {selectedPackage
              ? `Book ${selectedPackage.display_name}`
              : 'Select a Package'}
          </Text>
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
  bookNowContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    paddingHorizontal: 20,
    ...Shadow.lg,
  },
  bookNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  bookNowButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  bookNowText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    letterSpacing: LetterSpacing.normal,
  },
});

/**
 * SAHNE - Chef Card Component
 * Displays chef information in a premium card layout
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Chef } from '@/src/types';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/src/constants';
import { format } from '@/src/utils';

interface ChefCardProps {
  chef: Chef;
}

export const ChefCard: React.FC<ChefCardProps> = ({ chef }) => {
  const router = useRouter();

  const handlePress = () => {
    // TODO: Navigate to chef detail (Phase 3)
    // router.push(`/chef/${chef.id}` as any);
    console.log('Chef card pressed:', chef.id);
  };

  // Calculate starting price from packages
  const startingPrice = chef.packages && chef.packages.length > 0
    ? Math.min(...chef.packages.map((p) => p.price))
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Chef Image */}
      <View style={styles.imageContainer}>
        {chef.profile_image ? (
          <Image
            source={{ uri: chef.profile_image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {chef.user?.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}

        {/* Rating Badge */}
        {chef.rating > 0 && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {chef.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      {/* Chef Info */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {chef.user?.name || 'Chef'}
        </Text>

        {/* Experience */}
        {chef.experience_years > 0 && (
          <Text style={styles.experience}>
            {chef.experience_years} year{chef.experience_years !== 1 ? 's' : ''} of experience
          </Text>
        )}

        {/* Specialties */}
        {chef.specialties && chef.specialties.length > 0 && (
          <View style={styles.specialtiesContainer}>
            {chef.specialties.slice(0, 3).map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText} numberOfLines={1}>
                  {specialty}
                </Text>
              </View>
            ))}
            {chef.specialties.length > 3 && (
              <Text style={styles.moreSpecialties}>
                +{chef.specialties.length - 3}
              </Text>
            )}
          </View>
        )}

        {/* Price and Reviews */}
        <View style={styles.footer}>
          {startingPrice !== null && startingPrice > 0 && (
            <Text style={styles.price}>
              From {format.price(startingPrice)}
            </Text>
          )}
          {chef.total_reviews > 0 && (
            <Text style={styles.reviews}>
              {chef.total_reviews} review{chef.total_reviews !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.primaryLight,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: FontFamily.heading,
    fontSize: 64,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  ratingBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  ratingText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.md,
  },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  experience: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  specialtyTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    maxWidth: 100,
  },
  specialtyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.primaryDark,
    fontWeight: FontWeight.medium,
  },
  moreSpecialties: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  price: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  reviews: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
});

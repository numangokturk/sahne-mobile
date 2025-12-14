/**
 * SAHNE - Home Dashboard
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context';
import { chefsService } from '@/src/services';
import { Chef, ApiError } from '@/src/types';
import { ChefCard } from '@/src/components/chef';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants';

const CATEGORIES = [
  { id: 1, name: 'Turkish', icon: '🇹🇷', specialty: 'Turkish' },
  { id: 2, name: 'Italian', icon: '🇮🇹', specialty: 'Italian' },
  { id: 3, name: 'Japanese', icon: '🇯🇵', specialty: 'Japanese' },
  { id: 4, name: 'French', icon: '🇫🇷', specialty: 'French' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [popularChefs, setPopularChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularChefs();
  }, []);

  const fetchPopularChefs = async () => {
    try {
      setLoading(true);
      const response = await chefsService.getChefs();
      // Get top 3 chefs by rating
      const topChefs = response.data
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      setPopularChefs(topChefs);
    } catch (err) {
      console.error('❌ Error fetching popular chefs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: typeof CATEGORIES[0]) => {
    // Navigate to explore with filter
    router.push('/explore');
  };

  const handleViewAllChefs = () => {
    router.push('/explore');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}! 👋</Text>
          </View>
        </View>

        {/* Upcoming Reservation Card (Placeholder) */}
        <View style={styles.section}>
          <View style={styles.upcomingCard}>
            <Text style={styles.upcomingIcon}>📅</Text>
            <View style={styles.upcomingContent}>
              <Text style={styles.upcomingTitle}>No Upcoming Reservations</Text>
              <Text style={styles.upcomingText}>
                Book your first luxury chef experience
              </Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Chefs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Chefs</Text>
            <TouchableOpacity onPress={handleViewAllChefs}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : popularChefs.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chefsContainer}
            >
              {popularChefs.map((chef) => (
                <View key={chef.id} style={styles.chefCardContainer}>
                  <ChefCard chef={chef} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No chefs available</Text>
          )}
        </View>

        {/* View All Chefs Button */}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={handleViewAllChefs}
        >
          <Text style={styles.viewAllButtonText}>View All Chefs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  greeting: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  userName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  upcomingIcon: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  upcomingText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  categoriesContainer: {
    paddingRight: Spacing.lg,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  chefsContainer: {
    paddingRight: Spacing.lg,
  },
  chefCardContainer: {
    width: 300,
    marginRight: Spacing.md,
  },
  loadingText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  noDataText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  viewAllButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});

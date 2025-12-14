/**
 * SAHNE - Client Home Screen (Chef List)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '@/src/context';
import { chefsService } from '@/src/services';
import { Chef, ApiError } from '@/src/types';
import { ChefCard } from '@/src/components/chef';
import { Input, ChefListSkeleton, EmptyState } from '@/src/components/ui';
import { Colors, FontFamily, FontSize, FontWeight, Spacing } from '@/src/constants';

export default function ClientHomeScreen() {
  const { user, logout } = useAuth();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchChefs = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      console.log('📡 Fetching chefs...');
      const response = await chefsService.getChefs({
        search: searchQuery || undefined,
      });

      console.log('✅ Chefs fetched:', response.data.length);
      setChefs(response.data);
    } catch (err) {
      console.error('❌ Error fetching chefs:', err);
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load chefs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchChefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChefs(true);
  };

  const handleSearch = () => {
    fetchChefs();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}!</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search chefs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Chef List */}
      {loading && !refreshing ? (
        <View style={styles.content}>
          <ChefListSkeleton />
        </View>
      ) : error ? (
        <View style={styles.content}>
          <EmptyState
            icon="⚠️"
            title="Oops!"
            description={error}
          />
        </View>
      ) : chefs.length === 0 ? (
        <View style={styles.content}>
          <EmptyState
            icon="👨‍🍳"
            title="No Chefs Found"
            description={
              searchQuery
                ? 'Try adjusting your search terms'
                : 'No chefs available at the moment'
            }
          />
        </View>
      ) : (
        <FlatList
          data={chefs}
          renderItem={({ item }) => <ChefCard chef={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  userName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  logoutButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logoutText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  searchContainer: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  listContent: {
    padding: Spacing.lg,
  },
});

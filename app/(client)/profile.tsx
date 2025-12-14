/**
 * SAHNE - Profile Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/src/context';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  destructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, destructive }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <Text style={[styles.menuTitle, destructive && styles.menuTitleDestructive]}>
      {title}
    </Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menu}>
            <MenuItem
              icon="👤"
              title="Personal Information"
              onPress={() => Alert.alert('Coming Soon', 'Edit profile feature coming soon')}
            />
            <MenuItem
              icon="🔔"
              title="Notifications"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon')}
            />
            <MenuItem
              icon="💳"
              title="Payment Methods"
              onPress={() => Alert.alert('Coming Soon', 'Payment methods coming soon')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menu}>
            <MenuItem
              icon="⚙️"
              title="Settings"
              onPress={() => Alert.alert('Coming Soon', 'Settings coming soon')}
            />
            <MenuItem
              icon="🌐"
              title="Language"
              onPress={() => Alert.alert('Coming Soon', 'Language selection coming soon')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menu}>
            <MenuItem
              icon="❓"
              title="Help & Support"
              onPress={() => Alert.alert('Coming Soon', 'Support center coming soon')}
            />
            <MenuItem
              icon="📄"
              title="Terms & Conditions"
              onPress={() => Alert.alert('Coming Soon', 'Terms coming soon')}
            />
            <MenuItem
              icon="🔒"
              title="Privacy Policy"
              onPress={() => Alert.alert('Coming Soon', 'Privacy policy coming soon')}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontFamily: FontFamily.heading,
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  email: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textPrimary,
  },
  menuTitleDestructive: {
    color: Colors.error,
  },
  menuArrow: {
    fontFamily: FontFamily.body,
    fontSize: 24,
    color: Colors.textLight,
  },
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.error,
  },
  logoutText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
});

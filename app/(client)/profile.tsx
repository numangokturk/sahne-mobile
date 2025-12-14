/**
 * SAHNE - Profile Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import {
  User,
  Bell,
  CreditCard,
  Settings,
  Globe,
  HelpCircle,
  FileText,
  Lock,
  ChevronRight,
  Moon,
  Sun,
  X,
} from 'lucide-react-native';
import { useAuth, useTheme } from '@/src/context';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, BorderRadius, LetterSpacing } from '@/src/constants';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  destructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, destructive }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>{icon}</View>
    <Text style={[styles.menuTitle, destructive && styles.menuTitleDestructive]}>
      {title}
    </Text>
    <ChevronRight size={20} color={Colors.textLight} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { setTheme, isDark } = useTheme();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
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
              icon={<User size={20} color={Colors.textSecondary} />}
              title="Personal Information"
              onPress={() => Alert.alert('Coming Soon', 'Edit profile feature coming soon')}
            />
            <MenuItem
              icon={<Bell size={20} color={Colors.textSecondary} />}
              title="Notifications"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon')}
            />
            <MenuItem
              icon={<CreditCard size={20} color={Colors.textSecondary} />}
              title="Payment Methods"
              onPress={() => Alert.alert('Coming Soon', 'Payment methods coming soon')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menu}>
            <MenuItem
              icon={<Settings size={20} color={Colors.textSecondary} />}
              title="Settings"
              onPress={() => setSettingsModalVisible(true)}
            />
            <MenuItem
              icon={<Globe size={20} color={Colors.textSecondary} />}
              title="Language"
              onPress={() => Alert.alert('Coming Soon', 'Language selection coming soon')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menu}>
            <MenuItem
              icon={<HelpCircle size={20} color={Colors.textSecondary} />}
              title="Help & Support"
              onPress={() => Alert.alert('Coming Soon', 'Support center coming soon')}
            />
            <MenuItem
              icon={<FileText size={20} color={Colors.textSecondary} />}
              title="Terms & Conditions"
              onPress={() => Alert.alert('Coming Soon', 'Terms coming soon')}
            />
            <MenuItem
              icon={<Lock size={20} color={Colors.textSecondary} />}
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

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity
                onPress={() => setSettingsModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Dark Mode Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                {isDark ? (
                  <Moon size={20} color={Colors.textSecondary} />
                ) : (
                  <Sun size={20} color={Colors.textSecondary} />
                )}
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={(value) => handleThemeChange(value ? 'dark' : 'light')}
                trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontFamily: FontFamily.heading,
    fontSize: 36,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: LetterSpacing.normal,
  },
  email: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.normal,
  },
  section: {
    marginTop: Spacing.md,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wide,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    marginRight: Spacing.md,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  menuTitleDestructive: {
    color: Colors.error,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
    letterSpacing: LetterSpacing.normal,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: 100,
    letterSpacing: LetterSpacing.normal,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.normal,
  },
});

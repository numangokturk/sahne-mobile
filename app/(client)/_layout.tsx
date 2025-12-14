/**
 * SAHNE - Client Tab Layout
 */

import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, Calendar, User } from 'lucide-react-native';
import { Colors } from '@/src/constants';

export default function ClientLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color}) => <TabIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chef"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

// Tab icon component with Lucide icons
const TabIcon: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const iconProps = { color, size: 22, strokeWidth: 2 };

  switch (name) {
    case 'home':
      return <Home {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    default:
      return <View />;
  }
};

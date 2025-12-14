/**
 * SAHNE - Client Tab Layout
 */

import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/src/constants';

export default function ClientLayout() {
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
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
    </Tabs>
  );
}

// Simple icon component (you can replace with actual icons later)
const TabIcon: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const icons: Record<string, string> = {
    home: '🏠',
    search: '🔍',
    calendar: '📅',
    user: '👤',
  };

  return (
    <Text style={{ fontSize: 24 }}>
      {icons[name] || '•'}
    </Text>
  );
};

/**
 * SAHNE - Root Layout
 */

import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/src/context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/splash" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="(chef)" />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}

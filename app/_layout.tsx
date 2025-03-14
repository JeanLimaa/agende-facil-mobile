import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import React from 'react';
import { AuthProvider } from '@/modules/auth/contexts/AuthContext';
import { PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="+not-found" />
      </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}
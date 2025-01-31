import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      console.log(token);
      if (token) {
        router.push('/(tabs)');
        setIsLoggedIn(true);
      } else {
        router.push('/auth');
        setIsLoggedIn(false);
      }
      if (loaded) {
        SplashScreen.hideAsync();
      }
    };

    checkLoginStatus();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
      <Stack>
          {isLoggedIn ? (
              <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
          ) : (
              <Stack.Screen name="auth/index" options={{ headerShown: false }}  />
          )}
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="+not-found" />
      </Stack>
  );
}

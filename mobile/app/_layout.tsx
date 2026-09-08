import '@/global.css';

import React from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { NAV_THEME, THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';
import { Text } from '@/components/ui/text';
import { Image, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Bell } from '@hugeicons/core-free-icons';
import { authenticatedUser } from '@/mocks/authenticated-user';
import { AppHeader } from '@/components/layout/app-header';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { theme } = useUniwind();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          animation: 'simple_push',
          header: () => <AppHeader />,
        }}
      />
      <PortalHost />
    </ThemeProvider>
  );
}

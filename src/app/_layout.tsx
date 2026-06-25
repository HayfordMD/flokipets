import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThirdwebProvider, AutoConnect } from 'thirdweb/react';
import { client, appWallets } from '@/lib/thirdweb';
import * as WebBrowser from 'expo-web-browser';

import { Platform } from 'react-native';

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  WebBrowser.maybeCompleteAuthSession();
}
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { TopNavBar } from '@/components/TopNavBar';
import SlotMachine from '@/features/games/SlotMachine';
import '../global.css';

const TEST_GAME = process.env.EXPO_PUBLIC_TEST_GAME;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // BYPASS: If we are testing slots locally, render ONLY the game
  if (TEST_GAME === 'slots') {
    return <SlotMachine />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThirdwebProvider>
        <AutoConnect client={client} wallets={appWallets} />
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

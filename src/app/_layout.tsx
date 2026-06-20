import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThirdwebProvider } from 'thirdweb/react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
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
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}

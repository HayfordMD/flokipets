import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const { ncbUser, activeAccount } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      if (Platform.OS === 'web') {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          FlokiPets
        </ThemedText>

        {props.children}

        {ncbUser ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Spacing.three, gap: Spacing.two, position: 'relative', zIndex: 50 }}>
            <Pressable onPress={() => setIsDropdownOpen(!isDropdownOpen)} style={{ padding: 4 }}>
              <ThemedText type="smallBold">👤 {ncbUser.name ? ncbUser.name.split(' ')[0] : ncbUser.email}</ThemedText>
            </Pressable>
            {isDropdownOpen && (
              <View style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, backgroundColor: colors.background, padding: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, minWidth: 100, zIndex: 100 }}>
                <Pressable onPress={handleLogout} style={{ padding: 8 }}>
                  <ThemedText type="link">Logout</ThemedText>
                </Pressable>
              </View>
            )}
          </View>
        ) : activeAccount ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Spacing.three }}>
            <ThemedText type="smallBold">👛 {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}</ThemedText>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Spacing.three }}>
            <Link href="/" asChild>
              <Pressable style={{ padding: 4 }}>
                <ThemedText type="smallBold" style={{ color: '#3B82F6' }}>Sign In / Sign Up</ThemedText>
              </Pressable>
            </Link>
          </View>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});

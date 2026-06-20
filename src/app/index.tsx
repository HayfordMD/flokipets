import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConnectButton } from "thirdweb/react";
import { client } from '@/lib/thirdweb';
import { createWallet } from "thirdweb/wallets";
import { useAuth } from '@/hooks/useAuth';
import { BasePet } from '@/components/pets/BasePet';

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.walletconnect"),
];

type Providers = { email?: boolean; google?: boolean; emailOTP?: boolean };

export default function HomeScreen() {
  const router = useRouter();
  const [providers, setProviders] = useState<Providers | null>(null);
  const { isOffChain, flokiBalance, ncbUser, activeAccount } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'web') {
      fetch("/api/auth-providers")
        .then(res => res.json())
        .then(data => setProviders(data.providers || {}))
        .catch(() => setProviders({ google: true }));
    } else {
      setProviders({ google: true });
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (Platform.OS === 'web') {
      try {
        const callbackURL = window.location.origin + "/auth/callback";
        const res = await fetch("/api/auth/sign-in/social", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "google", callbackURL })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No redirect URL returned:", data);
        }
      } catch (error) {
        console.error("Google login failed:", error);
      }
    } else {
      alert("Google login is currently fully supported on web. Mobile implementation pending backend deep link proxy setup.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {Platform.OS === 'web' ? (
          <h1 className="text-gradient" style={{ fontSize: 48, fontWeight: 'bold', margin: 0, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            FlokiPets
          </h1>
        ) : (
          <Text style={styles.title}>FlokiPets</Text>
        )}
        
        <Text style={styles.subtitle}>Your Web3 Companion</Text>

        {isOffChain && (
          <View style={{ backgroundColor: '#FFFBEA', padding: 12, borderRadius: 8, marginBottom: 16, borderColor: '#F59E0B', borderWidth: 1, width: '100%', maxWidth: 400 }}>
            <Text style={{ color: '#D97706', fontWeight: 'bold', textAlign: 'center' }}>
              You are playing off-chain! Connect a wallet to secure your assets and earn 500 FLOKI.
            </Text>
          </View>
        )}

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back!</Text>
          <Text style={styles.cardText}>
            Connect your wallet or sign in with Google to start earning.
          </Text>

          {/* SVG GENERATOR DEMO */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16, gap: 10 }}>
            <BasePet color="#FFB84D" size={80} />
            <BasePet color="#4ADE80" size={80} />
            <BasePet color="#60A5FA" size={80} />
          </View>
          <Text style={{ fontSize: 13, color: '#3B82F6', textAlign: 'center', marginBottom: 20 }}>
            Look! 3 completely different colored pets generated from the exact same SVG code component!
          </Text>

          {/* Dev Shortcut to Sandbox */}
          <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', width: '100%', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Developer Tools</Text>
            <Link href="/testpets" style={{ padding: 12, backgroundColor: '#3B82F6', borderRadius: 20, overflow: 'hidden', color: 'white', fontWeight: 'bold' }}>
              Open Pet Sandbox
            </Link>
          </View>

          {(ncbUser || activeAccount) && (
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981', marginBottom: 16 }}>
              {flokiBalance} FLOKI
            </Text>
          )}
          
          <View style={{ marginBottom: 16, width: '100%' }}>
            <Button 
              title="Sign in with Google" 
              onPress={handleGoogleLogin} 
            />
            <Text style={{ fontSize: 13, color: '#1E3A8A', textAlign: 'center', marginTop: 8, fontWeight: '500' }}>
              You will still earn FLOKI but must claim it to your wallet later.
            </Text>
          </View>

          <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
            <ConnectButton
              client={client}
              wallets={wallets}
              theme={"light"}
              connectModal={{ size: "wide" }}
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // Background is handled by global.css body tag, but we can set it here for safety
    backgroundColor: '#6CC5FF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FF8C00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#1E3A8A', // Deep blue instead of gray
    fontWeight: 'bold',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    color: '#3B82F6', // Lighter blue
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
});

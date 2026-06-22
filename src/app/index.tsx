import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConnectButton } from "thirdweb/react";
import { client, appWallets } from '@/lib/thirdweb';
import { ACTIVE_CHAIN } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { BasePet } from '@/components/pets/BasePet';

type Providers = { email?: boolean; google?: boolean; emailOTP?: boolean };

export default function HomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('rememberMe').then((val) => {
      if (val === 'true') setRememberMe(true);
    });
  }, []);

  const toggleRememberMe = async () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);
    await AsyncStorage.setItem('rememberMe', String(newValue));
  };
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [providers, setProviders] = useState<Providers>({});
  const { activeAccount, ncbUser, isOffChain, flokiBalance, loading: authHookLoading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'web') {
      fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/auth/providers`)
        .then(res => res.json())
        .then(data => setProviders(data.providers || {}))
        .catch(() => setProviders({ email: true }));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProviders({ email: true });
    }
  }, []);

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (!authHookLoading && (ncbUser || activeAccount)) {
      router.replace('/dashboard');
    }
  }, [ncbUser, activeAccount, authHookLoading, router]);

  const handleEmailAuth = async () => {
    console.log("Auth button clicked!", { isSignUp, email: email ? "provided" : "empty", password: password ? "provided" : "empty" });
    
    if (!email || !password) {
      console.log("Early return: missing email or password");
      setAuthError('Email and password are required');
      return;
    }
    if (isSignUp && !name) {
      console.log("Early return: missing name for signup");
      setAuthError('Name is required for sign up');
      return;
    }
    
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
      const endpoint = isSignUp ? `${baseUrl}/api/auth/sign-up/email` : `${baseUrl}/api/auth/sign-in/email`;
      const body = isSignUp 
        ? JSON.stringify({ email, password, name, rememberMe })
        : JSON.stringify({ email, password, rememberMe });

      console.log(`Sending POST request to ${endpoint}`);

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body
      });
      
      console.log("Response received with status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }
      
      console.log("Auth successful! Attempting to navigate to /dashboard...");
      if (Platform.OS === 'web') {
        // Force a hard navigation on web to ensure cookies and states are freshly loaded
        console.log("Using window.location.href for web routing...");
        window.location.href = '/dashboard';
      } else {
        console.log("Using Expo Router replace for native routing...");
        router.replace('/dashboard');
      }
      console.log("Navigation command executed!");
    } catch (error: any) {
      console.error("Email auth failed:", error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
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
            Connect your wallet or sign in to start earning.
          </Text>

          {/* Replaced old dashboard view with redirect */}
          
          {/* Email Authentication Form */}
          {authHookLoading ? (
            <View style={{ marginBottom: 16, width: '100%', padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#1F2937' }}>Loading session...</Text>
            </View>
          ) : (!ncbUser && !activeAccount) && (
            <View style={{ marginBottom: 16, width: '100%', padding: 16, backgroundColor: '#F3F4F6', borderRadius: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1F2937', textAlign: 'center' }}>
                {isSignUp ? 'Create an Account' : 'Sign In with Email'}
              </Text>
              
              {authError ? (
                <Text style={{ color: '#EF4444', marginBottom: 12, textAlign: 'center', fontSize: 14 }}>{authError}</Text>
              ) : null}

              {isSignUp && (
                <TextInput 
                  placeholder="Full Name" 
                  value={name} 
                  onChangeText={setName} 
                  style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: 'white' }}
                />
              )}
              
              <TextInput 
                placeholder="Email Address" 
                value={email} 
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: 'white' }}
              />
              
              <TextInput 
                placeholder="Password" 
                value={password} 
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: 'white' }}
              />

              <Pressable 
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                onPress={toggleRememberMe}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                accessibilityLabel="Remember me"
              >
                <View style={[{
                  width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'
                }, rememberMe && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}>
                  {rememberMe && <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
                </View>
                <Text style={{ color: '#4B5563', fontSize: 14 }}>Remember me</Text>
              </Pressable>

              <Button 
                title={authLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")} 
                onPress={handleEmailAuth}
                disabled={authLoading}
              />
              
              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                  <Text 
                    style={{ color: '#3B82F6', fontWeight: 'bold', cursor: 'pointer' }} 
                    onPress={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Text>
                </Text>
              </View>

              <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 16 }}>
                You will still earn FLOKI but must claim it to your wallet later.
              </Text>
            </View>
          )}

          <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
            <ConnectButton
              client={client}
              wallets={appWallets}
              accountAbstraction={{
                chain: ACTIVE_CHAIN,
                sponsorGas: true,
              }}
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
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 48,
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

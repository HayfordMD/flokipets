import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function AdminScreen() {
  const router = useRouter();
  const { ncbUser, loading, activeAccount, isAdmin } = useAuth();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/dashboard');
    } else if (isAdmin) {
      // Fetch stats
      fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/admin/stats`)
        .then(res => res.json())
        .then(data => {
          if (data && data.userCount !== undefined) {
            setUserCount(data.userCount);
          }
        })
        .catch(err => console.error("Failed to fetch admin stats:", err))
        .finally(() => setIsLoadingStats(false));
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: '#1E3A8A' }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Welcome, Admin</Text>
          <Text style={styles.cardText}>
            This is a secure area only visible to authorized administrators.
          </Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>Email: {ncbUser?.email || 'N/A'}</Text>
            <Text style={styles.detailText}>Name: {ncbUser?.name || 'N/A'}</Text>
            <Text style={styles.detailText}>NCB ID: {ncbUser?.id || 'N/A'}</Text>
            <Text style={styles.detailText}>Wallet: {activeAccount?.address || 'Not Connected'}</Text>
          </View>

          <View style={[styles.detailBox, { marginTop: 16, backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }]}>
            <Text style={[styles.cardTitle, { marginBottom: 8 }]}>Platform Statistics</Text>
            <Text style={[styles.detailText, { fontSize: 18, fontWeight: 'bold' }]}>
              Total Users: {isLoadingStats ? 'Loading...' : (userCount !== null ? userCount : 'N/A')}
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6CC5FF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF8C00',
  },
  infoCard: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'flex-start',
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 24,
  },
  detailBox: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'monospace',
  }
});

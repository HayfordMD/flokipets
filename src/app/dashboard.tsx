import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BasePet } from '@/components/pets/BasePet';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const router = useRouter();
  const { flokiBalance } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.balanceText}>{flokiBalance} FLOKI</Text>
        </View>

        <Card style={styles.petCard}>
          <Text style={styles.petName}>Your Pet</Text>
          <View style={styles.petContainer}>
            {/* Displaying the user's pet. We'll use BasePet for now */}
            <BasePet color="#FFD700" size={150} />
          </View>
        </Card>

        <View style={styles.navigationGrid}>
          <View style={styles.navItem}>
            <Button 
              title="🛍 Shop" 
              variant="primary" 
              onPress={() => router.push('/shop')} 
            />
          </View>
          <View style={styles.navItem}>
            <Button 
              title="🎮 Game" 
              variant="secondary" 
              onPress={() => router.push('/game')} 
            />
          </View>
          <View style={styles.navItem}>
            <Button 
              title="🏪 Marketplace" 
              variant="primary" 
              onPress={() => router.push('/marketplace')} 
            />
          </View>
          <View style={styles.navItem}>
            <Button 
              title="👥 Friends" 
              variant="secondary" 
              onPress={() => router.push('/friends')} 
            />
          </View>
          <View style={styles.navItem}>
            <Button 
              title="🏦 Bank" 
              variant="primary" 
              onPress={() => router.push('/bank')} 
            />
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF8C00',
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  petCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 24,
    padding: 24,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  petContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  navigationGrid: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  navItem: {
    width: '100%',
  }
});

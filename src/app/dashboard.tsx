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
  const { flokiBalance, ncbUser, loading, activeAccount } = useAuth();

  React.useEffect(() => {
    console.log("Dashboard screen mounted! Current User:", ncbUser);
    // TEMPORARILY DISABLED FOR FRONTEND DEVELOPMENT
    // if (!loading && !ncbUser && !activeAccount) {
    //   router.replace('/');
    // }
  }, [loading, ncbUser, activeAccount, router]);

  // Temporary check: if they have pets array, consider them as having a pet.
  // We can adjust this logic once the backend schema is finalized.
  const hasPet = ncbUser?.pets?.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: '#1E3A8A' }}>Loading...</Text>
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={{fontSize: 16, color: '#1E3A8A', fontWeight: 'bold'}}>Level 1 • Novice</Text>
          </View>
          <Text style={styles.balanceText}>{flokiBalance} FLOKI</Text>
        </View>

        <Card style={styles.petCard}>
          <Text style={styles.petName}>Your Pet</Text>
          <View style={styles.petContainer}>
            {hasPet ? (
              <View style={{alignItems: 'center', width: '100%'}}>
                <BasePet color="#FFD700" size={120} />
                <View style={{marginTop: 16, width: '100%', paddingHorizontal: 16, gap: 8}}>
                   <Text style={{color: '#1E3A8A', fontWeight: 'bold', fontSize: 12}}>Hunger: 80%</Text>
                   <View style={{width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3}}>
                     <View style={{width: '80%', height: '100%', backgroundColor: '#10B981', borderRadius: 3}} />
                   </View>
                   <Text style={{color: '#1E3A8A', fontWeight: 'bold', fontSize: 12}}>Energy: 60%</Text>
                   <View style={{width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3}}>
                     <View style={{width: '60%', height: '100%', backgroundColor: '#F59E0B', borderRadius: 3}} />
                   </View>
                   <Text style={{color: '#1E3A8A', fontWeight: 'bold', fontSize: 12}}>Happiness: 90%</Text>
                   <View style={{width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3}}>
                     <View style={{width: '90%', height: '100%', backgroundColor: '#3B82F6', borderRadius: 3}} />
                   </View>
                </View>
              </View>
            ) : (
              <Button 
                title="🐾 Create your first pet" 
                variant="primary" 
                onPress={() => router.push('/mint')} 
              />
            )}
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
              title="🎮 Games" 
              variant="secondary" 
              onPress={() => router.push('/games')} 
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
          <View style={styles.navItem}>
            <Button 
              title="🎒 Inventory" 
              variant="secondary" 
              onPress={() => router.push('/inventory')} 
            />
          </View>
        </View>
      </ScrollView>
      )}
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
    width: '100%',
    minHeight: 250,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
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

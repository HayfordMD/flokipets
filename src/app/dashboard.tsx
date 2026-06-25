import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BasePet } from '@/components/pets/BasePet';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Platform, Pressable, Modal, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ConnectButton } from "thirdweb/react";
import { client, appWallets } from '@/lib/thirdweb';
import { ACTIVE_CHAIN, MAX_OFFCHAIN_FLOKI } from "@/lib/constants";
import { useFlokiBalance } from '@/hooks/useFlokiBalance';
import { apiClient, showAlert } from '@/lib/utils';
import { useAppState } from '@/lib/globalState';

export default function DashboardScreen() {
  const router = useRouter();
  const { refreshAuth } = useAppState();
  const { flokiBalance: petFloki, ncbUser, loading, activeAccount, isAdmin } = useAuth();
  const { formattedBalance: onChainFloki, isLoading: isBalanceLoading } = useFlokiBalance();

  const displayBalance = activeAccount ? (isBalanceLoading ? "..." : onChainFloki) : petFloki;
  const isLimitReached = !activeAccount && petFloki >= MAX_OFFCHAIN_FLOKI;

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);

  const handleCopyWallet = async () => {
    if (activeAccount?.address) {
      await Clipboard.setStringAsync(activeAccount.address);
      showAlert('Success', 'Wallet address copied to clipboard!');
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient('/api/auth/sign-out', { method: 'POST' });
      refreshAuth();
      router.replace('/');
    } catch (e) {
      console.error(e);
    }
  };

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
          <Pressable style={{alignItems: 'flex-end'}} onPress={() => setIsWalletModalVisible(true)}>
            <Text style={styles.balanceText}>{displayBalance} {activeAccount ? 'FLOKI' : 'Pet-Floki'}</Text>
            {activeAccount && <Text style={{fontSize: 10, color: '#10B981'}}>On-Chain (opBNB)</Text>}
          </Pressable>
        </View>

        {isLimitReached && (
          <View style={{ backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#F87171', width: '100%', maxWidth: 400 }}>
            <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>⚠️ Pet-Floki Limit Reached!</Text>
            <Text style={{ color: '#991B1B', fontSize: 14 }}>You have reached the maximum off-chain limit of {MAX_OFFCHAIN_FLOKI} Pet-Floki. Connect a wallet to continue earning and claim your tokens.</Text>
          </View>
        )}

        <Card style={styles.petCard}>
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

        {/* Settings Gear Menu */}
        <View style={{ marginTop: 32, alignItems: 'center', width: '100%', position: 'relative' }}>
          <Pressable 
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            style={{ padding: 12, backgroundColor: 'white', borderRadius: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
          >
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          </Pressable>

          {isMenuOpen && (
            <View style={{ position: 'absolute', bottom: 60, backgroundColor: 'white', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, width: 250, alignItems: 'center', zIndex: 100 }}>
              {!activeAccount && (
                <View style={{ marginBottom: 16, width: '100%', alignItems: 'center' }}>
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
              )}
              {isAdmin && (
                <Pressable onPress={() => { setIsMenuOpen(false); router.push('/admin'); }} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#3B82F6', borderRadius: 8, width: '100%', marginBottom: 12 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>ADMIN</Text>
                </Pressable>
              )}
              <Pressable onPress={handleLogout} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#EF4444', borderRadius: 8, width: '100%' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>LOGOUT</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      )}

      {/* Wallet Modal */}
      <Modal
        visible={isWalletModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsWalletModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsWalletModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wallet Details</Text>
            {activeAccount ? (
              <>
                <Text style={styles.modalText}>Connected Address:</Text>
                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">{activeAccount.address}</Text>
                <Button title="Copy Address" onPress={handleCopyWallet} />
              </>
            ) : (
              <Text style={styles.modalText}>No wallet connected. You are playing off-chain.</Text>
            )}
            <Pressable style={{marginTop: 16}} onPress={() => setIsWalletModalVisible(false)}>
              <Text style={{color: '#EF4444', textAlign: 'center', fontWeight: 'bold'}}>Close</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  }
});

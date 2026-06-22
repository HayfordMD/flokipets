import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { ACTIVE_CHAIN, FLOKI_CONTRACT_ADDRESS, ADMIN_GAS_WALLET } from "@/lib/constants";
import { client } from "@/lib/thirdweb";

export default function MarketplaceScreen() {
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [burnAmount, setBurnAmount] = useState("");
  const [contributedGas, setContributedGas] = useState(0);

  const flokiContract = getContract({
    client,
    chain: ACTIVE_CHAIN,
    address: FLOKI_CONTRACT_ADDRESS,
  });

  const handleBurn = async () => {
    if (!activeAccount || !burnAmount || isNaN(Number(burnAmount)) || Number(burnAmount) <= 0) return;

    try {
      const transaction = transfer({
        contract: flokiContract,
        to: ADMIN_GAS_WALLET,
        amount: burnAmount,
      });

      sendTx(transaction, {
        onSuccess: () => {
          setContributedGas(prev => prev + Number(burnAmount));
          setBurnAmount("");
          Alert.alert("Success", `Successfully contributed ${burnAmount} FLOKI to generate game gas!`);
        },
        onError: (error) => {
          console.error("Burn failed:", error);
          Alert.alert("Error", "Failed to contribute FLOKI. Please try again.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Marketplace</Text>
        
        <View style={styles.burnerCard}>
          <Text style={styles.burnerTitle}>🔥 FLOKI Gas Generator</Text>
          <Text style={styles.burnerDesc}>
            Contribute FLOKI to power the game ecosystem. Your contribution generates gas that keeps Flokipets running and helps admin accounts cover network fees!
          </Text>

          {activeAccount ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Amount of FLOKI to contribute"
                value={burnAmount}
                onChangeText={setBurnAmount}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              
              <Button 
                title={isPending ? "Processing..." : "Contribute FLOKI"} 
                onPress={handleBurn} 
                variant="primary" 
                disabled={isPending || !burnAmount}
              />
              {isPending && <ActivityIndicator style={{marginTop: 8}} color="#FF8C00" />}
            </>
          ) : (
            <Text style={{color: '#DC2626', marginTop: 16, textAlign: 'center'}}>
              Please connect your wallet on the dashboard to use the Gas Generator.
            </Text>
          )}

          {contributedGas > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>You have contributed:</Text>
              <Text style={styles.statsValue}>{contributedGas} FLOKI</Text>
              <Text style={styles.statsText}>to power the game!</Text>
            </View>
          )}
        </View>

        <Button title="Back to Dashboard" onPress={() => router.push('/dashboard')} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6CC5FF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 24,
  },
  burnerCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  burnerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  burnerDesc: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  statsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    color: '#4B5563',
    fontSize: 14,
  },
  statsValue: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  }
});

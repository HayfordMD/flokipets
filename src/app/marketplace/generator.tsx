import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { ACTIVE_CHAIN, FLOKI_CONTRACT_ADDRESS } from "@/lib/constants";
import { client } from "@/lib/thirdweb";
import { useWeb3Transaction } from "@/hooks/useWeb3Transaction";
import { apiClient, showAlert } from '@/lib/utils';

// Fallback if not set in .env
const GENERATOR_CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_GENERATOR_ADDRESS || "0x0000000000000000000000000000000000000000";

export default function GeneratorScreen() {
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const { executeTx, isPending: isTxPending } = useWeb3Transaction();
  
  const [gasAmount, setGasAmount] = useState("");
  const [flokiAmount, setFlokiAmount] = useState("");
  const [convertAmount, setConvertAmount] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const generatorContract = getContract({
    client,
    chain: ACTIVE_CHAIN,
    address: GENERATOR_CONTRACT_ADDRESS,
  });

  const flokiContract = getContract({
    client,
    chain: ACTIVE_CHAIN,
    address: FLOKI_CONTRACT_ADDRESS,
  });

  // Example reading from contract (assuming public mapping or similar if we wanted, 
  // but here we just read the contract balance for gas)
  // For BNB balance, we'd need a different read, but let's mock the display for now
  // or just show user they are depositing.

  const handleDepositGas = () => {
    if (!activeAccount || !gasAmount || isNaN(Number(gasAmount)) || Number(gasAmount) <= 0) return;
    
    try {
      const amountInWei = BigInt(Number(gasAmount) * 10**18);
      const transaction = prepareContractCall({
        contract: generatorContract,
        method: "function depositGas() payable",
        params: [],
        value: amountInWei
      });

      executeTx(
        transaction,
        "Gas deposited successfully!",
        "Failed to deposit gas.",
        () => setGasAmount("")
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDepositFloki = () => {
    if (!activeAccount || !flokiAmount || isNaN(Number(flokiAmount)) || Number(flokiAmount) <= 0) return;
    // Note: requires approve first in a real scenario, or use transfer for simple vaults
    try {
      const amountInWei = BigInt(Number(flokiAmount) * 10**18);
      const transaction = prepareContractCall({
        contract: generatorContract,
        method: "function depositFloki(uint256 amount)",
        params: [amountInWei]
      });

      executeTx(
        transaction,
        "Floki deposited successfully!",
        "Failed to deposit Floki. Did you approve?",
        () => setFlokiAmount("")
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvert = async () => {
    if (!activeAccount || !convertAmount || isNaN(Number(convertAmount)) || Number(convertAmount) <= 0) return;
    
    setIsConverting(true);
    try {
      const data = await apiClient('/api/generator/convert', {
        method: 'POST',
        body: JSON.stringify({ amount: convertAmount })
      });
      
      showAlert("Success", `Converted! On-chain Tx: ${data.txHash}`);
      setConvertAmount("");
    } catch (error: any) {
      console.error("Conversion API error", error);
      showAlert("Error", error.message || "Network error occurred");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Generator Vault</Text>

        {!activeAccount && (
          <Text style={{color: '#DC2626', marginBottom: 16, textAlign: 'center'}}>
            Please connect your wallet on the dashboard.
          </Text>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⛽ Deposit Gas (BNB)</Text>
          <Text style={styles.cardDesc}>Fund the community burner with BNB to help cover network fees.</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount in BNB"
            value={gasAmount}
            onChangeText={setGasAmount}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Button 
            title={isTxPending ? "Processing..." : "Deposit Gas"} 
            onPress={handleDepositGas} 
            disabled={isTxPending || !gasAmount || !activeAccount} 
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Deposit Floki</Text>
          <Text style={styles.cardDesc}>Deposit on-chain Floki into the Vault reserve.</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount in Floki"
            value={flokiAmount}
            onChangeText={setFlokiAmount}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Button 
            title={isTxPending ? "Processing..." : "Deposit Floki"} 
            onPress={handleDepositFloki} 
            disabled={isTxPending || !flokiAmount || !activeAccount} 
            variant="secondary"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔄 Convert Off-Chain Floki</Text>
          <Text style={styles.cardDesc}>Convert your earned in-game Floki to real on-chain Floki directly to your wallet.</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount to convert"
            value={convertAmount}
            onChangeText={setConvertAmount}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Button 
            title={isConverting ? "Converting..." : "Convert to On-Chain"} 
            onPress={handleConvert} 
            disabled={isConverting || !convertAmount || !activeAccount} 
            variant="primary"
          />
          {isConverting && <ActivityIndicator style={{marginTop: 8}} color="#FF8C00" />}
        </View>

        <Button title="Back to Marketplace" onPress={() => router.push('/marketplace')} variant="secondary" style={{marginTop: 16}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#6CC5FF' },
  container: { alignItems: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FF8C00', marginBottom: 24 },
  card: {
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
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, textAlign: 'center' },
  cardDesc: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16, color: '#1F2937' },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { getPetImage } from '@/lib/pets';

export default function MintScreen() {
  const router = useRouter();
  const { flokiBalance, ncbUser, activeAccount } = useAuth();
  
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [petName, setPetName] = useState('');
  const [error, setError] = useState('');

  const fetchPets = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/data/read/pets`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPets(data);
      }
    } catch (e) {
      console.error("Failed to load pets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ncbUser) {
      fetchPets();
    } else {
      setLoading(false);
    }
  }, [ncbUser]);

  const cost = pets.length === 0 ? 1 : 1000000;

  const handleMint = async () => {
    if (!petName.trim()) {
      setError("Please give your pet a name!");
      return;
    }
    
    setMinting(true);
    setError('');

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/pets/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petName: petName.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to mint pet");
      }

      setPetName('');
      // Refresh pets
      fetchPets();
      
      if (Platform.OS !== 'web') {
        Alert.alert("Success!", "You minted a new FlokiPet!");
      } else {
        alert("Success! You minted a new FlokiPet!");
        // Refresh page to update balance in useAuth
        window.location.reload();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setMinting(false);
    }
  };

  if (!ncbUser && !activeAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontSize: 18, color: '#374151' }}>Please log in to mint pets.</Text>
          <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button variant="outline" title="← Back" onPress={() => router.back()} />
        <Text style={styles.balanceText}>Balance: {flokiBalance} FLOKI</Text>
      </View>

      <Card style={{ margin: 16 }}>
        <Text style={styles.title}>Mint a FlokiPet</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
        ) : (
          <View>
            <Text style={styles.subtitle}>
              You currently own {pets.length} pet{pets.length !== 1 && 's'}.
            </Text>
            
            <View style={styles.costBox}>
              <Text style={styles.costText}>Cost to Mint:</Text>
              <Text style={styles.costAmount}>{cost.toLocaleString()} FLOKI</Text>
              {pets.length === 0 && (
                <Text style={styles.costNote}>Special price for your very first pet!</Text>
              )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.label}>Name your new pet:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sparky"
              value={petName}
              onChangeText={setPetName}
              editable={!minting}
            />

            <Button 
              title={minting ? "Minting..." : "Mint Pet"} 
              onPress={handleMint}
              disabled={minting || flokiBalance < cost}
              style={{ marginTop: 10 }}
            />
          </View>
        )}
      </Card>

      {/* Show existing pets */}
      {!loading && pets.length > 0 && (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.title}>Your Pets</Text>
          {pets.map(pet => (
            <Card key={pet.id} style={styles.petCard}>
              <Image 
                source={getPetImage(pet.image_id)} 
                style={styles.petImage} 
                resizeMode="contain"
              />
              <View>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petDate}>Born: {new Date(pet.created_at).toLocaleDateString()}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 10 
  },
  balanceText: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#4B5563', marginBottom: 20 },
  costBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center'
  },
  costText: { fontSize: 14, color: '#3B82F6', fontWeight: 'bold' },
  costAmount: { fontSize: 28, color: '#1D4ED8', fontWeight: '900', marginVertical: 4 },
  costNote: { fontSize: 12, color: '#F59E0B', fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16
  },
  errorText: { color: '#EF4444', marginBottom: 12, textAlign: 'center' },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#E5E7EB'
  },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  petDate: { fontSize: 12, color: '#6B7280', marginTop: 4 }
});

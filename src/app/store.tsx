import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function StoreScreen() {
  const router = useRouter();
  const { flokiBalance, ncbUser, activeAccount } = useAuth();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/data/read/items");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (e) {
      console.error("Failed to load store items", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePurchase = async (itemId: string, itemName: string) => {
    setPurchasing(itemId);
    try {
      const res = await fetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to purchase item");
      }
      
      if (Platform.OS !== 'web') {
        Alert.alert("Success!", `You bought ${itemName}!`);
      } else {
        alert(`Success! You bought ${itemName}!`);
        window.location.reload();
      }
    } catch (e: any) {
      if (Platform.OS !== 'web') {
        Alert.alert("Error", e.message);
      } else {
        alert("Error: " + e.message);
      }
    } finally {
      setPurchasing(null);
    }
  };

  if (!ncbUser && !activeAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontSize: 18, color: '#374151' }}>Please log in to use the store.</Text>
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

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Floki Store</Text>
        <Text style={styles.subtitle}>Buy food and toys for your pets!</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>The store is currently empty.</Text>
        ) : (
          items.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageEmoji}>
                    {item.type === 'food' ? '🍖' : '🎾'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price} FLOKI</Text>
                </View>
              </View>
              
              <Button 
                title={purchasing === item.id ? "..." : "Buy"}
                onPress={() => handlePurchase(item.id, item.name)}
                disabled={purchasing !== null || flokiBalance < item.price}
                style={styles.buyButton}
              />
            </Card>
          ))
        )}
      </ScrollView>
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
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 16, color: '#4B5563', marginBottom: 20 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 20 },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#EFF6FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  imageEmoji: {
    fontSize: 24
  },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  itemPrice: { fontSize: 14, color: '#10B981', fontWeight: 'bold', marginTop: 4 },
  buyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 0
  }
});

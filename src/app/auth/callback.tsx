import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AuthCallback() {
  const router = useRouter();
  
  useEffect(() => { 
    router.replace("/"); 
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Authenticating...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#6CC5FF" 
  },
  text: { 
    fontSize: 20, 
    color: "#1E3A8A", 
    fontWeight: "bold" 
  }
});

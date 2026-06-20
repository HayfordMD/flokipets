import React from 'react';
import { View, StyleSheet } from 'react-native';
import SlotMachine from '../../features/games/SlotMachine';

export default function SlotsSandboxScreen() {
  return (
    <View style={styles.container}>
      <SlotMachine />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Ensure safe area is dark
  },
});

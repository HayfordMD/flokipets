import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { GlassView } from 'expo-glass-effect'; // assuming this exists from dependencies

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, style, ...props }: CardProps) => {
  // If we are on web, we can just use a View with our global glass CSS class
  // For cross-platform, we use GlassView if available, else a styled View
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.card, style]} {...props}>
        <div className="glass" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRadius: 16, zIndex: -1 }} />
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.card, style]} {...props}>
      <GlassView style={{...StyleSheet.absoluteFill}} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    padding: 24,
    marginVertical: 10,
    overflow: 'hidden',
    position: 'relative',
    // Fallback if glass class fails
    backgroundColor: '#FFFFFF',
    borderColor: '#E0F2FE',
    borderWidth: 4,
  },
});

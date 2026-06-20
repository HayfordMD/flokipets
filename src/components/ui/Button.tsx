import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, Platform } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        isOutline && styles.outline,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      <Text
        style={[
          styles.text,
          isPrimary && styles.textPrimary,
          isOutline && styles.textOutline,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999, // Pill shape
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderWidth: 3,
  },
  primary: {
    backgroundColor: '#FFD13B',
    borderColor: '#F59E0B',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 6px 0 #D97706',
      transform: [{ translateY: -2 }],
    } : {
      elevation: 5,
    }),
  },
  secondary: {
    backgroundColor: '#84CC16',
    borderColor: '#65A30D',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 6px 0 #2563EB',
      transform: [{ translateY: -2 }],
    } : {}),
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: Platform.OS === 'web' ? 'var(--font-display)' : undefined,
  },
  textPrimary: {
    color: '#78350F', // Dark warm brown text
  },
  textOutline: {
    color: '#1D4ED8', // Deep blue
  },
});

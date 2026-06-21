import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export const TopNavBar = () => {
  const { ncbUser, activeAccount } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!ncbUser && !activeAccount) {
    return null; // Don't show if not logged in
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      if (Platform.OS === 'web') {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {ncbUser ? (
          <View style={{ position: 'relative', zIndex: 50 }}>
            <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Text style={styles.text}>
                👤 {ncbUser.name ? ncbUser.name.split(' ')[0] : ncbUser.email}
              </Text>
            </TouchableOpacity>
            {isDropdownOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : activeAccount ? (
          <Text style={styles.text}>
            👛 {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E3A8A', // Deep blue
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    } : {
      elevation: 3,
    }),
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 8,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

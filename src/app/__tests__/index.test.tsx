import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import HomeScreen from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mock useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    activeAccount: null,
    ncbUser: null,
    isOffChain: false,
    flokiBalance: 0
  })
}));

// Mock thirdweb
jest.mock('thirdweb/react', () => ({
  ConnectButton: () => null
}));
jest.mock('thirdweb/wallets', () => ({
  createWallet: jest.fn()
}));
jest.mock('@/lib/thirdweb', () => ({
  client: {}
}));

// Mock router
jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    useRouter: () => ({
      replace: jest.fn()
    }),
    Link: ({ children }: any) => <Text>{children}</Text>
  };
});

// Mock fetch for the providers call
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ providers: { email: true } }),
    ok: true,
  })
) as jest.Mock;

describe('HomeScreen - Remember Me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('renders Remember me checkbox', async () => {
    await render(<HomeScreen />);
    const checkbox = screen.getByLabelText('Remember me');
    expect(checkbox).toBeTruthy();
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it('toggles Remember me state and saves to AsyncStorage', async () => {
    await render(<HomeScreen />);
    const checkbox = screen.getByLabelText('Remember me');
    
    // Initially false
    expect(checkbox.props.accessibilityState.checked).toBe(false);

    // Toggle on
    fireEvent.press(checkbox);
    
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('rememberMe', 'true');
    });
    // Checkbox state will be true
    expect(checkbox.props.accessibilityState.checked).toBe(true);

    // Toggle off
    fireEvent.press(checkbox);
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('rememberMe', 'false');
    });
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it('initializes Remember me state from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
    await render(<HomeScreen />);
    
    await waitFor(() => {
      const checkbox = screen.getByLabelText('Remember me');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../index';

// Mock the router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
  Link: 'mock-link',
}));

// Mock thirdweb
jest.mock('thirdweb/react', () => ({
  ConnectButton: () => <mock-connect-button />
}));

jest.mock('thirdweb/wallets', () => ({
  createWallet: jest.fn(),
}));

jest.mock('@/lib/thirdweb', () => ({
  client: {},
}));

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Feature: User Login Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Scenario: Successful login redirects to dashboard', () => {
    it('Given the user logs in and useAuth returns ncbUser', () => {
      mockUseAuth.mockReturnValue({
        ncbUser: { email: 'test@example.com' },
        activeAccount: null,
        flokiBalance: 0,
        isOffChain: true
      });

      render(<HomeScreen />);

      // Then the user should be automatically routed to "/dashboard"
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });

    it('Given the user logs in with wallet (activeAccount)', () => {
      mockUseAuth.mockReturnValue({
        ncbUser: null,
        activeAccount: { address: '0x123' },
        flokiBalance: 100,
        isOffChain: false
      });

      render(<HomeScreen />);

      // Then the user should be automatically routed to "/dashboard"
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });

    it('Given the user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        ncbUser: null,
        activeAccount: null,
        flokiBalance: 0,
        isOffChain: false
      });

      render(<HomeScreen />);

      // Then the router should NOT replace the screen
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});

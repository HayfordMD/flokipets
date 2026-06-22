import React from 'react';
import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../dashboard';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock BasePet to avoid rendering complex nested SVG/components in simple tests
jest.mock('@/components/pets/BasePet', () => {
  const { View } = require('react-native');
  return { BasePet: () => <View testID="base-pet-mock" /> };
});

describe('Feature: Dashboard Interface', () => {
  beforeEach(() => {
    mockPush.mockClear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Scenario: Viewing the dashboard features with a pet', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        flokiBalance: 500,
        ncbUser: { pets: [{ id: 1, name: 'Floki' }] }
      });
    });

    it('Given the user is logged in and has a pet', async () => {
      await render(<DashboardScreen />);
      
      // Then the user should see an image of their pet
      expect(screen.getByTestId('base-pet-mock')).toBeTruthy();
      expect(screen.getByText('Your Pet')).toBeTruthy();

      // And the user should see their Pet Status and Profile
      expect(screen.getByText('Hunger: 80%')).toBeTruthy();
      expect(screen.getByText('Energy: 60%')).toBeTruthy();
      expect(screen.getByText('Happiness: 90%')).toBeTruthy();
      expect(screen.getByText('Level 1 • Novice')).toBeTruthy();

      // And the user should see buttons linking to various features
      expect(screen.getByText('🛍 Shop')).toBeTruthy();
      expect(screen.getByText('🎮 Games')).toBeTruthy();
      expect(screen.getByText('🏪 Marketplace')).toBeTruthy();
      expect(screen.getByText('👥 Friends')).toBeTruthy();
      expect(screen.getByText('🏦 Bank')).toBeTruthy();
      expect(screen.getByText('🎒 Inventory')).toBeTruthy();
    });

    it('routes correctly when navigation buttons are clicked', async () => {
      await render(<DashboardScreen />);
      
      fireEvent.press(screen.getByText('🛍 Shop'));
      expect(mockPush).toHaveBeenCalledWith('/shop');
      
      fireEvent.press(screen.getByText('🎮 Games'));
      expect(mockPush).toHaveBeenCalledWith('/games');
      
      fireEvent.press(screen.getByText('🏪 Marketplace'));
      expect(mockPush).toHaveBeenCalledWith('/marketplace');
      
      fireEvent.press(screen.getByText('👥 Friends'));
      expect(mockPush).toHaveBeenCalledWith('/friends');
      
      fireEvent.press(screen.getByText('🏦 Bank'));
      expect(mockPush).toHaveBeenCalledWith('/bank');
      
      fireEvent.press(screen.getByText('🎒 Inventory'));
      expect(mockPush).toHaveBeenCalledWith('/inventory');
    });
  });

  describe('Scenario: Viewing the dashboard features without a pet', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        flokiBalance: 500,
        ncbUser: { pets: [] }
      });
    });

    it('Given the user is logged in but has no pet', async () => {
      const { getByText, queryByTestId } = await render(<DashboardScreen />);
      
      // Then the user should NOT see an image of their pet
      expect(queryByTestId('base-pet-mock')).toBeNull();

      // But should see the Create your first pet button
      await waitFor(() => {
        expect(getByText(/Create your first pet/i)).toBeTruthy();
      });
    });
  });
});


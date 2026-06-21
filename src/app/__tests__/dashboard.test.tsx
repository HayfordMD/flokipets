import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../dashboard';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock BasePet to avoid rendering complex nested SVG/components in simple tests
jest.mock('@/components/pets/BasePet', () => ({
  BasePet: () => <mock-base-pet testID="base-pet-mock" />
}));

describe('Feature: Dashboard Interface', () => {
  describe('Scenario: Viewing the dashboard features with a pet', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        flokiBalance: 500,
        ncbUser: { pets: [{ id: 1, name: 'Floki' }] }
      });
    });

    it('Given the user is logged in and has a pet', () => {
      const { getByText, getByTestId } = render(<DashboardScreen />);
      
      // Then the user should see an image of their pet
      expect(getByTestId('base-pet-mock')).toBeTruthy();
      expect(getByText('Your Pet')).toBeTruthy();

      // And the user should see buttons linking to various features
      expect(getByText('🛍 Shop')).toBeTruthy();
      expect(getByText('🎮 Game')).toBeTruthy();
      expect(getByText('🏪 Marketplace')).toBeTruthy();
      expect(getByText('👥 Friends')).toBeTruthy();
      expect(getByText('🏦 Bank')).toBeTruthy();
    });
  });

  describe('Scenario: Viewing the dashboard features without a pet', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        flokiBalance: 500,
        ncbUser: { pets: [] }
      });
    });

    it('Given the user is logged in but has no pet', () => {
      const { getByText, queryByTestId } = render(<DashboardScreen />);
      
      // Then the user should NOT see an image of their pet
      expect(queryByTestId('base-pet-mock')).toBeNull();

      // But should see the Create your first pet button
      expect(getByText('🐾 Create your first pet')).toBeTruthy();
    });
  });
});

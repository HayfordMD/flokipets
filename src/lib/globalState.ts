import { create } from 'zustand';

interface AppState {
  shouldRefreshAuth: boolean;
  refreshAuth: () => void;
}

export const useAppState = create<AppState>((set) => ({
  shouldRefreshAuth: false,
  refreshAuth: () => set((state) => ({ shouldRefreshAuth: !state.shouldRefreshAuth })),
}));

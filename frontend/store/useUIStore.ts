import { create } from 'zustand';
import type { UIState } from '@/types';

/**
 * Global UI State Store
 * Manages loading states, errors, and UI preferences
 */
export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  error: null,
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

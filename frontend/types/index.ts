/**
 * Type Definitions for Frontend
 * Re-exports all type modules for convenient importing
 */

// Phase 2 Type Modules
export * from './partition';
export * from './schedule';
export * from './manual';
export * from './export';
export * from './speed';

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface VideoData {
  id: string;
  title: string;
  duration: number;
}

export interface SpeedDurations {
  '1': string;
  '1.25': string;
  '1.5': string;
  '1.75': string;
  '2': string;
}

export interface PlaylistData {
  title: string;
  videoCount: number;
  totalDuration: number;
  totalDurationFormatted: string;
  averageVideoLength: number;
  averageVideoLengthFormatted: string;
  speeds: SpeedDurations;
  videos?: VideoData[];
}

// UI State Types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Speed Types
 * Data models for advanced speed features
 */

export interface SpeedComparison {
  speed: number;
  totalDuration: number; // in seconds
  timeSaved: number; // in seconds
  timeSavedPercentage: number;
  formattedDuration: string;
  formattedTimeSaved: string;
}

export interface SpeedRecommendation {
  recommendedSpeed: number;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
}

export const PRESET_SPEEDS = [1.0, 1.25, 1.5, 1.75, 2.0] as const;

export const SPEED_LABELS: Record<number, string> = {
  0.5: 'Half Speed',
  0.75: 'Slow',
  1.0: 'Normal',
  1.25: 'Slightly Fast',
  1.5: 'Fast (Recommended)',
  1.75: 'Very Fast',
  2.0: 'Maximum',
  2.5: 'Extreme',
} as const;

export const SPEED_CONFIG = {
  MIN_SPEED: 0.25,
  MAX_SPEED: 2.5,
  STEP: 0.05,
  DEFAULT: 1.5,
} as const;

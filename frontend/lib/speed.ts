/**
 * Speed Calculation Utilities
 * Advanced speed features with comparisons and recommendations
 */

import type { SpeedComparison, SpeedRecommendation } from '@/types/speed';
import { PRESET_SPEEDS } from '@/types/speed';
import { formatDurationText } from './partitioning';

/**
 * Calculate duration at various speeds with time saved metrics
 */
export function calculateSpeedComparisons(
  baseDurationSeconds: number
): SpeedComparison[] {
  return PRESET_SPEEDS.map(speed => {
    const adjustedDuration = Math.ceil(baseDurationSeconds / speed);
    const timeSaved = baseDurationSeconds - adjustedDuration;
    const timeSavedPercentage = ((timeSaved / baseDurationSeconds) * 100);
    
    return {
      speed,
      totalDuration: adjustedDuration,
      timeSaved,
      timeSavedPercentage,
      formattedDuration: formatDurationText(adjustedDuration),
      formattedTimeSaved: timeSaved > 0 ? formatDurationText(timeSaved) : '0m',
    };
  });
}

/**
 * Calculate custom speed duration
 */
export function calculateCustomSpeed(
  baseDurationSeconds: number,
  speed: number
): number {
  if (speed <= 0) return baseDurationSeconds;
  return Math.ceil(baseDurationSeconds / speed);
}

/**
 * Suggest optimal speed based on content characteristics
 * Basic heuristic - can be enhanced with ML in future
 */
export function suggestOptimalSpeed(
  averageVideoDuration: number, // in seconds
  _videoCount: number,
  totalDuration: number // in seconds
): SpeedRecommendation {
  const avgMinutes = averageVideoDuration / 60;
  
  // Heuristic logic:
  // 1. Very short videos (<5 min avg) → 1.25x (likely dense content)
  // 2. Medium videos (5-20 min) → 1.5x (good balance)
  // 3. Long videos (>20 min) → 1.75x (likely have padding)
  // 4. Very long playlists → lower speed (fatigue factor)
  
  let recommendedSpeed = 1.5;
  let reason = 'Balanced speed for most content';
  let confidence: 'low' | 'medium' | 'high' = 'medium';
  
  if (avgMinutes < 5) {
    recommendedSpeed = 1.25;
    reason = 'Shorter videos often have dense information';
    confidence = 'medium';
  } else if (avgMinutes > 20) {
    recommendedSpeed = 1.75;
    reason = 'Longer videos typically have more explanation and padding';
    confidence = 'medium';
  } else if (avgMinutes >= 5 && avgMinutes <= 15) {
    recommendedSpeed = 1.5;
    reason = 'Optimal speed for medium-length educational content';
    confidence = 'high';
  }
  
  // Adjust for very long playlists (fatigue factor)
  if (totalDuration > 36000) { // >10 hours
    recommendedSpeed = Math.max(1.25, recommendedSpeed - 0.25);
    reason += '. Reduced for longer playlists to maintain comprehension';
    confidence = confidence === 'high' ? 'medium' : 'low';
  }
  
  return {
    recommendedSpeed,
    reason,
    confidence,
  };
}

/**
 * Calculate time saved in a human-friendly format
 */
export function calculateTimeSaved(
  originalDuration: number,
  speed: number
): { saved: number; percentage: number; formatted: string } {
  const adjustedDuration = calculateCustomSpeed(originalDuration, speed);
  const saved = originalDuration - adjustedDuration;
  const percentage = (saved / originalDuration) * 100;
  
  return {
    saved,
    percentage,
    formatted: formatDurationText(saved),
  };
}

/**
 * Get fun comparison for time saved
 */
export function getTimeSavedComparison(secondsSaved: number): string {
  const minutes = Math.floor(secondsSaved / 60);
  const hours = Math.floor(secondsSaved / 3600);
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `That's ${days} day${days > 1 ? 's' : ''} of your life back!`;
  } else if (hours >= 2) {
    const episodes = Math.floor(hours / 0.75); // ~45 min per episode
    return `That's like ${episodes} Netflix episodes!`;
  } else if (minutes >= 30) {
    return `That's half an hour of your time saved!`;
  } else if (minutes >= 15) {
    return `That's a coffee break worth of time!`;
  } else {
    return `Every minute counts!`;
  }
}

/**
 * Format speed display (e.g., "1.5x")
 */
export function formatSpeed(speed: number): string {
  return `${speed.toFixed(2).replace(/\.?0+$/, '')}x`;
}

/**
 * Validate speed value
 */
export function isValidSpeed(speed: number): boolean {
  return speed > 0 && speed <= 3;
}

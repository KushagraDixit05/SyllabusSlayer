/**
 * Duration Calculator Utility
 * Handles duration parsing, formatting, and speed calculations
 */

/**
 * Parse ISO 8601 duration format (e.g., PT1H2M10S) to seconds
 */
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) {
    return 0;
  }
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to human-readable text (e.g., "2h 30m", "45m")
 */
export function formatDurationText(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 && hours === 0) { // Only show seconds if less than an hour
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ') || '0s';
}

/**
 * Calculate duration at different playback speeds
 */
export function calculateSpeedDurations(totalSeconds: number): import('../types').SpeedDurations {
  const speeds = [1, 1.25, 1.5, 1.75, 2] as const;
  
  return speeds.reduce((acc, speed) => {
    const adjustedSeconds = totalSeconds / speed;
    (acc as unknown as Record<string, string>)[speed.toString()] = formatDurationText(adjustedSeconds);
    return acc;
  }, {} as import('../types').SpeedDurations);
}

/**
 * Calculate average duration
 */
export function calculateAverage(total: number, count: number): number {
  return count > 0 ? Math.floor(total / count) : 0;
}

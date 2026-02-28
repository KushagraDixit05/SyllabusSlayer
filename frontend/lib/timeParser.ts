/**
 * Time Parser Utility
 * Parses various time format inputs into seconds
 */

import { TIME_PATTERNS } from '@/types/manual';

/**
 * Parse various time format inputs
 * Examples: "1h 30m", "90 minutes", "01:30:00", "5400", "1:30"
 * Returns duration in seconds or null if invalid
 */
export function parseTimeInput(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }
  
  const trimmed = input.trim();
  
  // Try HH:MM:SS format (e.g., "01:30:45")
  const hmsMatch = trimmed.match(TIME_PATTERNS.HMS);
  if (hmsMatch) {
    const hours = parseInt(hmsMatch[1], 10);
    const minutes = parseInt(hmsMatch[2], 10);
    const seconds = parseInt(hmsMatch[3], 10);
    
    if (minutes >= 60 || seconds >= 60) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // Try HH:MM or MM:SS format (e.g., "1:30")
  const hmMatch = trimmed.match(TIME_PATTERNS.HM);
  if (hmMatch) {
    const first = parseInt(hmMatch[1], 10);
    const second = parseInt(hmMatch[2], 10);
    
    // Assume HH:MM if first part is small, otherwise MM:SS
    if (first < 24 && second < 60) {
      return first * 3600 + second * 60; // HH:MM
    } else if (first < 1000 && second < 60) {
      return first * 60 + second; // MM:SS
    }
    return null;
  }
  
  // Try "Xh Ym" format (e.g., "1h 30m", "2 hours 45 minutes")
  const hoursMinutesMatch = trimmed.match(TIME_PATTERNS.HOURS_MINUTES);
  if (hoursMinutesMatch) {
    const hours = parseInt(hoursMinutesMatch[1], 10);
    const minutes = parseInt(hoursMinutesMatch[2], 10);
    return hours * 3600 + minutes * 60;
  }
  
  // Try hours only (e.g., "2h", "3 hours")
  const hoursMatch = trimmed.match(TIME_PATTERNS.HOURS_ONLY);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1], 10);
    return hours * 3600;
  }
  
  // Try minutes only (e.g., "90m", "45 minutes")
  const minutesMatch = trimmed.match(TIME_PATTERNS.MINUTES_ONLY) || 
                       trimmed.match(TIME_PATTERNS.NUMERIC_MINUTES);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1], 10);
    return minutes * 60;
  }
  
  // Try seconds only (e.g., "45s", "30 seconds")
  const secondsMatch = trimmed.match(TIME_PATTERNS.SECONDS_ONLY);
  if (secondsMatch) {
    const seconds = parseInt(secondsMatch[1], 10);
    return seconds;
  }
  
  // Try raw number (assume seconds)
  const rawMatch = trimmed.match(TIME_PATTERNS.RAW_SECONDS);
  if (rawMatch) {
    const seconds = parseInt(rawMatch[1], 10);
    // Sanity check: if too large, might be an error
    if (seconds < 86400) { // Less than 24 hours
      return seconds;
    }
  }
  
  return null;
}

/**
 * Validate time input
 */
export function isValidTimeInput(input: string): boolean {
  return parseTimeInput(input) !== null;
}

/**
 * Parse bulk entry line
 * Format: "Video Title | Duration"
 * Returns { title, duration, isValid, parsedDuration, error }
 */
export function parseBulkEntryLine(line: string): {
  title: string;
  duration: string;
  isValid: boolean;
  parsedDuration?: number;
  error?: string;
} {
  const trimmedLine = line.trim();
  
  if (!trimmedLine) {
    return {
      title: '',
      duration: '',
      isValid: false,
      error: 'Empty line',
    };
  }
  
  // Split by pipe character
  const parts = trimmedLine.split('|').map(p => p.trim());
  
  if (parts.length !== 2) {
    return {
      title: trimmedLine,
      duration: '',
      isValid: false,
      error: 'Missing separator "|". Format: Title | Duration',
    };
  }
  
  const [title, durationStr] = parts;
  
  if (!title) {
    return {
      title: '',
      duration: durationStr,
      isValid: false,
      error: 'Title is required',
    };
  }
  
  if (!durationStr) {
    return {
      title,
      duration: '',
      isValid: false,
      error: 'Duration is required',
    };
  }
  
  const parsedDuration = parseTimeInput(durationStr);
  
  if (parsedDuration === null) {
    return {
      title,
      duration: durationStr,
      isValid: false,
      parsedDuration: undefined,
      error: 'Invalid duration format',
    };
  }
  
  return {
    title,
    duration: durationStr,
    isValid: true,
    parsedDuration,
  };
}

/**
 * Get example format based on seconds
 */
export function getTimeFormatExample(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${secs}s`;
  }
}

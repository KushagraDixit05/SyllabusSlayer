/**
 * Manual Entry Types
 * Data models for manually added videos and templates
 */

export interface ManualVideo {
  id: string; // generated UUID
  title: string;
  duration: number; // in seconds
  source: 'manual';
  notes?: string;
  createdAt: Date;
}

export interface VideoTemplate {
  id: string;
  name: string;
  description?: string;
  videos: ManualVideo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkEntryRow {
  title: string;
  duration: string;
  isValid: boolean;
  parsedDuration?: number;
  error?: string;
}

// Time format examples for user guidance
export const TIME_FORMAT_EXAMPLES = [
  '1h 30m',
  '90 minutes',
  '01:30:00',
  '5400 (seconds)',
  '1:30',
] as const;

// Regex patterns for time parsing
export const TIME_PATTERNS = {
  HMS: /^(\d{1,2}):(\d{2}):(\d{2})$/,  // HH:MM:SS
  HM: /^(\d{1,2}):(\d{2})$/,            // HH:MM or MM:SS
  HOURS_MINUTES: /^(\d+)\s*h(?:our)?s?\s*(\d+)\s*m(?:in)?(?:ute)?s?$/i,  // Xh Ym
  HOURS_ONLY: /^(\d+)\s*h(?:our)?s?$/i,  // Xh
  MINUTES_ONLY: /^(\d+)\s*m(?:in)?(?:ute)?s?$/i,  // Xm
  SECONDS_ONLY: /^(\d+)\s*s(?:ec)?(?:ond)?s?$/i,  // Xs
  NUMERIC_MINUTES: /^(\d+)\s*minutes?$/i,  // X minutes
  NUMERIC_HOURS: /^(\d+)\s*hours?$/i,  // X hours
  RAW_SECONDS: /^(\d+)$/,  // Just a number (seconds)
} as const;

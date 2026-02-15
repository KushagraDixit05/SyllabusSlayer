/**
 * Partition Types
 * Data models for the intelligent partitioning system
 */

export interface Video {
  id: string;
  title: string;
  duration: number; // in seconds
  thumbnail?: string;
  source: 'youtube' | 'manual';
}

export interface Partition {
  id: string;
  sessionNumber: number;
  videos: Video[];
  duration: number; // in seconds (alias for totalDuration for component compatibility)
  totalDuration: number; // in seconds
  startVideoIndex: number;
  endVideoIndex: number;
  startTime: string; // formatted time (e.g., "0:00")
  endTime: string; // formatted time (e.g., "3:47:00")
  breakAfter?: number; // break duration in minutes after this session
}

export interface PartitionConfig {
  sessionLength: number; // in minutes
  breakDuration: number; // in minutes
  respectVideoBreaks: boolean;
}

export interface PartitionSummary {
  totalSessions: number;
  averageSessionLength: number; // in minutes
  shortestSession: number; // in minutes
  longestSession: number; // in minutes
}

// Preset session lengths in minutes
export const PARTITION_PRESETS = [
  { minutes: 60, label: 'Short' },
  { minutes: 90, label: 'Medium' },
  { minutes: 120, label: 'Standard' },
  { minutes: 180, label: 'Long' },
  { minutes: 240, label: 'Extended' },
] as const;

export const DEFAULT_PARTITION_CONFIG: PartitionConfig = {
  sessionLength: 120, // 2 hours default
  breakDuration: 10, // 10 minute breaks
  respectVideoBreaks: true,
};

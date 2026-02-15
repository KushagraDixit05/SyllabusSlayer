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
  sessionNumber: number;
  videos: Video[];
  totalDuration: number; // in seconds
  startVideoIndex: number;
  endVideoIndex: number;
  startTime: string; // formatted time (e.g., "0:00")
  endTime: string; // formatted time (e.g., "3:47:00")
}

export interface PartitionConfig {
  targetSessionLength: number; // in minutes
  allowVideoSplitting: boolean;
  preferEvenSessions: boolean;
}

export interface PartitionSummary {
  totalSessions: number;
  averageSessionLength: number; // in minutes
  shortestSession: number; // in minutes
  longestSession: number; // in minutes
}

// Preset session lengths in minutes
export const SESSION_LENGTH_PRESETS = [
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
] as const;

export const DEFAULT_PARTITION_CONFIG: PartitionConfig = {
  targetSessionLength: 120, // 2 hours default
  allowVideoSplitting: false,
  preferEvenSessions: true,
};

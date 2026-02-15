/**
 * Partitioning Algorithm
 * Intelligently breaks playlists into study sessions
 */

import type { Video, Partition, PartitionConfig, PartitionSummary } from '@/types/partition';
import { generateId } from './helpers';

/**
 * Format duration in seconds to readable time string
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
 * Format duration to human-readable text (e.g., "2h 30m")
 */
export function formatDurationText(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (parts.length === 0) {
    parts.push('< 1m');
  }
  
  return parts.join(' ');
}

/**
 * Create intelligent partitions from video list
 * Algorithm respects video boundaries and tries to balance session lengths
 */
export function createPartitions(
  videos: Video[],
  config: PartitionConfig
): Partition[] {
  if (videos.length === 0) {
    return [];
  }
  
  const targetSeconds = config.sessionLength * 60;
  const breakDuration = config.breakDuration || 0;
  const partitions: Partition[] = [];
  let currentSession: Video[] = [];
  let currentDuration = 0;
  let sessionNumber = 1;
  let startVideoIndex = 0;
  let startTime = 0;
  
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const wouldExceed = currentDuration + video.duration > targetSeconds;
    
    // Decision logic:
    // 1. If adding this video would exceed target, check how much
    // 2. If overshoot is less than undershoot, include it
    // 3. Otherwise, close current session and start new one
    
    if (wouldExceed && currentSession.length > 0) {
      const overshoot = (currentDuration + video.duration) - targetSeconds;
      const undershoot = targetSeconds - currentDuration;
      
      // Prefer including video if overshoot is less than undershoot
      // Unless user prefers even sessions
      const shouldInclude = overshoot < undershoot;
      
      if (shouldInclude) {
        currentSession.push(video);
        currentDuration += video.duration;
      }
      
      // Close current session
      partitions.push({
        id: generateId(),
        sessionNumber,
        videos: [...currentSession],
        duration: currentDuration,
        totalDuration: currentDuration,
        startVideoIndex,
        endVideoIndex: startVideoIndex + currentSession.length - 1,
        startTime: formatDuration(startTime),
        endTime: formatDuration(startTime + currentDuration),
        breakAfter: breakDuration,
      });
      
      // Start new session
      sessionNumber++;
      startVideoIndex = i;
      if (shouldInclude) {
        currentSession = [];
        currentDuration = 0;
        startTime += currentDuration;
        // Don't add video again, it was included in previous session
      } else {
        currentSession = [video];
        currentDuration = video.duration;
        startTime = partitions.reduce((sum, p) => sum + p.totalDuration, 0);
      }
    } else {
      // Add video to current session
      currentSession.push(video);
      currentDuration += video.duration;
    }
  }
  
  // Add final session if it has videos
  if (currentSession.length > 0) {
    partitions.push({
      id: generateId(),
      sessionNumber,
      videos: currentSession,
      duration: currentDuration,
      totalDuration: currentDuration,
      startVideoIndex,
      endVideoIndex: startVideoIndex + currentSession.length - 1,
      startTime: formatDuration(startTime),
      endTime: formatDuration(startTime + currentDuration),
      breakAfter: 0, // No break after final session
    });
  }
  
  return partitions;
}

/**
 * Calculate optimal session length suggestions based on total duration
 */
export function suggestSessionLengths(totalDurationMinutes: number): number[] {
  const suggestions: number[] = [];
  
  if (totalDurationMinutes <= 120) {
    // Short playlists: suggest completing in 1-2 sessions
    suggestions.push(60, totalDurationMinutes);
  } else if (totalDurationMinutes <= 360) {
    // Medium playlists: suggest 1-3 hour sessions
    suggestions.push(60, 90, 120, 180);
  } else if (totalDurationMinutes <= 720) {
    // Long playlists: suggest 2-4 hour sessions
    suggestions.push(120, 180, 240);
  } else {
    // Very long playlists: suggest 3-6 hour sessions
    suggestions.push(180, 240, 300, 360);
  }
  
  // Remove duplicates and sort
  return [...new Set(suggestions)].sort((a, b) => a - b);
}

/**
 * Format partition summary for display
 */
export function formatPartitionSummary(partition: Partition): string {
  const videoRange = partition.startVideoIndex === partition.endVideoIndex
    ? `Video ${partition.startVideoIndex + 1}`
    : `Videos ${partition.startVideoIndex + 1}-${partition.endVideoIndex + 1}`;
  
  return `Session ${partition.sessionNumber}: ${videoRange} (${formatDurationText(partition.totalDuration)})`;
}

/**
 * Calculate partition statistics
 */
export function calculatePartitionSummary(partitions: Partition[]): PartitionSummary {
  if (partitions.length === 0) {
    return {
      totalSessions: 0,
      averageSessionLength: 0,
      shortestSession: 0,
      longestSession: 0,
    };
  }
  
  const durations = partitions.map(p => p.totalDuration / 60); // Convert to minutes
  
  return {
    totalSessions: partitions.length,
    averageSessionLength: Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length),
    shortestSession: Math.round(Math.min(...durations)),
    longestSession: Math.round(Math.max(...durations)),
  };
}

/**
 * Estimate number of sessions for a given configuration
 */
export function estimateSessionCount(
  totalDurationMinutes: number,
  targetSessionLength: number
): number {
  return Math.ceil(totalDurationMinutes / targetSessionLength);
}

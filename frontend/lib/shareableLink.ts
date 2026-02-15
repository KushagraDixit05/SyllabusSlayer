/**
 * Shareable Link Utility
 * Encodes and decodes playlist state for sharing
 */

import type { ShareableState } from '@/types/export';

/**
 * Encode playlist state into URL-safe string
 */
export function encodePlaylistState(state: ShareableState): string {
  try {
    const json = JSON.stringify(state);
    // Use base64 encoding for URL safety
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64;
  } catch (error) {
    console.error('Failed to encode playlist state:', error);
    throw new Error('Failed to create shareable link');
  }
}

/**
 * Decode playlist state from URL string
 */
export function decodePlaylistState(encoded: string): Partial<ShareableState> {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const state = JSON.parse(json);
    
    // Validate that it has expected shape
    if (!state.videos || !Array.isArray(state.videos)) {
      throw new Error('Invalid state structure');
    }
    
    return state;
  } catch (error) {
    console.error('Failed to decode playlist state:', error);
    return {};
  }
}

/**
 * Generate shareable URL for current playlist state
 */
export function generateShareableURL(state: ShareableState): string {
  const encoded = encodePlaylistState(state);
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseURL}/shared/${encoded}`;
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableURL(state: ShareableState): Promise<boolean> {
  try {
    const url = generateShareableURL(state);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error(' to copy shareable URL:', error);
    return false;
  }
}

/**
 * Validate encoded state string
 */
export function isValidEncodedState(encoded: string): boolean {
  try {
    const decoded = decodePlaylistState(encoded);
    return !!decoded.videos && decoded.videos.length > 0;
  } catch {
    return false;
  }
}

/**
 * Create shareable state from current app state
 */
export function createShareableState(params: {
  videos: any[];
  partitionConfig?: any;
  scheduleConfig?: any;
  speed?: number;
}): ShareableState {
  return {
    videos: params.videos,
    partitionConfig: params.partitionConfig,
    scheduleConfig: params.scheduleConfig,
    speed: params.speed,
    timestamp: Date.now(),
  };
}

/**
 * Get share metadata for social sharing
 */
export function getShareMetadata(state: ShareableState): {
  title: string;
  text: string;
  url: string;
} {
  const videoCount = state.videos.length;
  const totalMinutes = state.videos.reduce((sum, v) => sum + (v.duration / 60), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  const durationText = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;
  
  return {
    title: 'My Study Plan - Syllabus Slayer',
    text: `Check out my study plan: ${videoCount} videos, ${durationText} of content!`,
    url: generateShareableURL(state),
  };
}

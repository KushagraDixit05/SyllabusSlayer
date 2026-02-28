import type { ApiResponse, PlaylistData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Fetch playlist data from backend API
 */
export async function fetchPlaylistData(input: string): Promise<PlaylistData> {
  const params = new URLSearchParams();
  
  // Determine if input is a URL or direct playlist ID
  if (input.includes('youtube.com') || input.includes('youtu.be')) {
    params.append('url', input);
  } else {
    params.append('playlistId', input);
  }
  
  const response = await fetch(`${API_URL}/api/playlist?${params.toString()}`);
  
  if (!response.ok) {
    const errorData: ApiResponse = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch playlist data');
  }
  
  const data: ApiResponse<PlaylistData> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error('Invalid response from server');
  }
  
  return data.data;
}

/**
 * Health check API endpoint
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data: ApiResponse = await response.json();
    return data.success;
  } catch {
    return false;
  }
}

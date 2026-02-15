import { useState } from 'react';
import { fetchPlaylistData } from '@/lib/api';
import { useUIStore } from '@/store/useUIStore';
import type { PlaylistData } from '@/types';

/**
 * Custom hook for playlist data fetching
 */
export function usePlaylist() {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const { setLoading, setError, clearError } = useUIStore();
  
  const fetchPlaylist = async (input: string) => {
    if (!input.trim()) {
      setError('Please enter a valid YouTube playlist URL or ID');
      return;
    }
    
    try {
      clearError();
      setLoading(true);
      const data = await fetchPlaylistData(input);
      setPlaylistData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch playlist');
      setPlaylistData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const clearPlaylist = () => {
    setPlaylistData(null);
    clearError();
  };
  
  return {
    playlistData,
    fetchPlaylist,
    clearPlaylist,
  };
}

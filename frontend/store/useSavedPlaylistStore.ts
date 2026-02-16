/**
 * Playlist Store - Enhanced with Database Persistence
 * Manages saved playlists synced with Supabase
 */

import { create } from 'zustand'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { userRepository } from '@/lib/repositories/userRepository'
import type { Playlist, Video } from '@/types/database'

interface SavedPlaylistState {
  // Database-synced playlists
  savedPlaylists: Playlist[]
  currentPlaylist: Playlist | null
  currentVideos: Video[]
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  error: string | null
  
  // Actions - Database operations
  loadUserPlaylists: (userId: string) => Promise<void>
  loadPlaylist: (playlistId: string) => Promise<void>
  saveCurrentPlaylist: (userId: string, playlistData: Omit<Playlist, 'id' | 'user_id' | 'created_at' | 'updated_at'>, videos: Omit<Video, 'id' | 'playlist_id' | 'created_at'>[]) => Promise<Playlist | null>
  deletePlaylist: (playlistId: string) => Promise<void>
  updatePlaylistProgress: (playlistId: string, percentage: number) => Promise<void>
  markPlaylistComplete: (playlistId: string) => Promise<void>
  
  // Actions - Local state
  setCurrentPlaylist: (playlist: Playlist | null) => void
  setCurrentVideos: (videos: Video[]) => void
  clearCurrent: () => void
  clearError: () => void
}

export const useSavedPlaylistStore = create<SavedPlaylistState>((set) => ({
  savedPlaylists: [],
  currentPlaylist: null,
  currentVideos: [],
  isLoading: false,
  isSaving: false,
  error: null,

  loadUserPlaylists: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const playlists = await playlistRepository.getByUserId(userId)
      set({ savedPlaylists: playlists, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load playlists', 
        isLoading: false 
      })
    }
  },

  loadPlaylist: async (playlistId: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await playlistRepository.getByIdWithVideos(playlistId)
      if (result) {
        set({
          currentPlaylist: result.playlist,
          currentVideos: result.videos,
          isLoading: false,
        })
      } else {
        set({ error: 'Playlist not found', isLoading: false })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load playlist', 
        isLoading: false 
      })
    }
  },

  saveCurrentPlaylist: async (userId, playlistData, videos) => {
    set({ isSaving: true, error: null })
    try {
      const result = await playlistRepository.createWithVideos(
        { ...playlistData, user_id: userId } as any,
        videos
      )
      
      if (result) {
        // Add to saved playlists
        set((state) => ({
          savedPlaylists: [result.playlist, ...state.savedPlaylists],
          currentPlaylist: result.playlist,
          currentVideos: result.videos,
          isSaving: false,
        }))

        // Update user stats
        const hoursPlanned = Math.floor((playlistData.total_duration || 0) / 3600)
        await userRepository.incrementPlaylistStats(userId, hoursPlanned)

        return result.playlist
      }
      
      set({ error: 'Failed to save playlist', isSaving: false })
      return null
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save playlist', 
        isSaving: false 
      })
      return null
    }
  },

  deletePlaylist: async (playlistId: string) => {
    set({ isLoading: true, error: null })
    try {
      const success = await playlistRepository.delete(playlistId)
      if (success) {
        set((state) => ({
          savedPlaylists: state.savedPlaylists.filter((p) => p.id !== playlistId),
          currentPlaylist: state.currentPlaylist?.id === playlistId ? null : state.currentPlaylist,
          currentVideos: state.currentPlaylist?.id === playlistId ? [] : state.currentVideos,
          isLoading: false,
        }))
      } else {
        set({ error: 'Failed to delete playlist', isLoading: false })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete playlist', 
        isLoading: false 
      })
    }
  },

  updatePlaylistProgress: async (playlistId: string, percentage: number) => {
    try {
      await playlistRepository.updateProgress(playlistId, percentage)
      set((state) => ({
        savedPlaylists: state.savedPlaylists.map((p) =>
          p.id === playlistId
            ? { ...p, completion_percentage: percentage, status: percentage === 100 ? 'completed' : 'in_progress' }
            : p
        ),
        currentPlaylist: state.currentPlaylist?.id === playlistId
          ? { ...state.currentPlaylist, completion_percentage: percentage, status: percentage === 100 ? 'completed' : 'in_progress' }
          : state.currentPlaylist,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update progress' })
    }
  },

  markPlaylistComplete: async (playlistId: string) => {
    try {
      await playlistRepository.markAsCompleted(playlistId)
      set((state) => ({
        savedPlaylists: state.savedPlaylists.map((p) =>
          p.id === playlistId
            ? { ...p, status: 'completed', completion_percentage: 100, completed_at: new Date().toISOString() }
            : p
        ),
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark complete' })
    }
  },

  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  setCurrentVideos: (videos) => set({ currentVideos: videos }),
  clearCurrent: () => set({ currentPlaylist: null, currentVideos: [] }),
  clearError: () => set({ error: null }),
}))

/**
 * Playlist Store - Enhanced with Database Persistence
 * Manages saved playlists synced with Supabase
 */

import { create } from 'zustand'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { userRepository } from '@/lib/repositories/userRepository'
import { achievementChecker } from '@/lib/achievements/checker'
import type { AchievementDefinition } from '@/lib/achievements/definitions'
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

  // Achievement notifications
  pendingAchievements: AchievementDefinition[]
  dismissAchievement: () => void

  // Actions - Database operations
  loadUserPlaylists: (userId: string) => Promise<void>
  loadPlaylist: (playlistId: string) => Promise<void>
  saveCurrentPlaylist: (userId: string, playlistData: Omit<Playlist, 'id' | 'user_id' | 'created_at' | 'updated_at'>, videos: Omit<Video, 'id' | 'playlist_id' | 'created_at'>[]) => Promise<Playlist | null>
  deletePlaylist: (playlistId: string) => Promise<void>
  updatePlaylistProgress: (playlistId: string, percentage: number) => Promise<void>
  markPlaylistComplete: (playlistId: string, userId?: string) => Promise<void>
  toggleVideoCompletion: (videoId: string, playlistId: string, isCompleted: boolean) => Promise<void>

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
  pendingAchievements: [],

  dismissAchievement: () =>
    set((state) => ({ pendingAchievements: state.pendingAchievements.slice(1) })),

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

        // Check for new achievements
        const newAchievements = await achievementChecker.checkAfterPlaylistCreated(userId)
        if (newAchievements.length > 0) {
          set((state) => ({
            pendingAchievements: [...state.pendingAchievements, ...newAchievements],
          }))
        }

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

  markPlaylistComplete: async (playlistId: string, userId?: string) => {
    try {
      await playlistRepository.markAsCompleted(playlistId)
      set((state) => ({
        savedPlaylists: state.savedPlaylists.map((p) =>
          p.id === playlistId
            ? { ...p, status: 'completed', completion_percentage: 100, completed_at: new Date().toISOString() }
            : p
        ),
      }))
      // Check for new achievements after completion
      if (userId) {
        await userRepository.incrementCompletedStats(userId, 0)
        const newAchievements = await achievementChecker.checkAfterPlaylistCompleted(userId)
        if (newAchievements.length > 0) {
          set((state) => ({
            pendingAchievements: [...state.pendingAchievements, ...newAchievements],
          }))
        }
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark complete' })
    }
  },

  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  setCurrentVideos: (videos) => set({ currentVideos: videos }),
  clearCurrent: () => set({ currentPlaylist: null, currentVideos: [] }),
  clearError: () => set({ error: null }),

  toggleVideoCompletion: async (videoId: string, playlistId: string, isCompleted: boolean) => {
    try {
      const updatedVideo = await playlistRepository.toggleVideoCompletion(videoId, isCompleted)
      if (!updatedVideo) {
        set({ error: 'Failed to update video' })
        return
      }

      // Update local currentVideos state
      const currentVideos = [...(useSavedPlaylistStore.getState().currentVideos)]
      const updatedVideos = currentVideos.map((v) =>
        v.id === videoId ? { ...v, is_completed: isCompleted, completed_at: isCompleted ? new Date().toISOString() : null } : v
      )
      set({ currentVideos: updatedVideos })

      // Recalculate and persist playlist progress
      const totalVideos = updatedVideos.length
      const completedCount = updatedVideos.filter((v) => v.is_completed).length
      const percentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0

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
      set({ error: error instanceof Error ? error.message : 'Failed to toggle video completion' })
    }
  },
}))

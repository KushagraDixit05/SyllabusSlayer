import { createClient } from '@/lib/supabase/client'
import type { Playlist, PlaylistInsert, PlaylistUpdate, Video, VideoInsert, VideoUpdate } from '@/types/database'

export class PlaylistRepository {
  private supabase = createClient()

  async create(data: PlaylistInsert): Promise<Playlist | null> {
    const { data: playlist, error } = await this.supabase
      .from('playlists')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating playlist:', error.message, error.details, error.hint)
      throw new Error(`Database error: ${error.message}`)
    }

    return playlist
  }

  async createWithVideos(
    playlistData: PlaylistInsert,
    videos: Omit<VideoInsert, 'playlist_id'>[]
  ): Promise<{ playlist: Playlist; videos: Video[] } | null> {
    // Create playlist first
    const playlist = await this.create(playlistData)
    if (!playlist) return null

    // Then create videos
    const videoData: VideoInsert[] = videos.map((v) => ({
      ...v,
      playlist_id: playlist.id,
    }))

    const { data: createdVideos, error: videosError } = await this.supabase
      .from('videos')
      .insert(videoData)
      .select()

    if (videosError) {
      console.error('Error creating videos:', videosError.message, videosError.details)
      // Roll back playlist creation if videos fail
      await this.delete(playlist.id)
      throw new Error(`Failed to save videos: ${videosError.message}`)
    }

    return { playlist, videos: createdVideos }
  }

  async getById(id: string): Promise<Playlist | null> {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching playlist:', error)
      return null
    }

    return data
  }

  async getByIdWithVideos(id: string): Promise<{ playlist: Playlist; videos: Video[] } | null> {
    const playlist = await this.getById(id)
    if (!playlist) return null

    const { data: videos, error } = await this.supabase
      .from('videos')
      .select('*')
      .eq('playlist_id', id)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching videos:', error)
      return null
    }

    return { playlist, videos }
  }

  async getByUserId(userId: string): Promise<Playlist[]> {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user playlists:', error)
      return []
    }

    return data
  }

  async getActivePlaylistsByUserId(userId: string): Promise<Playlist[]> {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['planning', 'in_progress'])
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching active playlists:', error)
      return []
    }

    return data
  }

  async update(id: string, updates: PlaylistUpdate): Promise<Playlist | null> {
    const { data, error } = await this.supabase
      .from('playlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating playlist:', error)
      return null
    }

    return data
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('playlists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting playlist:', error)
      return false
    }

    return true
  }

  async markAsCompleted(id: string): Promise<Playlist | null> {
    return this.update(id, {
      status: 'completed',
      completion_percentage: 100,
      completed_at: new Date().toISOString(),
    })
  }

  async updateProgress(id: string, percentage: number): Promise<Playlist | null> {
    const status = percentage === 100 ? 'completed' : 'in_progress'

    return this.update(id, {
      completion_percentage: percentage,
      status,
      ...(percentage === 100 && { completed_at: new Date().toISOString() }),
    })
  }

  async getVideosByPlaylistId(playlistId: string): Promise<Video[]> {
    const { data, error } = await this.supabase
      .from('videos')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching videos:', error)
      return []
    }

    return data
  }

  async toggleVideoCompletion(videoId: string, isCompleted: boolean): Promise<Video | null> {
    const updates: VideoUpdate = {
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    }

    const { data, error } = await this.supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling video completion:', error)
      return null
    }

    return data
  }
}

export const playlistRepository = new PlaylistRepository()

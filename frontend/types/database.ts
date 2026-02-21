// Database types based on schema
// Note: In production, generate these with: npx supabase gen types typescript

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          timezone: string
          preferred_speed: number
          theme_preference: string
          email_notifications: boolean
          total_playlists_created: number
          total_playlists_completed: number
          total_hours_planned: number
          total_hours_completed: number
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          leaderboard_opt_in: boolean
          leaderboard_username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          preferred_speed?: number
          theme_preference?: string
          email_notifications?: boolean
          total_playlists_created?: number
          total_playlists_completed?: number
          total_hours_planned?: number
          total_hours_completed?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          leaderboard_opt_in?: boolean
          leaderboard_username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          preferred_speed?: number
          theme_preference?: string
          email_notifications?: boolean
          total_playlists_created?: number
          total_playlists_completed?: number
          total_hours_planned?: number
          total_hours_completed?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          leaderboard_opt_in?: boolean
          leaderboard_username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          user_id: string
          youtube_playlist_id: string | null
          title: string
          description: string | null
          thumbnail_url: string | null
          source: string
          total_duration: number
          video_count: number
          average_video_duration: number | null
          playback_speed: number
          adjusted_duration: number | null
          status: string
          completion_percentage: number
          created_at: string
          updated_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          youtube_playlist_id?: string | null
          title: string
          description?: string | null
          thumbnail_url?: string | null
          source?: string
          total_duration: number
          video_count: number
          average_video_duration?: number | null
          playback_speed?: number
          adjusted_duration?: number | null
          status?: string
          completion_percentage?: number
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          youtube_playlist_id?: string | null
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          source?: string
          total_duration?: number
          video_count?: number
          average_video_duration?: number | null
          playback_speed?: number
          adjusted_duration?: number | null
          status?: string
          completion_percentage?: number
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
      }
      videos: {
        Row: {
          id: string
          playlist_id: string
          youtube_video_id: string | null
          title: string
          duration: number
          thumbnail_url: string | null
          position: number
          source: string
          notes: string | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          youtube_video_id?: string | null
          title: string
          duration: number
          thumbnail_url?: string | null
          position: number
          source?: string
          notes?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          youtube_video_id?: string | null
          title?: string
          duration?: number
          thumbnail_url?: string | null
          position?: number
          source?: string
          notes?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      partitions: {
        Row: {
          id: string
          playlist_id: string
          session_number: number
          start_video_index: number
          end_video_index: number
          total_duration: number
          video_count: number
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          session_number: number
          start_video_index: number
          end_video_index: number
          total_duration: number
          video_count: number
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          session_number?: number
          start_video_index?: number
          end_video_index?: number
          total_duration?: number
          video_count?: number
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          earned_at: string
          metadata: Record<string, any> | null
          is_shared: boolean
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          earned_at?: string
          metadata?: Record<string, any> | null
          is_shared?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          earned_at?: string
          metadata?: Record<string, any> | null
          is_shared?: boolean
        }
      }
    }
  }
}

export type Playlist = Database['public']['Tables']['playlists']['Row']
export type PlaylistInsert = Database['public']['Tables']['playlists']['Insert']
export type PlaylistUpdate = Database['public']['Tables']['playlists']['Update']

export type Video = Database['public']['Tables']['videos']['Row']
export type VideoInsert = Database['public']['Tables']['videos']['Insert']
export type VideoUpdate = Database['public']['Tables']['videos']['Update']

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type Achievement = Database['public']['Tables']['achievements']['Row']
export type AchievementInsert = Database['public']['Tables']['achievements']['Insert']

export type Partition = Database['public']['Tables']['partitions']['Row']
export type PartitionInsert = Database['public']['Tables']['partitions']['Insert']
export type PartitionUpdate = Database['public']['Tables']['partitions']['Update']

import { createClient } from '@/lib/supabase/client'
import type { UserProfile, UserProfileUpdate } from '@/types/database'

export class UserRepository {
  private supabase = createClient()

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  async updateProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  }

  async updateStreak(userId: string, newStreak: number): Promise<void> {
    const profile = await this.getProfile(userId)
    if (!profile) return

    const updates: UserProfileUpdate = {
      current_streak: newStreak,
      longest_streak: Math.max(profile.longest_streak || 0, newStreak),
      last_activity_date: new Date().toISOString().split('T')[0],
    }

    await this.updateProfile(userId, updates)
  }

  async incrementPlaylistStats(userId: string, hoursPlanned: number): Promise<void> {
    const profile = await this.getProfile(userId)
    if (!profile) return

    await this.updateProfile(userId, {
      total_playlists_created: (profile.total_playlists_created || 0) + 1,
      total_hours_planned: (profile.total_hours_planned || 0) + hoursPlanned,
    })
  }

  async incrementCompletedStats(userId: string, hoursCompleted: number): Promise<void> {
    const profile = await this.getProfile(userId)
    if (!profile) return

    await this.updateProfile(userId, {
      total_playlists_completed: (profile.total_playlists_completed || 0) + 1,
      total_hours_completed: (profile.total_hours_completed || 0) + hoursCompleted,
    })
  }

  async updateThemePreference(
    userId: string,
    theme: 'light' | 'dark' | 'system'
  ): Promise<void> {
    await this.updateProfile(userId, { theme_preference: theme })
  }
}

export const userRepository = new UserRepository()

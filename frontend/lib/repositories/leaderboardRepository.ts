import { createClient } from '@/lib/supabase/client'

export interface LeaderboardEntry {
  rank: number
  username: string
  value: number
  isCurrentUser?: boolean
}

export class LeaderboardRepository {
  private supabase = createClient()

  async getHoursLeaderboard(currentUserId?: string, limit = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, leaderboard_username, total_hours_planned')
      .eq('leaderboard_opt_in', true)
      .not('leaderboard_username', 'is', null)
      .order('total_hours_planned', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map((row, index) => ({
      rank: index + 1,
      username: row.leaderboard_username ?? 'Anonymous',
      value: Math.floor(row.total_hours_planned ?? 0),
      isCurrentUser: row.id === currentUserId,
    }))
  }

  async getStreakLeaderboard(currentUserId?: string, limit = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, leaderboard_username, longest_streak')
      .eq('leaderboard_opt_in', true)
      .not('leaderboard_username', 'is', null)
      .order('longest_streak', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map((row, index) => ({
      rank: index + 1,
      username: row.leaderboard_username ?? 'Anonymous',
      value: row.longest_streak ?? 0,
      isCurrentUser: row.id === currentUserId,
    }))
  }

  async getCompletionLeaderboard(currentUserId?: string, limit = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, leaderboard_username, total_playlists_completed')
      .eq('leaderboard_opt_in', true)
      .not('leaderboard_username', 'is', null)
      .order('total_playlists_completed', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map((row, index) => ({
      rank: index + 1,
      username: row.leaderboard_username ?? 'Anonymous',
      value: row.total_playlists_completed ?? 0,
      isCurrentUser: row.id === currentUserId,
    }))
  }
}

export const leaderboardRepository = new LeaderboardRepository()

import { createClient } from '@/lib/supabase/client'
import { levelForXp } from '@/lib/gamification/xpCurve'
import { tierForLevel } from '@/lib/gamification/tier'

export interface LeaderboardEntry {
  rank: number
  username: string
  value: number
  level: number
  tier: string
  isCurrentUser?: boolean
}

export type LeaderboardCategory = 'hours' | 'streak' | 'completion'

const CATEGORY_COLUMN: Record<LeaderboardCategory, string> = {
  hours: 'total_hours_planned',
  streak: 'longest_streak',
  completion: 'total_playlists_completed',
}

interface RawRow {
  id: string
  leaderboard_username: string | null
  xp: number | null
  value: number
}

export class LeaderboardRepository {
  private supabase = createClient()

  private async queryColumn(
    category: LeaderboardCategory,
    limit: number
  ): Promise<RawRow[]> {
    const column = CATEGORY_COLUMN[category]
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select(`id, leaderboard_username, xp, ${column}`)
      .eq('leaderboard_opt_in', true)
      .not('leaderboard_username', 'is', null)
      .order(column, { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return (data as unknown as Record<string, unknown>[]).map((row) => ({
      id: row.id as string,
      leaderboard_username: row.leaderboard_username as string | null,
      xp: row.xp as number | null,
      value: category === 'hours' ? Math.floor((row[column] as number) ?? 0) : ((row[column] as number) ?? 0),
    }))
  }

  private toEntry(row: RawRow, rank: number, currentUserId?: string): LeaderboardEntry {
    const level = levelForXp(row.xp ?? 0)
    return {
      rank,
      username: row.leaderboard_username ?? 'Anonymous',
      value: row.value,
      level,
      tier: tierForLevel(level),
      isCurrentUser: row.id === currentUserId,
    }
  }

  async getLeaderboard(
    category: LeaderboardCategory,
    currentUserId?: string,
    limit = 10
  ): Promise<LeaderboardEntry[]> {
    const rows = await this.queryColumn(category, limit)
    return rows.map((row, index) => this.toEntry(row, index + 1, currentUserId))
  }

  async getHoursLeaderboard(currentUserId?: string, limit = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard('hours', currentUserId, limit)
  }

  async getStreakLeaderboard(currentUserId?: string, limit = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard('streak', currentUserId, limit)
  }

  async getCompletionLeaderboard(currentUserId?: string, limit = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard('completion', currentUserId, limit)
  }

  /**
   * The current user's rank and score within a category, even when they
   * fall outside the top-N cut used for `getLeaderboard`. Returns null if
   * they aren't opted in / have no leaderboard username.
   */
  async getUserRank(
    category: LeaderboardCategory,
    userId: string
  ): Promise<{ rank: number; value: number } | null> {
    // Opted-in userbases are small; pulling the full ordered column and
    // finding the index is simpler and cheaper than a second count query.
    const rows = await this.queryColumn(category, 10000)
    const index = rows.findIndex((row) => row.id === userId)
    if (index === -1) return null
    return { rank: index + 1, value: rows[index].value }
  }
}

export const leaderboardRepository = new LeaderboardRepository()

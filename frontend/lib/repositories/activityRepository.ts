import { createClient } from '@/lib/supabase/client'

export type ActivityType =
  | 'playlist_created'
  | 'playlist_completed'
  | 'video_completed'
  | 'session_completed'
  | 'achievement_earned'
  | 'streak_milestone'
  | 'login'

export class ActivityRepository {
  private supabase = createClient()

  async logActivity(
    userId: string,
    activityType: ActivityType,
    options?: { durationSeconds?: number; data?: Record<string, any> }
  ): Promise<void> {
    const { error } = await this.supabase.from('activity_log').insert({
      user_id: userId,
      activity_type: activityType,
      duration_seconds: options?.durationSeconds ?? 0,
      activity_data: options?.data ?? null,
    })

    if (error) {
      console.error('Error logging activity:', error)
    }
  }

  /**
   * Activity counts per calendar day, for the contribution heatmap. Returns
   * only days that have at least one entry; the heatmap fills the gaps.
   */
  async getDailyActivityCounts(
    userId: string,
    days = 84
  ): Promise<Array<{ date: string; count: number }>> {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data, error } = await this.supabase
      .from('activity_log')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())

    if (error) {
      console.error('Error loading activity counts:', error)
      return []
    }

    const counts = new Map<string, number>()
    for (const row of data ?? []) {
      const day = new Date(row.created_at).toISOString().split('T')[0]
      counts.set(day, (counts.get(day) ?? 0) + 1)
    }

    return Array.from(counts, ([date, count]) => ({ date, count }))
  }
}

export const activityRepository = new ActivityRepository()

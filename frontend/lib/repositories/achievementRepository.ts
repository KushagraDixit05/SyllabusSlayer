import { createClient } from '@/lib/supabase/client'
import type { Achievement } from '@/types/database'

export class AchievementRepository {
  private supabase = createClient()

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }

    return data
  }

  async unlockAchievement(
    userId: string,
    achievementType: string,
    metadata?: Record<string, any>
  ): Promise<Achievement | null> {
    const { data, error } = await this.supabase
      .from('achievements')
      .insert({
        user_id: userId,
        achievement_type: achievementType,
        metadata,
      })
      .select()
      .single()

    if (error) {
      // Already unlocked (unique constraint)
      if (error.code === '23505') {
        return null
      }
      console.error('Error unlocking achievement:', error)
      return null
    }

    return data
  }

  async hasAchievement(userId: string, achievementType: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)
      .single()

    return !error && data !== null
  }

  async getAchievementCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) {
      console.error('Error counting achievements:', error)
      return 0
    }

    return count || 0
  }
}

export const achievementRepository = new AchievementRepository()

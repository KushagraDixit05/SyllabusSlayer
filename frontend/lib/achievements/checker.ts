import { achievementRepository } from '@/lib/repositories/achievementRepository'
import { userRepository } from '@/lib/repositories/userRepository'
import { ACHIEVEMENTS, type AchievementDefinition } from './definitions'

export class AchievementChecker {
  /**
   * Check if user has unlocked any new achievements
   */
  async checkAchievements(userId: string): Promise<AchievementDefinition[]> {
    const profile = await userRepository.getProfile(userId)
    if (!profile) return []

    const newAchievements: AchievementDefinition[] = []

    for (const achievement of ACHIEVEMENTS) {
      const hasAchievement = await achievementRepository.hasAchievement(
        userId,
        achievement.id
      )
      if (hasAchievement) continue

      const isMet = this.checkRequirement(achievement, profile)
      if (isMet) {
        const unlocked = await achievementRepository.unlockAchievement(
          userId,
          achievement.id,
          { points: achievement.points }
        )
        if (unlocked) {
          newAchievements.push(achievement)
        }
      }
    }

    return newAchievements
  }

  /**
   * Check if a specific achievement requirement is met
   */
  private checkRequirement(
    achievement: AchievementDefinition,
    profile: Record<string, unknown>
  ): boolean {
    const { type, threshold } = achievement.requirement

    switch (type) {
      case 'playlist_count':
        return ((profile.total_playlists_completed as number) || 0) >= threshold

      case 'hours_planned':
        return ((profile.total_hours_planned as number) || 0) >= threshold

      case 'hours_saved':
        // TODO: Implement based on actual speed-adjusted data
        return false

      case 'streak_days':
        return ((profile.current_streak as number) || 0) >= threshold

      case 'speed_mastery':
        // TODO: Requires playlist-level speed tracking
        return false

      default:
        return false
    }
  }

  async checkAfterPlaylistCreated(userId: string): Promise<AchievementDefinition[]> {
    const newAchievements = await this.checkAchievements(userId)
    if (newAchievements.length > 0) {
      this.logAchievements(userId, newAchievements)
    }
    return newAchievements
  }

  async checkAfterPlaylistCompleted(userId: string): Promise<AchievementDefinition[]> {
    const newAchievements = await this.checkAchievements(userId)
    if (newAchievements.length > 0) {
      this.logAchievements(userId, newAchievements)
    }
    return newAchievements
  }

  async checkAfterStreakUpdate(userId: string): Promise<AchievementDefinition[]> {
    const newAchievements = await this.checkAchievements(userId)
    if (newAchievements.length > 0) {
      this.logAchievements(userId, newAchievements)
    }
    return newAchievements
  }

  private logAchievements(userId: string, achievements: AchievementDefinition[]): void {
    console.log(`User ${userId} unlocked:`, achievements.map((a) => a.name))
  }
}

export const achievementChecker = new AchievementChecker()

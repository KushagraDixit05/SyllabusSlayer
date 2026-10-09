import { auth } from '@/lib/auth'
import { achievementRepository } from '@/lib/repositories/achievementRepository'
import { userRepository } from '@/lib/repositories/userRepository'
import { AchievementCard } from '@/components/achievements/AchievementCard'
import { AchievementsClientSection } from '@/components/achievements/AchievementsClientSection'
import { ACHIEVEMENTS, getAchievementsByCategory } from '@/lib/achievements/definitions'
import { PageHeader } from '@/components/dashboard/PageHeader'

export default async function AchievementsPage() {
  const session = await auth()
  const userId = session!.user.id

  const [userAchievements, userProfile] = await Promise.all([
    achievementRepository.getUserAchievements(userId),
    userRepository.getProfile(userId),
  ])

  const unlockedIds = new Set(userAchievements.map((a) => a.achievement_type))
  const earnedAtMap = new Map(
    userAchievements.map((a) => [a.achievement_type, a.earned_at])
  )

  const categories = ['milestone', 'streak', 'speed', 'volume'] as const
  const totalPoints = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id)).reduce(
    (sum, a) => sum + a.points,
    0
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Trophy Room"
        title="Achievements"
        description={`${unlockedIds.size} of ${ACHIEVEMENTS.length} unlocked • ${totalPoints} points earned`}
      />

      {/* Achievement categories */}
      {categories.map((category) => {
        const categoryAchievements = getAchievementsByCategory(category)
        const unlockedCount = categoryAchievements.filter((a) => unlockedIds.has(a.id)).length

        return (
          <section key={category}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-black tracking-tight">{category} Achievements</h2>
              <span className="text-sm text-muted-foreground">
                {unlockedCount}/{categoryAchievements.length}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedIds.has(achievement.id)}
                  earnedAt={earnedAtMap.get(achievement.id)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Client-side interactive section (modals + leaderboard) */}
      <AchievementsClientSection
        isLeaderboardOptedIn={userProfile?.leaderboard_opt_in ?? false}
      />
    </div>
  )
}

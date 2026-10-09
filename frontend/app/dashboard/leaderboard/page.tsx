import { auth } from '@/lib/auth'
import { userRepository } from '@/lib/repositories/userRepository'
import { leaderboardRepository, type LeaderboardCategory } from '@/lib/repositories/leaderboardRepository'
import { LeaderboardView } from '@/components/leaderboard/LeaderboardView'

export default async function LeaderboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const userProfile = await userRepository.getProfile(userId)
  const isOptedIn = userProfile?.leaderboard_opt_in ?? false

  const categories: LeaderboardCategory[] = ['hours', 'streak', 'completion']

  const data = Object.fromEntries(
    await Promise.all(
      categories.map(async (category) => {
        const [entries, userRank] = await Promise.all([
          leaderboardRepository.getLeaderboard(category, userId),
          isOptedIn ? leaderboardRepository.getUserRank(category, userId) : Promise.resolve(null),
        ])
        return [category, { entries, userRank }]
      })
    )
  ) as Record<LeaderboardCategory, { entries: Awaited<ReturnType<typeof leaderboardRepository.getLeaderboard>>; userRank: { rank: number; value: number } | null }>

  return (
    <LeaderboardView
      isOptedIn={isOptedIn}
      data={data}
    />
  )
}

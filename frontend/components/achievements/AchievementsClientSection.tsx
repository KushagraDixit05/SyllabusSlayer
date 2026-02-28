'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AchievementUnlockedModal } from '@/components/achievements/AchievementUnlockedModal'
import { OptInDialog } from '@/components/leaderboard/OptInDialog'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { userRepository } from '@/lib/repositories/userRepository'
import { leaderboardRepository } from '@/lib/repositories/leaderboardRepository'
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore'
import { Trophy } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/repositories/leaderboardRepository'

interface AchievementsClientSectionProps {
  isLeaderboardOptedIn: boolean
}

export function AchievementsClientSection({
  isLeaderboardOptedIn: initialOptedIn,
}: AchievementsClientSectionProps) {
  const { data: session } = useSession()
  const { pendingAchievements, dismissAchievement } = useSavedPlaylistStore()
  const [optInOpen, setOptInOpen] = useState(false)
  const [isOptedIn, setIsOptedIn] = useState(initialOptedIn)
  const [leaderboardData, setLeaderboardData] = useState<{
    hours: LeaderboardEntry[]
    streak: LeaderboardEntry[]
    completion: LeaderboardEntry[]
  } | null>(null)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  const currentAchievement = pendingAchievements[0] ?? null

  const handleOptIn = async (username: string) => {
    if (!session?.user?.id) return
    await userRepository.optInToLeaderboard(session.user.id, username)
    setIsOptedIn(true)
    loadLeaderboard()
  }

  const loadLeaderboard = async () => {
    if (!session?.user?.id) return
    setLoadingLeaderboard(true)
    const [hours, streak, completion] = await Promise.all([
      leaderboardRepository.getHoursLeaderboard(session.user.id),
      leaderboardRepository.getStreakLeaderboard(session.user.id),
      leaderboardRepository.getCompletionLeaderboard(session.user.id),
    ])
    setLeaderboardData({ hours, streak, completion })
    setLoadingLeaderboard(false)
  }

  // Auto-load leaderboard if opted in
  useState(() => {
    if (isOptedIn) {
      loadLeaderboard()
    }
  })

  return (
    <>
      {/* Achievement unlock modal */}
      <AchievementUnlockedModal
        achievement={currentAchievement}
        open={!!currentAchievement}
        onClose={dismissAchievement}
        onShare={() => {
          if (currentAchievement) {
            navigator.clipboard?.writeText(
              `I just unlocked "${currentAchievement.name}" on Syllabus Slayer! ${currentAchievement.icon}`
            )
          }
          dismissAchievement()
        }}
      />

      {/* Leaderboard section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>See how you rank against other learners</CardDescription>
            </div>
            {!isOptedIn && (
              <Button onClick={() => setOptInOpen(true)}>
                <Trophy className="mr-2 h-4 w-4" />
                Join Leaderboard
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isOptedIn ? (
            <div className="py-8 text-center text-muted-foreground">
              <Trophy className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium mb-1">You're not on the leaderboard yet</p>
              <p className="text-sm">Opt in to compete with other learners</p>
            </div>
          ) : loadingLeaderboard ? (
            <div className="py-8 text-center text-muted-foreground text-sm">Loading rankings…</div>
          ) : leaderboardData ? (
            <LeaderboardTable
              hoursLeaderboard={leaderboardData.hours}
              streakLeaderboard={leaderboardData.streak}
              completionLeaderboard={leaderboardData.completion}
            />
          ) : null}
        </CardContent>
      </Card>

      <OptInDialog
        open={optInOpen}
        onClose={() => setOptInOpen(false)}
        onOptIn={handleOptIn}
      />
    </>
  )
}

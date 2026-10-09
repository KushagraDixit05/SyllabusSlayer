'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { OptInDialog } from '@/components/leaderboard/OptInDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { userRepository } from '@/lib/repositories/userRepository'
import { Trophy, ArrowRight } from 'lucide-react'

interface AchievementsClientSectionProps {
  isLeaderboardOptedIn: boolean
}

export function AchievementsClientSection({
  isLeaderboardOptedIn: initialOptedIn,
}: AchievementsClientSectionProps) {
  const { data: session } = useSession()
  const [optInOpen, setOptInOpen] = useState(false)
  const [isOptedIn, setIsOptedIn] = useState(initialOptedIn)

  const handleOptIn = async (username: string) => {
    if (!session?.user?.id) return
    await userRepository.optInToLeaderboard(session.user.id, username)
    setIsOptedIn(true)
  }

  return (
    <>
      {/* The unlock modal is mounted once by GlobalAchievementNotifier in the
          dashboard layout. Rendering a second one here off the same store fired
          two modals and two confetti bursts on this route. */}

      {/* Leaderboard link */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                {isOptedIn
                  ? 'See how you rank against other learners'
                  : "You're not on the leaderboard yet — opt in to compete"}
              </CardDescription>
            </div>
            {isOptedIn ? (
              <Button asChild variant="outline">
                <Link href="/dashboard/leaderboard">
                  View Leaderboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button onClick={() => setOptInOpen(true)}>
                <Trophy className="mr-2 h-4 w-4" />
                Join Leaderboard
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard/leaderboard"
            className="rounded-lg flex items-center gap-3 border-[3px] border-dashed border-ink p-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Trophy className="h-5 w-5 shrink-0 opacity-60" />
            Hours planned, longest streaks, and most completed playlists — see the full rankings.
          </Link>
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

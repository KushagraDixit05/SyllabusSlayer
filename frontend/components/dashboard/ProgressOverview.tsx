'use client'

import { CircularProgress } from '@/components/progress/CircularProgress'
import { ActivityHeatmap } from '@/components/progress/ActivityHeatmap'
import { StreakDisplay } from '@/components/progress/StreakDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { levelForXp, xpForNextLevel } from '@/lib/gamification/xpCurve'

interface ProgressOverviewProps {
  activePlaylists: number
  completedPlaylists: number
  totalPlaylists: number
  currentStreak: number
  longestStreak: number
  activityData: Array<{ date: string; count: number }>
  xp: number
}

export function ProgressOverview({
  activePlaylists,
  completedPlaylists,
  totalPlaylists,
  currentStreak,
  longestStreak,
  activityData,
  xp,
}: ProgressOverviewProps) {
  const completionRate =
    totalPlaylists > 0 ? (completedPlaylists / totalPlaylists) * 100 : 0
  const level = levelForXp(xp)
  const nextLevel = xpForNextLevel(xp)

  return (
    <div className="space-y-6">
      {/* XP / level threshold */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-baseline justify-between">
            <CardTitle>Rank Threshold</CardTitle>
            <span className="text-xs font-bold text-muted-foreground">
              Level {level} &rarr; {level + 1}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted-foreground">{nextLevel.current.toLocaleString()} / {nextLevel.needed.toLocaleString()} XP</span>
            <span className="font-display text-sm font-black tabular-nums">{Math.round(nextLevel.progress)}%</span>
          </div>
          <Progress value={nextLevel.progress} />
        </CardContent>
      </Card>

      {/* Circular Progress Indicators */}
      <Card variant="glass" className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <CircularProgress
            progress={completionRate}
            label="Overall Completion"
            sublabel={`${completedPlaylists} of ${totalPlaylists} playlists`}
          />
          <CircularProgress
            progress={activePlaylists > 0 ? 50 : 0}
            label="Active Playlists"
            sublabel={`${activePlaylists} in progress`}
          />
          <CircularProgress
            progress={currentStreak > 0 ? Math.min((currentStreak / 30) * 100, 100) : 0}
            label="Streak Progress"
            sublabel={`${currentStreak} of 30-day goal`}
            gradient="flame"
          />
        </div>
      </Card>

      {/* Streak Display */}
      <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />

      {/* Activity Heatmap */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap activities={activityData} weeks={12} />
        </CardContent>
      </Card>
    </div>
  )
}

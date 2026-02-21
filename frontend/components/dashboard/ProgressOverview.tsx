'use client'

import { CircularProgress } from '@/components/progress/CircularProgress'
import { ActivityHeatmap } from '@/components/progress/ActivityHeatmap'
import { StreakDisplay } from '@/components/progress/StreakDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProgressOverviewProps {
  activePlaylists: number
  completedPlaylists: number
  totalPlaylists: number
  currentStreak: number
  longestStreak: number
  activityData: Array<{ date: string; count: number }>
}

export function ProgressOverview({
  activePlaylists,
  completedPlaylists,
  totalPlaylists,
  currentStreak,
  longestStreak,
  activityData,
}: ProgressOverviewProps) {
  const completionRate =
    totalPlaylists > 0 ? (completedPlaylists / totalPlaylists) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Circular Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        />
      </div>

      {/* Streak Display */}
      <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />

      {/* Activity Heatmap */}
      <Card>
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

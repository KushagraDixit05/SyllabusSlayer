'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StreakFlame } from '@/components/gamification/StreakFlame'
import { cn } from '@/lib/utils'

interface StreakHeatmapProps {
  history: Array<{ date: string; active: boolean }>
  currentStreak?: number
  longestStreak?: number
}

export function StreakHeatmap({ history, currentStreak = 0, longestStreak = 0 }: StreakHeatmapProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Streak</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <StreakFlame days={currentStreak} className="text-foreground" />
            <span className="text-muted-foreground">Best: {longestStreak} Days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet. Complete a video to start your streak!</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {history.map(({ date, active }) => (
              <div
                key={date}
                title={date}
                className={cn(
                  'h-4 w-4 border-[3px] border-ink',
                  active ? 'bg-flame-from' : 'bg-muted'
                )}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

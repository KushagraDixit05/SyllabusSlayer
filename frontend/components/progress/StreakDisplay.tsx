'use client'

import { Card, CardContent } from '@/components/ui/card'
import { StreakFlame } from '@/components/gamification/StreakFlame'
import { cn } from '@/lib/utils'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const active = currentStreak > 0

  // One surface regardless of state — the streak is expressed in the fill,
  // not by swapping the card variant.
  return (
    <Card variant="glass" className={cn(active && 'flame-glow')}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <StreakFlame days={currentStreak} compact className="text-5xl" iconClassName="h-12 w-12" />

          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-4xl font-black tabular-nums">{currentStreak}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Personal best: {longestStreak} days
            </p>
          </div>
        </div>

        {/* Streak milestones progress bar */}
        <div className="mt-4 flex items-center space-x-2">
          {[7, 30, 100].map((milestone) => (
            <div
              key={milestone}
              className={cn(
                'h-3 flex-1 border-[3px] border-ink transition-colors',
                currentStreak >= milestone ? 'bg-flame-from' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>7d</span>
          <span>30d</span>
          <span>100d</span>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { Trophy } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface GamificationSummaryCardProps {
  level: number
  xp: number
  xpToNextLevel: { current: number; needed: number; progress: number }
}

export function GamificationSummaryCard({ level, xp, xpToNextLevel }: GamificationSummaryCardProps) {
  return (
    <Card variant="elevated" dots>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-primary">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <CardTitle className="flex-1">Level Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-4xl font-black leading-none tabular-nums">
            Level {level}
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            {xp.toLocaleString()} XP total
          </p>
        </div>
        <Progress value={xpToNextLevel.progress} />
        <p className="text-sm font-medium text-muted-foreground">
          {xpToNextLevel.current} / {xpToNextLevel.needed} XP to level {level + 1}
        </p>
      </CardContent>
    </Card>
  )
}

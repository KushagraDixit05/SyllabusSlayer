'use client'

import { BrutalRadarChart } from '@/components/ui/brutal-radar-chart'
import type { UserAnalytics } from '@/lib/analytics/service'

interface LearningProfileRadarProps {
  analytics: UserAnalytics
}

const pct = (n: number) => Math.round(Math.min(Math.max(n, 0), 100))

/**
 * Five derived 0-100 scores describing how someone studies, rather than how
 * much. Each axis is normalised against a goal so they share one scale.
 */
export function LearningProfileRadar({ analytics }: LearningProfileRadarProps) {
  const data = [
    { label: 'Finish', value: pct(analytics.completionRate) },
    // A 30-day streak is treated as full marks.
    { label: 'Streak', value: pct((analytics.streakData.current / 30) * 100) },
    // 2x is the practical ceiling for comprehension.
    { label: 'Speed', value: pct(((analytics.speedPreference.average - 1) / 1) * 100) },
    // 10 playlists is full marks for breadth.
    { label: 'Volume', value: pct((analytics.totalPlaylists / 10) * 100) },
    {
      label: 'Depth',
      value: pct(
        analytics.totalHoursPlanned > 0
          ? (analytics.totalHoursCompleted / analytics.totalHoursPlanned) * 100
          : 0
      ),
    },
  ]

  return <BrutalRadarChart title="Learning Profile" data={data} />
}

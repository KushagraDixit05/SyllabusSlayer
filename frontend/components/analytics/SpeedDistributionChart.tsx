'use client'

import { BrutalBarChart } from '@/components/ui/brutal-bar-chart'
import type { ChartDatum } from '@/components/ui/brutal-chart-tones'

interface SpeedDistributionChartProps {
  /** Playback speed -> number of playlists watched at it. */
  distribution: Record<string, number>
}

export function SpeedDistributionChart({ distribution }: SpeedDistributionChartProps) {
  const data: ChartDatum[] = Object.entries(distribution)
    .map(([speed, count]) => ({ label: `${speed}x`, value: count }))
    .sort((a, b) => parseFloat(a.label) - parseFloat(b.label))

  if (data.length === 0) return null

  return <BrutalBarChart title="Playback Speed" data={data} unit=" playlists" />
}

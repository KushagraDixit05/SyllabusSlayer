'use client'

import { BrutalDonutChart } from '@/components/ui/brutal-donut-chart'

interface CategorySplitDonutProps {
  categoryBreakdown: Array<{ category: string; count: number }>
}

export function CategorySplitDonut({ categoryBreakdown }: CategorySplitDonutProps) {
  // Beyond five slices the legend and the ring both stop being readable, so
  // the tail is folded into one bucket.
  const top = categoryBreakdown.slice(0, 4)
  const rest = categoryBreakdown.slice(4).reduce((sum, c) => sum + c.count, 0)

  const data = [
    ...top.map((c) => ({ label: c.category, value: c.count })),
    ...(rest > 0 ? [{ label: 'Other', value: rest }] : []),
  ]

  return (
    <BrutalDonutChart title="Category Split" data={data} centerLabel="Playlists" dots />
  )
}

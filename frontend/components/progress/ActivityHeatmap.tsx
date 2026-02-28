'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ActivityDay {
  date: string
  count: number
}

interface ActivityHeatmapProps {
  activities: ActivityDay[]
  weeks?: number
}

export function ActivityHeatmap({ activities, weeks = 12 }: ActivityHeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - weeks * 7)

    const activityMap = new Map(activities.map((a) => [a.date, a.count]))
    const data: ActivityDay[] = []

    for (let i = 0; i < weeks * 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      data.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
      })
    }

    return data
  }, [activities, weeks])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count === 1) return 'bg-green-200 dark:bg-green-900'
    if (count === 2) return 'bg-green-400 dark:bg-green-700'
    return 'bg-green-600 dark:bg-green-500'
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1">
        {heatmapData.map((day, index) => (
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.001 }}
                className={`w-3 h-3 rounded-sm cursor-default ${getColor(day.count)}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{new Date(day.date + 'T00:00:00').toLocaleDateString()}</p>
              <p className="text-sm">{day.count} session{day.count !== 1 ? 's' : ''}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

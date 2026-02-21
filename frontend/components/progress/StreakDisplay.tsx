'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl select-none"
          >
            🔥
          </motion.div>

          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold">{currentStreak}</span>
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
              className={`flex-1 h-2 rounded-full transition-colors ${
                currentStreak >= milestone ? 'bg-orange-500' : 'bg-muted'
              }`}
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

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AchievementDefinition } from '@/lib/achievements/definitions'

interface AchievementCardProps {
  achievement: AchievementDefinition
  unlocked: boolean
  earnedAt?: string
  /** True for a brief window right after unlock — pulses the rarity glow once. */
  justUnlocked?: boolean
}

const RARITY_OVERLAY = {
  common: 'bg-rarity-common',
  rare: 'bg-rarity-rare',
  epic: 'bg-rarity-epic',
  legendary: 'bg-rarity-legendary',
} as const

export function AchievementCard({
  achievement,
  unlocked,
  earnedAt,
  justUnlocked = false,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden',
          unlocked && 'brutal-lift',
          !unlocked && 'opacity-50 grayscale',
          justUnlocked && 'animate-glow-fade'
        )}
      >
        {/* Rarity flag: a solid bar down the leading edge */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-3 border-r-[3px] border-ink',
            RARITY_OVERLAY[achievement.rarity]
          )}
        />

        <CardContent className="relative p-6 pl-9">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className="text-5xl">{achievement.icon}</div>

              {/* Details */}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-display text-lg font-black tracking-tight">{achievement.name}</h3>
                  {!unlocked && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>
                {earnedAt && (
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Earned {new Date(earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Rarity badge */}
            <Badge variant={achievement.rarity}>
              {achievement.rarity.toUpperCase()}
            </Badge>
          </div>

          {/* Points */}
          <div className="mt-4 flex items-center justify-between">
            <span className="font-display text-sm font-black tabular-nums">
              {achievement.points} points
            </span>
            {!unlocked && (
              <span className="text-sm font-medium text-muted-foreground">
                {achievement.requirement.threshold}{' '}
                {achievement.requirement.type.replace(/_/g, ' ')} required
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'
import type { AchievementDefinition } from '@/lib/achievements/definitions'

interface AchievementCardProps {
  achievement: AchievementDefinition
  unlocked: boolean
  earnedAt?: string
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500',
}

const rarityTextColors = {
  common: 'text-gray-100',
  rare: 'text-blue-100',
  epic: 'text-purple-100',
  legendary: 'text-amber-100',
}

export function AchievementCard({
  achievement,
  unlocked,
  earnedAt,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden ${
          !unlocked ? 'opacity-50 grayscale' : ''
        }`}
      >
        {/* Rarity gradient background */}
        <div
          className={`absolute inset-0 opacity-10 ${rarityColors[achievement.rarity]}`}
        />

        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className="text-5xl">{achievement.icon}</div>

              {/* Details */}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg">{achievement.name}</h3>
                  {!unlocked && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>
                {earnedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Earned {new Date(earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Rarity badge */}
            <Badge
              variant="secondary"
              className={`${rarityColors[achievement.rarity]} ${rarityTextColors[achievement.rarity]}`}
            >
              {achievement.rarity.toUpperCase()}
            </Badge>
          </div>

          {/* Points */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium">
              {achievement.points} points
            </span>
            {!unlocked && (
              <span className="text-xs text-muted-foreground">
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

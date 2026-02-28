'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import type { AchievementDefinition } from '@/lib/achievements/definitions'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'

interface AchievementUnlockedModalProps {
  achievement: AchievementDefinition | null
  open: boolean
  onClose: () => void
  onShare?: () => void
}

export function AchievementUnlockedModal({
  achievement,
  open,
  onClose,
  onShare,
}: AchievementUnlockedModalProps) {
  const { width, height } = useWindowSize()

  if (!achievement) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence>
          {open && (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          )}
        </AnimatePresence>

        <DialogHeader>
          <DialogTitle className="text-center">🎉 Achievement Unlocked!</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          className="flex flex-col items-center space-y-4 py-6"
        >
          <div className="text-8xl">{achievement.icon}</div>

          <h2 className="text-2xl font-bold text-center">{achievement.name}</h2>

          <p className="text-center text-muted-foreground">
            {achievement.description}
          </p>

          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-primary">
              +{achievement.points}
            </span>
            <span className="text-muted-foreground">points</span>
          </div>
        </motion.div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

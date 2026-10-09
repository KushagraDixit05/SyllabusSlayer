'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'
import { cn } from '@/lib/utils'
import {
  getConfettiColors,
  CONFETTI_PIECES,
  CONFETTI_GRAVITY,
} from '@/lib/celebrations/confettiColors'

interface MilestoneCelebrationProps {
  open: boolean
  onClose: () => void
  milestone: {
    title: string
    message: string
    icon: string
    /** Drives the themed glow; streak milestones burn flame-colored. */
    type?: 'playlists' | 'hours' | 'streak'
  }
}

export function MilestoneCelebration({
  open,
  onClose,
  milestone,
}: MilestoneCelebrationProps) {
  const { width, height } = useWindowSize()
  const reduceMotion = useReducedMotion()
  const isStreakMilestone = milestone.type === 'streak'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'sm:max-w-lg',
          isStreakMilestone ? 'flame-glow' : 'shadow-brutal'
        )}
      >
        {open && !reduceMotion && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={CONFETTI_PIECES}
            gravity={CONFETTI_GRAVITY}
            colors={getConfettiColors()}
          />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex flex-col items-center space-y-6 py-8"
        >
          <div className="select-none text-8xl">{milestone.icon}</div>

          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-black tracking-tight">{milestone.title}</h2>
            <p className="text-base text-muted-foreground">{milestone.message}</p>
          </div>

          <Button size="lg" onClick={onClose}>
            Keep Going! 🚀
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

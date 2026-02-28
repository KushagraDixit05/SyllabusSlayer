'use client'

import { motion } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'

interface MilestoneCelebrationProps {
  open: boolean
  onClose: () => void
  milestone: {
    title: string
    message: string
    icon: string
  }
}

export function MilestoneCelebration({
  open,
  onClose,
  milestone,
}: MilestoneCelebrationProps) {
  const { width, height } = useWindowSize()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={300}
          />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex flex-col items-center space-y-6 py-8"
        >
          <div className="text-9xl select-none">{milestone.icon}</div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{milestone.title}</h2>
            <p className="text-lg text-muted-foreground">{milestone.message}</p>
          </div>

          <Button size="lg" onClick={onClose}>
            Keep Going! 🚀
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

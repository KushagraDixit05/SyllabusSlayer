'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface InteractiveCardProps {
  children: ReactNode
  className?: string
}

export function InteractiveCard({ children, className }: InteractiveCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

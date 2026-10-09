'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  /** Solid stroke color (CSS color string). Ignored when `gradient` is set. */
  color?: string
  /** `brand` = indigo->purple stroke, `flame` = amber->orange stroke. */
  gradient?: 'brand' | 'flame'
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'hsl(var(--primary))',
  gradient,
}: ProgressRingProps) {
  const uid = useId()
  const gradientId = `progress-ring-${uid}`
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient === 'brand' ? 'hsl(var(--brand-from))' : 'hsl(var(--flame-from))'} />
            <stop offset="100%" stopColor={gradient === 'brand' ? 'hsl(var(--brand-to))' : 'hsl(var(--flame-to))'} />
          </linearGradient>
        </defs>
      )}
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={gradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        strokeLinecap="round"
      />
    </svg>
  )
}

'use client'

import { ProgressRing } from '@/components/animations/ProgressRing'

interface CircularProgressProps {
  progress: number
  size?: number
  label: string
  sublabel?: string
}

export function CircularProgress({
  progress,
  size = 120,
  label,
  sublabel,
}: CircularProgressProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <ProgressRing progress={progress} size={size} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium">{label}</p>
        {sublabel && (
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FeatureTooltipProps {
  feature: string
  children: React.ReactNode
  description: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function FeatureTooltip({
  feature,
  children,
  description,
  side = 'bottom',
}: FeatureTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenFeature, setHasSeenFeature] = useState(true) // default true to avoid flash

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      const seen = localStorage.getItem(`feature-seen-${feature}`)
      if (!seen) {
        setHasSeenFeature(false)
        // Small delay so the page renders before showing the tooltip
        timer = setTimeout(() => setIsOpen(true), 800)
      }
    } catch {
      // SSR safety
      setHasSeenFeature(true)
    }
    return () => {
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [feature])

  const handleDismiss = () => {
    setIsOpen(false)
    try {
      localStorage.setItem(`feature-seen-${feature}`, 'true')
    } catch {
      // ignore
    }
    setHasSeenFeature(true)
  }

  if (hasSeenFeature) return <>{children}</>

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-xs p-4 bg-primary text-primary-foreground border-0 shadow-lg"
          sideOffset={10}
        >
          <div className="flex items-start justify-between space-x-2">
            <p className="text-sm leading-relaxed">{description}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <button
            className="text-xs underline mt-2 text-primary-foreground/70 hover:text-primary-foreground"
            onClick={handleDismiss}
          >
            Got it!
          </button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

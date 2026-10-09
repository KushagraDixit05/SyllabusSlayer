'use client'

import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { TONE_CLASSES, type StatTileTone } from '@/components/ui/stat-tile'

export type InsightTone = StatTileTone

interface InsightCardProps {
  title: string
  insight: string
  icon: LucideIcon
  tone?: InsightTone
}

/**
 * Same chip/label/value anatomy as StatTile, but the value is a short phrase
 * rather than a number, so it can't use CountingNumber.
 */
export function InsightCard({
  title,
  insight,
  icon: Icon,
  tone = 'brand',
}: InsightCardProps) {
  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink',
            TONE_CLASSES[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold text-muted-foreground">
          {title}
        </p>
      </div>
      <p className="mt-4 font-display text-2xl font-black leading-tight">{insight}</p>
    </Card>
  )
}

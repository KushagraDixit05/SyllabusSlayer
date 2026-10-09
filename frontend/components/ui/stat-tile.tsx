import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { CountingNumber } from "@/components/animations/CountingNumber"

/**
 * Solid crayon fills, not the old `/15` washes — a tinted wash reads muddy
 * inside a hard 3px ink border. Every fill is saturated enough that the chip
 * glyph must be black.
 */
const TONE_CLASSES = {
  brand: "bg-primary text-primary-foreground",
  flame: "bg-flame-from text-primary-foreground",
  rare: "bg-rarity-rare text-primary-foreground",
  success: "bg-chart-3 text-primary-foreground",
} as const

export type StatTileTone = keyof typeof TONE_CLASSES

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
  tone?: StatTileTone
  caption?: React.ReactNode
  /** Throws a colored shadow instead of ink — for an active streak, say. */
  glow?: boolean
}

/**
 * The single stat-card implementation. Analytics, profile and leaderboard each
 * used to carry their own near-miss copy of this (different chip sizes, label
 * tracking and value weights); they all route through here now.
 */
const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  (
    { label, value, suffix, icon: Icon, tone = "brand", caption, glow, className, ...props },
    ref
  ) => (
    <Card
      ref={ref}
      variant="glass"
      className={cn("p-6", glow && "flame-glow", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink",
            TONE_CLASSES[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold text-muted-foreground">
          {label}
        </p>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <CountingNumber
          value={value}
          suffix={suffix}
          className="font-display text-4xl font-black leading-none tabular-nums"
        />
      </div>
      {caption && (
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {caption}
        </p>
      )}
    </Card>
  )
)
StatTile.displayName = "StatTile"

export { StatTile, TONE_CLASSES }

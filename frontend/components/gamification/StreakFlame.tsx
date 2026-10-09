import { Flame } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StreakFlameProps {
  days: number
  className?: string
  iconClassName?: string
  /** Hide the trailing "Day(s)" label, e.g. for a compact header chip. */
  compact?: boolean
}

/**
 * Flame icon + day count, per the Gamified Productivity HUD streak-counter
 * spec: amber->orange gradient flame, gentle 1.00->1.03 pulse while a
 * streak is active. Respects prefers-reduced-motion via the shared
 * `.animate-flame-pulse` reduced-motion override in globals.css.
 */
export function StreakFlame({ days, className, iconClassName, compact = false }: StreakFlameProps) {
  const active = days > 0
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold", className)}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="streak-flame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--flame-from))" />
            <stop offset="100%" stopColor="hsl(var(--flame-to))" />
          </linearGradient>
        </defs>
      </svg>
      <Flame
        className={cn("h-4 w-4", active && "animate-flame-pulse", iconClassName)}
        style={{ fill: "url(#streak-flame-gradient)", stroke: "url(#streak-flame-gradient)" }}
      />
      <span>
        {days}
        {!compact && (days === 1 ? " Day" : " Days")}
      </span>
    </span>
  )
}

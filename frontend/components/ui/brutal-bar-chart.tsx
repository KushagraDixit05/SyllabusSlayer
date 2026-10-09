"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Card, CardTitle } from "@/components/ui/card"
import { seriesBg, type ChartDatum } from "@/components/ui/brutal-chart-tones"

export interface BrutalBarChartProps {
  title: string
  data: ChartDatum[]
  /** Rendered after each value in the hover tooltip, e.g. "min". */
  unit?: string
  /** Lays the dot texture on the panel. See `Card`'s `dots` prop. */
  dots?: boolean
  className?: string
}

/**
 * Vertical bars scaled against the largest value in the set, so a quiet week
 * still fills the frame rather than collapsing to slivers.
 */
export function BrutalBarChart({
  title,
  data,
  unit = "",
  dots = false,
  className,
}: BrutalBarChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const reduceMotion = useReducedMotion()
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <Card variant="glass" dots={dots} className={cn("flex h-full flex-col p-6", className)}>
      <CardTitle className="mb-6">{title}</CardTitle>
      <div className="flex min-h-[180px] flex-1 items-end justify-between gap-2 sm:gap-4">
        {data.map((item, i) => {
          const pct = (item.value / max) * 100
          return (
            <div key={item.label} className="group relative flex h-full flex-1 items-end">
              <motion.div
                initial={reduceMotion ? false : { height: 0 }}
                animate={{ height: `${Math.max(pct, 2)}%` }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }
                }
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className={cn(
                  "rounded-t-lg relative z-10 flex w-full origin-bottom cursor-pointer items-end justify-center overflow-hidden border-[3px] border-ink",
                  "brutal-halftone",
                  seriesBg(i)
                )}
              >
                <span className="relative z-20 pb-1 font-mono text-[10px] font-bold text-primary-foreground">
                  {item.label}
                </span>
              </motion.div>

              <AnimatePresence>
                {hovered === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-lg pointer-events-none absolute bottom-full left-1/2 z-30 -translate-x-1/2 border-[3px] border-ink bg-background px-3 py-1 font-mono text-sm font-bold whitespace-nowrap"
                  >
                    {item.value}
                    {unit}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion"

import { cn } from "@/lib/utils"
import { Card, CardTitle } from "@/components/ui/card"
import { seriesFill, type ChartDatum } from "@/components/ui/brutal-chart-tones"
import { BrutalChartLegend } from "@/components/ui/brutal-chart-legend"

const SPRING: Transition = { type: "spring", stiffness: 300, damping: 20 }

const arcPoint = (percent: number): [number, number] => [
  Math.cos(2 * Math.PI * percent),
  Math.sin(2 * Math.PI * percent),
]

export interface BrutalDonutChartProps {
  title: string
  data: ChartDatum[]
  /** Shown under the total in the hole. Defaults to "TOTAL". */
  centerLabel?: string
  /** Lays the dot texture on the panel. See `Card`'s `dots` prop. */
  dots?: boolean
  className?: string
}

/**
 * Donut whose slices are shares of the summed total, so callers pass raw
 * values (minutes, counts) rather than pre-computed percentages.
 */
export function BrutalDonutChart({
  title,
  data,
  centerLabel = "TOTAL",
  dots = false,
  className,
}: BrutalDonutChartProps) {
  const [hovered, setHovered] = React.useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  // Pattern ids are document-global, so two donuts on one page would collide
  // and the second would paint with the first's pattern.
  const halftoneId = `brutal-halftone-${React.useId().replace(/:/g, "")}`

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const pctOf = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0)

  const slices = React.useMemo(() => {
    let cumulative = 0
    return data.map((slice) => {
      const start = cumulative
      const fraction = total > 0 ? slice.value / total : 0
      cumulative += fraction
      return { ...slice, start, end: cumulative, fraction }
    })
  }, [data, total])

  if (total === 0) {
    return (
      <Card variant="glass" dots={dots} className={cn("flex h-full flex-col p-6", className)}>
        <CardTitle className="mb-6">{title}</CardTitle>
        <p className="flex flex-1 items-center justify-center text-sm font-medium text-muted-foreground">
          No data yet
        </p>
      </Card>
    )
  }

  return (
    <Card
      variant="glass"
      dots={dots}
      className={cn("relative flex h-full flex-col items-center p-6", className)}
    >
      <CardTitle className="mb-8 w-full text-center">{title}</CardTitle>

      <div className="z-10 flex h-full w-full flex-col items-center justify-center">
        <div className="relative aspect-square w-full max-w-[280px]">
          <motion.svg
            viewBox="-1.2 -1.2 2.4 2.4"
            className="h-full w-full -rotate-90 overflow-visible"
            initial={reduceMotion ? false : { rotate: -180, scale: 0 }}
            animate={{ rotate: -90, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 100, damping: 20, delay: 0.2 }
            }
          >
            <defs>
              <pattern
                id={halftoneId}
                width="0.05"
                height="0.05"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="0.025" cy="0.025" r="0.012" className="fill-ink" opacity="0.22" />
              </pattern>
            </defs>

            {slices.map((slice, i) => {
              const [startX, startY] = arcPoint(slice.start)
              const [endX, endY] = arcPoint(slice.end)
              const largeArc = slice.fraction > 0.5 ? 1 : 0
              // A single slice covering the whole ring can't be drawn as one
              // arc (start and end coincide), so draw it as a full circle.
              const d =
                slice.fraction >= 0.999
                  ? "M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0"
                  : [
                      `M ${startX} ${startY}`,
                      `A 1 1 0 ${largeArc} 1 ${endX} ${endY}`,
                      "L 0 0",
                    ].join(" ")

              const isHovered = hovered === slice.label
              const isDimmed = hovered !== null && !isHovered

              return (
                // The fill and its halftone overlay share one animated group so
                // the texture can't drift away from the slice it sits on.
                <motion.g
                  key={slice.label}
                  animate={{
                    translateX: isHovered ? (startX + endX) * 0.08 : 0,
                    translateY: isHovered ? (startY + endY) * 0.08 : 0,
                    opacity: isDimmed ? 0.35 : 1,
                  }}
                  transition={reduceMotion ? { duration: 0 } : SPRING}
                  onMouseEnter={() => setHovered(slice.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <path
                    d={d}
                    className={cn("stroke-ink", seriesFill(i))}
                    strokeWidth="0.04"
                    strokeLinejoin="round"
                  />
                  <path
                    d={d}
                    fill={`url(#${halftoneId})`}
                    stroke="none"
                    pointerEvents="none"
                  />
                </motion.g>
              )
            })}

            <motion.circle
              cx="0"
              cy="0"
              r="0.55"
              className="fill-card stroke-ink"
              strokeWidth="0.04"
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.4, ...SPRING }}
            />
          </motion.svg>

          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {hovered ? (
                <motion.div
                  key="hovered"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={SPRING}
                  className="flex flex-col items-center"
                >
                  <span className="font-display text-2xl font-black tabular-nums">
                    {pctOf(data.find((d) => d.label === hovered)?.value ?? 0)}%
                  </span>
                  <span className="mt-1 bg-ink px-1 text-[10px] font-bold text-background">
                    {hovered}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={SPRING}
                  className="flex flex-col items-center"
                >
                  <span className="font-display text-3xl font-black tabular-nums">
                    {total}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {centerLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <BrutalChartLegend
          data={data}
          size="lg"
          hovered={hovered}
          onHover={setHovered}
          dimInactive
          className="mt-6"
        />
      </div>
    </Card>
  )
}

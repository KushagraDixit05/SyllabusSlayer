"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Card, CardTitle } from "@/components/ui/card"
import { type ChartDatum } from "@/components/ui/brutal-chart-tones"
import { BrutalChartLegend } from "@/components/ui/brutal-chart-legend"

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 80
const GRID_LEVELS = [100, 75, 50, 25]

export interface BrutalRadarChartProps {
  title: string
  /** Values are percentages (0-100). */
  data: ChartDatum[]
  className?: string
}

/**
 * Polygon radar over a dashed grid. Values are read as percentages so every
 * axis shares one scale.
 */
export function BrutalRadarChart({ title, data, className }: BrutalRadarChartProps) {
  const [hovered, setHovered] = React.useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  const coordsFor = React.useCallback(
    (value: number, index: number) => {
      const angle = (Math.PI / 180) * ((360 / data.length) * index - 90)
      const r = (Math.min(Math.max(value, 0), 100) / 100) * RADIUS
      return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) }
    },
    [data.length]
  )

  const toPath = React.useCallback(
    (valueAt: (i: number) => number) =>
      data
        .map((_, i) => {
          const c = coordsFor(valueAt(i), i)
          return `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`
        })
        .join(" ") + " Z",
    [data, coordsFor]
  )

  if (data.length < 3) return null

  return (
    <Card
      variant="glass"
      className={cn("flex h-full flex-col gap-6 p-6 sm:flex-row", className)}
    >
      <div className="relative flex min-h-[220px] flex-1 items-center justify-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full max-w-[280px] overflow-visible">
          {GRID_LEVELS.map((level) => (
            <path
              key={level}
              d={toPath(() => level)}
              fill="none"
              className="stroke-ink/20"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ))}

          {data.map((d, i) => {
            const outer = coordsFor(100, i)
            return (
              <line
                key={d.label}
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                className="stroke-ink/20"
                strokeWidth="2"
              />
            )
          })}

          <motion.path
            d={toPath((i) => data[i].value)}
            className="fill-brand-from/50 stroke-ink"
            strokeWidth="4"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 200, damping: 20, delay: 0.2 }
            }
            style={{ originX: "50%", originY: "50%" }}
          />

          {data.map((d, i) => {
            const c = coordsFor(d.value, i)
            const isHovered = hovered === d.label
            return (
              <g
                key={d.label}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(d.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle cx={c.x} cy={c.y} r="20" fill="transparent" />
                <motion.rect
                  x={c.x - 5}
                  y={c.y - 5}
                  width="10"
                  height="10"
                  className="fill-background stroke-ink"
                  strokeWidth="3"
                  animate={{ scale: isHovered ? 1.8 : 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 400, damping: 15 }
                  }
                  style={{ originX: `${c.x}px`, originY: `${c.y}px` }}
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="z-10 flex w-full flex-col justify-center gap-2 sm:w-44">
        <CardTitle className="mb-2 text-base">{title}</CardTitle>
        <BrutalChartLegend
          data={data}
          size="sm"
          hovered={hovered}
          onHover={setHovered}
          showValue
          valueSuffix="%"
        />
      </div>
    </Card>
  )
}

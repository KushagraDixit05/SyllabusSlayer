"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { seriesBg, type ChartDatum } from "@/components/ui/brutal-chart-tones"

export interface BrutalChartLegendProps {
  data: ChartDatum[]
  /**
   * `lg` is the donut's reference-scale row — a two-column grid of large
   * display labels. `sm` is the compact stacked list the radar reads out
   * beside its polygon.
   */
  size?: "sm" | "lg"
  hovered: string | null
  onHover: (label: string | null) => void
  /** Renders the datum's value at the end of each row. */
  showValue?: boolean
  valueSuffix?: string
  /** Fades the rows that aren't hovered, to pair with a dimmed chart mark. */
  dimInactive?: boolean
  className?: string
}

/**
 * The one chart legend. The donut and the radar each carried a near-identical
 * hand-rolled copy of this, which is why their chip sizes and label tracking
 * had drifted apart; they both route through here now.
 */
export function BrutalChartLegend({
  data,
  size = "sm",
  hovered,
  onHover,
  showValue = false,
  valueSuffix = "",
  dimInactive = false,
  className,
}: BrutalChartLegendProps) {
  return (
    <div
      className={cn(
        size === "lg" ? "grid w-full grid-cols-2 gap-2" : "flex flex-col gap-2",
        className
      )}
    >
      {data.map((item, i) => {
        const isHovered = hovered === item.label
        return (
          <div
            key={item.label}
            onMouseEnter={() => onHover(item.label)}
            onMouseLeave={() => onHover(null)}
            className={cn(
              "rounded-lg flex cursor-pointer items-center justify-between gap-2 border-[3px] p-2 transition-colors",
              isHovered ? "border-ink bg-accent" : "border-transparent",
              dimInactive && hovered && !isHovered && "opacity-40"
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={cn(
                  "rounded-md shrink-0 border-[3px] border-ink",
                  size === "lg" ? "h-4 w-4" : "h-3 w-3",
                  seriesBg(i)
                )}
              />
              <span
                className={cn(
                  "truncate",
                  size === "lg"
                    ? "font-display text-lg font-black leading-none tracking-tight"
                    : "font-mono text-[10px] font-bold tracking-normal"
                )}
              >
                {item.label}
              </span>
            </div>
            {showValue && (
              <span
                className={cn(
                  "shrink-0 font-display font-black tabular-nums",
                  size === "lg" ? "text-lg" : "text-sm"
                )}
              >
                {item.value}
                {valueSuffix}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

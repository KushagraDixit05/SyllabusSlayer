import * as React from "react"

import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  /** `brand` (default) = purple fill, `flame` = streak yellow fill. */
  tone?: "brand" | "flame"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, tone = "brand", ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value || 0))
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full brutal-border bg-card",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            // `duration-400` used to compile to nothing (not a stock Tailwind
            // step), so this fill never actually animated. The config now
            // defines the 400ms step.
            "h-full w-full flex-1 origin-left rounded-full transition-transform duration-400 ease-out",
            tone === "brand" ? "bg-primary" : "bg-flame-from"
          )}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }

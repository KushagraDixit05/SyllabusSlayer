import * as React from "react"

import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  /** Small kicker label above the title. */
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  /** Right-aligned slot for actions. */
  actions?: React.ReactNode
  className?: string
}

/**
 * The one page heading. Routes previously hand-copied this, which drifted into
 * three H1 recipes (`text-3xl`/`text-2xl`, with and without `tracking-tight`)
 * and two eyebrow recipes with different weights, tracking and colors.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b-[3px] border-ink pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-bold tracking-normal text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-display text-4xl font-black leading-none tracking-tight md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

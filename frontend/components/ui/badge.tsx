import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-[3px] border-ink px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "bg-background text-foreground",
        flame: "bg-flame-from text-primary-foreground",
        common: "bg-rarity-common text-rarity-common-foreground",
        rare: "bg-rarity-rare text-rarity-rare-foreground",
        epic: "bg-rarity-epic text-rarity-epic-foreground",
        legendary: "bg-rarity-legendary text-rarity-legendary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

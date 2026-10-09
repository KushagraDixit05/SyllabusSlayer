import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * All three variants share the hard 3px ink border; they differ only in how
   * far the surface is thrown off the page. `default` sits close, `glass` is
   * the standard content panel, `elevated` is for hero panels and modals.
   *
   * The names are inherited from the pre-brutalist HUD system — keeping them
   * means the ~60 existing call sites convert without edits.
   */
  variant?: "default" | "glass" | "elevated"
  /**
   * Lays the dot texture over the card surface. Opt-in rather than tied to a
   * variant: the texture only reads as deliberate while a couple of panels per
   * screen carry it, so most cards should stay flat.
   */
  dots?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", dots = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-card text-card-foreground brutal-border",
        variant === "default" && "shadow-brutal-sm",
        variant === "glass" && "shadow-brutal",
        variant === "elevated" && "shadow-brutal-lg",
        dots && "brutal-dots-panel",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * One canonical card heading. Previously this defaulted to `text-2xl` and was
 * overridden to `text-lg` at ~10 call sites and left alone at ~8 others, which
 * is why card headings were visibly inconsistent across routes.
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-xl font-black leading-tight tracking-tight",
      "border-b-[3px] border-ink pb-2",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

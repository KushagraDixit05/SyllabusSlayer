/**
 * The crayon series ramp, as Tailwind classes rather than hex. SVG `fill` and
 * `stroke` can't take an `hsl(var(--x))` color through the `style` prop
 * cleanly, so charts apply these as classes instead.
 */
export const SERIES_FILL = [
  "fill-chart-1",
  "fill-chart-2",
  "fill-chart-3",
  "fill-chart-4",
  "fill-chart-5",
] as const

export const SERIES_BG = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
] as const

export const seriesFill = (i: number) => SERIES_FILL[i % SERIES_FILL.length]
export const seriesBg = (i: number) => SERIES_BG[i % SERIES_BG.length]

export interface ChartDatum {
  label: string
  value: number
}

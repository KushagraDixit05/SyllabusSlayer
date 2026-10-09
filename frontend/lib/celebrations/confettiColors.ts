/**
 * react-confetti needs real color strings, not Tailwind classes, so the
 * celebration palette is read off the chart tokens at runtime. Both
 * celebration modals previously carried their own hard-coded hex copy of
 * this, which silently drifted from the design tokens.
 */
const TOKENS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'] as const

/** Used before mount and if a token is missing — the brand purple and yellow. */
const FALLBACK = ['hsl(258 90% 76%)', 'hsl(43 96% 56%)']

export function getConfettiColors(): string[] {
  if (typeof window === 'undefined') return FALLBACK

  const styles = getComputedStyle(document.documentElement)
  const colors = TOKENS.map((token) => {
    const value = styles.getPropertyValue(token).trim()
    return value ? `hsl(${value})` : null
  }).filter((c): c is string => c !== null)

  return colors.length > 0 ? colors : FALLBACK
}

/** Every celebration throws the same amount of confetti. */
export const CONFETTI_PIECES = 250
export const CONFETTI_GRAVITY = 0.3

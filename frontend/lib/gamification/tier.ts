// Flavor titles shown next to a learner's level on the leaderboard podium
// and profile card. Purely cosmetic — has no bearing on the xp/level curve
// in xpCurve.ts, which remains the source of truth for level math.

const TIERS: { minLevel: number; title: string }[] = [
  { minLevel: 20, title: 'Grandmaster Slayer' },
  { minLevel: 15, title: 'Syllabus Champion' },
  { minLevel: 10, title: 'Elite Specialist' },
  { minLevel: 5, title: 'Rising Scholar' },
  { minLevel: 1, title: 'Newcomer' },
]

export function tierForLevel(level: number): string {
  return TIERS.find((t) => level >= t.minLevel)?.title ?? 'Newcomer'
}

// Level curve: level = floor(sqrt(xp / 50)) + 1
// Mirrored server-side by the `xp_to_level` SQL function in
// supabase/migrations/phase4-analytics-gamification.sql — keep both in sync.

export function levelForXp(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1)
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50
}

export function xpForNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = levelForXp(xp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const needed = nextLevelXp - currentLevelXp
  const current = xp - currentLevelXp

  return {
    current,
    needed,
    progress: needed > 0 ? Math.round((current / needed) * 100) : 100,
  }
}

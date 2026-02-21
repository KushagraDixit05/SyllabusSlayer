'use client'

import { AchievementUnlockedModal } from '@/components/achievements/AchievementUnlockedModal'
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore'

export function GlobalAchievementNotifier() {
  const { pendingAchievements, dismissAchievement } = useSavedPlaylistStore()
  const current = pendingAchievements[0] ?? null

  return (
    <AchievementUnlockedModal
      achievement={current}
      open={!!current}
      onClose={dismissAchievement}
      onShare={() => {
        if (current) {
          navigator.clipboard?.writeText(
            `I just unlocked "${current.name}" on Syllabus Slayer! ${current.icon}`
          )
        }
        dismissAchievement()
      }}
    />
  )
}

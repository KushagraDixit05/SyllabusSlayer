'use client'

import { MilestoneCelebration } from '@/components/celebrations/MilestoneCelebration'
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore'

export function GlobalMilestoneNotifier() {
  const { pendingMilestones, dismissMilestone } = useSavedPlaylistStore()
  const current = pendingMilestones[0] ?? null

  return (
    <MilestoneCelebration
      open={!!current}
      onClose={dismissMilestone}
      milestone={current ?? { title: '', message: '', icon: '' }}
    />
  )
}

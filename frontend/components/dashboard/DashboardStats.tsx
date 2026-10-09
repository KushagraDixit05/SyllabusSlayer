'use client'

import { StatTile } from '@/components/ui/stat-tile'
import { ListVideo, Clock, Zap, Flame } from 'lucide-react'
import type { UserProfile } from '@/types/database'

interface DashboardStatsProps {
  userId: string
  userProfile: UserProfile | null
  activePlaylistsCount: number
}

export function DashboardStats({ userProfile, activePlaylistsCount }: DashboardStatsProps) {
  const currentStreak = userProfile?.current_streak ?? 0
  const longestStreak = userProfile?.longest_streak ?? 0

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        label="Active Playlists"
        value={activePlaylistsCount}
        icon={ListVideo}
        tone="brand"
      />
      <StatTile
        label="Hours Planned"
        value={userProfile?.total_hours_planned ?? 0}
        suffix=" hrs"
        icon={Clock}
        tone="rare"
      />
      <StatTile
        label="Hours Saved"
        value={userProfile?.total_hours_saved ?? 0}
        suffix=" hrs"
        icon={Zap}
        tone="success"
        caption="via playback speed"
      />
      <StatTile
        label="Active Streak"
        value={currentStreak}
        suffix=" days"
        icon={Flame}
        tone="flame"
        glow={currentStreak > 0}
        caption={`Best: ${longestStreak} days`}
      />
    </div>
  )
}

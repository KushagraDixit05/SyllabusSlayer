'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlaySquare, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TONE_CLASSES, type StatTileTone } from '@/components/ui/stat-tile'

interface RecentActivityProps {
  userId: string
}

interface ActivityItem {
  id: string
  type: 'playlist_created' | 'playlist_completed' | 'achievement_earned' | 'session_completed'
  message: string
  timestamp: string
  icon: any
}

// Icon-chip tone per activity type, drawn from the shared StatTile tones so
// the chips match the stat row above them.
const ACTIVITY_TONE: Record<ActivityItem['type'], StatTileTone> = {
  playlist_created: 'brand',
  playlist_completed: 'flame',
  achievement_earned: 'rare',
  session_completed: 'success',
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  // TODO: Fetch real activities from database
  // For now, showing placeholder data
  const placeholderActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'playlist_created',
      message: 'Created a new playlist',
      timestamp: '2 hours ago',
      icon: PlaySquare,
    },
  ]

  useEffect(() => {
    setActivities(placeholderActivities)
  }, [userId])

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest learning milestones</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-2 font-display text-sm font-black">No recent activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start learning to see your activity here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink',
                    TONE_CLASSES[ACTIVITY_TONE[activity.type]]
                  )}
                >
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold">{activity.message}</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

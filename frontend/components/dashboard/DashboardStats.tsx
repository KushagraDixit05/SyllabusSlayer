'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { BookOpen, CheckCircle2, Clock, Flame } from 'lucide-react'
import type { UserProfile } from '@/types/database'

interface DashboardStatsProps {
  userId: string
  userProfile: UserProfile | null
}

export function DashboardStats({ userProfile }: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Playlists',
      value: userProfile?.total_playlists_created || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      name: 'Completed',
      value: userProfile?.total_playlists_completed || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: 'Hours Learned',
      value: userProfile?.total_hours_completed || 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      name: 'Current Streak',
      value: `${userProfile?.current_streak || 0} days`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="relative rounded-2xl border p-2">
          <GlowingEffect
            blur={0}
            borderWidth={3}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <Card className="h-full border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

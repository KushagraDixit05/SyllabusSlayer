'use client'

import { InsightCard } from '@/components/analytics/InsightCard'
import { MonthlyProgressChart } from '@/components/analytics/MonthlyProgressChart'
import { Card } from '@/components/ui/card'
import { TrendingUp, Calendar, Zap, Target } from 'lucide-react'
import type { UserAnalytics } from '@/lib/analytics/service'

interface AnalyticsContentProps {
  analytics: UserAnalytics
}

export function AnalyticsContent({ analytics }: AnalyticsContentProps) {
  const timeSaved = Math.round(analytics.totalHoursPlanned * 0.25)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics &amp; Insights</h1>
        <p className="text-muted-foreground mt-1">Track your learning progress and discover patterns</p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Most Productive Day"
          insight={analytics.mostProductiveDayOfWeek}
          icon={Calendar}
          color="hsl(var(--primary))"
        />
        <InsightCard
          title="Average Speed"
          insight={`${analytics.speedPreference.average.toFixed(2)}x`}
          icon={Zap}
          color="#f59e0b"
        />
        <InsightCard
          title="Completion Rate"
          insight={`${Math.round(analytics.completionRate)}%`}
          icon={Target}
          color="#10b981"
        />
        <InsightCard
          title="Daily Average"
          insight={`${analytics.averageDailyStudyTime}h`}
          icon={TrendingUp}
          color="#3b82f6"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Playlists</p>
          <p className="text-3xl font-bold mt-2">{analytics.totalPlaylists}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Hours Planned</p>
          <p className="text-3xl font-bold mt-2">{Math.round(analytics.totalHoursPlanned)}h</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-3xl font-bold mt-2">{analytics.streakData.current} days</p>
        </Card>
      </div>

      {/* Monthly Progress Chart */}
      <MonthlyProgressChart data={analytics.monthlyProgress} />

      {/* Personalized Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">💡 Insight</h3>
          <p className="text-muted-foreground">
            You&apos;re most productive on {analytics.mostProductiveDayOfWeek}s.
            Try scheduling your most challenging playlists on this day!
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">🎯 Suggestion</h3>
          <p className="text-muted-foreground">
            You&apos;ve saved approximately {timeSaved} hours by watching at{' '}
            {analytics.speedPreference.average.toFixed(2)}x speed. Keep it up!
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">🔥 Streak</h3>
          <p className="text-muted-foreground">
            Current streak: <span className="font-semibold text-foreground">{analytics.streakData.current} days</span>.
            Your longest streak was <span className="font-semibold text-foreground">{analytics.streakData.longest} days</span>.
            {analytics.streakData.current < analytics.streakData.longest && " You're on the way to beating your record!"}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">📊 Category Breakdown</h3>
          <div className="space-y-1 mt-2">
            {analytics.categoryBreakdown.slice(0, 4).map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{category}</span>
                <span className="text-sm font-medium">{count} playlists</span>
              </div>
            ))}
            {analytics.categoryBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground">No playlists yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

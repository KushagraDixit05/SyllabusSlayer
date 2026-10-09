'use client'

import { TrendingUp, Calendar, Zap, Target, ListVideo, Clock, Download, Flame } from 'lucide-react'

import { InsightCard } from '@/components/analytics/InsightCard'
import { MonthlyProgressChart } from '@/components/analytics/MonthlyProgressChart'
import { GamificationSummaryCard } from '@/components/analytics/GamificationSummaryCard'
import { StreakHeatmap } from '@/components/analytics/StreakHeatmap'
import { SpeedDistributionChart } from '@/components/analytics/SpeedDistributionChart'
import { LearningProfileRadar } from '@/components/analytics/LearningProfileRadar'
import { CategorySplitDonut } from '@/components/analytics/CategorySplitDonut'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatTile } from '@/components/ui/stat-tile'
import type { UserAnalytics } from '@/lib/analytics/service'

interface AnalyticsContentProps {
  analytics: UserAnalytics
}

export function AnalyticsContent({ analytics }: AnalyticsContentProps) {
  const timeSaved = Math.round(analytics.totalHoursPlanned * 0.25)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Telemetry Protocol"
        title="Analytics & Insights"
        description="Track your learning progress and discover patterns"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Gamification + Streak */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GamificationSummaryCard
          level={analytics.level}
          xp={analytics.xp}
          xpToNextLevel={analytics.xpToNextLevel}
        />
        <StreakHeatmap
          history={analytics.streakData.history}
          currentStreak={analytics.streakData.current}
          longestStreak={analytics.streakData.longest}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatTile label="Total Playlists" value={analytics.totalPlaylists} icon={ListVideo} tone="brand" />
        <StatTile label="Hours Planned" value={Math.round(analytics.totalHoursPlanned)} suffix="h" icon={Clock} tone="rare" />
        <StatTile label="Hours Saved" value={analytics.hoursSaved} suffix="h" icon={Zap} tone="success" caption="via playback speed" />
        <StatTile
          label="Current Streak"
          value={analytics.streakData.current}
          suffix=" days"
          icon={Flame}
          tone="flame"
          glow={analytics.streakData.current > 0}
        />
      </div>

      {/* Bento: profile radar + speed bars beside the category donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <LearningProfileRadar analytics={analytics} />
          <SpeedDistributionChart distribution={analytics.speedPreference.distribution} />
        </div>
        <CategorySplitDonut categoryBreakdown={analytics.categoryBreakdown} />
      </div>

      {/* Monthly Progress Chart */}
      <MonthlyProgressChart data={analytics.monthlyProgress} />

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          title="Most Productive Day"
          insight={analytics.mostProductiveDayOfWeek}
          icon={Calendar}
          tone="brand"
        />
        <InsightCard
          title="Average Speed"
          insight={`${analytics.speedPreference.average.toFixed(2)}x`}
          icon={Zap}
          tone="flame"
        />
        <InsightCard
          title="Completion Rate"
          insight={`${Math.round(analytics.completionRate)}%`}
          icon={Target}
          tone="success"
        />
        <InsightCard
          title="Daily Average"
          insight={`${analytics.averageDailyStudyTime}h`}
          icon={TrendingUp}
          tone="rare"
        />
      </div>

      {/* Personalized Insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You&apos;re most productive on {analytics.mostProductiveDayOfWeek}s.
              Try scheduling your most challenging playlists on this day.
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You&apos;ve saved approximately {timeSaved} hours by watching at{' '}
              {analytics.speedPreference.average.toFixed(2)}x speed. Keep it up.
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Current streak:{' '}
              <span className="font-semibold text-foreground">
                {analytics.streakData.current} days
              </span>
              . Your longest streak was{' '}
              <span className="font-semibold text-foreground">
                {analytics.streakData.longest} days
              </span>
              .
              {analytics.streakData.current < analytics.streakData.longest &&
                " You're on the way to beating your record."}
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y-[3px] divide-ink border-t-[3px] border-ink">
              {analytics.categoryBreakdown.slice(0, 4).map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between py-2">
                  <span className="text-xs font-bold text-muted-foreground">
                    {category}
                  </span>
                  <span className="font-display text-sm font-black tabular-nums">
                    {count} playlists
                  </span>
                </div>
              ))}
              {analytics.categoryBreakdown.length === 0 && (
                <p className="py-2 text-sm font-medium text-muted-foreground">
                  No playlists yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

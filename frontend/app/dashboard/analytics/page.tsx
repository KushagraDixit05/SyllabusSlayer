import { auth } from '@/lib/auth'
import { analyticsService } from '@/lib/analytics/service'
import { AnalyticsContent } from '@/components/analytics/AnalyticsContent'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const analytics = await analyticsService.getUserAnalytics(session.user.id)

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load analytics. Please try again later.</p>
      </div>
    )
  }

  return <AnalyticsContent analytics={analytics} />
}

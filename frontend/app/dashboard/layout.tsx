import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { CommandMenu } from '@/components/dashboard/CommandMenu'
import { GlobalAchievementNotifier } from '@/components/achievements/GlobalAchievementNotifier'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <CommandMenu />
        <GlobalAchievementNotifier />
        <OnboardingTour />
      </div>
    </ProtectedRoute>
  )
}

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { CommandMenu } from '@/components/dashboard/CommandMenu'
import { GlobalAchievementNotifier } from '@/components/achievements/GlobalAchievementNotifier'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import { auth } from '@/lib/auth'
import { userRepository } from '@/lib/repositories/userRepository'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const userProfile = session?.user?.id
    ? await userRepository.getProfile(session.user.id)
    : null

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            currentStreak={userProfile?.current_streak ?? 0}
            hoursSaved={userProfile?.total_hours_completed ?? 0}
          />
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

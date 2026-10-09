import { auth } from '@/lib/auth'
import { syncUserToDatabase } from '@/lib/auth-helpers'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { userRepository } from '@/lib/repositories/userRepository'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { ActivePlaylists } from '@/components/dashboard/ActivePlaylists'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { activityRepository } from '@/lib/repositories/activityRepository'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id
  
  // Sync user to database (creates profile if doesn't exist)
  await syncUserToDatabase({
    id: userId,
    email: session!.user.email,
    name: session!.user.name,
    image: session!.user.image,
  })
  
  const [playlists, userProfile, allPlaylists, activityData] = await Promise.all([
    playlistRepository.getActivePlaylistsByUserId(userId),
    userRepository.getProfile(userId),
    playlistRepository.getByUserId(userId),
    activityRepository.getDailyActivityCounts(userId),
  ])

  const completedPlaylists = allPlaylists.filter((p) => p.status === 'completed').length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tactical Cockpit"
        title={
          <>
            Welcome back,{' '}
            <span className="text-gradient-brand">
              {userProfile?.display_name || session?.user?.name}
            </span>
          </>
        }
        actions={<QuickActions />}
      />

      <DashboardStats userId={userId} userProfile={userProfile} activePlaylistsCount={playlists.length} />

      <div className="grid gap-6 md:grid-cols-2">
        <ActivePlaylists playlists={playlists} />
        <RecentActivity userId={userId} />
      </div>

      <ProgressOverview
        activePlaylists={playlists.length}
        completedPlaylists={completedPlaylists}
        totalPlaylists={allPlaylists.length}
        currentStreak={userProfile?.current_streak ?? 0}
        longestStreak={userProfile?.longest_streak ?? 0}
        activityData={activityData}
        xp={userProfile?.xp ?? 0}
      />
    </div>
  )
}

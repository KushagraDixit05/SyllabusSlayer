import { auth } from '@/lib/auth'
import { syncUserToDatabase } from '@/lib/auth-helpers'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { userRepository } from '@/lib/repositories/userRepository'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { ActivePlaylists } from '@/components/dashboard/ActivePlaylists'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

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
  
  const [playlists, userProfile] = await Promise.all([
    playlistRepository.getActivePlaylistsByUserId(userId),
    userRepository.getProfile(userId),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.display_name || session?.user?.name}!
          </p>
        </div>
        <QuickActions />
      </div>

      <DashboardStats userId={userId} userProfile={userProfile} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <ActivePlaylists playlists={playlists} />
        <RecentActivity userId={userId} />
      </div>
    </div>
  )
}

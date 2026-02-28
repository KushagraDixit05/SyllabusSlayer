import { auth } from '@/lib/auth'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { PlaylistsClient } from './PlaylistsClient'

export default async function PlaylistsPage() {
  const session = await auth()
  const userId = session!.user.id

  const playlists = await playlistRepository.getByUserId(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Playlists</h1>
          <p className="text-muted-foreground">
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      <PlaylistsClient playlists={playlists} />
    </div>
  )
}

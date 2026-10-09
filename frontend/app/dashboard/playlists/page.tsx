import { auth } from '@/lib/auth'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { PlaylistsClient } from './PlaylistsClient'

export default async function PlaylistsPage() {
  const session = await auth()
  const userId = session!.user.id

  const playlists = await playlistRepository.getByUserId(userId)

  return (
    <div className="space-y-6">
      {/* PlaylistsClient renders the page header; it owns the filter state that
          the header's counts depend on. */}
      <PlaylistsClient playlists={playlists} />
    </div>
  )
}

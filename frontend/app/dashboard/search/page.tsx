import { auth } from '@/lib/auth'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { redirect } from 'next/navigation'
import { SearchClient } from './SearchClient'

export default async function SearchPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const playlists = await playlistRepository.getByUserId(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find playlists and videos across your library
        </p>
      </div>
      <SearchClient playlists={playlists} />
    </div>
  )
}

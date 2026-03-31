import { auth } from '@/lib/auth'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { notFound } from 'next/navigation'
import { PlaylistDetailClient } from './PlaylistDetailClient'

interface PlaylistDetailPageProps {
    params: { id: string }
}

export default async function PlaylistDetailPage({ params }: PlaylistDetailPageProps) {
    const session = await auth()
    if (!session?.user?.id) return notFound()

    const result = await playlistRepository.getByIdWithVideos(params.id)
    if (!result) return notFound()

    // Ensure the user owns this playlist
    if (result.playlist.user_id !== session.user.id) return notFound()

    return (
        <PlaylistDetailClient
            playlist={result.playlist}
            videos={result.videos}
        />
    )
}

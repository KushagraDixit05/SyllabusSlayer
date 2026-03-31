'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore'
import type { Playlist, Video } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Clock,
    ListVideo,
    CheckCircle2,
    ExternalLink,
    Play,
    BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaylistDetailClientProps {
    playlist: Playlist
    videos: Video[]
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    planning: {
        label: 'Planning',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: <BookOpen className="h-3 w-3" />,
    },
    in_progress: {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <Play className="h-3 w-3" />,
    },
    completed: {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
}

export function PlaylistDetailClient({ playlist, videos: initialVideos }: PlaylistDetailClientProps) {
    const { currentVideos, setCurrentPlaylist, setCurrentVideos, toggleVideoCompletion } =
        useSavedPlaylistStore()

    // Initialize store with server-fetched data
    useEffect(() => {
        setCurrentPlaylist(playlist)
        setCurrentVideos(initialVideos)
        return () => {
            setCurrentPlaylist(null)
            setCurrentVideos([])
        }
    }, [playlist, initialVideos, setCurrentPlaylist, setCurrentVideos])

    const videos = currentVideos.length > 0 ? currentVideos : initialVideos

    const completedCount = videos.filter((v) => v.is_completed).length
    const totalCount = videos.length
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const totalDurationCompleted = videos
        .filter((v) => v.is_completed)
        .reduce((sum, v) => sum + v.duration, 0)

    const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

    const handleToggle = async (videoId: string, currentState: boolean) => {
        setTogglingIds((prev) => new Set(prev).add(videoId))
        const newState = !currentState

        try {
            await toggleVideoCompletion(videoId, playlist.id, newState)
            toast.success(newState ? 'Video marked as completed ✓' : 'Video marked as incomplete')
        } catch {
            toast.error('Failed to update video status')
        } finally {
            setTogglingIds((prev) => {
                const next = new Set(prev)
                next.delete(videoId)
                return next
            })
        }
    }

    const status = STATUS_CONFIG[playlist.status] ?? STATUS_CONFIG.planning

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/dashboard/playlists">
                    <Button variant="outline" size="icon" className="shrink-0 mt-1">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold tracking-tight truncate">{playlist.title}</h1>
                        <span
                            className={cn(
                                'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                status.color
                            )}
                        >
                            {status.icon}
                            {status.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                            <ListVideo className="h-3.5 w-3.5" />
                            {totalCount} videos
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDuration(playlist.total_duration)}
                        </span>
                        <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {completedCount}/{totalCount} completed
                        </span>
                        {playlist.youtube_playlist_id && (
                            <a
                                href={`https://www.youtube.com/playlist?list=${playlist.youtube_playlist_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                YouTube
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-muted-foreground">
                            {percentage}% • {formatDuration(totalDurationCompleted)} of{' '}
                            {formatDuration(playlist.total_duration)} watched
                        </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                </CardContent>
            </Card>

            {/* Video List */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Videos</CardTitle>
                        <Badge variant="secondary">
                            {completedCount}/{totalCount}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {videos.map((video, index) => {
                            const isToggling = togglingIds.has(video.id)
                            return (
                                <div
                                    key={video.id}
                                    className={cn(
                                        'flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg transition-colors',
                                        video.is_completed && 'opacity-60',
                                        isToggling && 'opacity-40 pointer-events-none',
                                        !video.is_completed && 'hover:bg-accent/50'
                                    )}
                                >
                                    <Checkbox
                                        id={`video-${video.id}`}
                                        checked={video.is_completed}
                                        onCheckedChange={() => handleToggle(video.id, video.is_completed)}
                                        disabled={isToggling}
                                        className="shrink-0"
                                    />

                                    <span className="w-8 text-center text-xs text-muted-foreground font-mono shrink-0">
                                        {index + 1}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <label
                                            htmlFor={`video-${video.id}`}
                                            className={cn(
                                                'text-sm font-medium cursor-pointer truncate block',
                                                video.is_completed && 'line-through text-muted-foreground'
                                            )}
                                        >
                                            {video.title}
                                        </label>
                                        {video.youtube_video_id && (
                                            <a
                                                href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Watch on YouTube ↗
                                            </a>
                                        )}
                                    </div>

                                    <span className="text-xs text-muted-foreground shrink-0 font-mono">
                                        {formatDuration(video.duration)}
                                    </span>

                                    {video.is_completed && (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {videos.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            <ListVideo className="mx-auto h-10 w-10 opacity-50 mb-3" />
                            <p>No videos in this playlist</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

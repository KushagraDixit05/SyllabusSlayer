'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Playlist } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ListVideo,
  Clock,
  Play,
  CheckCircle2,
  BookOpen,
  Plus,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'planning' | 'in_progress' | 'completed'

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
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

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

interface PlaylistsClientProps {
  playlists: Playlist[]
}

export function PlaylistsClient({ playlists }: PlaylistsClientProps) {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const counts = {
    all: playlists.length,
    planning: playlists.filter((p) => p.status === 'planning').length,
    in_progress: playlists.filter((p) => p.status === 'in_progress').length,
    completed: playlists.filter((p) => p.status === 'completed').length,
  }

  const filtered = playlists.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-16 text-center">
        <ListVideo className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">No playlists yet</h2>
        <p className="text-muted-foreground mb-6">
          Analyze a YouTube playlist to get started with your study plan.
        </p>
        <Button asChild>
          <Link href="/planner">
            <Plus className="mr-2 h-4 w-4" />
            New Playlist
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'planning', 'in_progress', 'completed'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 rounded-full bg-background/30 px-1.5 py-0.5 text-xs">
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No playlists match your search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((playlist) => {
            const status = STATUS_LABELS[playlist.status] ?? STATUS_LABELS.planning
            return (
              <Card key={playlist.id} className="flex flex-col hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                {playlist.thumbnail_url ? (
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={playlist.thumbnail_url}
                      alt={playlist.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-t-lg bg-gradient-to-br from-primary/10 to-primary/30">
                    <ListVideo className="h-12 w-12 text-primary/60" />
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2 leading-snug">
                      {playlist.title}
                    </CardTitle>
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
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListVideo className="h-3.5 w-3.5" />
                      {playlist.video_count} videos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(playlist.total_duration)}
                    </span>
                  </div>

                  {/* Progress */}
                  {playlist.status !== 'planning' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(playlist.completion_percentage)}%</span>
                      </div>
                      <Progress value={playlist.completion_percentage} className="h-1.5" />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}
                    </span>
                    {playlist.youtube_playlist_id && (
                      <a
                        href={`https://www.youtube.com/playlist?list=${playlist.youtube_playlist_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View on YouTube
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* CTA to create more */}
      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <Link href="/planner">
            <Plus className="mr-2 h-4 w-4" />
            New Playlist
          </Link>
        </Button>
      </div>
    </div>
  )
}

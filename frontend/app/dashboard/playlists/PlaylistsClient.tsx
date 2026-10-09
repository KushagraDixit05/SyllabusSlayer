'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Playlist } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
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
import { PageHeader } from '@/components/dashboard/PageHeader'
import { ViewControls } from '@/components/dashboard/ViewControls'
import { useViewStore } from '@/store/useViewStore'

type StatusFilter = 'all' | 'planning' | 'in_progress' | 'completed'

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  planning: {
    label: 'Planning',
    color: 'bg-primary text-primary-foreground',
    icon: <BookOpen className="h-3 w-3" />,
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-flame-from text-primary-foreground',
    icon: <Play className="h-3 w-3" />,
  },
  completed: {
    label: 'Completed',
    color: 'bg-chart-3 text-primary-foreground',
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
  const sortOrder = useViewStore((s) => s.sortOrder)

  const counts = {
    all: playlists.length,
    planning: playlists.filter((p) => p.status === 'planning').length,
    in_progress: playlists.filter((p) => p.status === 'in_progress').length,
    completed: playlists.filter((p) => p.status === 'completed').length,
  }

  const filtered = playlists
    .filter((p) => {
      const matchesFilter = filter === 'all' || p.status === filter
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'progress':
          return b.completion_percentage - a.completion_percentage
        case 'duration':
          return b.total_duration - a.total_duration
        case 'recent':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  if (playlists.length === 0) {
    return (
      <div className="rounded-lg flex flex-col items-center justify-center border-[3px] border-dashed border-ink p-16 text-center">
        <ListVideo className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 font-display text-xl font-black">No playlists yet</h2>
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
      <PageHeader
        eyebrow="Library"
        title="My Playlists"
        description={`${playlists.length} ${playlists.length === 1 ? 'playlist' : 'playlists'} saved`}
        actions={
          <Button asChild>
            <Link href="/planner">
              <Plus className="mr-2 h-4 w-4" />
              New Playlist
            </Link>
          </Button>
        }
      />

      {/* Filter pills + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'planning', 'in_progress', 'completed'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'border-[3px] border-ink px-4 py-1.5 text-xs font-bold transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground shadow-brutal-sm'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              )}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span
                className={cn(
                  'ml-1.5 border-[3px] border-ink px-1.5 text-xs tabular-nums',
                  filter === f ? 'bg-background text-foreground' : 'bg-muted'
                )}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ViewControls />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search playlists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border-[3px] border-dashed border-ink py-16 text-center text-sm font-medium text-muted-foreground">
          No playlists match your search.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((playlist) => {
            const status = STATUS_LABELS[playlist.status] ?? STATUS_LABELS.planning
            const notStarted = playlist.completion_percentage === 0
            return (
              <Link key={playlist.id} href={`/dashboard/playlists/${playlist.id}`}>
                <Card className="flex h-full flex-col overflow-hidden brutal-lift">
                  {/* Thumbnail */}
                  <div className="relative h-40 overflow-hidden">
                    {playlist.thumbnail_url ? (
                      <>
                        <img
                          src={playlist.thumbnail_url}
                          alt={playlist.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
                        <span className="px-4 text-center text-xs font-medium text-muted-foreground/70 line-clamp-2">
                          {playlist.title}
                        </span>
                      </div>
                    )}
                    <span
                      className={cn(
                        'absolute left-3 top-3 flex items-center gap-1 border-[3px] border-ink px-2 py-0.5 text-xs font-bold',
                        status.color
                      )}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-3 p-4">
                    <h3 className="line-clamp-2 font-display text-base font-black leading-snug">
                      {playlist.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Play className="h-3.5 w-3.5" />
                        {playlist.video_count} videos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(playlist.total_duration)}
                      </span>
                    </div>

                    <div className="mt-auto space-y-1">
                      {notStarted ? (
                        <p className="text-xs text-muted-foreground">
                          Not started yet • Ready to schedule
                        </p>
                      ) : (
                        <>
                          <div className="flex justify-between text-xs font-bold text-muted-foreground">
                            <span>Progress</span>
                            <span
                              className={cn(
                                'font-medium',
                                playlist.status === 'completed' ? 'text-chart-3' : 'text-foreground'
                              )}
                            >
                              {Math.round(playlist.completion_percentage)}%
                            </span>
                          </div>
                          <Progress value={playlist.completion_percentage} />
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(playlist.updated_at), { addSuffix: true })}
                      </span>
                      {playlist.youtube_playlist_id && (
                        <a
                          href={`https://www.youtube.com/playlist?list=${playlist.youtube_playlist_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-foreground hover:underline"
                        >
                          View on YouTube ↗
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

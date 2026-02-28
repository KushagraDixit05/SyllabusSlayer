'use client'

import { useMemo, useState } from 'react'
import type { Playlist } from '@/types/database'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Search,
  ListVideo,
  Clock,
  BookOpen,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
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

interface SearchClientProps {
  playlists: Playlist[]
}

export function SearchClient({ playlists }: SearchClientProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.status.toLowerCase().includes(q)
    )
  }, [query, playlists])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search by playlist name, description, or status..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>

      {/* Results */}
      {query.trim() === '' ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">Start typing to search your playlists</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Search across {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            No playlists matching &quot;{query}&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((playlist) => {
            const status = STATUS_CONFIG[playlist.status] ?? STATUS_CONFIG.planning
            return (
              <Card key={playlist.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  {playlist.thumbnail_url ? (
                    <img
                      src={playlist.thumbnail_url}
                      alt=""
                      className="h-16 w-24 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-md bg-muted flex-shrink-0">
                      <ListVideo className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{playlist.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ListVideo className="h-3.5 w-3.5" />
                        {playlist.video_count} videos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(playlist.total_duration)}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={cn(
                      'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      status.color
                    )}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

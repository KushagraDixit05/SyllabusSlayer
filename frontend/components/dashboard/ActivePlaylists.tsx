'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PlaySquare, Clock, BarChart3 } from 'lucide-react'
import type { Playlist } from '@/types/database'
import { formatDuration } from '@/lib/helpers'

interface ActivePlaylistsProps {
  playlists: Playlist[]
}

export function ActivePlaylists({ playlists }: ActivePlaylistsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Playlists</CardTitle>
            <CardDescription>Your current learning projects</CardDescription>
          </div>
          <Link href="/dashboard/playlists">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {playlists.length === 0 ? (
          <div className="text-center py-8">
            <PlaySquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-2 text-sm font-semibold">No active playlists</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new playlist
            </p>
            <div className="mt-6">
              <Link href="/planner">
                <Button>Create Playlist</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {playlists.slice(0, 3).map((playlist) => (
              <div
                key={playlist.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold line-clamp-1">{playlist.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(playlist.total_duration)}</span>
                      <span>•</span>
                      <span>{playlist.video_count} videos</span>
                    </div>
                  </div>
                  <Badge variant={playlist.status === 'in_progress' ? 'default' : 'secondary'}>
                    {playlist.status === 'in_progress' ? 'In Progress' : 'Planning'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{playlist.completion_percentage}%</span>
                  </div>
                  <Progress value={playlist.completion_percentage} className="h-2" />
                </div>

                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/playlists/${playlist.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, Clock } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  username: string
  value: number
  isCurrentUser?: boolean
}

interface LeaderboardTableProps {
  hoursLeaderboard: LeaderboardEntry[]
  streakLeaderboard: LeaderboardEntry[]
  completionLeaderboard: LeaderboardEntry[]
}

function getRankIcon(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

function renderTable(data: LeaderboardEntry[], suffix: string) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Trophy className="mx-auto h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">No data yet. Be the first to opt in!</p>
      </div>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Rank</TableHead>
          <TableHead>Username</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow
            key={entry.rank}
            className={entry.isCurrentUser ? 'bg-primary/5' : ''}
          >
            <TableCell className="font-medium text-lg">
              {getRankIcon(entry.rank)}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span>{entry.username}</span>
                {entry.isCurrentUser && (
                  <Badge variant="secondary">You</Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold">
              {entry.value}
              {suffix}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function LeaderboardTable({
  hoursLeaderboard,
  streakLeaderboard,
  completionLeaderboard,
}: LeaderboardTableProps) {
  return (
    <Tabs defaultValue="hours" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="hours">
          <Clock className="mr-2 h-4 w-4" />
          Hours Planned
        </TabsTrigger>
        <TabsTrigger value="streak">
          <Flame className="mr-2 h-4 w-4" />
          Longest Streak
        </TabsTrigger>
        <TabsTrigger value="completion">
          <Trophy className="mr-2 h-4 w-4" />
          Most Completed
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hours">
        {renderTable(hoursLeaderboard, 'h')}
      </TabsContent>

      <TabsContent value="streak">
        {renderTable(streakLeaderboard, 'd')}
      </TabsContent>

      <TabsContent value="completion">
        {renderTable(completionLeaderboard, '')}
      </TabsContent>
    </Tabs>
  )
}

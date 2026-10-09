'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OptInDialog } from '@/components/leaderboard/OptInDialog'
import { userRepository } from '@/lib/repositories/userRepository'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Clock, Flame, Trophy, Crown, Medal, Award, Sparkles } from 'lucide-react'
import type { LeaderboardCategory, LeaderboardEntry } from '@/lib/repositories/leaderboardRepository'

interface CategoryData {
  entries: LeaderboardEntry[]
  userRank: { rank: number; value: number } | null
}

interface LeaderboardViewProps {
  isOptedIn: boolean
  data: Record<LeaderboardCategory, CategoryData>
}

const CATEGORIES: { key: LeaderboardCategory; label: string; icon: typeof Clock; unit: string }[] = [
  { key: 'hours', label: 'Hours Planned', icon: Clock, unit: 'h' },
  { key: 'streak', label: 'Longest Streak', icon: Flame, unit: 'd' },
  { key: 'completion', label: 'Most Completed', icon: Trophy, unit: '' },
]

function initials(username: string) {
  return username.slice(0, 2).toUpperCase()
}

const PODIUM_STYLE = {
  1: {
    icon: Crown,
    ring: 'shadow-[8px_8px_0_0_hsl(var(--gold))]',
    badge: 'bg-gold text-primary-foreground',
    avatar: 'bg-gold text-primary-foreground',
    value: 'text-foreground',
  },
  2: {
    icon: Medal,
    ring: '',
    badge: 'bg-muted text-foreground',
    avatar: 'bg-primary text-primary-foreground',
    value: 'text-foreground',
  },
  3: {
    icon: Award,
    ring: 'shadow-[8px_8px_0_0_hsl(var(--flame-to))]',
    badge: 'bg-flame-from text-primary-foreground',
    avatar: 'bg-flame-from text-primary-foreground',
    value: 'text-foreground',
  },
} as const

export function LeaderboardView({ isOptedIn: initialOptedIn, data: initialData }: LeaderboardViewProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [active, setActive] = useState<LeaderboardCategory>('hours')
  const [optInOpen, setOptInOpen] = useState(false)
  const [isOptedIn, setIsOptedIn] = useState(initialOptedIn)

  const config = CATEGORIES.find((c) => c.key === active)!
  const { entries, userRank } = initialData[active]
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)
  const podiumOrder = [top3[1], top3[0], top3[2]] // silver, gold, bronze layout

  const handleOptIn = async (username: string) => {
    if (!session?.user?.id) return
    await userRepository.optInToLeaderboard(session.user.id, username)
    setIsOptedIn(true)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rankings"
        title="Leaderboard"
        description="See how you rank against other learners"
      />

      {/* Summary cards / opt-in CTA */}
      {isOptedIn ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground">Your Rank</p>
                <p className="mt-2 font-display text-4xl font-black leading-none tabular-nums">{userRank ? `#${userRank.rank}` : '—'}</p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {userRank ? (userRank.rank <= 10 ? 'Top 10 standing' : 'Keep climbing') : 'Not ranked yet'}
                </p>
              </div>
              <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground">Your Score</p>
                <p className="mt-2 font-display text-4xl font-black leading-none tabular-nums">
                  {userRank ? userRank.value : 0}
                  {config.unit}
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {active === 'hours' ? 'Verified curriculum hours' : active === 'streak' ? 'Longest daily streak' : 'Playlists completed'}
                </p>
              </div>
              <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-rarity-rare text-primary-foreground">
                <config.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground">Category</p>
                <p className="mt-2 font-display text-2xl font-black leading-none">{config.label}</p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">Active view</p>
              </div>
              <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-flame-from text-primary-foreground">
                <Trophy className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-accent">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <Trophy className="h-10 w-10" />
              <div>
                <p className="font-medium">You're not on the leaderboard yet</p>
                <p className="text-sm text-muted-foreground">Opt in to see your rank and compete with other learners</p>
              </div>
            </div>
            <Button onClick={() => setOptInOpen(true)}>
              <Trophy className="mr-2 h-4 w-4" />
              Join Leaderboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tab bar */}
      <div className="rounded-full flex gap-1 border-[3px] border-ink bg-muted p-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs font-bold transition-colors',
              active === c.key ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active === c.key && (
              <motion.span
                layoutId="leaderboard-tab-active"
                className="rounded-full absolute inset-0 border-[3px] border-ink bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <c.icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{c.label}</span>
          </button>
        ))}
      </div>

      {/* Podium */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Trophy className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No rankings yet. Be the first to opt in!</p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {podiumOrder.map((entry, i) => {
              if (!entry) return <div key={`podium-empty-${i}`} className="hidden sm:block" />
              const style = PODIUM_STYLE[entry.rank as 1 | 2 | 3]
              const isFirst = entry.rank === 1
              return (
                <Card
                  key={entry.rank}
                  variant={isFirst ? 'elevated' : 'default'}
                  className={cn('relative overflow-visible pt-6 text-center', style.ring, isFirst && 'sm:-translate-y-3')}
                >
                  <span
                    className={cn(
                      'absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 border-[3px] border-ink px-3 py-1 text-xs font-bold',
                      style.badge
                    )}
                  >
                    <style.icon className="h-3.5 w-3.5" />
                    RANK #{entry.rank}
                  </span>
                  <CardContent className="flex flex-col items-center gap-2 pt-2">
                    <div className={cn('flex h-16 w-16 items-center justify-center border-[3px] border-ink font-display text-lg font-black', style.avatar)}>
                      {initials(entry.username)}
                    </div>
                    <p className="font-display text-base font-black">
                      {entry.username}
                      {entry.isCurrentUser && <Badge variant="secondary" className="ml-2 align-middle">You</Badge>}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">{entry.tier}</p>
                    <p className={cn('mt-1 font-display text-3xl font-black tabular-nums', style.value)}>
                      {entry.value}
                      <span className="text-base font-medium">{config.unit}</span>
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ranks 4+ */}
      {rest.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rest.map((entry) => (
                <TableRow key={entry.rank} className={entry.isCurrentUser ? 'bg-primary/5' : undefined}>
                  <TableCell className="font-mono text-muted-foreground">#{entry.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.username}</span>
                      {entry.isCurrentUser && <Badge variant="secondary">You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {entry.value}
                    {config.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <OptInDialog open={optInOpen} onClose={() => setOptInOpen(false)} onOptIn={handleOptIn} />
    </div>
  )
}

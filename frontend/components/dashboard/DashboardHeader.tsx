'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { UserMenu } from '@/components/auth/UserMenu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StreakFlame } from '@/components/gamification/StreakFlame'
import { Search, Bell, Menu, X } from 'lucide-react'
import { levelForXp } from '@/lib/gamification/xpCurve'
import { useCommandMenuStore } from '@/store/useCommandMenuStore'
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore'

interface DashboardHeaderProps {
  currentStreak?: number
  hoursSaved?: number
  xp?: number
}

export function DashboardHeader({ currentStreak = 0, hoursSaved = 0, xp = 0 }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const level = levelForXp(xp)

  const openCommandMenu = useCommandMenuStore((s) => s.setOpen)

  // Real pending count, replacing a hardcoded `3`. Read after mount so the
  // server and client markup agree.
  const pendingAchievements = useSavedPlaylistStore((s) => s.pendingAchievements)
  const pendingMilestones = useSavedPlaylistStore((s) => s.pendingMilestones)
  const pendingCount = mounted
    ? pendingAchievements.length + pendingMilestones.length
    : 0

  useEffect(() => setMounted(true), [])

  const notificationBell = (
    <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
      <Bell className="h-5 w-5" />
      {pendingCount > 0 && (
        <span className="rounded-full absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border-[3px] border-ink bg-destructive font-mono text-[10px] font-bold text-destructive-foreground">
          {pendingCount}
        </span>
      )}
    </Button>
  )

  return (
    <div className="z-10 h-16 w-full shrink-0 border-b-[3px] border-ink bg-background">
      <div className="mx-auto flex h-full w-full items-center justify-between px-6">
        {/* Left: Search */}
        <div className="flex flex-1 items-center">
          <Button
            variant="outline"
            onClick={() => openCommandMenu(true)}
            className="w-64 justify-start text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            Search...
            <kbd className="rounded-md pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 border-[3px] border-ink bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Right: desktop actions */}
        <div className="hidden items-center space-x-4 md:flex">
          <div className="flex items-center space-x-3">
            <Badge variant="flame" className="gap-1">
              <StreakFlame days={currentStreak} compact iconClassName="h-3.5 w-3.5" />
            </Badge>
            <Badge className="gap-1">
              Lvl {level} &middot; {xp.toLocaleString()} XP
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">
              {hoursSaved}h saved
            </span>
          </div>

          {notificationBell}
          {session && <UserMenu session={session} />}
        </div>

        {/* Mobile: hamburger */}
        {!mobileOpen && (
          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 ${
          mobileOpen ? 'left-0' : 'left-[-100%]'
        } z-50 flex h-full w-4/5 flex-col gap-8 border-r-[3px] border-ink bg-card p-10 duration-300 ease-in`}
      >
        <div className="flex items-center justify-between border-b-[3px] border-ink pb-4">
          <span className="font-display text-xl font-black tracking-tight">Menu</span>
          <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg flex items-center justify-between border-[3px] border-ink p-3">
            <span className="text-xs font-bold text-muted-foreground">
              Streak
            </span>
            <Badge variant="flame">
              <StreakFlame days={currentStreak} compact iconClassName="h-3.5 w-3.5" />
            </Badge>
          </div>
          <div className="rounded-lg flex items-center justify-between border-[3px] border-ink p-3">
            <span className="text-xs font-bold text-muted-foreground">
              Level
            </span>
            <Badge>Lvl {level} &middot; {xp.toLocaleString()} XP</Badge>
          </div>
          <div className="rounded-lg flex items-center justify-between border-[3px] border-ink p-3">
            <span className="text-xs font-bold text-muted-foreground">
              Hours saved
            </span>
            <Badge variant="secondary">{hoursSaved}h</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session && <UserMenu session={session} />}
          {notificationBell}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useSession } from 'next-auth/react'
import { UserMenu } from '@/components/auth/UserMenu'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Search, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      {/* Left: Search */}
      <div className="flex items-center flex-1">
        <Button
          variant="outline"
          className="w-64 justify-start text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Search... 
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Streak:</span>
            <Badge variant="secondary">7 days 🔥</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Hours saved:</span>
            <Badge variant="secondary">47h</Badge>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {session && <UserMenu session={session} />}
      </div>
    </header>
  )
}

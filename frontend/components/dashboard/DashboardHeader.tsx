'use client'

import { UserMenu } from '@/components/auth/UserMenu'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'

export function DashboardHeader() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-6 gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search playlists..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  )
}

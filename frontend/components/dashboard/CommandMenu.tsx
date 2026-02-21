'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  LayoutDashboard,
  ListVideo,
  Trophy,
  TrendingUp,
  Settings,
  Search,
  Plus,
  HelpCircle,
} from 'lucide-react'

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden">
        <Command className="rounded-lg border-0 shadow-none">
          <Command.Input
            placeholder="Type a command or search..."
            className="h-12 px-4 text-base border-b"
          />
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/playlists'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <ListVideo className="h-4 w-4" />
                <span>Playlists</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/achievements'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <Trophy className="h-4 w-4" />
                <span>Achievements</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/analytics'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/help'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/planner'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>New Playlist</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard/search'))}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Search Playlists</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

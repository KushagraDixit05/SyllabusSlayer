'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  ListVideo,
  Trophy,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronLeft,
  Plus,
  BookOpen,
  Search,
} from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Playlists', href: '/dashboard/playlists', icon: ListVideo },
  { name: 'Planner', href: '/planner', icon: BookOpen },
  { name: 'Search', href: '/dashboard/search', icon: Search },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col border-r bg-sidebar text-sidebar-foreground"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-accent">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">SS</span>
            </div>
            <span className="font-bold text-lg">Syllabus Slayer</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <Button
          asChild
          className="w-full justify-start"
          size={collapsed ? 'icon' : 'default'}
          data-tour="new-playlist"
        >
          <Link href="/planner">
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Playlist</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground',
                  collapsed && 'justify-center'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-sidebar-accent p-4">
          <div className="text-xs text-sidebar-foreground/60">
            <p>Made with ❤️ for learners</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        </div>
      )}
    </motion.aside>
  )
}

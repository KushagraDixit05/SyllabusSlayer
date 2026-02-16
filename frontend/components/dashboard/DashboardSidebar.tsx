'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  PlaySquare, 
  Calendar, 
  Trophy, 
  Settings,
  Zap,
  BookOpen,
  BarChart3
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Playlists', href: '/dashboard/playlists', icon: PlaySquare },
  { name: 'Planner', href: '/planner', icon: Calendar },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

const quickLinks = [
  { name: 'Templates', href: '/dashboard/templates', icon: BookOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r bg-background">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Syllabus Slayer</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="pt-6">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Links
          </p>
          <div className="space-y-1">
            {quickLinks.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <p className="text-sm font-semibold mb-1">🎯 Pro Tip</p>
          <p className="text-xs text-muted-foreground">
            Use keyboard shortcuts to navigate faster. Press{' '}
            <kbd className="px-1 py-0.5 text-xs bg-background border rounded">?</kbd>{' '}
            for help.
          </p>
        </div>
      </div>
    </aside>
  )
}

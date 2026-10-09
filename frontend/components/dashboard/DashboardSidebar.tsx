'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar'
import { Logo } from '@/components/brand/Logo'
import {
  LayoutDashboard,
  ListVideo,
  Trophy,
  Crown,
  TrendingUp,
  Settings,
  HelpCircle,
  Plus,
  Search,
  LogOut,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
  /** Match the path exactly instead of by prefix — for routes that are a prefix of others. */
  exact?: boolean
}

const navigation: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Playlists', href: '/dashboard/playlists', icon: ListVideo },
  { label: 'New Playlist', href: '/planner', icon: Plus },
  { label: 'Search', href: '/dashboard/search', icon: Search },
  { label: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: Crown },
  { label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

/**
 * Exactly one nav item wins: the longest href that matches the current path.
 * The index route matches exactly, so `/dashboard` does not claim its children.
 */
function resolveActiveHref(pathname: string) {
  return navigation
    .filter((item) =>
      item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(item.href + '/')
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href
}

const SidebarHeading = () => {
  const { expanded } = useSidebar()

  return (
    <Link
      href="/dashboard"
      className={cn(
        'relative z-20 flex min-w-0 items-center gap-2 py-1 text-sm font-normal',
        expanded ? 'justify-start' : 'justify-center'
      )}
    >
      <Logo size={32} className="shrink-0 rounded-lg" />
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-base font-bold text-foreground transition-opacity duration-150',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        Syllabus Slayer
      </span>
    </Link>
  )
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const activeHref = resolveActiveHref(pathname)

  const navLinks = navigation.map((item) => {
    const isActive = item.href === activeHref
    const Icon = item.icon
    return {
      label: item.label,
      href: item.href,
      active: isActive,
      icon: (
        <Icon
          className={cn(
            'h-5 w-5 shrink-0 transition-colors',
            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        />
      ),
    }
  })

  const userLink = {
    label: session?.user?.name ?? 'Profile',
    href: '/dashboard/profile',
    active: pathname === '/dashboard/profile',
    icon: session?.user?.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={session.user.image}
        className="h-9 w-9 shrink-0 rounded-full border-[3px] border-ink object-cover"
        width={36}
        height={36}
        alt={session.user.name ?? 'User avatar'}
      />
    ) : (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-primary">
        <span className="font-display text-sm font-black text-primary-foreground">
          {(session?.user?.name ?? 'U').slice(0, 1).toUpperCase()}
        </span>
      </div>
    ),
  }

  const logoutLink = {
    label: 'Logout',
    href: '/api/auth/signout',
    icon: (
      <LogOut className="h-5 w-5 shrink-0 text-muted-foreground" />
    ),
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-4">
        {/* Top: logo + nav. The -mx-1 px-1 gutter keeps the active pill's
            offset shadow inside the scroll container's padding box. */}
        <div className="-mx-1 flex flex-1 flex-col overflow-y-auto px-1">
          <SidebarHeading />
          <div className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <SidebarLink key={link.href + link.label} link={link} />
            ))}
          </div>
        </div>

        {/* Bottom: user profile + logout */}
        <div className="-mx-1 flex shrink-0 flex-col gap-2 px-1">
          <SidebarLink link={userLink} />
          <SidebarLink link={logoutLink} />
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

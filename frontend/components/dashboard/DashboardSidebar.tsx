'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  ListVideo,
  Trophy,
  TrendingUp,
  Settings,
  HelpCircle,
  Plus,
  BookOpen,
  Search,
  LogOut,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Playlists', href: '/dashboard/playlists', icon: ListVideo },
  { label: 'Planner', href: '/planner', icon: BookOpen },
  { label: 'Search', href: '/dashboard/search', icon: Search },
  { label: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { label: 'New Playlist', href: '/planner', icon: Plus },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

const SidebarLogo = () => (
  <Link
    href="/dashboard"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
      <span className="text-primary-foreground font-bold text-sm">SS</span>
    </div>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-bold text-base whitespace-pre text-foreground"
    >
      Syllabus Slayer
    </motion.span>
  </Link>
)

const SidebarLogoIcon = () => (
  <Link href="/dashboard" className="relative z-20 flex items-center justify-center py-1">
    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
      <span className="text-primary-foreground font-bold text-sm">SS</span>
    </div>
  </Link>
)

export function DashboardSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const navLinks = navigation.map((item) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + '/')
    const Icon = item.icon
    return {
      label: item.label,
      href: item.href,
      icon: (
        <Icon
          className={cn(
            'h-5 w-5 shrink-0 transition-colors',
            isActive ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'
          )}
        />
      ),
    }
  })

  const userLink = {
    label: session?.user?.name ?? 'Profile',
    href: '/dashboard/settings',
    icon: session?.user?.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={session.user.image}
        className="h-7 w-7 shrink-0 rounded-full object-cover"
        width={28}
        height={28}
        alt={session.user.name ?? 'User avatar'}
      />
    ) : (
      <div className="h-7 w-7 shrink-0 rounded-full bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-xs">
          {(session?.user?.name ?? 'U').slice(0, 1).toUpperCase()}
        </span>
      </div>
    ),
  }

  const logoutLink = {
    label: 'Logout',
    href: '/api/auth/signout',
    icon: (
      <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        {/* Top: logo + nav */}
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <SidebarLogo /> : <SidebarLogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <SidebarLink key={link.href + link.label} link={link} />
            ))}
          </div>
        </div>

        {/* Bottom: user profile + logout */}
        <div className="flex flex-col gap-2">
          <SidebarLink link={userLink} />
          <SidebarLink link={logoutLink} />
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

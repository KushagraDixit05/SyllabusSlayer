'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { UserMenu } from '@/components/auth/UserMenu'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Bell } from 'lucide-react'
import { FaBars, FaTimes } from 'react-icons/fa'

export function DashboardHeader() {
  const { data: session } = useSession()
  const [pageScroll, setPageScroll] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setPageScroll(window.scrollY >= 90)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`w-full h-16 z-10 bg-black text-white duration-300 ease-in transition-all ${
        pageScroll ? 'backdrop-blur-md bg-black/80' : ''
      }`}
    >
      <div className="flex justify-between items-center w-full h-full mx-auto px-6">
        {/* Left: Search */}
        <div className="flex items-center flex-1">
          <Button
            variant="outline"
            className="w-64 justify-start bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <Search className="mr-2 h-4 w-4" />
            Search...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/50">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Right: desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-white/60">Streak:</span>
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                7 days 🔥
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white/60">Hours saved:</span>
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                47h
              </Badge>
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
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

        {/* Mobile: hamburger */}
        {!mobileOpen && (
          <div className="md:hidden cursor-pointer" onClick={() => setMobileOpen(true)}>
            <FaBars size={24} />
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      <div
        className={
          mobileOpen
            ? 'md:hidden fixed left-0 top-0 w-full h-full bg-black/70 backdrop-blur z-40'
            : ''
        }
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 ${
          mobileOpen ? 'left-0' : 'left-[-100%]'
        } w-4/5 h-full bg-gradient-to-b from-gray-900 to-black text-white p-10 ease-in duration-300 z-50 flex flex-col gap-8`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-wider uppercase">Menu</span>
          <div className="p-2 cursor-pointer hover:text-white/70 transition-colors" onClick={() => setMobileOpen(false)}>
            <FaTimes size={24} />
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between border border-white/10 rounded-lg p-3">
            <span className="text-white/60">Streak</span>
            <Badge variant="secondary" className="bg-white/10 text-white">7 days 🔥</Badge>
          </div>
          <div className="flex items-center justify-between border border-white/10 rounded-lg p-3">
            <span className="text-white/60">Hours saved</span>
            <Badge variant="secondary" className="bg-white/10 text-white">47h</Badge>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session && <UserMenu session={session} />}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}


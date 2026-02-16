'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, PlaySquare, Calendar, FileText } from 'lucide-react'

export function QuickActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Action
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href="/planner">
          <DropdownMenuItem>
            <PlaySquare className="mr-2 h-4 w-4" />
            New Playlist
          </DropdownMenuItem>
        </Link>
        <Link href="/planner?tab=manual">
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            Manual Entry
          </DropdownMenuItem>
        </Link>
        <Link href="/planner?tab=schedule">
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            Create Schedule
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

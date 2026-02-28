'use client'

import { useViewStore } from '@/store/useViewStore'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LayoutGrid, List, LayoutList } from 'lucide-react'

export function ViewControls() {
  const { playlistView, sortOrder, setPlaylistView, setSortOrder } = useViewStore()

  return (
    <div className="flex items-center space-x-2">
      {/* View Mode */}
      <div className="flex items-center rounded-lg border">
        <Button
          variant={playlistView === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setPlaylistView('grid')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={playlistView === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setPlaylistView('list')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={playlistView === 'compact' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setPlaylistView('compact')}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>

      {/* Sort Order */}
      <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as typeof sortOrder)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="alphabetical">A-Z</SelectItem>
          <SelectItem value="progress">Progress</SelectItem>
          <SelectItem value="duration">Duration</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

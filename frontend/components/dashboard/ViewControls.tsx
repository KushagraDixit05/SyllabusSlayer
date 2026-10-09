'use client'

import { useViewStore } from '@/store/useViewStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Sort control for the playlist library. The grid/list/compact toggle that
 * used to live here was removed: no route ever implemented those layouts, so
 * the buttons changed a persisted value that nothing read.
 */
export function ViewControls() {
  const sortOrder = useViewStore((s) => s.sortOrder)
  const setSortOrder = useViewStore((s) => s.setSortOrder)

  return (
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
  )
}

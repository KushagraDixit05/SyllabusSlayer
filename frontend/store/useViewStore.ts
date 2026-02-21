import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewMode = 'grid' | 'list' | 'compact'
type SortOrder = 'recent' | 'alphabetical' | 'progress' | 'duration'

interface ViewStore {
  playlistView: ViewMode
  sortOrder: SortOrder
  showCompleted: boolean
  
  setPlaylistView: (view: ViewMode) => void
  setSortOrder: (order: SortOrder) => void
  toggleShowCompleted: () => void
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      playlistView: 'grid',
      sortOrder: 'recent',
      showCompleted: true,

      setPlaylistView: (view) => set({ playlistView: view }),
      setSortOrder: (order) => set({ sortOrder: order }),
      toggleShowCompleted: () =>
        set((state) => ({ showCompleted: !state.showCompleted })),
    }),
    {
      name: 'view-preferences',
    }
  )
)

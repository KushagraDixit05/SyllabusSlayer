import { create } from 'zustand'

interface CommandMenuState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

/**
 * The command palette's open state lives here rather than inside CommandMenu
 * so siblings can open it — the header's search button is rendered in a
 * different subtree and previously had no way to.
 */
export const useCommandMenuStore = create<CommandMenuState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}))

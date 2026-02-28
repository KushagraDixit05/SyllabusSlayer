export interface Milestone {
  id: string
  title: string
  message: string
  icon: string
  threshold: number
  type: 'playlists' | 'hours' | 'streak'
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_playlist',
    title: 'Your Journey Begins!',
    message: 'You created your first learning plan',
    icon: '🎉',
    threshold: 1,
    type: 'playlists',
  },
  {
    id: 'five_playlists',
    title: 'Getting Serious!',
    message: "You've completed 5 playlists",
    icon: '🔥',
    threshold: 5,
    type: 'playlists',
  },
  {
    id: 'ten_playlists',
    title: 'Double Digits!',
    message: "You've conquered 10 playlists",
    icon: '🏆',
    threshold: 10,
    type: 'playlists',
  },
  {
    id: 'fifty_hours',
    title: 'Time Architect!',
    message: "You've planned 50 hours of learning",
    icon: '⏰',
    threshold: 50,
    type: 'hours',
  },
]

export function checkMilestone(
  type: Milestone['type'],
  currentValue: number,
  previousValue: number
): Milestone | null {
  const milestone = MILESTONES.find(
    (m) =>
      m.type === type &&
      currentValue >= m.threshold &&
      previousValue < m.threshold
  )

  return milestone || null
}

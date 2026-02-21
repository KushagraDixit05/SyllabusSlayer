export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: 'milestone' | 'streak' | 'speed' | 'volume'
  requirement: {
    type: 'playlist_count' | 'hours_planned' | 'hours_saved' | 'streak_days' | 'speed_mastery'
    threshold: number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Milestone Achievements
  {
    id: 'first_plan',
    name: 'First Steps',
    description: 'Create your first learning plan',
    icon: '🎯',
    category: 'milestone',
    requirement: { type: 'playlist_count', threshold: 1 },
    rarity: 'common',
    points: 10,
  },
  {
    id: 'syllabus_slayer_10',
    name: 'Syllabus Slayer',
    description: 'Complete 10 playlists',
    icon: '📚',
    category: 'milestone',
    requirement: { type: 'playlist_count', threshold: 10 },
    rarity: 'rare',
    points: 100,
  },
  {
    id: 'marathon_50h',
    name: 'Marathon Runner',
    description: 'Plan 50+ hours of content',
    icon: '🏃',
    category: 'volume',
    requirement: { type: 'hours_planned', threshold: 50 },
    rarity: 'epic',
    points: 150,
  },
  {
    id: 'ultra_marathon_100h',
    name: 'Ultra Marathon',
    description: 'Plan 100+ hours of content',
    icon: '🏅',
    category: 'volume',
    requirement: { type: 'hours_planned', threshold: 100 },
    rarity: 'legendary',
    points: 300,
  },

  // Streak Achievements
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', threshold: 3 },
    rarity: 'common',
    points: 25,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', threshold: 7 },
    rarity: 'rare',
    points: 50,
  },
  {
    id: 'streak_30',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', threshold: 30 },
    rarity: 'epic',
    points: 200,
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    category: 'streak',
    requirement: { type: 'streak_days', threshold: 100 },
    rarity: 'legendary',
    points: 500,
  },

  // Speed Achievements
  {
    id: 'speed_demon_50h',
    name: 'Speed Demon',
    description: 'Save 50+ hours through speed optimization',
    icon: '⚡',
    category: 'speed',
    requirement: { type: 'hours_saved', threshold: 50 },
    rarity: 'rare',
    points: 75,
  },
  {
    id: 'speed_demon_100h',
    name: 'Time Bender',
    description: 'Save 100+ hours through speed optimization',
    icon: '⏱️',
    category: 'speed',
    requirement: { type: 'hours_saved', threshold: 100 },
    rarity: 'epic',
    points: 150,
  },
  {
    id: 'two_x_master',
    name: '2x Master',
    description: 'Complete 10 playlists at 2x speed',
    icon: '🚀',
    category: 'speed',
    requirement: { type: 'speed_mastery', threshold: 10 },
    rarity: 'epic',
    points: 200,
  },

  // Early Adopter
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined during beta',
    icon: '🚀',
    category: 'milestone',
    requirement: { type: 'playlist_count', threshold: 1 },
    rarity: 'legendary',
    points: 1000,
  },
]

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export function getAchievementsByCategory(
  category: AchievementDefinition['category']
): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((a) => a.category === category)
}

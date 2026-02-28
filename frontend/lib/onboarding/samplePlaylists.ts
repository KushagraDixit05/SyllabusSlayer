export const SAMPLE_PLAYLISTS = [
  {
    title: 'Learn React in 2024',
    youtubeId: 'SqcY0GlETPk',
    description: 'A comprehensive React tutorial playlist',
    category: 'Programming',
  },
  {
    title: 'JavaScript Basics',
    youtubeId: 'PkZNo7MFNFg',
    description: 'Master JavaScript fundamentals',
    category: 'Programming',
  },
  {
    title: 'Productivity Masterclass',
    youtubeId: 'PLEx5khR4g7PIEfXodbMACxZl8FSCszP3a',
    description: 'Learn time management and productivity',
    category: 'Personal Development',
  },
]

/**
 * Returns the sample playlist URL for a given index
 * Can be used to seed the planner for new users
 */
export function getSamplePlaylistUrl(sampleIndex: number): string {
  const sample = SAMPLE_PLAYLISTS[sampleIndex]
  if (!sample) return ''
  return `https://www.youtube.com/playlist?list=${sample.youtubeId}`
}

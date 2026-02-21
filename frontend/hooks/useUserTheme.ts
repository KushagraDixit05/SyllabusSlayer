'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { userRepository } from '@/lib/repositories/userRepository'

export function useUserTheme() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  // Load user's theme preference on mount
  useEffect(() => {
    if (session?.user.id) {
      userRepository.getProfile(session.user.id).then((profile) => {
        if (profile?.theme_preference) {
          setTheme(profile.theme_preference)
        }
      })
    }
  }, [session?.user.id, setTheme])

  // Save theme changes to database
  const updateTheme = async (newTheme: string) => {
    setTheme(newTheme)
    if (session?.user.id) {
      await userRepository.updateThemePreference(
        session.user.id,
        newTheme as 'light' | 'dark' | 'system'
      )
    }
  }

  return { theme, updateTheme }
}

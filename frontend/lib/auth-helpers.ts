import { createClient } from '@/lib/supabase/server'

/**
 * Sync user to Supabase database
 * Call this after successful authentication to ensure user exists in database
 */
export async function syncUserToDatabase(user: {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
}) {
  const supabase = await createClient()

  try {
    // Check if user profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      // Create new user profile
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          display_name: user.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.image,
        })

      if (error) {
        console.error('Error creating user profile:', error)
      }
    } else {
      // Update existing profile with latest info
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: user.name || existingProfile.display_name,
          avatar_url: user.image || existingProfile.avatar_url,
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating user profile:', error)
      }
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
  }
}

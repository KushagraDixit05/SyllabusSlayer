import { createClient } from '@/lib/supabase/client'

export interface UserAnalytics {
  totalPlaylists: number
  totalHoursPlanned: number
  totalHoursCompleted: number
  averageDailyStudyTime: number
  mostProductiveDayOfWeek: string
  speedPreference: {
    average: number
    distribution: Record<string, number>
  }
  completionRate: number
  streakData: {
    current: number
    longest: number
    history: Array<{ date: string; active: boolean }>
  }
  categoryBreakdown: Array<{ category: string; count: number }>
  monthlyProgress: Array<{ month: string; playlists: number; hours: number }>
}

export class AnalyticsService {
  private supabase = createClient()

  async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    try {
      // Get user profile stats
      const { data: profile } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!profile) return null

      // Get playlists for detailed analysis
      const { data: playlists } = await this.supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)

      // Get activity log
      const { data: activities } = await this.supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100)

      // Calculate analytics
      const analytics: UserAnalytics = {
        totalPlaylists: profile.total_playlists_created || 0,
        totalHoursPlanned: profile.total_hours_planned || 0,
        totalHoursCompleted: profile.total_hours_completed || 0,
        averageDailyStudyTime: this.calculateAverageDailyTime(activities || []),
        mostProductiveDayOfWeek: this.findMostProductiveDay(activities || []),
        speedPreference: this.analyzeSpeedPreference(playlists || []),
        completionRate: this.calculateCompletionRate(playlists || []),
        streakData: {
          current: profile.current_streak || 0,
          longest: profile.longest_streak || 0,
          history: this.getStreakHistory(activities || []),
        },
        categoryBreakdown: this.categorizePlaylists(playlists || []),
        monthlyProgress: this.getMonthlyProgress(playlists || []),
      }

      return analytics
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return null
    }
  }

  private calculateAverageDailyTime(activities: any[]): number {
    if (activities.length === 0) return 0

    // Group by date
    const byDate: Record<string, number> = {}
    activities.forEach((activity) => {
      const date = activity.created_at.split('T')[0]
      byDate[date] = (byDate[date] || 0) + (activity.duration_seconds || 0)
    })

    const days = Object.values(byDate)
    if (days.length === 0) return 0

    const totalSeconds = days.reduce((a, b) => a + b, 0)
    return Math.round((totalSeconds / days.length / 3600) * 10) / 10
  }

  private findMostProductiveDay(activities: any[]): string {
    const dayCount: Record<string, number> = {}
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    activities.forEach((activity) => {
      const date = new Date(activity.created_at)
      const dayName = days[date.getDay()]
      dayCount[dayName] = (dayCount[dayName] || 0) + 1
    })

    let maxDay = 'Monday'
    let maxCount = 0
    Object.entries(dayCount).forEach(([day, count]) => {
      if (count > maxCount) {
        maxDay = day
        maxCount = count
      }
    })

    return maxDay
  }

  private analyzeSpeedPreference(playlists: any[]): { average: number; distribution: Record<string, number> } {
    if (playlists.length === 0) return { average: 1.5, distribution: {} }

    const speeds = playlists.map((p) => p.playback_speed || 1.5)
    const average = speeds.reduce((a, b) => a + b, 0) / speeds.length

    const distribution: Record<string, number> = {}
    speeds.forEach((speed) => {
      const key = speed.toString()
      distribution[key] = (distribution[key] || 0) + 1
    })

    return { average: Math.round(average * 100) / 100, distribution }
  }

  private calculateCompletionRate(playlists: any[]): number {
    if (playlists.length === 0) return 0
    const completed = playlists.filter((p) => p.status === 'completed').length
    return (completed / playlists.length) * 100
  }

  private getStreakHistory(activities: any[]): Array<{ date: string; active: boolean }> {
    const history: Array<{ date: string; active: boolean }> = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const hasActivity = activities.some((a) => a.created_at.startsWith(dateStr))

      history.push({ date: dateStr, active: hasActivity })
    }

    return history
  }

  private categorizePlaylists(playlists: any[]): Array<{ category: string; count: number }> {
    const keywords: Record<string, string[]> = {
      Programming: ['javascript', 'python', 'react', 'node', 'code', 'programming', 'web', 'css', 'html', 'typescript', 'java', 'c++', 'golang', 'rust'],
      Business: ['business', 'marketing', 'sales', 'startup', 'finance', 'entrepreneur', 'management'],
      Design: ['design', 'ui', 'ux', 'figma', 'photoshop', 'graphic', 'illustration'],
      Math: ['math', 'calculus', 'algebra', 'statistics', 'linear algebra'],
      Science: ['science', 'physics', 'chemistry', 'biology', 'machine learning', 'ai', 'data'],
    }

    const counts: Record<string, number> = { Other: 0 }
    Object.keys(keywords).forEach((cat) => (counts[cat] = 0))

    playlists.forEach((playlist) => {
      const title = (playlist.title || '').toLowerCase()
      let matched = false
      for (const [category, words] of Object.entries(keywords)) {
        if (words.some((w) => title.includes(w))) {
          counts[category]++
          matched = true
          break
        }
      }
      if (!matched) counts['Other']++
    })

    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .filter(({ count }) => count > 0)
  }

  private getMonthlyProgress(playlists: any[]): Array<{ month: string; playlists: number; hours: number }> {
    const monthlyData: Record<string, { playlists: number; hours: number }> = {}

    playlists.forEach((playlist) => {
      const date = new Date(playlist.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { playlists: 0, hours: 0 }
      }

      monthlyData[monthKey].playlists += 1
      monthlyData[monthKey].hours += Math.floor((playlist.adjusted_duration || 0) / 3600)
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }
}

export const analyticsService = new AnalyticsService()

# PHASE 3D: ANALYTICS, ONBOARDING & POLISH
**Duration:** 1-2 weeks  
**Focus:** Analytics dashboard, user onboarding, email system, and final polish

## Prerequisites
✅ Phase 3A complete (authentication and database)  
✅ Phase 3B complete (premium UI and dark mode)  
✅ Phase 3C complete (gamification and progress tracking)

---

## GitHub Copilot Prompt: Phase 3D

### Context
Phases 3A, 3B, and 3C are complete. Users have accounts, a premium UI, and engaging gamification. Now we're adding analytics insights, smooth onboarding for new users, email notifications, and final polish before Phase 4.

**Phase 3D Objective:** Complete the user experience with insights, guidance, and communication.

---

## TASK 1: ANALYTICS & INSIGHTS DASHBOARD

### 1.1 Analytics Data Service

Create `/lib/analytics/service.ts`:
```typescript
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
    // Implementation: Calculate from activity log
    // Group by date, sum hours, average
    return 0 // Placeholder
  }

  private findMostProductiveDay(activities: any[]): string {
    // Implementation: Group activities by day of week
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
    const speeds = playlists.map((p) => p.playback_speed || 1.5)
    const average = speeds.reduce((a, b) => a + b, 0) / speeds.length || 1.5

    const distribution: Record<string, number> = {}
    speeds.forEach((speed) => {
      const key = speed.toString()
      distribution[key] = (distribution[key] || 0) + 1
    })

    return { average, distribution }
  }

  private calculateCompletionRate(playlists: any[]): number {
    if (playlists.length === 0) return 0
    const completed = playlists.filter((p) => p.status === 'completed').length
    return (completed / playlists.length) * 100
  }

  private getStreakHistory(activities: any[]): Array<{ date: string; active: boolean }> {
    // Last 30 days of activity
    const history: Array<{ date: string; active: boolean }> = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const hasActivity = activities.some(
        (a) => a.created_at.startsWith(dateStr)
      )

      history.push({ date: dateStr, active: hasActivity })
    }

    return history
  }

  private categorizePlaylists(playlists: any[]): Array<{ category: string; count: number }> {
    // Simple categorization by playlist title keywords
    // In production, use ML or manual tagging
    return [
      { category: 'Programming', count: 0 },
      { category: 'Business', count: 0 },
      { category: 'Design', count: 0 },
      { category: 'Other', count: playlists.length },
    ]
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
      .slice(-6) // Last 6 months
  }
}

export const analyticsService = new AnalyticsService()
```

### 1.2 Analytics Dashboard Components

Create `/components/analytics/InsightCard.tsx`:
```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface InsightCardProps {
  title: string
  insight: string
  icon: LucideIcon
  color?: string
}

export function InsightCard({
  title,
  insight,
  icon: Icon,
  color = 'hsl(var(--primary))',
}: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div
            className="rounded-full p-2"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{insight}</p>
      </CardContent>
    </Card>
  )
}
```

Create `/components/analytics/MonthlyProgressChart.tsx`:
```typescript
'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonthlyProgressChartProps {
  data: Array<{ month: string; playlists: number; hours: number }>
}

export function MonthlyProgressChart({ data }: MonthlyProgressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                const [year, month] = value.split('-')
                const date = new Date(parseInt(year), parseInt(month) - 1)
                return date.toLocaleDateString('en-US', { month: 'short' })
              }}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="playlists"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

Create `/app/dashboard/analytics/page.tsx`:
```typescript
import { auth } from '@/lib/auth'
import { analyticsService } from '@/lib/analytics/service'
import { InsightCard } from '@/components/analytics/InsightCard'
import { MonthlyProgressChart } from '@/components/analytics/MonthlyProgressChart'
import { TrendingUp, Calendar, Zap, Target } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const analytics = await analyticsService.getUserAnalytics(session.user.id)
  if (!analytics) return <div>Failed to load analytics</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics & Insights</h1>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Most Productive Day"
          insight={analytics.mostProductiveDayOfWeek}
          icon={Calendar}
          color="hsl(var(--primary))"
        />
        <InsightCard
          title="Average Speed"
          insight={`${analytics.speedPreference.average.toFixed(2)}x`}
          icon={Zap}
          color="hsl(var(--warning))"
        />
        <InsightCard
          title="Completion Rate"
          insight={`${Math.round(analytics.completionRate)}%`}
          icon={Target}
          color="hsl(var(--success))"
        />
        <InsightCard
          title="Daily Average"
          insight={`${analytics.averageDailyStudyTime}h`}
          icon={TrendingUp}
          color="hsl(var(--info))"
        />
      </div>

      {/* Monthly Progress Chart */}
      <MonthlyProgressChart data={analytics.monthlyProgress} />

      {/* Personalized Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">💡 Insight</h3>
          <p className="text-muted-foreground">
            You're most productive on {analytics.mostProductiveDayOfWeek}s. 
            Try scheduling your most challenging playlists on this day!
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">🎯 Suggestion</h3>
          <p className="text-muted-foreground">
            You've saved {Math.round(analytics.totalHoursPlanned * 0.25)} hours by watching at 
            {analytics.speedPreference.average}x speed. Keep it up!
          </p>
        </Card>
      </div>
    </div>
  )
}
```

---

## TASK 2: INTERACTIVE ONBOARDING

### 2.1 Onboarding Flow Store

Create `/store/useOnboardingStore.ts`:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingStore {
  hasCompletedOnboarding: boolean
  currentStep: number
  
  completeOnboarding: () => void
  setStep: (step: number) => void
  resetOnboarding: () => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,

      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true, currentStep: 0 }),

      setStep: (step) => set({ currentStep: step }),

      resetOnboarding: () =>
        set({ hasCompletedOnboarding: false, currentStep: 0 }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
)
```

### 2.2 Onboarding Tour Component

Install shepherd.js:
```bash
npm install react-shepherd
```

Create `/components/onboarding/OnboardingTour.tsx`:
```typescript
'use client'

import { useEffect } from 'react'
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import 'shepherd.js/dist/css/shepherd.css'

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: 'shepherd-theme-custom',
    scrollTo: { behavior: 'smooth', block: 'center' },
  },
  useModalOverlay: true,
}

const steps = [
  {
    id: 'welcome',
    text: 'Welcome to Syllabus Slayer! Let's take a quick tour of your new learning command center.',
    buttons: [
      {
        text: 'Next',
        action: function (this: any) {
          this.next()
        },
      },
    ],
  },
  {
    id: 'sidebar',
    attachTo: { element: 'aside', on: 'right' },
    text: 'Navigate between different sections using the sidebar. Try collapsing it for more space!',
    buttons: [
      {
        text: 'Back',
        action: function (this: any) {
          this.back()
        },
        secondary: true,
      },
      {
        text: 'Next',
        action: function (this: any) {
          this.next()
        },
      },
    ],
  },
  {
    id: 'new-playlist',
    attachTo: { element: '[data-tour="new-playlist"]', on: 'bottom' },
    text: 'Click here to create your first playlist. Just paste a YouTube URL and we'll handle the rest!',
    buttons: [
      {
        text: 'Back',
        action: function (this: any) {
          this.back()
        },
        secondary: true,
      },
      {
        text: 'Next',
        action: function (this: any) {
          this.next()
        },
      },
    ],
  },
  {
    id: 'command-menu',
    text: 'Pro tip: Press Cmd+K (or Ctrl+K) anytime to quickly navigate or search!',
    buttons: [
      {
        text: 'Back',
        action: function (this: any) {
          this.back()
        },
        secondary: true,
      },
      {
        text: 'Next',
        action: function (this: any) {
          this.next()
        },
      },
    ],
  },
  {
    id: 'achievements',
    text: 'Earn achievements and track your progress as you learn. Your first achievement is just one playlist away!',
    buttons: [
      {
        text: 'Back',
        action: function (this: any) {
          this.back()
        },
        secondary: true,
      },
      {
        text: 'Get Started!',
        action: function (this: any) {
          this.complete()
        },
      },
    ],
  },
]

export function OnboardingTour() {
  const { hasCompletedOnboarding, completeOnboarding } = useOnboardingStore()

  if (hasCompletedOnboarding) return null

  return (
    <ShepherdTour steps={steps} tourOptions={tourOptions}>
      <TourStarter onComplete={completeOnboarding} />
    </ShepherdTour>
  )
}

function TourStarter({ onComplete }: { onComplete: () => void }) {
  const tour = ShepherdTour.useContext()

  useEffect(() => {
    if (tour) {
      tour.on('complete', onComplete)
      tour.on('cancel', onComplete)
      
      // Start tour after a short delay
      const timer = setTimeout(() => {
        tour.start()
      }, 1000)

      return () => {
        clearTimeout(timer)
        tour.off('complete', onComplete)
        tour.off('cancel', onComplete)
      }
    }
  }, [tour, onComplete])

  return null
}
```

### 2.3 Sample Playlists for New Users

Create `/lib/onboarding/samplePlaylists.ts`:
```typescript
export const SAMPLE_PLAYLISTS = [
  {
    title: 'Learn React in 2024',
    youtubeId: 'SqcY0GlETPk', // Example playlist ID
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
    youtubeId: 'example3',
    description: 'Learn time management and productivity',
    category: 'Personal Development',
  },
]

export async function createSamplePlaylist(userId: string, sampleIndex: number) {
  const sample = SAMPLE_PLAYLISTS[sampleIndex]
  // Implementation: Fetch from YouTube API and create playlist
  // This gives new users something to explore immediately
}
```

### 2.4 Feature Discovery Tooltips

Create `/components/onboarding/FeatureTooltip.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FeatureTooltipProps {
  feature: string
  children: React.ReactNode
  description: string
}

export function FeatureTooltip({
  feature,
  children,
  description,
}: FeatureTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenFeature, setHasSeenFeature] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(`feature-seen-${feature}`)
    if (!seen) {
      setIsOpen(true)
    } else {
      setHasSeenFeature(true)
    }
  }, [feature])

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem(`feature-seen-${feature}`, 'true')
    setHasSeenFeature(true)
  }

  if (hasSeenFeature) return <>{children}</>

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-xs p-4"
          sideOffset={10}
        >
          <div className="flex items-start justify-between space-x-2">
            <p className="text-sm">{description}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### 2.5 Help Center

Create `/app/dashboard/help/page.tsx`:
```typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const faqs = [
  {
    question: 'How do I create a playlist plan?',
    answer: 'Simply paste a YouTube playlist URL into the planner, and we'll automatically fetch all videos and calculate the total duration. You can then adjust playback speed and create study sessions.',
  },
  {
    question: 'What does the speed multiplier do?',
    answer: 'The speed multiplier shows you how long the playlist would take at different playback speeds (1.25x, 1.5x, 1.75x, 2x). Many learners find 1.5x to be the sweet spot between speed and comprehension.',
  },
  {
    question: 'How do partitions work?',
    answer: 'Partitions break your playlist into manageable study sessions. You can define custom session lengths (e.g., 3 hours), and we'll intelligently group videos while respecting video boundaries.',
  },
  {
    question: 'How are achievements earned?',
    answer: 'Achievements are unlocked automatically as you hit milestones like creating your first playlist, maintaining streaks, or completing playlists at high speeds. Check the Achievements page to see all available badges!',
  },
  {
    question: 'Can I export my study plan?',
    answer: 'Yes! You can export your plan as a PDF, CSV, or generate a shareable link. We're working on calendar integration for future updates.',
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Help & FAQ</h1>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle>Video Tutorials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Getting Started Tutorial (Coming Soon)</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? We're here to help!
          </p>
          <Button>Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## TASK 3: EMAIL NOTIFICATION SYSTEM

### 3.1 Email Service Setup

Install Resend:
```bash
npm install resend
```

Create `/lib/email/client.ts`:
```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const SENDER_EMAIL = 'notifications@syllabusslayer.com'
```

### 3.2 Email Templates

Create `/emails/AchievementUnlocked.tsx`:
```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface AchievementUnlockedEmailProps {
  userName: string
  achievementName: string
  achievementDescription: string
  achievementIcon: string
}

export function AchievementUnlockedEmail({
  userName,
  achievementName,
  achievementDescription,
  achievementIcon,
}: AchievementUnlockedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You unlocked a new achievement!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={h1}>🎉 Achievement Unlocked!</Heading>
            
            <Text style={text}>Hi {userName},</Text>
            
            <div style={achievementBox}>
              <div style={iconBox}>{achievementIcon}</div>
              <Heading style={h2}>{achievementName}</Heading>
              <Text style={description}>{achievementDescription}</Text>
            </div>
            
            <Text style={text}>
              Keep up the amazing work! Check your dashboard to see all your achievements.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const content = {
  padding: '0 48px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const achievementBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const iconBox = {
  fontSize: '64px',
  margin: '0 0 16px',
}

const description = {
  color: '#666',
  fontSize: '14px',
  margin: '8px 0',
}
```

Create `/emails/WeeklySummary.tsx`:
```typescript
// Similar structure for weekly progress email
export function WeeklySummaryEmail({
  userName,
  playlistsCompleted,
  hoursLearned,
  currentStreak,
  insights,
}: WeeklySummaryEmailProps) {
  // Implementation similar to above
}
```

### 3.3 Email Sending Service

Create `/lib/email/service.ts`:
```typescript
import { resend, SENDER_EMAIL } from './client'
import { AchievementUnlockedEmail } from '@/emails/AchievementUnlocked'
import { WeeklySummaryEmail } from '@/emails/WeeklySummary'

export class EmailService {
  async sendAchievementUnlocked(
    userEmail: string,
    userName: string,
    achievement: {
      name: string
      description: string
      icon: string
    }
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: userEmail,
        subject: `🎉 Achievement Unlocked: ${achievement.name}`,
        react: AchievementUnlockedEmail({
          userName,
          achievementName: achievement.name,
          achievementDescription: achievement.description,
          achievementIcon: achievement.icon,
        }),
      })
    } catch (error) {
      console.error('Failed to send achievement email:', error)
    }
  }

  async sendWeeklySummary(
    userEmail: string,
    userName: string,
    summary: {
      playlistsCompleted: number
      hoursLearned: number
      currentStreak: number
      insights: string[]
    }
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: userEmail,
        subject: 'Your Weekly Learning Summary',
        react: WeeklySummaryEmail({
          userName,
          ...summary,
        }),
      })
    } catch (error) {
      console.error('Failed to send weekly summary:', error)
    }
  }
}

export const emailService = new EmailService()
```

### 3.4 Email Preferences

Add to user settings page:
```typescript
// /app/dashboard/settings/page.tsx
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="achievement-emails">Achievement unlocks</Label>
            <Switch id="achievement-emails" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-summary">Weekly summary</Label>
            <Switch id="weekly-summary" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="streak-reminder">Streak reminders</Label>
            <Switch id="streak-reminder" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## TASK 4: FINAL POLISH

### 4.1 Error Boundaries

Create `/components/ErrorBoundary.tsx`:
```typescript
'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 4.2 Performance Optimizations

Create `/lib/utils/performance.ts`:
```typescript
import { useEffect, useRef } from 'react'

/**
 * Debounce hook for expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Intersection Observer for lazy loading
 */
export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback()
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return ref
}
```

### 4.3 Accessibility Audit

Create checklist:
```markdown
## Accessibility Checklist

- [ ] All images have alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Modal dialogs trap focus
- [ ] Skip to main content link present
- [ ] ARIA labels for icon-only buttons
- [ ] Heading hierarchy is logical
```

### 4.4 Mobile Responsiveness Check

Test breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

---

## PHASE 3D SUCCESS CRITERIA

✅ Analytics dashboard showing personalized insights  
✅ Interactive onboarding tour for new users  
✅ Sample playlists available for exploration  
✅ Feature discovery tooltips implemented  
✅ Help center with comprehensive FAQ  
✅ Email notification system functional  
✅ Email preferences configurable  
✅ Weekly summary emails sent automatically  
✅ Error boundaries catching failures gracefully  
✅ Performance optimizations applied  
✅ Accessibility score >90 (Lighthouse)  
✅ Mobile responsiveness verified  
✅ All console errors resolved  
✅ Final QA testing complete

---

## TESTING CHECKLIST

- [ ] New user onboarding flow works end-to-end
- [ ] Analytics page loads and displays correct data
- [ ] Email notifications send successfully
- [ ] Email preferences save correctly
- [ ] Help center content is helpful and accurate
- [ ] Error boundary catches and displays errors
- [ ] Mobile experience is smooth
- [ ] Dark mode works consistently
- [ ] All tooltips display correctly
- [ ] Performance: Initial load <3s
- [ ] Performance: Interaction-to-visual <100ms
- [ ] No memory leaks
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

---

**Phase 3D completes the Phase 3 experience. The app should now feel polished, professional, and production-ready.**

## PHASE 3 COMPLETE 🎉

With all sub-phases complete, you have:
- ✅ Authentication and data persistence (3A)
- ✅ Premium UI with dark mode (3B)
- ✅ Gamification and progress tracking (3C)
- ✅ Analytics, onboarding, and polish (3D)

**Ready for Phase 4: Ecosystem Expansion!**

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Bell, Mail, Shield, Palette, Sun } from 'lucide-react'

interface EmailPreferences {
  achievementEmails: boolean
  weeklySummary: boolean
  streakReminder: boolean
}

export default function SettingsPage() {
  const [emailPrefs, setEmailPrefs] = useState<EmailPreferences>({
    achievementEmails: true,
    weeklySummary: true,
    streakReminder: true,
  })

  const [saving, setSaving] = useState(false)

  const handleToggle = (key: keyof EmailPreferences) => {
    setEmailPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Persist preferences to database via API
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      toast.success('Settings saved successfully!')
    } catch {
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-foreground" />
            <CardTitle>Email Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose which emails you&apos;d like to receive from us
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="achievement-emails" className="text-base">Achievement unlocks</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you earn a new achievement
              </p>
            </div>
            <Switch
              id="achievement-emails"
              checked={emailPrefs.achievementEmails}
              onCheckedChange={() => handleToggle('achievementEmails')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-summary" className="text-base">Weekly summary</Label>
              <p className="text-sm text-muted-foreground">
                A weekly recap of your learning progress
              </p>
            </div>
            <Switch
              id="weekly-summary"
              checked={emailPrefs.weeklySummary}
              onCheckedChange={() => handleToggle('weeklySummary')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="streak-reminder" className="text-base">Streak reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders to keep your learning streak alive
              </p>
            </div>
            <Switch
              id="streak-reminder"
              checked={emailPrefs.streakReminder}
              onCheckedChange={() => handleToggle('streakReminder')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-foreground" />
            <CardTitle>In-App Notifications</CardTitle>
          </div>
          <CardDescription>Control in-app notification behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="achievement-notifs" className="text-base">Achievement celebrations</Label>
              <p className="text-sm text-muted-foreground">
                Show confetti and modal when earning achievements
              </p>
            </div>
            <Switch id="achievement-notifs" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="milestone-notifs" className="text-base">Milestone alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify when you hit key progress milestones
              </p>
            </div>
            <Switch id="milestone-notifs" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-foreground" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base">Theme</Label>
            <div className="flex items-center gap-3 rounded-lg border-[3px] border-ink bg-card p-4 shadow-brutal-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-primary">
                <Sun className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold">Light</p>
                <p className="text-xs text-muted-foreground">
                  SyllabusSlayer uses a single light theme.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-foreground" />
            <CardTitle>Privacy</CardTitle>
          </div>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile" className="text-base">Public leaderboard</Label>
              <p className="text-sm text-muted-foreground">
                Show your stats on the public leaderboard
              </p>
            </div>
            <Switch id="public-profile" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}

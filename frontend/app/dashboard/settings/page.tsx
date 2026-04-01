'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Bell, Mail, Shield, Palette, Sun, Moon, Monitor } from 'lucide-react'

interface EmailPreferences {
  achievementEmails: boolean
  weeklySummary: boolean
  streakReminder: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
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
            <Bell className="h-5 w-5 text-primary" />
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
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === 'light' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Light
                </span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Dark
                </span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === 'system' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Monitor className={`h-5 w-5 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`}>
                  System
                </span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              System theme follows your device&apos;s appearance settings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
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

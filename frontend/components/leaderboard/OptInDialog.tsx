'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface OptInDialogProps {
  open: boolean
  onClose: () => void
  onOptIn: (username: string) => Promise<void>
}

export function OptInDialog({ open, onClose, onOptIn }: OptInDialogProps) {
  const [username, setUsername] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!username.trim() || !agreed) return
    setIsSubmitting(true)
    try {
      await onOptIn(username.trim())
      onClose()
    } catch (error) {
      console.error('Failed to opt in:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the Leaderboard</DialogTitle>
          <DialogDescription>
            Compete with other learners and showcase your progress!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Choose a display name</Label>
            <Input
              id="username"
              placeholder="e.g., LearnMaster2024"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be visible to all users on the leaderboard
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="agree"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to make my stats public on the leaderboard
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!username.trim() || !agreed || isSubmitting}
          >
            {isSubmitting ? 'Joining...' : 'Join Leaderboard'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

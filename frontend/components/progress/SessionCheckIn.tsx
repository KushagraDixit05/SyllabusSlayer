'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Partition } from '@/types/database'

interface SessionCheckInProps {
  partition: Partition
  onComplete: (partitionId: string) => Promise<void>
}

export function SessionCheckIn({ partition, onComplete }: SessionCheckInProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    if (partition.is_completed || isCompleting) return
    setIsCompleting(true)
    try {
      await onComplete(partition.id)
      toast.success('Session completed! 🎉', {
        description: 'Keep up the great work!',
      })
    } catch {
      toast.error('Failed to mark session as complete')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <Card className={partition.is_completed ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={partition.is_completed}
              onCheckedChange={handleComplete}
              disabled={isCompleting || partition.is_completed}
            />
            <div>
              <h4 className="font-medium">Session {partition.session_number}</h4>
              <p className="text-sm text-muted-foreground">
                Videos {partition.start_video_index + 1}–{partition.end_video_index + 1}
                {' • '}
                {Math.ceil(partition.total_duration / 60)} minutes
              </p>
            </div>
          </div>

          {partition.is_completed && (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

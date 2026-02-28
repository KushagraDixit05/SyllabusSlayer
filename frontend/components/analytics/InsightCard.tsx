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
            style={{ backgroundColor: `${color}20` }}
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

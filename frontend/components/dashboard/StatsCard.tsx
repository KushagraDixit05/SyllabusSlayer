'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CountingNumber } from '@/components/animations/CountingNumber'

interface StatsCardProps {
  title: string
  value: number
  suffix?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

export function StatsCard({
  title,
  value,
  suffix,
  icon: Icon,
  trend,
  color = 'hsl(var(--primary))',
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="mt-2 flex items-baseline space-x-1">
                <CountingNumber
                  value={value}
                  suffix={suffix}
                  className="text-3xl font-bold"
                />
              </div>
              {trend && (
                <p
                  className={`mt-1 text-sm ${
                    trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {trend.isPositive ? '↑' : '↓'} {trend.value}% from last week
                </p>
              )}
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-6 w-6" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

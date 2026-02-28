'use client'

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonthlyProgressChartProps {
  data: Array<{ month: string; playlists: number; hours: number }>
}

export function MonthlyProgressChart({ data }: MonthlyProgressChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No data yet. Start adding playlists to see your progress!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                const [year, month] = value.split('-')
                const date = new Date(parseInt(year), parseInt(month) - 1)
                return date.toLocaleDateString('en-US', { month: 'short' })
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(label) => {
                const [year, month] = label.split('-')
                const date = new Date(parseInt(year), parseInt(month) - 1)
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="playlists"
              name="Playlists"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="hours"
              name="Hours"
              stroke="hsl(var(--chart-2, 220 70% 50%))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

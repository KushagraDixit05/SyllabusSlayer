'use client';

import { useState, useEffect } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const DAYS_OF_WEEK = [
  { id: 1, label: 'Monday', short: 'Mon' },
  { id: 2, label: 'Tuesday', short: 'Tue' },
  { id: 3, label: 'Wednesday', short: 'Wed' },
  { id: 4, label: 'Thursday', short: 'Thu' },
  { id: 5, label: 'Friday', short: 'Fri' },
  { id: 6, label: 'Saturday', short: 'Sat' },
  { id: 0, label: 'Sunday', short: 'Sun' },
];

export function ScheduleCalculator() {
  const { totalDuration, schedule, calculateSchedule } = usePlannerStore();
  
  const [weekdayHours, setWeekdayHours] = useState(2);
  const [weekendHours, setWeekendHours] = useState(4);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [restDays, setRestDays] = useState<number[]>([]);

  useEffect(() => {
    if (totalDuration > 0) {
      calculateSchedule({
        startDate: new Date(startDate),
        hoursPerWeekday: weekdayHours,
        hoursPerWeekend: weekendHours,
        restDaysPerWeek: restDays,
        bufferPercentage: 15,
      });
    }
  }, [weekdayHours, weekendHours, startDate, restDays, totalDuration, calculateSchedule]);

  const toggleRestDay = (dayId: number) => {
    setRestDays(prev => {
      if (prev.includes(dayId)) {
        // Remove the day from rest days
        return prev.filter(d => d !== dayId);
      } else {
        // Only add if we won't have all 7 days as rest days
        if (prev.length >= 6) {
          // Already have 6 rest days, can't add more
          return prev;
        }
        return [...prev, dayId];
      }
    });
  };

  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Schedule Calculator
          </CardTitle>
          <CardDescription>
            Plan when you'll complete this playlist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Daily Hours */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weekdayHours">Weekday Study Hours</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weekdayHours"
                  type="number"
                  value={weekdayHours}
                  onChange={(e) => setWeekdayHours(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={24}
                  step={0.5}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">hours/day</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekendHours">Weekend Study Hours</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weekendHours"
                  type="number"
                  value={weekendHours}
                  onChange={(e) => setWeekendHours(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={24}
                  step={0.5}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">hours/day</span>
              </div>
            </div>
          </div>

          {/* Rest Days */}
          <div className="space-y-3">
            <Label>Rest Days (Optional)</Label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleRestDay(day.id)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${restDays.includes(day.id)
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-800 text-red-700 dark:text-red-400'
                      : 'bg-card border-border hover:border-border/80'
                    }
                  `}
                >
                  <span className="text-xs font-medium">{day.short}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Click days to mark as rest days</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {schedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-border bg-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Your Completion Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Target Completion</p>
                  <p className="text-2xl font-bold text-foreground">
                    {format(schedule.endDate, 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Days Required</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {schedule.totalDays}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Study Time</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {totalHours}h {totalMinutes}m
                  </p>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="rounded-lg bg-card/80 p-4 border border-border">
                <p className="text-center text-muted-foreground italic">
                  💪 Consistency is key to mastering this content!
                </p>
              </div>

              {/* Daily Breakdown */}
              {schedule.dailySchedule.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Daily Breakdown</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {schedule.dailySchedule.slice(0, 14).map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border"
                      >
                        <div className="min-w-[100px]">
                          <p className="text-sm font-medium">{format(day.date, 'EEE, MMM dd')}</p>
                        </div>
                        <div className="flex-1">
                          {day.hoursAllocated > 0 ? (
                            <p className="text-sm text-muted-foreground">
                              {day.hoursAllocated.toFixed(1)}h study time • {Math.floor(day.cumulativeMinutes / 60)}h {Math.floor(day.cumulativeMinutes % 60)}m total
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground/70 italic">Rest day</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {schedule.dailySchedule.length > 14 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        + {schedule.dailySchedule.length - 14} more days...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

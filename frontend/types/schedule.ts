/**
 * Schedule Types
 * Data models for time-to-finish calculator and scheduling
 */

export interface StudySchedule {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  studyDays: number;
  restDays: number;
  dailySchedule: DaySchedule[];
}

export interface DaySchedule {
  date: Date;
  dayOfWeek: string;
  dayNumber: number; // 0-6 (Sunday-Saturday)
  isRestDay: boolean;
  hoursAllocated: number;
  sessionsScheduled: number[]; // Partition session numbers
  cumulativeMinutes: number;
}

export interface ScheduleConfig {
  hoursPerWeekday: number;
  hoursPerWeekend: number;
  restDaysPerWeek: number[]; // Array of day numbers (0-6)
  startDate: Date;
  bufferPercentage: number; // Additional time for breaks, reviews
}

export const DEFAULT_SCHEDULE_CONFIG: ScheduleConfig = {
  hoursPerWeekday: 2,
  hoursPerWeekend: 3,
  restDaysPerWeek: [0], // Sunday
  startDate: new Date(),
  bufferPercentage: 15,
};

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

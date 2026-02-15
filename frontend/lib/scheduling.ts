/**
 * Scheduling Algorithm
 * Calculates completion dates and daily study schedules
 */

import { 
  addDays, 
  format, 
  differenceInDays, 
  startOfDay,
  isWeekend,
  getDay,
} from 'date-fns';
import type { 
  StudySchedule, 
  DaySchedule, 
  ScheduleConfig 
} from '@/types/schedule';
import type { Partition } from '@/types/partition';

/**
 * Calculate completion date based on daily commitment
 */
export function calculateCompletionDate(
  totalDurationMinutes: number,
  config: ScheduleConfig
): StudySchedule {
  const bufferedMinutes = addBufferTime(totalDurationMinutes, config.bufferPercentage);
  
  let remainingMinutes = bufferedMinutes;
  let currentDate = startOfDay(config.startDate);
  const dailySchedule: DaySchedule[] = [];
  let studyDaysCount = 0;
  let dayCounter = 0;
  
  while (remainingMinutes > 0) {
    const dayOfWeek = getDay(currentDate);
    const isRestDay = config.restDaysPerWeek.includes(dayOfWeek);
    const allocation = isRestDay 
      ? 0 
      : (dayOfWeek === 0 || dayOfWeek === 6) 
        ? config.hoursPerWeekend 
        : config.hoursPerWeekday;
    const hoursAllocated = Math.min(allocation, remainingMinutes / 60);
    const minutesAllocated = hoursAllocated * 60;
    
    if (!isRestDay && hoursAllocated > 0) {
      studyDaysCount++;
    }
    
    dailySchedule.push({
      date: new Date(currentDate),
      dayOfWeek: format(currentDate, 'EEEE'),
      dayNumber: dayOfWeek,
      isRestDay,
      hoursAllocated,
      sessionsScheduled: [],
      cumulativeMinutes: bufferedMinutes - remainingMinutes + minutesAllocated,
    });
    
    remainingMinutes -= minutesAllocated;
    currentDate = addDays(currentDate, 1);
    dayCounter++;
    
    // Safety check: prevent infinite loop
    if (dayCounter > 365) {
      throw new Error('Schedule calculation exceeded 1 year. Please adjust your daily hours.');
    }
  }
  
  const endDate = new Date(dailySchedule[dailySchedule.length - 1].date);
  const startDate = new Date(config.startDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const restDaysCount = totalDays - studyDaysCount;
  
  return {
    startDate,
    endDate,
    totalDays,
    studyDays: studyDaysCount,
    restDays: restDaysCount,
    dailySchedule,
  };
}

/**
 * Map partitions to specific calendar days in schedule
 */
export function mapPartitionsToSchedule(
  partitions: Partition[],
  config: ScheduleConfig
): StudySchedule {
  if (partitions.length === 0) {
    throw new Error('No partitions provided');
  }
  
  // First, calculate total duration from partitions
  const totalMinutes = partitions.reduce((sum, p) => sum + p.totalDuration / 60, 0);
  const schedule = calculateCompletionDate(totalMinutes, config);
  
  // Now assign partitions to days
  let partitionIndex = 0;
  let currentPartition = partitions[0];
  let partitionRemainingMinutes = currentPartition.totalDuration / 60;
  
  for (const day of schedule.dailySchedule) {
    if (day.isRestDay || day.hoursAllocated === 0) {
      continue;
    }
    
    const dayMinutes = day.hoursAllocated * 60;
    let dayRemainingMinutes = dayMinutes;
    
    while (dayRemainingMinutes > 0 && partitionIndex < partitions.length) {
      if (partitionRemainingMinutes <= dayRemainingMinutes) {
        // Entire partition fits in this day
        day.sessionsScheduled.push(currentPartition.sessionNumber);
        dayRemainingMinutes -= partitionRemainingMinutes;
        
        // Move to next partition
        partitionIndex++;
        if (partitionIndex < partitions.length) {
          currentPartition = partitions[partitionIndex];
          partitionRemainingMinutes = currentPartition.totalDuration / 60;
        } else {
          break;
        }
      } else {
        // Partition spans multiple days
        day.sessionsScheduled.push(currentPartition.sessionNumber);
        partitionRemainingMinutes -= dayRemainingMinutes;
        dayRemainingMinutes = 0;
      }
    }
  }
  
  return schedule;
}

/**
 * Calculate realistic time estimate with buffer
 */
export function addBufferTime(
  rawMinutes: number,
  bufferPercentage: number = 15
): number {
  return Math.ceil(rawMinutes * (1 + bufferPercentage / 100));
}

/**
 * Calculate days until completion from today
 */
export function daysUntilCompletion(endDate: Date): number {
  return differenceInDays(endDate, new Date());
}

/**
 * Format completion date message
 */
export function formatCompletionMessage(schedule: StudySchedule): string {
  const days = daysUntilCompletion(schedule.endDate);
  const dateStr = format(schedule.endDate, 'MMMM d, yyyy');
  
  if (days === 0) {
    return `You'll finish today!`;
  } else if (days === 1) {
    return `You'll finish tomorrow (${dateStr})`;
  } else if (days <= 7) {
    return `You'll finish in ${days} days (${dateStr})`;
  } else if (days <= 30) {
    const weeks = Math.ceil(days / 7);
    return `You'll finish in ${weeks} week${weeks > 1 ? 's' : ''} (${dateStr})`;
  } else {
    const months = Math.ceil(days / 30);
    return `You'll finish in about ${months} month${months > 1 ? 's' : ''} (${dateStr})`;
  }
}

/**
 * Get motivational message based on timeline
 */
export function getMotivationalMessage(days: number): string {
  if (days <= 3) {
    return '🚀 Quick sprint! You got this!';
  } else if (days <= 7) {
    return '💪 One week of focus ahead!';
  } else if (days <= 14) {
    return '📚 Two weeks to mastery!';
  } else if (days <= 30) {
    return '🎯 A month well invested!';
  } else if (days <= 60) {
    return '🌟 Steady progress leads to success!';
  } else {
    return '🏔️ Long journey, but every step counts!';
  }
}

/**
 * Calculate average daily time across all days (including rest)
 */
export function calculateAverageDailyTime(schedule: StudySchedule): number {
  const totalHours = schedule.dailySchedule.reduce((sum, day) => sum + day.hoursAllocated, 0);
  return totalHours / schedule.totalDays;
}

/**
 * Calculate just average study time (excluding rest days)
 */
export function calculateAverageStudyTime(schedule: StudySchedule): number {
  const totalHours = schedule.dailySchedule
    .filter(day => !day.isRestDay)
    .reduce((sum, day) => sum + day.hoursAllocated, 0);
  return schedule.studyDays > 0 ? totalHours / schedule.studyDays : 0;
}

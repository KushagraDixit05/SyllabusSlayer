/**
 * CSV Export Utility
 * Generates CSV files from partitions and schedules
 */

import { format } from 'date-fns';
import type { Partition } from '@/types/partition';
import type { StudySchedule } from '@/types/schedule';
import { formatDurationText } from './partitioning';

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSVField(field: string | number): string {
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate CSV from partitions
 */
export function generatePartitionCSV(partitions: Partition[]): string {
  const headers = ['Session', 'Start Video', 'End Video', 'Video Count', 'Duration (min)', 'Duration', 'Status'];
  
  const rows = partitions.map(p => [
    p.sessionNumber,
    p.startVideoIndex + 1,
    p.endVideoIndex + 1,
    p.videos.length,
    Math.ceil(p.totalDuration / 60),
    formatDurationText(p.totalDuration),
    'Not Started',
  ]);
  
  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map(row => row.map(escapeCSVField).join(',')),
  ].join('\n');
  
  return csvContent;
}

/**
 * Generate CSV from schedule
 */
export function generateScheduleCSV(schedule: StudySchedule): string {
  const headers = ['Date', 'Day', 'Status', 'Hours Allocated', 'Sessions', 'Cumulative Hours', 'Notes'];
  
  const rows = schedule.dailySchedule.map(day => [
    format(day.date, 'yyyy-MM-dd'),
    day.dayOfWeek,
    day.isRestDay ? 'Rest Day' : 'Study Day',
    day.hoursAllocated.toFixed(1),
    day.sessionsScheduled.join(', ') || 'None',
    (day.cumulativeMinutes / 60).toFixed(1),
    '',
  ]);
  
  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map(row => row.map(escapeCSVField).join(',')),
  ].join('\n');
  
  return csvContent;
}

/**
 * Generate combined CSV with both partitions and schedule
 */
export function generateCombinedCSV(
  partitions: Partition[],
  schedule?: StudySchedule
): string {
  let csvContent = '# PARTITIONS\n';
  csvContent += generatePartitionCSV(partitions);
  
  if (schedule) {
    csvContent += '\n\n# SCHEDULE\n';
    csvContent += generateScheduleCSV(schedule);
  }
  
  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export partitions as CSV file
 */
export function exportPartitionsAsCSV(partitions: Partition[], playlistTitle: string): void {
  const csv = generatePartitionCSV(partitions);
  const filename = `partitions-${playlistTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export schedule as CSV file
 */
export function exportScheduleAsCSV(schedule: StudySchedule, playlistTitle: string): void {
  const csv = generateScheduleCSV(schedule);
  const filename = `schedule-${playlistTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`;
  downloadCSV(csv, filename);
}

/**
 * Export combined data as CSV file
 */
export function exportCombinedCSV(
  partitions: Partition[],
  playlistTitle: string,
  schedule?: StudySchedule
): void {
  const csv = generateCombinedCSV(partitions, schedule);
  const filename = `study-plan-${playlistTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`;
  downloadCSV(csv, filename);
}

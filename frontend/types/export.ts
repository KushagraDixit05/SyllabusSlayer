/**
 * Export Types
 * Data models for PDF, CSV, and shareable link exports
 */

import type { Partition } from './partition';
import type { StudySchedule } from './schedule';
import type { Video } from './partition';

export interface PDFExportData {
  playlistTitle: string;
  totalDuration: string;
  videoCount: number;
  speed: number;
  partitions: Partition[];
  schedule?: StudySchedule;
  generatedDate: Date;
  includeVideos: boolean;
  videos?: Video[];
}

export interface ShareableState {
  videos: Video[];
  partitionConfig?: any;
  scheduleConfig?: any;
  speed?: number;
  timestamp: number;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  includeSchedule: boolean;
  includeVideoList: boolean;
  includeStatistics: boolean;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'pdf',
  includeSchedule: true,
  includeVideoList: false,
  includeStatistics: true,
};

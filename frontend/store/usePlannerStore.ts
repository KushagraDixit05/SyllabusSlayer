/**
 * Planner Store
 * Zustand store for Phase 2 planning features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Video,
  Partition,
  PartitionConfig,
} from '@/types/partition';
import { DEFAULT_PARTITION_CONFIG } from '@/types/partition';
import type {
  StudySchedule,
  ScheduleConfig,
} from '@/types/schedule';
import { DEFAULT_SCHEDULE_CONFIG } from '@/types/schedule';
import type {
  ManualVideo,
  VideoTemplate,
} from '@/types/manual';
import {
  createPartitions,
  estimateSessionCount,
  calculatePartitionSummary,
} from '@/lib/partitioning';
import {
  calculateCompletionDate,
  mapPartitionsToSchedule,
} from '@/lib/scheduling';
import { generateId } from '@/lib/helpers';

interface PlannerState {
  // Video data
  videos: Video[];
  playlistTitle: string;
  totalDuration: number;
  
  // Partition state
  partitionConfig: PartitionConfig;
  partitions: Partition[];
  
  // Schedule state
  scheduleConfig: ScheduleConfig;
  schedule: StudySchedule | null;
  
  // Manual videos
  manualVideos: ManualVideo[];
  templates: VideoTemplate[];
  
  // Speed
  selectedSpeed: number;
  currentSpeed: number;
  
  // Actions - Video Management
  setVideos: (videos: Video[], title: string, duration: number) => void;
  setPlaylistData: (title: string, videos: Video[]) => void;
  addManualVideo: (title: string, durationInput: string | number) => void;
  updateManualVideo: (id: string, updates: Partial<ManualVideo>) => void;
  removeManualVideo: (id: string) => void;
  removeVideo: (id: string) => void;
  bulkAddVideos: (videos: Omit<ManualVideo, 'id' | 'createdAt' | 'source'>[]) => void;
  clearVideos: () => void;
  
  // Actions - Partitioning
  setPartitionConfig: (config: Partial<PartitionConfig>) => void;
  updatePartitionConfig: (config: Partial<PartitionConfig>) => void;
  createPartitionsFromConfig: (config: PartitionConfig) => void;
  generatePartitions: () => void;
  clearPartitions: () => void;
  getPartitionSummary: () => ReturnType<typeof calculatePartitionSummary>;
  estimateSessions: () => number;
  
  // Actions - Scheduling
  setScheduleConfig: (config: Partial<ScheduleConfig>) => void;
  calculateSchedule: (config?: ScheduleConfig) => void;
  mapPartitionsToSchedule: () => void;
  clearSchedule: () => void;
  
  // Actions - Templates
  saveTemplate: (name: string, description?: string) => void;
  loadTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  updateTemplate: (id: string, updates: Partial<VideoTemplate>) => void;
  
  // Actions - Speed
  setSpeed: (speed: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  
  // Actions - General
  reset: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      // Initial state
      videos: [],
      playlistTitle: '',
      totalDuration: 0,
      partitionConfig: DEFAULT_PARTITION_CONFIG,
      partitions: [],
      scheduleConfig: DEFAULT_SCHEDULE_CONFIG,
      schedule: null,
      manualVideos: [],
      templates: [],
      currentSpeed: 1.0,
      selectedSpeed: 1.5,
      
      // Video Management
      setVideos: (videos, title, duration) => set({
        videos,
        playlistTitle: title,
        totalDuration: duration,
      }),
      
      setPlaylistData: (title, videos) => {
        const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
        set({
          videos,
          playlistTitle: title,
          totalDuration,
        });
      },
      
      addManualVideo: (title, durationInput) => {
        // Parse duration if it's a string
        let durationSeconds: number;
        if (typeof durationInput === 'string') {
          const { parseTimeInput } = require('@/lib/timeParser');
          durationSeconds = parseTimeInput(durationInput);
        } else {
          durationSeconds = durationInput;
        }
        
        const newVideo: ManualVideo = {
          id: generateId(),
          title,
          duration: durationSeconds,
          source: 'manual',
          createdAt: new Date(),
        };
        
        const allVideos = [...get().videos, newVideo as Video];
        const newDuration = get().totalDuration + newVideo.duration;
        
        set({
          manualVideos: [...get().manualVideos, newVideo],
          videos: allVideos,
          totalDuration: newDuration,
        });
      },
      
      updateManualVideo: (id, updates) => {
        const manualVideos = get().manualVideos.map(v =>
          v.id === id ? { ...v, ...updates } : v
        );
        
        const videos = get().videos.map(v =>
          v.id === id ? { ...v, ...updates } : v
        );
        
        const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
        
        set({ manualVideos, videos, totalDuration });
      },
      
      removeManualVideo: (id) => {
        const manualVideos = get().manualVideos.filter(v => v.id !== id);
        const videos = get().videos.filter(v => v.id !== id);
        const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
        
        set({ manualVideos, videos, totalDuration });
      },
      
      removeVideo: (id) => {
        const manualVideos = get().manualVideos.filter(v => v.id !== id);
        const videos = get().videos.filter(v => v.id !== id);
        const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
        
        set({ manualVideos, videos, totalDuration });
      },
      
      bulkAddVideos: (videos) => {
        const newVideos: ManualVideo[] = videos.map(v => ({
          ...v,
          id: generateId(),
          source: 'manual',
          createdAt: new Date(),
        }));
        
        const allVideos = [...get().videos, ...newVideos as Video[]];
        const newDuration = get().totalDuration + newVideos.reduce((sum, v) => sum + v.duration, 0);
        
        set({
          manualVideos: [...get().manualVideos, ...newVideos],
          videos: allVideos,
          totalDuration: newDuration,
        });
      },
      
      clearVideos: () => set({
        videos: [],
        manualVideos: [],
        playlistTitle: '',
        totalDuration: 0,
        partitions: [],
        schedule: null,
      }),
      
      // Partitioning
      setPartitionConfig: (config) => set({
        partitionConfig: { ...get().partitionConfig, ...config },
      }),
      
      updatePartitionConfig: (config) => set({
        partitionConfig: { ...get().partitionConfig, ...config },
      }),
      
      createPartitionsFromConfig: (config) => {
        const { videos } = get();
        if (videos.length === 0) return;
        
        // Update config and generate partitions
        set({ partitionConfig: config });
        const partitions = createPartitions(videos, config);
        set({ partitions });
      },
      
      generatePartitions: () => {
        const { videos, partitionConfig } = get();
        if (videos.length === 0) return;
        
        const partitions = createPartitions(videos, partitionConfig);
        set({ partitions });
      },
      
      clearPartitions: () => set({ partitions: [] }),
      
      getPartitionSummary: () => {
        return calculatePartitionSummary(get().partitions);
      },
      
      estimateSessions: () => {
        const { totalDuration, partitionConfig } = get();
        return estimateSessionCount(
          totalDuration / 60,
          partitionConfig.sessionLength
        );
      },
      
      // Scheduling
      setScheduleConfig: (config) => set({
        scheduleConfig: { ...get().scheduleConfig, ...config },
      }),
      
      calculateSchedule: (config) => {
        const { totalDuration, partitions } = get();
        const scheduleConfig = config || get().scheduleConfig;
        
        if (totalDuration === 0 && partitions.length === 0) return;
        
        try {
          const schedule = calculateCompletionDate(totalDuration / 60, scheduleConfig);
          set({ schedule, scheduleConfig });
        } catch (error) {
          console.error('Failed to calculate schedule:', error);
        }
      },
      
      mapPartitionsToSchedule: () => {
        const { partitions, scheduleConfig } = get();
        if (partitions.length === 0) return;
        
        try {
          const schedule = mapPartitionsToSchedule(partitions, scheduleConfig);
          set({ schedule });
        } catch (error) {
          console.error('Failed to map partitions to schedule:', error);
        }
      },
      
      clearSchedule: () => set({ schedule: null }),
      
      // Templates
      saveTemplate: (name, description) => {
        const { manualVideos } = get();
        if (manualVideos.length === 0) return;
        
        const template: VideoTemplate = {
          id: generateId(),
          name,
          description,
          videos: manualVideos,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({ templates: [...get().templates, template] });
      },
      
      loadTemplate: (id) => {
        const template = get().templates.find(t => t.id === id);
        if (!template) return;
        
        const newVideos = template.videos.map(v => ({
          ...v,
          id: generateId(), // Generate new IDs
          createdAt: new Date(),
        }));
        
        const allVideos = [...get().videos, ...newVideos as Video[]];
        const newDuration = get().totalDuration + newVideos.reduce((sum, v) => sum + v.duration, 0);
        
        set({
          manualVideos: [...get().manualVideos, ...newVideos],
          videos: allVideos,
          totalDuration: newDuration,
        });
      },
      
      deleteTemplate: (id) => {
        set({ templates: get().templates.filter(t => t.id !== id) });
      },
      
      updateTemplate: (id, updates) => {
        const templates = get().templates.map(t =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
        );
        set({ templates });
      },
      
      // Speed
      setSpeed: (speed) => set({ selectedSpeed: speed }),
      
      setPlaybackSpeed: (speed) => set({ 
        selectedSpeed: speed,
        currentSpeed: speed 
      }),
      
      // General
      reset: () => set({
        videos: [],
        playlistTitle: '',
        totalDuration: 0,
        partitionConfig: DEFAULT_PARTITION_CONFIG,
        partitions: [],
        scheduleConfig: DEFAULT_SCHEDULE_CONFIG,
        schedule: null,
        manualVideos: [],
        selectedSpeed: 1.5,
      }),
    }),
    {
      name: 'planner-storage',
      partialize: (state) => ({
        templates: state.templates,
        partitionConfig: state.partitionConfig,
        scheduleConfig: state.scheduleConfig,
        selectedSpeed: state.selectedSpeed,
      }),
    }
  )
);

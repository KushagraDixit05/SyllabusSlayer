'use client';

import { useState } from 'react';
import {  usePlannerStore } from '@/store/usePlannerStore';
import { PartitionControls } from '@/components/partition/PartitionControls';
import { PartitionList } from '@/components/partition/PartitionList';
import { ScheduleCalculator } from '@/components/schedule/ScheduleCalculator';
import { SpeedSelector } from '@/components/speed/SpeedSelector';
import { SpeedComparisonTable } from '@/components/speed/SpeedComparisonTable';
import { ExportMenu } from '@/components/export/ExportMenu';
import { ManualEntrySection } from '@/components/manual/ManualEntrySection';
import { Calendar, Clock, Zap, FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'partition' | 'schedule' | 'speed' | 'manual'>('partition');
  const { videos, playlistTitle, totalDuration, partitions, schedule } = usePlannerStore();
  
  const hasVideos = videos.length > 0;
  const hasPartitions = partitions.length > 0;
  const hasSchedule = schedule !== null;

  if (!hasVideos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-12 shadow-xl"
            >
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Playlist Loaded
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Start by analyzing a YouTube playlist from the home page, or add videos manually.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Calendar className="h-5 w-5" />
                  Analyze Playlist
                </a>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Add Manually
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{playlistTitle || 'Untitled Playlist'}</h1>
              <p className="text-sm text-gray-600">
                {videos.length} videos • {Math.floor(totalDuration / 60)} minutes total
              </p>
            </div>
            <ExportMenu />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'partition', label: 'Partitions', icon: FileText },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'speed', label: 'Speed', icon: Zap },
              { id: 'manual', label: 'Manual Entry', icon: Plus },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-6 py-3 font-medium transition-all relative
                    ${isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'partition' && (
            <div className="space-y-8">
              <PartitionControls />
              {hasPartitions && <PartitionList />}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-8">
              <ScheduleCalculator />
            </div>
          )}

          {activeTab === 'speed' && (
            <div className="space-y-8">
              <SpeedSelector />
              <SpeedComparisonTable />
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-8">
              <ManualEntrySection />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

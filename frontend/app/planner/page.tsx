'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { PartitionControls } from '@/components/partition/PartitionControls';
import { PartitionList } from '@/components/partition/PartitionList';
import { ScheduleCalculator } from '@/components/schedule/ScheduleCalculator';
import { SpeedSelector } from '@/components/speed/SpeedSelector';
import { SpeedComparisonTable } from '@/components/speed/SpeedComparisonTable';
import { ExportMenu } from '@/components/export/ExportMenu';
import { ManualEntrySection } from '@/components/manual/ManualEntrySection';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Calendar, Zap, FileText, Plus, BookmarkPlus, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'partition' | 'schedule' | 'speed' | 'manual'>('partition');
  const [showEmptyState, setShowEmptyState] = useState(true);
  const { videos, playlistTitle, totalDuration, partitions, selectedSpeed } = usePlannerStore();
  const { saveCurrentPlaylist, isSaving } = useSavedPlaylistStore();
  const { data: session } = useSession();
  
  const hasVideos = videos.length > 0;
  const hasPartitions = partitions.length > 0;

  const handleAddManually = () => {
    setShowEmptyState(false);
    setActiveTab('manual');
  };

  const handleSaveToDashboard = async () => {
    if (!session?.user?.id) {
      toast.error('Please sign in to save playlists to your dashboard');
      return;
    }
    if (!hasVideos) {
      toast.error('No videos to save');
      return;
    }

    const dbVideos = videos.map((v, index) => ({
      youtube_video_id: v.source === 'youtube' ? v.id : null,
      title: v.title,
      duration: v.duration,
      thumbnail_url: null,
      position: index,
      source: v.source,
      notes: null,
      is_completed: false,
      completed_at: null,
    }));

    const speed = selectedSpeed || 1;
    const playlistData = {
      youtube_playlist_id: null,
      title: playlistTitle || 'Untitled Playlist',
      description: null,
      thumbnail_url: null,
      source: 'youtube' as const,
      total_duration: totalDuration,
      video_count: videos.length,
      average_video_duration: videos.length > 0 ? Math.floor(totalDuration / videos.length) : 0,
      playback_speed: speed,
      adjusted_duration: Math.floor(totalDuration / speed),
      status: 'planning',
      completion_percentage: 0,
      started_at: null,
      completed_at: null,
    };

    const result = await saveCurrentPlaylist(session.user.id, playlistData as any, dbVideos);
    if (result) {
      toast.success('Playlist saved to dashboard!');
    } else {
      toast.error('Failed to save playlist. Check your connection.');
    }
  };

  if (!hasVideos && showEmptyState) {
    return (
      <div className="min-h-screen bg-background relative">
        <BackgroundBeams />
        <div className="flex justify-end p-4 relative z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card text-card-foreground p-12 shadow-xl border relative z-10"
            >
              <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                No Playlist Loaded
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start by analyzing a YouTube playlist from the home page, or add videos manually.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/"
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <Calendar className="h-5 w-5" />
                  Analyze Playlist
                </a>
                <button
                  onClick={handleAddManually}
                  className="flex items-center gap-2 rounded-lg border-2 border-border px-6 py-3 font-medium text-foreground hover:bg-accent transition-all"
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
    <div className="min-h-screen bg-background relative">
      <BackgroundBeams />
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border hover:bg-accent transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{playlistTitle || 'Untitled Playlist'}</h1>
                <p className="text-sm text-muted-foreground">
                  {videos.length} videos • {Math.floor(totalDuration / 60)} minutes total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ExportMenu />
              <button
                onClick={handleSaveToDashboard}
                disabled={isSaving || !hasVideos}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkPlus className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Save to Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b bg-background">
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
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
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
      <div className="container mx-auto px-4 py-8 relative z-10">
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

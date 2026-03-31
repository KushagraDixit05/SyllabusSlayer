'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { useSavedPlaylistStore } from '@/store/useSavedPlaylistStore';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { PartitionControls } from '@/components/partition/PartitionControls';
import { PartitionList } from '@/components/partition/PartitionList';
import { ScheduleCalculator } from '@/components/schedule/ScheduleCalculator';
import { SpeedSelector } from '@/components/speed/SpeedSelector';
import { SpeedComparisonTable } from '@/components/speed/SpeedComparisonTable';
import { ExportMenu } from '@/components/export/ExportMenu';
import { ManualEntrySection } from '@/components/manual/ManualEntrySection';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PlaylistForm } from '@/components/PlaylistForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useUIStore } from '@/store/useUIStore';
import { Calendar, Zap, FileText, Plus, BookmarkPlus, Loader2, ArrowLeft, Video, Clock, BarChart3, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { AnimatedWaveBackground } from '@/components/ui/animated-wave-background';

// Speed options for public view
const SPEED_OPTIONS = [
  { speed: 1, label: '1×' },
  { speed: 1.25, label: '1.25×' },
  { speed: 1.5, label: '1.5×' },
  { speed: 1.75, label: '1.75×' },
  { speed: 2, label: '2×' },
];

// Helper to format duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'partition' | 'schedule' | 'speed' | 'manual'>('partition');
  const [showEmptyState, setShowEmptyState] = useState(true);
  const { videos, playlistTitle, totalDuration, partitions, selectedSpeed, setPlaylistData } = usePlannerStore();
  const { saveCurrentPlaylist, isSaving } = useSavedPlaylistStore();
  const { data: session, status } = useSession();
  
  // Analyze playlist functionality
  const { playlistData, fetchPlaylist, clearPlaylist } = usePlaylist();
  const { isLoading, error } = useUIStore();

  const hasVideos = videos.length > 0;
  const hasPartitions = partitions.length > 0;
  const isAuthenticated = status === 'authenticated';

  // Only load videos into planner when user explicitly starts planning (and is authenticated)
  const handleStartPlanning = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }
    
    if (playlistData && playlistData.videos) {
      const mappedVideos = playlistData.videos.map((video: any) => ({
        id: video.id || String(Math.random()),
        title: video.title,
        duration: video.duration,
        source: 'youtube' as const,
      }));
      setPlaylistData(playlistData.title, mappedVideos);
    }
  };

  const handleAddManually = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }
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

    try {
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
      const playlistDataToSave = {
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

      const result = await saveCurrentPlaylist(session.user.id, playlistDataToSave as any, dbVideos);
      if (result) {
        toast.success('Playlist saved to dashboard!');
      } else {
        // Get more specific error from store
        const storeError = useSavedPlaylistStore.getState().error;
        toast.error(storeError || 'Failed to save playlist. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  if (!hasVideos && showEmptyState) {
    return (
      <div className="min-h-screen bg-black relative">
        <AnimatedWaveBackground />
        
        {/* Navigation header */}
        <div className="fixed top-0 inset-x-0 flex items-center justify-between p-4 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors glass px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Centered analyzer card */}
        <div className="fixed inset-0 flex items-center justify-center p-4 z-10 pt-20">
          <div className="w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative card-border overflow-hidden rounded-2xl flex flex-col"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl">
                {/* Header */}
                <div className="p-6 pb-4">
                  <span className="inline-block px-3 py-1 glass text-indigo-300 rounded-full text-xs font-medium mb-3 border border-indigo-400/30">
                    Analyze Playlist
                  </span>
                  <h3 className="text-xl font-medium text-white mb-2">
                    Paste a YouTube Playlist
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Enter a playlist URL or ID to analyze duration, plan sessions, and track progress.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Form area */}
                <div className="p-6">
                  <PlaylistForm onSubmit={fetchPlaylist} onClear={clearPlaylist} />
                  
                  {/* Loading state */}
                  {isLoading && (
                    <div className="mt-6">
                      <LoadingState />
                    </div>
                  )}

                  {/* Error state */}
                  {error && !isLoading && (
                    <div className="mt-6">
                      <ErrorMessage message={error} />
                    </div>
                  )}

                  {/* Results preview with speed options (PUBLIC) */}
                  {playlistData && !isLoading && !error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 space-y-4"
                    >
                      {/* Playlist info */}
                      <div className="p-4 rounded-xl glass border border-white/10">
                        <h4 className="text-white font-medium mb-3 truncate">{playlistData.title}</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <Video className="h-4 w-4 text-indigo-400 mx-auto mb-1" />
                            <p className="text-white font-semibold text-sm">{playlistData.videoCount}</p>
                            <p className="text-white/50 text-xs">Videos</p>
                          </div>
                          <div className="text-center">
                            <Clock className="h-4 w-4 text-indigo-400 mx-auto mb-1" />
                            <p className="text-white font-semibold text-sm">{playlistData.totalDurationFormatted}</p>
                            <p className="text-white/50 text-xs">Duration</p>
                          </div>
                          <div className="text-center">
                            <BarChart3 className="h-4 w-4 text-indigo-400 mx-auto mb-1" />
                            <p className="text-white font-semibold text-sm">{playlistData.averageVideoLengthFormatted}</p>
                            <p className="text-white/50 text-xs">Avg Length</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Speed options table (PUBLIC FEATURE) */}
                      <div className="p-4 rounded-xl glass border border-white/10">
                        <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-indigo-400" />
                          Duration at Different Speeds
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                          {SPEED_OPTIONS.map(({ speed, label }) => (
                            <div key={speed} className="text-center p-2 rounded-lg bg-white/5">
                              <p className="text-indigo-400 text-xs font-medium">{label}</p>
                              <p className="text-white font-semibold text-sm mt-1">
                                {formatDuration(playlistData.totalDuration / speed)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTA: Sign in to Plan or Start Planning */}
                      <div className="space-y-3">
                        {isAuthenticated ? (
                          <button
                            onClick={handleStartPlanning}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                          >
                            Start Planning
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => signIn()}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                            >
                              <LogIn className="h-4 w-4" />
                              Sign in to Plan Sessions
                            </button>
                            <p className="text-center text-white/40 text-xs">
                              Sign in to access partitions, scheduling, and save to dashboard
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Footer actions */}
                <div className="p-4 flex items-center justify-between">
                  <button
                    onClick={handleAddManually}
                    className="text-white/60 hover:text-white transition flex items-center text-xs font-medium gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add videos manually
                    {!isAuthenticated && <LogIn className="h-3 w-3 ml-1 text-indigo-400" />}
                  </button>
                  <span className="text-white/40 text-xs glass px-2 py-1 rounded-full border border-white/10">
                    {playlistData ? 'Analyze • Free' : 'Free • No sign-in'}
                  </span>
                </div>
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

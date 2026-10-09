'use client';

import { useState, useMemo } from 'react';
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
import { PlaylistForm } from '@/components/PlaylistForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useUIStore } from '@/store/useUIStore';
import { Calendar, Zap, List, Plus, BookmarkPlus, Loader2, ArrowLeft, Video, Clock, BarChart3, LogIn, ArrowRight, ChevronDown, ChevronUp, Filter, PlaySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  
  // Video range selection state
  const [showRangeSelector, setShowRangeSelector] = useState(false);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  
  const { videos, playlistTitle, totalDuration, partitions, selectedSpeed, setPlaylistData } = usePlannerStore();
  const { saveCurrentPlaylist, isSaving } = useSavedPlaylistStore();
  const { data: session, status } = useSession();
  
  // Analyze playlist functionality
  const { playlistData, fetchPlaylist, clearPlaylist } = usePlaylist();
  const { isLoading, error } = useUIStore();

  const hasVideos = videos.length > 0;
  const hasPartitions = partitions.length > 0;
  const isAuthenticated = status === 'authenticated';
  
  // Calculate selected range duration
  const selectedRangeData = useMemo(() => {
    if (!playlistData?.videos) return null;
    
    const videoCount = playlistData.videos.length;
    const start = Math.max(1, Math.min(rangeStart, videoCount));
    const end = rangeEnd ? Math.min(rangeEnd, videoCount) : videoCount;
    
    // Validate range
    if (start > end) return null;
    
    // Get videos in range (1-indexed for user, 0-indexed for array)
    const selectedVideos = playlistData.videos.slice(start - 1, end);
    const selectedDuration = selectedVideos.reduce((sum: number, v: any) => sum + (v.duration || 0), 0);
    const selectedCount = selectedVideos.length;
    
    // Check if using full playlist
    const isFullPlaylist = start === 1 && end === videoCount;
    
    return {
      start,
      end,
      count: selectedCount,
      duration: selectedDuration,
      isFullPlaylist,
      videos: selectedVideos,
    };
  }, [playlistData, rangeStart, rangeEnd]);
  
  // Duration to use for speed calculations (selected range or full playlist)
  const effectiveDuration = selectedRangeData?.duration ?? playlistData?.totalDuration ?? 0;

  // Only load videos into planner when user explicitly starts planning (and is authenticated)
  const handleStartPlanning = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }
    
    if (playlistData && playlistData.videos) {
      // Use selected range if set, otherwise use all videos
      const videosToUse = selectedRangeData?.isFullPlaylist === false 
        ? selectedRangeData.videos 
        : playlistData.videos;
      
      const mappedVideos = videosToUse.map((video: any) => ({
        id: video.id || String(Math.random()),
        title: video.title,
        duration: video.duration,
        source: 'youtube' as const,
      }));
      
      const title = selectedRangeData?.isFullPlaylist === false
        ? `${playlistData.title} (Videos ${selectedRangeData.start}-${selectedRangeData.end})`
        : playlistData.title;
      
      setPlaylistData(title, mappedVideos);
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
      <div className="brutal-dots relative flex min-h-screen flex-col bg-background">
        {/* Navigation header */}
        <div className="relative z-20 flex shrink-0 items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo size={36} className="rounded-xl" />
            <span className="font-display text-lg font-black tracking-tight text-foreground md:text-xl">
              Syllabus<span className="text-gradient-brand">Slayer</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="rounded-full flex items-center gap-2 border-[3px] border-ink bg-card px-4 py-2 text-sm font-bold transition-colors hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </div>
        </div>

        {/* Centered analyzer card */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg relative flex flex-col border-[3px] border-ink bg-card shadow-brutal-lg"
            >
              <div>
                {/* Header */}
                <div className="p-6 pb-4">
                  <Badge className="mb-3">Analyze Playlist</Badge>
                  <h3 className="mb-2 font-display text-xl font-black leading-none tracking-tight">
                    Paste a YouTube Playlist
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Enter a playlist URL or ID to analyze duration, plan sessions, and track progress.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full border-t-[3px] border-ink" />

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
                      <div className="rounded-lg border-[3px] border-ink bg-muted p-4">
                        <h4 className="mb-3 flex items-center gap-2 truncate font-display text-base font-black tracking-tight">
                          <PlaySquare className="h-4 w-4 shrink-0 text-foreground" />
                          {playlistData.title}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { icon: Video, value: playlistData.videoCount, label: 'Videos' },
                            { icon: Clock, value: playlistData.totalDurationFormatted, label: 'Duration' },
                            { icon: BarChart3, value: playlistData.averageVideoLengthFormatted, label: 'Avg Length' },
                          ].map(({ icon: Icon, value, label }) => (
                            <div key={label} className="text-center">
                              <div className="rounded-full mx-auto mb-1.5 flex h-8 w-8 items-center justify-center border-[3px] border-ink bg-primary text-primary-foreground">
                                <Icon className="h-4 w-4" />
                              </div>
                              <p className="font-display text-sm font-black tabular-nums">{value}</p>
                              <p className="text-sm font-medium text-muted-foreground">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Video Range Selector (Collapsible) */}
                      <div className="rounded-lg overflow-hidden border-[3px] border-ink bg-muted">
                        <button
                          onClick={() => setShowRangeSelector(!showRangeSelector)}
                          className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-accent"
                        >
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-foreground" />
                            <span className="text-xs font-bold">
                              Custom Video Range
                            </span>
                            {selectedRangeData && !selectedRangeData.isFullPlaylist && (
                              <span className="rounded-full border-[3px] border-ink bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                                {selectedRangeData.count} videos selected
                              </span>
                            )}
                          </div>
                          {showRangeSelector ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {showRangeSelector && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 space-y-3">
                                <p className="text-sm font-medium text-muted-foreground">
                                  Select a range to calculate duration for specific videos only
                                </p>
                                
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-muted-foreground">From video</label>
                                    <input
                                      type="number"
                                      min={1}
                                      max={rangeEnd ?? playlistData.videoCount}
                                      value={rangeStart}
                                      onChange={(e) => {
                                        const val = Math.max(1, parseInt(e.target.value) || 1);
                                        const maxVal = rangeEnd ?? playlistData.videoCount;
                                        setRangeStart(Math.min(val, maxVal));
                                      }}
                                      className="rounded-lg w-full border-[3px] border-ink bg-background px-3 py-2 font-mono text-sm tabular-nums focus:outline-none focus-visible:bg-accent"
                                    />
                                  </div>
                                  <span className="mt-5 text-xs font-medium text-muted-foreground">to</span>
                                  <div className="flex-1">
                                    <label className="mb-1 block text-xs font-bold text-muted-foreground">To video</label>
                                    <input
                                      type="number"
                                      min={rangeStart}
                                      max={playlistData.videoCount}
                                      value={rangeEnd ?? playlistData.videoCount}
                                      onChange={(e) => {
                                        const val = Math.min(playlistData.videoCount, parseInt(e.target.value) || playlistData.videoCount);
                                        setRangeEnd(Math.max(val, rangeStart));
                                      }}
                                      className="rounded-lg w-full border-[3px] border-ink bg-background px-3 py-2 font-mono text-sm tabular-nums focus:outline-none focus-visible:bg-accent"
                                    />
                                  </div>
                                </div>
                                
                                {/* Selected range summary */}
                                {selectedRangeData && (
                                  <div className={cn('border-[3px] p-3', selectedRangeData.isFullPlaylist ? 'border-transparent bg-accent' : 'border-ink bg-accent')}>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        {selectedRangeData.isFullPlaylist ? (
                                          'Full playlist selected'
                                        ) : (
                                          <>Videos {selectedRangeData.start} – {selectedRangeData.end}</>
                                        )}
                                      </span>
                                      <span className="font-display text-sm font-black tabular-nums">
                                        {selectedRangeData.count} videos • {formatDuration(selectedRangeData.duration)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Reset button */}
                                {selectedRangeData && !selectedRangeData.isFullPlaylist && (
                                  <button
                                    onClick={() => {
                                      setRangeStart(1);
                                      setRangeEnd(null);
                                    }}
                                    className="text-xs font-bold underline underline-offset-4 transition-colors hover:text-muted-foreground"
                                  >
                                    Reset to full playlist
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Speed options table (PUBLIC FEATURE) */}
                      <div className="rounded-lg border-[3px] border-ink bg-muted p-4">
                        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <Zap className="h-4 w-4 text-foreground" />
                          Duration at Different Speeds
                          {selectedRangeData && !selectedRangeData.isFullPlaylist && (
                            <span className="font-mono text-xs font-normal text-muted-foreground">
                              (for selected {selectedRangeData.count} videos)
                            </span>
                          )}
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                          {SPEED_OPTIONS.map(({ speed, label }) => {
                            const isSweetSpot = speed === 1.5;
                            return (
                              <div
                                key={speed}
                                className={cn(
                                  'border-[3px] p-2 text-center transition-colors',
                                  isSweetSpot
                                    ? 'border-ink bg-primary text-primary-foreground'
                                    : 'border-transparent bg-accent'
                                )}
                              >
                                <p className="text-xs font-bold">{label}</p>
                                <p className="mt-1 font-display text-sm font-black tabular-nums">
                                  {formatDuration(effectiveDuration / speed)}
                                </p>
                                {isSweetSpot && (
                                  <p className="mt-0.5 text-[9px] font-bold">
                                    Sweet Spot
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* CTA: Sign in to Plan or Start Planning */}
                      <div className="space-y-3">
                        {isAuthenticated ? (
                          <Button onClick={handleStartPlanning} size="lg" className="w-full gap-2">
                            Start Planning
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <Button onClick={() => signIn()} size="lg" className="w-full gap-2">
                              <LogIn className="h-4 w-4" />
                              Sign in to Plan Sessions
                            </Button>
                            <p className="text-center text-sm font-medium text-muted-foreground">
                              Sign in to access partitions, scheduling, and save to dashboard
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent" />

                {/* Footer actions */}
                <div className="p-4 flex items-center justify-between">
                  <button
                    onClick={handleAddManually}
                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    Add videos manually
                    {!isAuthenticated && <LogIn className="ml-1 h-3 w-3 text-foreground" />}
                  </button>
                  <span className="rounded-lg border-[3px] border-ink bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
                    {playlistData ? 'Analyze • Free' : 'Free • No sign-in'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Page footer */}
        <div className="relative z-10 shrink-0 py-4 text-center text-sm font-medium text-muted-foreground">
          © {new Date().getFullYear()} SyllabusSlayer. Slay Your Syllabus. One Playlist at a Time.
        </div>
      </div>
    );
  }

  return (
    <div className="brutal-dots relative min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:flex shrink-0" title="SyllabusSlayer">
                <Logo size={28} />
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <Link
                href="/dashboard"
                className="rounded-full flex h-9 w-9 items-center justify-center border-[3px] border-ink transition-colors hover:bg-accent"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="font-display text-2xl font-black leading-none tracking-tight text-foreground">{playlistTitle || 'Untitled Playlist'}</h1>
                <p className="text-sm font-medium text-muted-foreground">
                  {videos.length} videos • {Math.floor(totalDuration / 60)} minutes total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ExportMenu />
              <Button
                onClick={handleSaveToDashboard}
                disabled={isSaving || !hasVideos}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkPlus className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Save to Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b-[3px] border-ink bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'partition', label: 'Partitions', icon: List },
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
            <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
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

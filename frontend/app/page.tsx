'use client';

import { PlaylistForm } from '@/components/PlaylistForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useUIStore } from '@/store/useUIStore';
import { Clock, Youtube, Zap } from 'lucide-react';

export default function Home() {
  const { playlistData, fetchPlaylist, clearPlaylist } = usePlaylist();
  const { isLoading, error } = useUIStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Syllabus Slayer
              </h1>
              <p className="text-sm text-gray-600">YouTube Time Architect</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Transform Content Chaos into Calculated Mastery
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Calculate YouTube playlist durations, optimize playback speed, and plan your learning journey with precision.
          </p>

          {/* Feature Pills */}
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Instant Duration Calculation
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Speed Optimization
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <PlaylistForm onSubmit={fetchPlaylist} onClear={clearPlaylist} />

            {/* Loading State */}
            {isLoading && (
              <div className="mt-8 animate-fade-in">
                <LoadingState />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="mt-8 animate-fade-in">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Results */}
            {playlistData && !isLoading && !error && (
              <div className="mt-8 animate-fade-in">
                <ResultsDisplay data={playlistData} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-gray-600">
            Built for learners, by learners. Time is finite. Make it count.
          </p>
        </div>
      </footer>
    </main>
  );
}

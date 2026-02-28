'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { PlaylistForm } from '@/components/PlaylistForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useUIStore } from '@/store/useUIStore';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Home() {
  const { playlistData, fetchPlaylist, clearPlaylist } = usePlaylist();
  const { isLoading, error } = useUIStore();
  const analyzerRef = useRef<HTMLDivElement>(null);

  const scrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white overflow-x-hidden">
      {/* Hero */}
      <HeroSection onAnalyzeClick={scrollToAnalyzer} />

      {/* How it works */}
      <HowItWorks />

      {/* Features */}
      <FeaturesSection />

      {/* ── Analyzer Section ── */}
      <section
        ref={analyzerRef}
        id="analyze"
        className="relative mx-auto max-w-7xl px-4 py-24"
      >
        {/* Section header */}
        <div className="mb-12 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-blue-50 dark:bg-blue-950 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 mb-4"
          >
            Try it now — free, no sign-in needed
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Analyse any YouTube playlist
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-neutral-500 dark:text-neutral-400"
          >
            Paste the URL below and get instant results.
          </motion.p>
        </div>

        {/* Analyzer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-xl">
            {/* Subtle glow */}
            <div className="absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />

            <PlaylistForm onSubmit={fetchPlaylist} onClear={clearPlaylist} />

            {isLoading && (
              <div className="mt-8">
                <LoadingState />
              </div>
            )}

            {error && !isLoading && (
              <div className="mt-8">
                <ErrorMessage message={error} />
              </div>
            )}

            {playlistData && !isLoading && !error && (
              <div className="mt-8">
                <ResultsDisplay data={playlistData} />
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* CTA + Footer */}
      <LandingFooter />
    </main>
  );
}

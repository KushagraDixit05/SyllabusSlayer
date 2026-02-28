"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BookOpen } from "lucide-react";

interface HeroSectionProps {
  onAnalyzeClick: () => void;
}

export function HeroSection({ onAnalyzeClick }: HeroSectionProps) {
  const { data: session } = useSession();

  const headline = "Slay Your Syllabus. One Playlist at a Time.";

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center">
      {/* Left rail */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-20 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      {/* Right rail */}
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-20 h-40 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
      </div>
      {/* Bottom border accent */}
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Navbar */}
      <LandingNavbar session={session} />

      {/* Hero content */}
      <div className="px-4 py-14 md:py-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Free · No credit card required
          </span>
        </motion.div>

        {/* Animated headline */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-extrabold text-slate-800 md:text-5xl lg:text-7xl dark:text-slate-100 leading-tight tracking-tight">
          {headline.split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
                ease: "easeInOut",
              }}
              className={`mr-2 inline-block ${
                word === "Slay" || word === "Syllabus."
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-lg font-normal text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          Paste any YouTube playlist. Instantly see how long it'll take, plan
          your study sessions, optimise playback speed, and track your progress
          — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.1 }}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onAnalyzeClick}
            className="w-60 transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 hover:shadow-xl"
          >
            Analyze a Playlist ↓
          </button>
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex w-60 transform items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-flex w-60 transform items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              Sign In Free →
            </Link>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          className="mt-4 text-center text-sm text-neutral-400 dark:text-neutral-600"
        >
          Trusted by learners binge-watching courses at 2× speed
        </motion.p>

        {/* App preview card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="relative z-10 mt-16 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* Glow behind the card */}
          <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 rounded bg-gray-200 dark:bg-gray-700 h-5 text-xs text-gray-400 flex items-center px-3">
                syllabusslayer.app/dashboard
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="grid grid-cols-3 gap-3 p-6 bg-white dark:bg-gray-950">
              {/* Stat cards */}
              {[
                { label: "Total Hours Saved", value: "24h 30m", color: "from-blue-500 to-blue-600" },
                { label: "Playlists Planned", value: "12", color: "from-purple-500 to-purple-600" },
                { label: "Current Streak", value: "7 🔥", color: "from-orange-500 to-orange-600" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              ))}
              {/* Progress bar row */}
              <div className="col-span-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">CS50 Full Course</p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">68%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
              </div>
              {/* Achievement badges */}
              <div className="col-span-3 flex gap-2 flex-wrap">
                {["🏆 First Plan", "⚡ Speed Demon", "🔥 Week Warrior", "🎯 Syllabus Slayer"].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LandingNavbar({ session }: { session: any }) {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white md:text-xl">
          Syllabus<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Slayer</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

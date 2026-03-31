"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BookOpen } from "lucide-react";
import { HiOutlineBars3 } from "react-icons/hi2";

// Hero6-inspired focus ring styles
const focusRing = "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-600 focus:ring-offset-black";

export function HeroSection() {
  const { data: session } = useSession();

  const headline = "Slay Your Syllabus. One Playlist at a Time.";

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Hero6-style radial glow background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[32rem] h-[32rem] bg-indigo-500 opacity-15 rounded-full blur-3xl top-10 left-1/2 -translate-x-1/2" />
        <div className="absolute w-64 h-64 bg-purple-500 opacity-10 rounded-full blur-3xl top-40 left-1/4" />
        <div className="absolute w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl top-40 right-1/4" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center">
        {/* Navbar */}
        <LandingNavbar session={session} />

      {/* Hero content */}
      <div className="px-4 py-20 md:py-32">
        {/* Badge - Hero6 style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            Free · No credit card required
          </span>
        </motion.div>

        {/* Animated headline - Hero6 style text colors */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-extrabold text-white md:text-5xl lg:text-7xl leading-tight tracking-tight">
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
                  ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtext - Hero6 style */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-lg font-normal text-white/70 leading-relaxed"
        >
          Paste any YouTube playlist. Instantly see how long it'll take, plan
          your study sessions, optimise playback speed, and track your progress
          — all in one place.
        </motion.p>

        {/* CTA Buttons - Hero6 rounded-full style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.1 }}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/planner"
            className={`inline-flex items-center justify-center w-60 rounded-full bg-white px-8 py-3 text-base font-semibold text-black transition-all duration-200 hover:bg-opacity-90 ${focusRing}`}
          >
            Analyze a Playlist →
          </Link>
          {session ? (
            <Link
              href="/dashboard"
              className={`inline-flex w-60 items-center justify-center rounded-full border-2 border-white/20 bg-transparent px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 ${focusRing}`}
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className={`inline-flex w-60 items-center justify-center rounded-full border-2 border-white/20 bg-transparent px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 ${focusRing}`}
            >
              Sign In Free →
            </Link>
          )}
        </motion.div>

        {/* Social proof - Hero6 style */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          className="mt-4 text-center text-sm text-white/40"
        >
          Trusted by learners binge-watching courses at 2× speed
        </motion.p>

        {/* App preview card - Hero6 inspired */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 mt-16 rounded-2xl border border-white/10 bg-neutral-900/80 p-4 shadow-2xl backdrop-blur-sm"
        >
          {/* Glow behind the card - Hero6 style */}
          <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
          <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-900 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 rounded bg-neutral-800 h-5 text-xs text-white/40 flex items-center px-3">
                syllabusslayer.app/dashboard
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="grid grid-cols-3 gap-3 p-6 bg-neutral-950">
              {/* Stat cards */}
              {[
                { label: "Total Hours Saved", value: "24h 30m", color: "from-indigo-500 to-indigo-600" },
                { label: "Playlists Planned", value: "12", color: "from-purple-500 to-purple-600" },
                { label: "Current Streak", value: "7 🔥", color: "from-orange-500 to-orange-600" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-neutral-900 p-4"
                >
                  <p className="text-xs text-white/50">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              ))}
              {/* Progress bar row */}
              <div className="col-span-3 rounded-xl border border-white/10 bg-neutral-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white/80">CS50 Full Course</p>
                  <span className="text-xs text-indigo-400 font-semibold">68%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                </div>
              </div>
              {/* Achievement badges */}
              <div className="col-span-3 flex gap-2 flex-wrap">
                {["🏆 First Plan", "⚡ Speed Demon", "🔥 Week Warrior", "🎯 Syllabus Slayer"].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-indigo-950/50 border border-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-300"
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
    </div>
  );
}

function LandingNavbar({ session }: { session: any }) {
  return (
    <nav className="flex w-full items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md ${focusRing}`}>
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-white md:text-xl">
          Syllabus<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Slayer</span>
        </span>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className={`p-2 -m-2 text-white rounded-full ${focusRing}`}
        >
          <HiOutlineBars3 className="w-7 h-7" />
        </button>
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <Link
            href="/dashboard"
            className={`rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-opacity-90 ${focusRing}`}
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className={`rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-opacity-90 ${focusRing}`}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

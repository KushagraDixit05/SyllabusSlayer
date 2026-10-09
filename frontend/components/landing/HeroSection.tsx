"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";

const focusRing = "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ring focus:ring-offset-background";

// A representative sample of real achievements (see lib/achievements/definitions.ts)
// used to preview the rarity system on the hero card — not a live feed.
const SAMPLE_ACHIEVEMENTS = [
  { icon: "🎯", name: "First Steps", rarity: "common" as const },
  { icon: "⚡", name: "Speed Demon", rarity: "rare" as const },
  { icon: "🏃", name: "Marathon Runner", rarity: "epic" as const },
  { icon: "👑", name: "Centurion", rarity: "legendary" as const },
];

export function HeroSection() {
  const { data: session } = useSession();

  const headline = "Slay Your Syllabus. One Playlist at a Time.";

  return (
    <div className="brutal-dots relative overflow-hidden bg-background">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center">
        {/* Navbar */}
        <LandingNavbar session={session} />

      {/* Hero content */}
      <div className="px-4 py-20 md:py-32">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            YouTube Time Architect &middot; Gamified Productivity
          </span>
        </motion.div>

        {/* Animated headline */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center font-display text-3xl font-black text-foreground md:text-5xl lg:text-7xl leading-tight tracking-tight">
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
                  ? "text-gradient-brand"
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
          className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-lg font-normal text-muted-foreground leading-relaxed"
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
          <Button asChild size="lg" className="w-60 rounded-full">
            <Link href="/planner">Slay a Playlist →</Link>
          </Button>
          {session ? (
            <Button asChild variant="outline" size="lg" className="w-60 rounded-full">
              <Link href="/dashboard">Go to Dashboard →</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="w-60 rounded-full">
              <Link href="/auth/signin">Sign In Free →</Link>
            </Button>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          className="mt-4 text-center text-sm text-muted-foreground/70"
        >
          Trusted by learners binge-watching courses at 2× speed
        </motion.p>

        {/* App preview panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 mt-16"
        >
          {/* Glow behind the panel */}
          
          <Card variant="elevated" className="overflow-hidden p-4">
            <div className="w-full overflow-hidden rounded-lg border-[3px] border-ink">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 border-b-[3px] border-ink bg-muted px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-destructive" />
                <span className="h-3 w-3 rounded-full bg-gold" />
                <span className="h-3 w-3 rounded-full bg-chart-5" />
                <div className="ml-4 flex-1 rounded bg-muted h-5 text-xs text-muted-foreground flex items-center px-3">
                  syllabusslayer.app/dashboard
                </div>
              </div>
              {/* Dashboard mockup */}
              <div className="grid grid-cols-3 gap-3 p-6">
                {[
                  { label: "Total Hours Saved", value: "24h 30m" },
                  { label: "Playlists Planned", value: "12" },
                  { label: "Current Streak", value: "7 🔥" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border-[3px] border-ink bg-card p-4"
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gradient-brand">
                      {stat.value}
                    </p>
                  </div>
                ))}
                {/* Progress bar row */}
                <div className="col-span-3 rounded-lg border-[3px] border-ink bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">CS50 Full Course</p>
                    <span className="text-xs text-foreground font-semibold">68%</span>
                  </div>
                  <div className="h-2 w-full rounded-full border-[3px] border-ink bg-card">
                    <div className="h-2 w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
                {/* Achievement badges */}
                <div className="col-span-3 flex gap-2 flex-wrap">
                  {SAMPLE_ACHIEVEMENTS.map((achievement) => (
                    <Badge key={achievement.name} variant={achievement.rarity}>
                      {achievement.icon} {achievement.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

function LandingNavbar({ session }: { session: any }) {
  return (
    <nav className="flex w-full items-center justify-between border-b-[3px] border-ink px-6 py-4">
      <div className="flex items-center gap-3">
        <Logo size={36} className={`rounded-xl ${focusRing}`} />
        <span className="font-display text-lg font-black tracking-tight text-foreground md:text-xl">
          Syllabus<span className="text-gradient-brand">Slayer</span>
        </span>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className={`p-2 -m-2 text-foreground rounded-full ${focusRing}`}
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {session ? (
          <Button asChild size="sm" className="rounded-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <Button asChild size="sm" className="rounded-full">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

"use client";

import { motion, type Variants } from "framer-motion";
import { Clock, Zap, BarChart2, Trophy, Calendar, Share2 } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Instant Duration Analysis",
    description:
      "Paste any YouTube playlist URL and get the total duration, per-video breakdown, and time estimates instantly — no sign-in required.",
    gradient: "bg-primary",
  },
  {
    icon: Zap,
    title: "Speed Optimisation",
    description:
      "See exactly how much time you save at 1.25×, 1.5×, 1.75×, and 2× playback speeds. Plan smarter, not harder.",
    gradient: "bg-rarity-rare",
  },
  {
    icon: Calendar,
    title: "Study Schedule Builder",
    description:
      "Set a daily study goal. Get an auto-generated schedule that fits your life — broken into manageable daily partitions.",
    gradient: "bg-rarity-epic",
  },
  {
    icon: BarChart2,
    title: "Progress Tracking",
    description:
      "Track streaks, completion rates, and hours planned. Stay consistent with a GitHub-style activity heatmap and streak counter.",
    gradient: "bg-flame-from",
  },
  {
    icon: Trophy,
    title: "Achievements & Gamification",
    description:
      "Unlock 12 achievements as you plan and complete playlists. Compete on the optional leaderboard and celebrate milestones with confetti.",
    gradient: "bg-gold",
  },
  {
    icon: Share2,
    title: "Shareable Planner Links",
    description:
      "Generate a public link to any planned playlist. Share your study plan with friends, classmates, or post it online.",
    gradient: "bg-brand-to",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      {/* Section header */}
      <div className="mb-16 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-block rounded-full border-[3px] border-ink bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground mb-4"
        >
          Everything you need
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          From chaos to{" "}
          <span className="text-gradient-brand">calculated mastery</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
        >
          SyllabusSlayer turns any YouTube playlist into a fully structured
          study plan with analytics, streaks, and achievements.
        </motion.p>
      </div>

      {/* Feature cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="rounded-lg group border-[3px] border-ink bg-card p-6 shadow-brutal-sm brutal-lift"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border-[3px] border-ink ${feature.gradient}`}
              >
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

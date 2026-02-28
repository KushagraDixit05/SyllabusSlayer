"use client";

import { motion, type Variants } from "framer-motion";
import { Clock, Zap, BarChart2, Trophy, Calendar, Share2 } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Instant Duration Analysis",
    description:
      "Paste any YouTube playlist URL and get the total duration, per-video breakdown, and time estimates instantly — no sign-in required.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-100 dark:border-blue-900",
  },
  {
    icon: Zap,
    title: "Speed Optimisation",
    description:
      "See exactly how much time you save at 1.25×, 1.5×, 1.75×, and 2× playback speeds. Plan smarter, not harder.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-100 dark:border-purple-900",
  },
  {
    icon: Calendar,
    title: "Study Schedule Builder",
    description:
      "Set a daily study goal. Get an auto-generated schedule that fits your life — broken into manageable daily partitions.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-100 dark:border-emerald-900",
  },
  {
    icon: BarChart2,
    title: "Progress Tracking",
    description:
      "Track streaks, completion rates, and hours planned. Stay consistent with a GitHub-style activity heatmap and streak counter.",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-100 dark:border-orange-900",
  },
  {
    icon: Trophy,
    title: "Achievements & Gamification",
    description:
      "Unlock 12 achievements as you plan and complete playlists. Compete on the optional leaderboard and celebrate milestones with confetti.",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    border: "border-yellow-100 dark:border-yellow-900",
  },
  {
    icon: Share2,
    title: "Shareable Planner Links",
    description:
      "Generate a public link to any planned playlist. Share your study plan with friends, classmates, or post it online.",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-950/40",
    border: "border-pink-100 dark:border-pink-900",
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
          className="inline-block rounded-full bg-blue-50 dark:bg-blue-950 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 mb-4"
        >
          Everything you need
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
        >
          From chaos to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            calculated mastery
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400"
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
              className={`group rounded-2xl border p-6 ${feature.bg} ${feature.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-sm`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

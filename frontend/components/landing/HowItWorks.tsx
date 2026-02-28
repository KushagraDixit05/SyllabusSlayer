"use client";

import { motion } from "framer-motion";
import { Link2, SlidersHorizontal, LayoutDashboard } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Paste a YouTube Playlist URL",
    description:
      "Copy any YouTube playlist link — a full university course, a coding bootcamp, a language series, anything. Paste it into the analyser below.",
    color: "from-blue-600 to-cyan-500",
  },
  {
    step: "02",
    icon: SlidersHorizontal,
    title: "Configure Your Study Plan",
    description:
      "Choose your daily time budget, target playback speed, and how you want to partition the content. We'll build a schedule around your life.",
    color: "from-purple-600 to-pink-500",
  },
  {
    step: "03",
    icon: LayoutDashboard,
    title: "Track, Achieve, Repeat",
    description:
      "Save your plan to the dashboard. Check off sessions, maintain your streak, unlock achievements, and race up the leaderboard.",
    color: "from-emerald-500 to-teal-500",
  },
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-100/40 dark:bg-purple-900/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-16 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-block rounded-full bg-purple-50 dark:bg-purple-950 px-4 py-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900 mb-4"
        >
          How it works
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          Three steps to slaying your syllabus
        </motion.h2>
      </div>

      {/* Steps */}
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Connecting line (desktop) */}
        <div className="absolute inset-x-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent md:block" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step icon */}
              <div
                className={`relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
              >
                <Icon className="h-7 w-7 text-white" />
              </div>

              {/* Step number badge */}
              <span className="absolute -right-2 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                {step.step}
              </span>

              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

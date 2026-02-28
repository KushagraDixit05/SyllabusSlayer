"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BookOpen, Github, Twitter } from "lucide-react";

export function LandingFooter() {
  const { data: session } = useSession();

  return (
    <>
      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 px-8 py-16 text-center shadow-2xl"
        >
          {/* Background decoration */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

          <h2 className="relative z-10 mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to slay your backlog?
          </h2>
          <p className="relative z-10 mx-auto mb-8 max-w-xl text-lg text-blue-100">
            Join learners who've reclaimed thousands of hours by studying
            smarter — not longer.
          </p>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-white px-8 py-3 font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Open Dashboard →
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-lg bg-white px-8 py-3 font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Get Started Free →
              </Link>
            )}
            <Link
              href="/planner"
              className="rounded-lg border border-white/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              Try the Planner
            </Link>
          </div>
          <p className="relative z-10 mt-6 text-sm text-blue-200">
            Free forever · No credit card · No BS
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-gray-900 dark:text-white">
                Syllabus<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Slayer</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/planner" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Planner
              </Link>
              {session && (
                <>
                  <Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/achievements" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                    Achievements
                  </Link>
                </>
              )}
              {!session && (
                <Link href="/auth/signin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
              )}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-3 text-gray-400">
              <a href="#" aria-label="GitHub" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} SyllabusSlayer. Time is finite. Make it count.
          </p>
        </div>
      </footer>
    </>
  );
}

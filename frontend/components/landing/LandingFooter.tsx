"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Github, Twitter } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        >
          <Card variant="elevated" className="relative overflow-hidden px-8 py-16 text-center">
            {/* Background decoration */}

            <h2 className="relative z-10 mb-4 font-display text-3xl font-black text-foreground sm:text-4xl">
              Ready to slay your backlog?
            </h2>
            <p className="relative z-10 mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              Join learners who've reclaimed thousands of hours by studying
              smarter — not longer.
            </p>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                {session ? (
                  <Link href="/dashboard">Open Dashboard →</Link>
                ) : (
                  <Link href="/auth/signin">Get Started Free →</Link>
                )}
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/planner">Try the Planner</Link>
              </Button>
            </div>
            <p className="relative z-10 mt-6 text-sm text-muted-foreground">
              Free forever · No credit card · No BS
            </p>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-ink bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Logo size={28} className="rounded-lg" />
              <span className="font-display font-black text-foreground">
                Syllabus<span className="text-gradient-brand">Slayer</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/planner" className="hover:text-foreground transition-colors">
                Planner
              </Link>
              {session && (
                <>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/achievements" className="hover:text-foreground transition-colors">
                    Achievements
                  </Link>
                </>
              )}
              {!session && (
                <Link href="/auth/signin" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              )}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <a href="#" aria-label="GitHub" className="hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} SyllabusSlayer. Time is finite. Make it count.
          </p>
        </div>
      </footer>
    </>
  );
}

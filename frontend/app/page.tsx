'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white overflow-x-hidden">
      {/* Hero */}
      <HeroSection />

      {/* How it works */}
      <HowItWorks />

      {/* Features */}
      <FeaturesSection />

      {/* CTA + Footer */}
      <LandingFooter />
    </main>
  );
}

'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <main className="brutal-dots min-h-screen bg-background text-foreground overflow-x-hidden">
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

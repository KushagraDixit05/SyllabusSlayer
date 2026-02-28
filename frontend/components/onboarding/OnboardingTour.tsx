'use client'

import { useEffect, useRef } from 'react'
import Shepherd from 'shepherd.js'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import 'shepherd.js/dist/css/shepherd.css'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Syllabus Slayer! 🎉',
    text: "Let's take a quick tour of your new learning command center.",
    buttons: [
      { text: 'Skip Tour', action: 'cancel', secondary: true },
      { text: 'Next →', action: 'next' },
    ],
  },
  {
    id: 'sidebar',
    attachTo: { element: 'aside', on: 'right' as const },
    title: 'Navigation Sidebar',
    text: 'Navigate between different sections using the sidebar. Collapse it for more screen space!',
    buttons: [
      { text: '← Back', action: 'back', secondary: true },
      { text: 'Next →', action: 'next' },
    ],
  },
  {
    id: 'new-playlist',
    attachTo: { element: '[data-tour="new-playlist"]', on: 'right' as const },
    title: 'Create a Playlist Plan',
    text: "Click here to create your first playlist. Paste a YouTube URL and we'll handle the rest!",
    buttons: [
      { text: '← Back', action: 'back', secondary: true },
      { text: 'Next →', action: 'next' },
    ],
  },
  {
    id: 'command-menu',
    title: 'Command Menu ⌨️',
    text: 'Pro tip: Press Cmd+K (or Ctrl+K) anytime to quickly navigate and search!',
    buttons: [
      { text: '← Back', action: 'back', secondary: true },
      { text: 'Next →', action: 'next' },
    ],
  },
  {
    id: 'achievements',
    title: 'Earn Achievements 🏆',
    text: 'Earn achievements and track your progress as you learn. Your first achievement is just one playlist away!',
    buttons: [
      { text: '← Back', action: 'back', secondary: true },
      { text: "Let's Go!", action: 'complete' },
    ],
  },
]

export function OnboardingTour() {
  const { hasCompletedOnboarding, completeOnboarding } = useOnboardingStore()
  const onCompleteRef = useRef(completeOnboarding)

  useEffect(() => {
    onCompleteRef.current = completeOnboarding
  }, [completeOnboarding])

  useEffect(() => {
    if (hasCompletedOnboarding) return

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: 'smooth', block: 'center' },
      },
      useModalOverlay: true,
    })

    STEPS.forEach((step) => {
      tour.addStep({
        id: step.id,
        title: step.title,
        text: step.text,
        attachTo: (step as any).attachTo,
        buttons: step.buttons.map((btn) => ({
          text: btn.text,
          secondary: !!btn.secondary,
          action: function (this: InstanceType<typeof Shepherd.Tour>) {
            if (btn.action === 'next') this.next()
            else if (btn.action === 'back') this.back()
            else if (btn.action === 'complete') this.complete()
            else if (btn.action === 'cancel') this.cancel()
          },
        })),
      })
    })

    tour.on('complete', () => onCompleteRef.current())
    tour.on('cancel', () => onCompleteRef.current())

    const timer = setTimeout(() => {
      if (!tour.isActive()) tour.start()
    }, 1500)

    return () => {
      clearTimeout(timer)
      if (tour.isActive()) tour.cancel()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedOnboarding])

  return null
}

export default OnboardingTour

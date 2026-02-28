'use client'

import { useState } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, MessageCircle, PlayCircle } from 'lucide-react'
import { FaMinus, FaPlus } from 'react-icons/fa'

const faqs = [
  {
    id: 1,
    question: 'How do I create a playlist plan?',
    answer:
      "Simply paste a YouTube playlist URL into the planner, and we'll automatically fetch all videos and calculate the total duration. You can then adjust playback speed and create study sessions.",
  },
  {
    id: 2,
    question: 'What does the speed multiplier do?',
    answer:
      'The speed multiplier shows you how long the playlist would take at different playback speeds (1.25x, 1.5x, 1.75x, 2x). Many learners find 1.5x to be the sweet spot between speed and comprehension.',
  },
  {
    id: 3,
    question: 'How do partitions work?',
    answer:
      "Partitions break your playlist into manageable study sessions. You can define custom session lengths (e.g., 3 hours), and we'll intelligently group videos while respecting video boundaries.",
  },
  {
    id: 4,
    question: 'How are achievements earned?',
    answer:
      "Achievements are unlocked automatically as you hit milestones like creating your first playlist, maintaining streaks, or completing playlists at high speeds. Check the Achievements page to see all available badges!",
  },
  {
    id: 5,
    question: 'Can I export my study plan?',
    answer:
      "Yes! You can export your plan as a PDF, CSV, or generate a shareable link. We're working on calendar integration for future updates.",
  },
  {
    id: 6,
    question: 'How does the schedule feature work?',
    answer:
      "Set your available study hours per day and start date, and we'll generate a custom schedule showing you exactly which videos to watch each day to complete the playlist on time.",
  },
  {
    id: 7,
    question: 'Can I share playlists with others?',
    answer:
      "Yes! Use the Share feature to generate a public link. Anyone with the link can view your playlist plan, even without an account.",
  },
  {
    id: 8,
    question: 'How do streaks work?',
    answer:
      "A streak is tracked each day you actively use the app (create or update playlists). Keep logging in daily to maintain your streak and unlock streak-related achievements!",
  },
]

export default function HelpPage() {
  const [activeId, setActiveId] = useState<number | null>(1)

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Help &amp; FAQ</h1>
        <p className="text-muted-foreground mt-1">Everything you need to know about Syllabus Slayer</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center space-x-3 cursor-pointer hover:border-primary/50 transition-colors">
          <BookOpen className="h-6 w-6 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Documentation</p>
            <p className="text-xs text-muted-foreground">Full guides &amp; references</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-3 cursor-pointer hover:border-primary/50 transition-colors">
          <PlayCircle className="h-6 w-6 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Video Tutorials</p>
            <p className="text-xs text-muted-foreground">Watch and learn</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-3 cursor-pointer hover:border-primary/50 transition-colors">
          <MessageCircle className="h-6 w-6 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Contact Support</p>
            <p className="text-xs text-muted-foreground">Get personalized help</p>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-sm mb-6">Ask everything you need to know about our products and services.</p>

        <div className="overflow-hidden border border-border divide-y divide-border rounded-xl">
          {faqs.map((faq) => (
            <div key={faq.id} role="region">
              <h3>
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={activeId === faq.id}
                  className="flex items-center justify-between w-full px-6 py-5 text-base font-semibold text-left hover:bg-muted/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0">
                    {activeId === faq.id ? (
                      <FaMinus className="w-4 h-4 text-foreground" />
                    ) : (
                      <FaPlus className="w-4 h-4 text-foreground" />
                    )}
                  </span>
                </button>
              </h3>
              {activeId === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-8 overflow-hidden text-center bg-muted/50 rounded-xl">
          <div className="px-6 py-12 sm:p-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold">Still have questions?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Can&apos;t find the answer you&apos;re looking for? Chat with our friendly support team.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button className="rounded-full px-6">Contact Support</Button>
                <Button variant="outline" className="rounded-full px-6">Join Community</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle>Video Tutorials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center space-y-2">
            <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">Getting Started Tutorial (Coming Soon)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BookOpen, MessageCircle, PlayCircle } from 'lucide-react'

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
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl">Help &amp; FAQ</h1>
        <p className="text-muted-foreground mt-1">Everything you need to know about Syllabus Slayer</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex cursor-pointer items-center space-x-3 p-4 brutal-lift">
          <BookOpen className="h-6 w-6 text-foreground shrink-0" />
          <div>
            <p className="font-medium text-sm">Documentation</p>
            <p className="text-xs text-muted-foreground">Full guides &amp; references</p>
          </div>
        </Card>
        <Card className="flex cursor-pointer items-center space-x-3 p-4 brutal-lift">
          <PlayCircle className="h-6 w-6 text-foreground shrink-0" />
          <div>
            <p className="font-medium text-sm">Video Tutorials</p>
            <p className="text-xs text-muted-foreground">Watch and learn</p>
          </div>
        </Card>
        <Card className="flex cursor-pointer items-center space-x-3 p-4 brutal-lift">
          <MessageCircle className="h-6 w-6 text-foreground shrink-0" />
          <div>
            <p className="font-medium text-sm">Contact Support</p>
            <p className="text-xs text-muted-foreground">Get personalized help</p>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-1 font-display text-2xl font-black tracking-tight">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-sm mb-6">Ask everything you need to know about our products and services.</p>

        <Accordion
          type="single"
          collapsible
          defaultValue="1"
          className="rounded-lg divide-y-[3px] divide-ink border-[3px] border-ink"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={String(faq.id)} className="border-0">
              <AccordionTrigger className="px-6 py-5 text-left font-display text-base font-black hover:bg-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions CTA */}
        <div className="rounded-lg mt-8 overflow-hidden border-[3px] border-ink bg-muted text-center shadow-brutal">
          <div className="px-6 py-12 sm:p-12">
            <div className="max-w-sm mx-auto">
              <h3 className="font-display text-xl font-black tracking-tight">Still have questions?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Can&apos;t find the answer you&apos;re looking for? Chat with our friendly support team.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button>Contact Support</Button>
                <Button variant="outline">Join Community</Button>
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

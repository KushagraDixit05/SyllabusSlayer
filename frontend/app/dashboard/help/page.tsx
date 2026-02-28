import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, MessageCircle, PlayCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How do I create a playlist plan?',
    answer:
      "Simply paste a YouTube playlist URL into the planner, and we'll automatically fetch all videos and calculate the total duration. You can then adjust playback speed and create study sessions.",
  },
  {
    question: 'What does the speed multiplier do?',
    answer:
      'The speed multiplier shows you how long the playlist would take at different playback speeds (1.25x, 1.5x, 1.75x, 2x). Many learners find 1.5x to be the sweet spot between speed and comprehension.',
  },
  {
    question: 'How do partitions work?',
    answer:
      "Partitions break your playlist into manageable study sessions. You can define custom session lengths (e.g., 3 hours), and we'll intelligently group videos while respecting video boundaries.",
  },
  {
    question: 'How are achievements earned?',
    answer:
      "Achievements are unlocked automatically as you hit milestones like creating your first playlist, maintaining streaks, or completing playlists at high speeds. Check the Achievements page to see all available badges!",
  },
  {
    question: 'Can I export my study plan?',
    answer:
      "Yes! You can export your plan as a PDF, CSV, or generate a shareable link. We're working on calendar integration for future updates.",
  },
  {
    question: 'How does the schedule feature work?',
    answer:
      "Set your available study hours per day and start date, and we'll generate a custom schedule showing you exactly which videos to watch each day to complete the playlist on time.",
  },
  {
    question: 'Can I share playlists with others?',
    answer:
      "Yes! Use the Share feature to generate a public link. Anyone with the link can view your playlist plan, even without an account.",
  },
  {
    question: 'How do streaks work?',
    answer:
      "A streak is tracked each day you actively use the app (create or update playlists). Keep logging in daily to maintain your streak and unlock streak-related achievements!",
  },
]

export default function HelpPage() {
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
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

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

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
          </p>
          <div className="flex gap-3">
            <Button>Contact Support</Button>
            <Button variant="outline">Join Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

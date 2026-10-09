'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { decodePlaylistState } from '@/lib/shareableLink';
import type { ShareableState } from '@/types/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar, Clock, Zap, PlayCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function SharedPlanPage() {
  const params = useParams();
  const [state, setState] = useState<ShareableState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      try {
        const decoded = decodePlaylistState(id);
        setState(decoded as ShareableState);
      } catch (err) {
        setError('Invalid or corrupted share link');
        console.error(err);
      }
    }
  }, [params.id]);

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  if (error) {
    return (
      <div className="brutal-dots flex min-h-screen items-center justify-center bg-background p-4">
        <Card variant="elevated" className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Invalid Share Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              {error}
            </p>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="brutal-dots flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-foreground" />
          <p className="text-xs font-bold text-muted-foreground">
            Loading study plan...
          </p>
        </div>
      </div>
    );
  }

  const totalDuration = state.videos.reduce((sum, v) => sum + v.duration, 0);

  return (
    <div className="brutal-dots min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageHeader
            eyebrow="Shared Plan"
            title={state.playlistTitle}
            description={
              <span className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  {state.videos.length} videos
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(totalDuration)}
                </span>
              </span>
            }
            actions={
              state.currentSpeed && state.currentSpeed !== 1.0 ? (
                <Badge className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {state.currentSpeed.toFixed(2)}x speed
                </Badge>
              ) : undefined
            }
          />

          {/* Schedule */}
          {state.schedule && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="elevated" className="bg-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-foreground" />
                    Completion Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <p className="mb-1 text-xs font-bold text-muted-foreground">
                        Target Completion
                      </p>
                      <p className="font-display text-xl font-black tabular-nums">
                        {format(new Date(state.schedule.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="mb-1 text-xs font-bold text-muted-foreground">
                        Days Required
                      </p>
                      <p className="font-display text-xl font-black tabular-nums">
                        {state.schedule.totalDays}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="mb-1 text-xs font-bold text-muted-foreground">
                        Study Days
                      </p>
                      <p className="font-display text-xl font-black tabular-nums">
                        {state.schedule.studyDays}
                      </p>
                    </div>
                  </div>

                  {state.schedule.studyDays > 0 && (
                    <div className="rounded-lg border-[3px] border-ink bg-card p-3">
                      <p className="text-center text-sm font-medium text-muted-foreground">
                        Study for {state.schedule.studyDays} days to complete!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Partitions */}
          {state.partitions && state.partitions.length > 0 && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Study Sessions ({state.partitions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {state.partitions.map((partition, index) => (
                    <AccordionItem key={partition.id} value={partition.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-primary font-display text-sm font-black text-primary-foreground">
                            {index + 1}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-display text-base font-black tracking-tight">
                              Session {index + 1}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground">
                              {partition.videos.length} videos • {formatDuration(partition.duration)}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-4">
                          {partition.videos.map((video) => (
                            <div
                              key={video.id}
                              className="rounded-lg flex items-start gap-3 border-[3px] border-ink bg-muted p-3"
                            >
                              <PlayCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{video.title}</p>
                                <p className="font-mono text-xs text-muted-foreground">
                                  {formatDuration(video.duration)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <div className="py-8 text-center">
            <p className="mb-4 text-xs font-medium text-muted-foreground">
              Want to create your own study plan?
            </p>
            <Button asChild size="lg">
              <Link href="/">
                <Zap className="mr-2 h-5 w-5" />
                Try Syllabus Slayer
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

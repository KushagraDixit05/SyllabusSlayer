'use client';

import { usePlannerStore } from '@/store/usePlannerStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function PartitionList() {
  const { partitions } = usePlannerStore();

  if (partitions.length === 0) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Study Sessions</CardTitle>
        <span className="text-xs font-bold text-muted-foreground">
          Auto-Partitioned
        </span>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {partitions.map((partition, index) => (
            <motion.div
              key={partition.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem value={partition.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-primary font-display font-black text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-display text-base font-black tracking-tight">Session {index + 1}</p>
                      <p className="text-sm font-medium text-muted-foreground">
                        {partition.videos.length} videos • {formatDuration(partition.duration)}
                      </p>
                    </div>
                    <Badge className="hidden md:flex">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(partition.duration)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-4">
                    {partition.videos.map((video, videoIndex) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: videoIndex * 0.05 }}
                        className="flex items-start gap-3 p-3 transition-colors hover:bg-accent"
                      >
                        <PlayCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{video.title}</p>
                          <p className="font-mono text-xs text-muted-foreground">{formatDuration(video.duration)}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {partition.breakAfter && partition.breakAfter > 0 && (
                      <div className="rounded-lg mt-4 flex items-center gap-3 border-[3px] border-ink bg-flame-from p-3 text-primary-foreground">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-display text-sm font-black tracking-wide">Break Time</p>
                          <p className="font-mono text-xs">
                            Take a {partition.breakAfter} minute break before the next session
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

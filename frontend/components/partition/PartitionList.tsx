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
import { Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
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
      <CardHeader>
        <CardTitle>Your Study Sessions</CardTitle>
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
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Session {index + 1}</p>
                      <p className="text-sm text-gray-600">
                        {partition.videos.length} videos • {formatDuration(partition.duration)}
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
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
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <PlayCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{video.title}</p>
                          <p className="text-xs text-gray-600">{formatDuration(video.duration)}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {partition.breakAfter && partition.breakAfter > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 mt-4">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-green-900">Break Time</p>
                          <p className="text-xs text-green-700">
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

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodePlaylistState } from '@/lib/shareableLink';
import type { ShareableState } from '@/types/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar, Clock, Zap, PlayCircle, AlertCircle } from 'lucide-react';
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
        setState(decoded);
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Invalid Share Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study plan...</p>
        </div>
      </div>
    );
  }

  const totalDuration = state.videos.reduce((sum, v) => sum + v.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {state.playlistTitle}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <PlayCircle className="h-4 w-4" />
                {state.videos.length} videos
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(totalDuration)}
              </span>
              {state.currentSpeed && state.currentSpeed !== 1.0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {state.currentSpeed.toFixed(2)}x speed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Schedule */}
          {state.schedule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Completion Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Target Completion</p>
                      <p className="text-xl font-bold text-gray-900">
                        {format(new Date(state.schedule.completionDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Days Required</p>
                      <p className="text-xl font-bold text-blue-600">
                        {state.schedule.daysRequired}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                      <p className="text-xl font-bold text-purple-600">
                        {state.schedule.totalHours}h
                      </p>
                    </div>
                  </div>
                  
                  {state.schedule.motivationalMessage && (
                    <div className="rounded-lg bg-white/80 p-3 border border-blue-200">
                      <p className="text-center text-gray-700 italic text-sm">
                        "{state.schedule.motivationalMessage}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Partitions */}
          {state.partitions && state.partitions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Study Sessions ({state.partitions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {state.partitions.map((partition, index) => (
                    <AccordionItem key={partition.id} value={partition.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold">Session {index + 1}</p>
                            <p className="text-sm text-gray-600">
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
                              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                            >
                              <PlayCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{video.title}</p>
                                <p className="text-xs text-gray-600">{formatDuration(video.duration)}</p>
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
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Want to create your own study plan?</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              <Zap className="h-5 w-5" />
              Try Syllabus Slayer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { parseBulkEntryLine } from '@/lib/timeParser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ManualEntrySection() {
  const { videos, addManualVideo, removeVideo } = usePlannerStore();
  const [bulkInput, setBulkInput] = useState('');
  const [singleTitle, setSingleTitle] = useState('');
  const [singleDuration, setSingleDuration] = useState('');

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const parsed = parseBulkEntryLine(line);
      if (parsed) {
        addManualVideo(parsed.title, parsed.duration);
      }
    });

    setBulkInput('');
  };

  const handleSingleAdd = () => {
    if (singleTitle.trim() && singleDuration.trim()) {
      addManualVideo(singleTitle.trim(), singleDuration);
      setSingleTitle('');
      setSingleDuration('');
    }
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Single Video Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Add Single Video
          </CardTitle>
          <CardDescription>
            Manually add one video at a time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="videoTitle">Video Title</Label>
              <Input
                id="videoTitle"
                placeholder="Introduction to React Hooks"
                value={singleTitle}
                onChange={(e) => setSingleTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSingleAdd()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoDuration">Duration</Label>
              <Input
                id="videoDuration"
                placeholder="15:30 or 15m 30s"
                value={singleDuration}
                onChange={(e) => setSingleDuration(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSingleAdd()}
              />
            </div>
          </div>
          <Button onClick={handleSingleAdd} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Bulk Entry
          </CardTitle>
          <CardDescription>
            Add multiple videos at once (one per line)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulkEntry">Paste video list</Label>
            <Textarea
              id="bulkEntry"
              placeholder="Video Title 1 | 15:30&#10;Video Title 2 | 20 minutes&#10;Video Title 3 | 1h 5m"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Format: <code className="bg-gray-100 px-1 py-0.5 rounded">Title | Duration</code>
              {' '}(supports: HH:MM:SS, "15 minutes", "1h 30m", etc.)
            </p>
          </div>
          <Button onClick={handleBulkAdd} disabled={!bulkInput.trim()}>
            <Upload className="h-4 w-4 mr-2" />
            Add All Videos
          </Button>
        </CardContent>
      </Card>

      {/* Video List */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Videos ({videos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white group"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{video.title}</p>
                      <p className="text-xs text-gray-600">{formatDuration(video.duration)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(video.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

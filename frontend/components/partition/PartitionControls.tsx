'use client';

import { useState, useEffect } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { PARTITION_PRESETS } from '@/types/partition';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function PartitionControls() {
  const { totalDuration, partitions, createPartitionsFromConfig, partitionConfig, updatePartitionConfig } = usePlannerStore();
  const [sessionLength, setSessionLength] = useState(partitionConfig?.sessionLength || 60);
  const [breakDuration, setBreakDuration] = useState(partitionConfig?.breakDuration || 10);
  
  // Use actual partitions count instead of estimation
  const estimatedSessions = partitions.length;

  useEffect(() => {
    // Auto-generate partitions when configuration changes
    createPartitionsFromConfig({
      sessionLength,
      breakDuration,
      respectVideoBreaks: true,
    });
  }, [sessionLength, breakDuration]);

  const handlePresetClick = (minutes: number) => {
    setSessionLength(minutes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Partition Your Study Plan
        </CardTitle>
        <CardDescription>
          Break down your playlist into manageable study sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Length Presets */}
        <div className="space-y-3">
          <Label>Session Length Presets</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PARTITION_PRESETS.map((preset) => (
              <Button
                key={preset.minutes}
                variant={sessionLength === preset.minutes ? 'default' : 'outline'}
                onClick={() => handlePresetClick(preset.minutes)}
                className="flex flex-col h-auto py-3"
              >
                <span className="text-lg font-bold">{preset.minutes} min</span>
                <span className="text-xs opacity-75">{preset.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Session Length Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Custom Session Length</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={sessionLength}
                onChange={(e) => setSessionLength(parseInt(e.target.value) || 60)}
                className="w-20 text-center"
                min={15}
                max={300}
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          </div>
          <Slider
            value={[sessionLength]}
            onValueChange={(value) => setSessionLength(value[0])}
            min={15}
            max={300}
            step={5}
            className="w-full"
          />
        </div>

        {/* Break Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Break Duration</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                className="w-20 text-center"
                min={0}
                max={60}
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          </div>
          <Slider
            value={[breakDuration]}
            onValueChange={(value) => setBreakDuration(value[0])}
            min={0}
            max={60}
            step={5}
            className="w-full"
          />
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Estimated Study Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{estimatedSessions}</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Total study time: {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
            {breakDuration > 0 && estimatedSessions > 1 && (
              <> + {Math.floor((estimatedSessions - 1) * breakDuration / 60)}h {((estimatedSessions - 1) * breakDuration) % 60}m breaks</>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

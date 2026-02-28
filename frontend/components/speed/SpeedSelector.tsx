'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { PRESET_SPEEDS } from '@/types/speed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Zap } from 'lucide-react';

export function SpeedSelector() {
  const { currentSpeed, setPlaybackSpeed } = usePlannerStore();
  const [customSpeed, setCustomSpeed] = useState(currentSpeed);

  const handlePresetClick = (speed: number) => {
    setCustomSpeed(speed);
    setPlaybackSpeed(speed);
  };

  const handleCustomSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setCustomSpeed(newSpeed);
    setPlaybackSpeed(newSpeed);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Playback Speed
        </CardTitle>
        <CardDescription>
          Adjust video playback speed to save time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Speeds */}
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_SPEEDS.map((speed) => (
              <Button
                key={speed}
                variant={currentSpeed === speed ? 'default' : 'outline'}
                onClick={() => handlePresetClick(speed)}
                className="font-mono"
              >
                {speed.toFixed(2)}x
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Speed Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Custom Speed</span>
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {customSpeed.toFixed(2)}x
            </span>
          </div>
          <Slider
            value={[customSpeed]}
            onValueChange={handleCustomSpeedChange}
            min={0.25}
            max={3.0}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.25x (Slower)</span>
            <span>3.0x (Faster)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

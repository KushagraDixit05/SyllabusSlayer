'use client';

import { usePlannerStore } from '@/store/usePlannerStore';
import { calculateSpeedComparisons } from '@/lib/speed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function SpeedComparisonTable() {
  const { totalDuration, currentSpeed } = usePlannerStore();
  const comparisons = calculateSpeedComparisons(totalDuration);

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-foreground" />
          Speed Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {comparisons.map((comparison, index) => {
            const isActive = comparison.speed === currentSpeed;
            const timeSavedHours = Math.floor(comparison.timeSaved / 3600);
            const timeSavedMinutes = Math.floor((comparison.timeSaved % 3600) / 60);

            return (
              <motion.div
                key={comparison.speed}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  border-[3px] border-ink p-4 transition-all
                  ${isActive ? 'bg-accent shadow-brutal-sm' : 'bg-card'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-ink font-mono text-sm font-bold
                      ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    `}>
                      {comparison.speed.toFixed(1)}x
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-lg font-black tabular-nums text-foreground">
                          {formatDuration(comparison.totalDuration)}
                        </p>
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      {comparison.timeSaved > 0 && (
                        <p className="rounded-full mt-1 inline-flex items-center gap-1 border-[3px] border-ink bg-chart-3 px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                          <TrendingDown className="h-3 w-3" />
                          Save {timeSavedHours > 0 ? `${timeSavedHours}h ` : ''}{timeSavedMinutes}m
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-muted-foreground">{comparison.timeSavedPercentage.toFixed(0)}% faster</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="rounded-lg mt-6 border-[3px] border-ink bg-muted p-4">
          <p className="font-mono text-xs text-muted-foreground">
            💡 <strong>Pro tip:</strong> Most people comprehend well at 1.5-1.75x speed. 
            Start at 1.25x and gradually increase as you get comfortable!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

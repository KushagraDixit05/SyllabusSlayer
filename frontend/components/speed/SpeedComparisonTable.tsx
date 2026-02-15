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
          <Clock className="h-5 w-5 text-blue-600" />
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
                  p-4 rounded-lg border-2 transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full font-mono font-bold
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                      }
                    `}>
                      {comparison.speed.toFixed(1)}x
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
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
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Save {timeSavedHours > 0 ? `${timeSavedHours}h ` : ''}{timeSavedMinutes}m
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-right">
                    <p className="text-sm text-gray-600">{comparison.timeSavedPercentage.toFixed(0)}% faster</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <p className="text-sm text-gray-700">
            💡 <strong>Pro tip:</strong> Most people comprehend well at 1.5-1.75x speed. 
            Start at 1.25x and gradually increase as you get comfortable!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

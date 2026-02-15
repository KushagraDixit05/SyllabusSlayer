'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaylistData } from '@/types';
import { Clock, Video, BarChart3, Copy, Check, ArrowRight } from 'lucide-react';
import { copyToClipboard, cn } from '@/lib/utils';

interface ResultsDisplayProps {
  data: PlaylistData;
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  const router = useRouter();
  const [copiedSpeed, setCopiedSpeed] = useState<string | null>(null);

  const handleGoToPlanner = () => {
    // Store playlist data in planner store
    if (typeof window !== 'undefined') {
      const { usePlannerStore } = require('@/store/usePlannerStore');
      const store = usePlannerStore.getState();
      
      // Convert playlist data to videos
      const videos = data.videos?.map((video: any) => ({
        id: video.id || String(Math.random()),
        title: video.title,
        duration: video.duration,
        source: 'youtube' as const,
      })) || [];
      
      store.setPlaylistData(
        data.title,
        videos
      );
    }
    
    router.push('/planner');
  };

  const handleCopy = async (speed: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSpeed(speed);
      setTimeout(() => setCopiedSpeed(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Playlist Info */}
      <div className="border-b pb-6">
        <h3 className="mb-4 text-2xl font-bold text-gray-900">{data.title}</h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Video className="h-5 w-5" />}
            label="Videos"
            value={data.videoCount.toString()}
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Total Duration"
            value={data.totalDurationFormatted}
          />
          <StatCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Avg Video Length"
            value={data.averageVideoLengthFormatted}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={handleGoToPlanner}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Plan Your Study Sessions
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Speed Options */}
      <div>
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Playback Speed Options
        </h4>
        <div className="space-y-2">
          {Object.entries(data.speeds).map(([speed, duration]) => (
            <SpeedRow
              key={speed}
              speed={speed}
              duration={duration}
              isCopied={copiedSpeed === speed}
              onCopy={() => handleCopy(speed, duration)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function SpeedRow({
  speed,
  duration,
  isCopied,
  onCopy,
}: {
  speed: string;
  duration: string;
  isCopied: boolean;
  onCopy: () => void;
}) {
  const isNormalSpeed = speed === '1';
  const speedLabel = `${speed}x`;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-4 transition-all",
        isNormalSpeed ? "border-gray-300 bg-white" : "border-blue-200 bg-blue-50/50"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-md px-3 py-1 text-sm font-semibold",
            isNormalSpeed
              ? "bg-gray-200 text-gray-700"
              : "bg-blue-600 text-white"
          )}
        >
          {speedLabel}
        </span>
        <span className="text-lg font-medium text-gray-900">{duration}</span>
      </div>
      <button
        onClick={onCopy}
        className={cn(
          "rounded-md p-2 transition-all",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        )}
        aria-label={`Copy ${speedLabel} duration`}
      >
        {isCopied ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <Copy className="h-5 w-5 text-gray-400" />
        )}
      </button>
    </div>
  );
}

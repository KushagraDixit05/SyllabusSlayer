'use client';

import { useState } from 'react';
import { PlaylistData } from '@/types';
import { Clock, Video, BarChart3, Copy, Check } from 'lucide-react';
import { copyToClipboard, cn } from '@/lib/utils';

interface ResultsDisplayProps {
  data: PlaylistData;
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  const [copiedSpeed, setCopiedSpeed] = useState<string | null>(null);

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
      <div className="border-b-[3px] border-ink pb-6">
        <h3 className="mb-4 font-display text-2xl font-black leading-none tracking-tight">
          {data.title}
        </h3>

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

      {/* Speed Options */}
      <div>
        <h4 className="mb-4 font-display text-lg font-black tracking-tight">
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

/**
 * Not `StatTile`: that one counts up to a numeric `value`, and these are
 * pre-formatted duration strings ("1h 23m") that can't be animated that way.
 */
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg flex items-center gap-3 border-[3px] border-ink bg-card p-4 shadow-brutal-sm">
      <div className="rounded-full flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-primary text-primary-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground">
          {label}
        </p>
        <p className="font-display text-lg font-black tabular-nums">{value}</p>
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
        "rounded-lg flex items-center justify-between border-[3px] border-ink p-4 transition-all",
        isNormalSpeed ? "bg-card" : "bg-accent"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-full border-[3px] border-ink px-3 py-1 font-mono text-sm font-bold",
            isNormalSpeed ? "bg-muted text-muted-foreground" : "bg-brand-to text-primary-foreground"
          )}
        >
          {speedLabel}
        </span>
        <span className="font-display text-lg font-black tabular-nums">{duration}</span>
      </div>
      <button
        onClick={onCopy}
        className="p-2 transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        aria-label={`Copy ${speedLabel} duration`}
      >
        {isCopied ? (
          <Check className="h-5 w-5 text-chart-3" />
        ) : (
          <Copy className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

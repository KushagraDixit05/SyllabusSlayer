'use client';

import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-foreground" />
      <p className="mt-4 text-xs font-bold text-foreground">
        Analyzing playlist...
      </p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        Fetching video data from YouTube
      </p>
    </div>
  );
}

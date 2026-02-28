'use client';

import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
        Analyzing playlist...
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Fetching video data from YouTube
      </p>
    </div>
  );
}

'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border-[3px] border-ink bg-destructive p-4 text-destructive-foreground shadow-brutal-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div>
          <h4 className="font-display text-sm font-black tracking-wide">Error</h4>
          <p className="mt-1 font-mono text-xs">{message}</p>
        </div>
      </div>
    </div>
  );
}

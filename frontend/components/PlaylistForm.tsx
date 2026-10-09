'use client';

import { useState, FormEvent } from 'react';
import { Search, X, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaylistFormProps {
  onSubmit: (input: string) => void;
  onClear: () => void;
}

export function PlaylistForm({ onSubmit, onClear }: PlaylistFormProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(input);
  };

  const handleClear = () => {
    setInput('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="playlist-input" className="mb-2 block text-left text-xs font-bold text-muted-foreground">
          YouTube Playlist URL or ID
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="playlist-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=PLxxxxxx or PLxxxxxx"
            className={cn(
              "rounded-lg w-full border-[3px] border-ink bg-background py-3 pl-10 pr-10 font-mono text-sm",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus-visible:bg-accent",
              "transition-all duration-200"
            )}
          />
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-2 text-left text-sm font-medium text-muted-foreground">
          Paste a YouTube playlist URL or enter the playlist ID directly
        </p>
      </div>

      <button
        type="submit"
        disabled={!input.trim()}
        className={cn(
          "rounded-full w-full border-[3px] border-ink px-6 py-3 font-display font-black tracking-tight text-primary-foreground",
          "bg-primary shadow-brutal-sm brutal-lift hover:brightness-110",
          "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
          "focus-visible:outline-none focus-visible:ring-0",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100",
          "transition-all duration-200",
          "flex items-center justify-center gap-2"
        )}
      >
        <Search className="h-4 w-4" />
        Analyze Playlist
      </button>
    </form>
  );
}

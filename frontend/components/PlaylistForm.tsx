'use client';

import { useState, FormEvent } from 'react';
import { Search, X } from 'lucide-react';
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
        <label htmlFor="playlist-input" className="mb-2 block text-left text-sm font-medium text-gray-700">
          YouTube Playlist URL or ID
        </label>
        <div className="relative">
          <input
            id="playlist-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=PLxxxxxx or PLxxxxxx"
            className={cn(
              "w-full rounded-lg border border-gray-300 px-4 py-3 pr-10",
              "text-gray-900 placeholder-gray-400",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "transition-all duration-200"
            )}
          />
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear input"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-2 text-left text-xs text-gray-500">
          Paste a YouTube playlist URL or enter the playlist ID directly
        </p>
      </div>

      <button
        type="submit"
        disabled={!input.trim()}
        className={cn(
          "w-full rounded-lg px-6 py-3 font-medium text-white",
          "bg-gradient-to-r from-blue-600 to-purple-600",
          "hover:from-blue-700 hover:to-purple-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          "disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed",
          "transition-all duration-200",
          "flex items-center justify-center gap-2"
        )}
      >
        <Search className="h-5 w-5" />
        Analyze Playlist
      </button>
    </form>
  );
}

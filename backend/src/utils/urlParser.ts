/**
 * URL Parser Utility
 * Extracts YouTube playlist IDs from various URL formats
 */

/**
 * Extract playlist ID from YouTube URL
 * Supports formats:
 * - https://www.youtube.com/playlist?list=PLxxxxxxx
 * - https://youtube.com/playlist?list=PLxxxxxxx
 * - https://www.youtube.com/watch?v=xxxxx&list=PLxxxxxxx
 * - Direct playlist ID: PLxxxxxxx
 */
export function extractPlaylistId(input: string): string | null {
  const trimmedInput = input.trim();
  
  // Direct playlist ID (starts with PL, UU, LL, RD, or OL)
  if (/^(PL|UU|LL|RD|OL)[a-zA-Z0-9_-]+$/.test(trimmedInput)) {
    return trimmedInput;
  }
  
  try {
    const url = new URL(trimmedInput);
    
    // Extract from query parameters
    const listParam = url.searchParams.get('list');
    if (listParam && /^(PL|UU|LL|RD|OL)[a-zA-Z0-9_-]+$/.test(listParam)) {
      return listParam;
    }
  } catch {
    // Not a valid URL, return null
    return null;
  }
  
  return null;
}

/**
 * Validate YouTube playlist ID format
 */
export function isValidPlaylistId(playlistId: string): boolean {
  return /^(PL|UU|LL|RD|OL)[a-zA-Z0-9_-]+$/.test(playlistId);
}

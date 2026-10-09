import type { PostgrestError } from '@supabase/supabase-js'

/**
 * Turns a PostgrestError into something a user can act on.
 *
 * supabase-js reports a failed browser `fetch` as a PostgrestError whose message
 * is the raw `TypeError: Failed to fetch` and which carries no SQL error `code`.
 * Prefixing that with "Database error" is misleading — the request never reached
 * the database — so transport failures get their own message.
 */

const NETWORK_MARKERS = ['failed to fetch', 'networkerror', 'network request failed', 'load failed']

export function isNetworkError(error: PostgrestError): boolean {
  const message = error.message?.toLowerCase() ?? ''
  if (NETWORK_MARKERS.some((marker) => message.includes(marker))) return true
  // A genuine PostgREST/Postgres failure always carries a code; its absence means
  // the response never made it back.
  return !error.code
}

export function describeDatabaseError(error: PostgrestError, action: string): string {
  if (isNetworkError(error)) {
    return (
      `Can't reach the database. Check your connection and that the Supabase project ` +
      `is running (a paused project stops resolving).`
    )
  }

  // `details` and `hint` are where Postgres puts the actionable part — a constraint
  // name, a missing column, a suggested fix. They were previously logged but dropped
  // from the thrown message.
  const extra = [error.details, error.hint].filter(Boolean).join(' ')
  return extra ? `${action}: ${error.message} (${extra})` : `${action}: ${error.message}`
}

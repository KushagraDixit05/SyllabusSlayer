/**
 * Reads the Supabase connection settings, failing loudly when they are absent or
 * still carry the `.env.example` placeholders.
 *
 * Both values are `NEXT_PUBLIC_*`, so Next.js inlines them at build time: a var
 * added to `.env.local` after the dev server started is not picked up until it
 * restarts. Without this check a stale or empty URL surfaces much later as an
 * opaque `TypeError: Failed to fetch` from deep inside supabase-js.
 */

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SupabaseConfigError'
  }
}

/** The values `frontend/.env.example` ships with, which are not usable as-is. */
const PLACEHOLDERS = new Set(['your_supabase_project_url', 'your_supabase_anon_key'])

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim()

  if (!trimmed) {
    throw new SupabaseConfigError(
      `${name} is not set. Copy frontend/.env.example to frontend/.env.local, fill in your ` +
        `Supabase project settings, then restart the dev server.`
    )
  }

  if (PLACEHOLDERS.has(trimmed)) {
    throw new SupabaseConfigError(
      `${name} is still set to the placeholder from .env.example. Replace it with the value ` +
        `from your Supabase project's API settings, then restart the dev server.`
    )
  }

  return trimmed
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey = required('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  try {
    new URL(url)
  } catch {
    throw new SupabaseConfigError(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid URL (got "${url}"). It should look like ` +
        `https://<project-ref>.supabase.co.`
    )
  }

  return { url, anonKey }
}

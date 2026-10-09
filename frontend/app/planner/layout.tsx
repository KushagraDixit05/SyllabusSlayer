import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { auth } from '@/lib/auth'

/**
 * The planner is usable signed out, so it cannot live under the dashboard shell.
 * Signed-in visitors still get the sidebar for navigation; signed-out ones get the
 * page exactly as it was, and rely on the header's back link.
 *
 * The session is resolved on the server so the rail is in the first paint —
 * `useSession()` reports `loading` on the initial client render, which would make
 * the sidebar pop in after hydration.
 */
export default async function PlannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop only: below `md` this hides the sidebar's own mobile hamburger
          bar, which would otherwise stack above the planner's header. */}
      <div className="hidden h-full md:flex">
        <DashboardSidebar />
      </div>
      <div className="relative flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

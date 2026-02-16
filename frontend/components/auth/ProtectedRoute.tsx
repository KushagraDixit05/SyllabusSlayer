import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return <>{children}</>
}

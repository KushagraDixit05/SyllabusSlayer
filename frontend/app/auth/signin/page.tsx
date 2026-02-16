import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SignInForm } from '@/components/auth/SignInForm'

export default async function SignInPage() {
  const session = await auth()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SignInForm />
    </div>
  )
}

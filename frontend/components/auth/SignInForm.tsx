'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome, Github, Zap } from 'lucide-react'
import { useState } from 'react'

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading('google')
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const handleGitHubSignIn = async () => {
    setIsLoading('github')
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Syllabus Slayer
        </CardTitle>
        <CardDescription className="text-base">
          Master your learning journey with intelligent planning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-11 text-base"
          onClick={handleGoogleSignIn}
          disabled={isLoading !== null}
        >
          {isLoading === 'google' ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <Chrome className="mr-2 h-5 w-5" />
          )}
          Continue with Google
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-11 text-base"
          onClick={handleGitHubSignIn}
          disabled={isLoading !== null}
        >
          {isLoading === 'github' ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <Github className="mr-2 h-5 w-5" />
          )}
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Free forever • No credit card required
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-green-500" />
            <span>Smart playlist management</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-blue-500" />
            <span>Personalized study schedules</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-purple-500" />
            <span>Track your progress & achievements</span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-4">
          By signing in, you agree to our{' '}
          <a href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
